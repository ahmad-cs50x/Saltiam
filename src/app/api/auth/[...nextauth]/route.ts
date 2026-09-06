import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";

const SUPER_USER_EMAIL = process.env.SUPER_USER_EMAIL || "ranaahmadranaahmad741@gmail.com";

const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) {
          return null;
        }

        await dbConnect();
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || user.email.split("@")[0],
          role: user.email === SUPER_USER_EMAIL ? "super" : user.role || "normal",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) {
        return true;
      }

      try {
        await dbConnect();
        const email = user.email.toLowerCase();
        const existingUser = await User.findOne({ email });

        const databaseUser = existingUser || await User.create({
            name: user.name || email.split("@")[0],
            email,
            // Google-authenticated users do not use credentials login. Store a
            // random hash to satisfy the shared User schema safely.
            password: await bcrypt.hash(`${randomUUID()}-${Date.now()}`, 10),
            role: (email === SUPER_USER_EMAIL || (await User.countDocuments()) === 0) ? "super" : "normal",
          });
        user.id = databaseUser._id.toString();
        user.email = databaseUser.email;
        (user as { role?: string }).role = databaseUser.role;

        return true;
      } catch (error) {
        console.error("Failed to save Google user:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.email === SUPER_USER_EMAIL ? "super" : (user as { role?: string }).role || "normal";
      } else if (token.email) {
        // Refresh the authoritative role from the database on every request so
        // stale JWTs cannot lock users out of the admin panel.
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.role = token.email === SUPER_USER_EMAIL ? "super" : dbUser.role || "normal";
            token.name = dbUser.name || token.name;
          }
        } catch (error) {
          console.error("Failed to refresh user role:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const { handlers, auth } = NextAuth(authOptions);

export const { GET, POST } = handlers;
export { auth };
