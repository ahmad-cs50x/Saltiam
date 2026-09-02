import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";
import { otpStore } from "../../../../lib/otpStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body?.name?.toString()?.trim();
    const email = body?.email?.toString()?.trim()?.toLowerCase();
    const password = body?.password?.toString();
    const otp = body?.otp?.toString()?.trim();

    if (!name || !email || !password || !otp) {
      return NextResponse.json({ error: "Name, email, password and OTP are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    await dbConnect();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Account already exists with this email." }, { status: 400 });
    }

    const storedOTP = otpStore.get(email);
    if (!storedOTP || storedOTP.otp !== otp) {
      return NextResponse.json({ error: "OTP incorrect or expired." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: passwordHash });
    otpStore.delete(email);

    return NextResponse.json({ message: "Registration successful." });
  } catch (error) {
    console.error("register error", error);
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
