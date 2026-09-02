"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const SignInPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: formData.email.trim().toLowerCase() === "ranaahmadranaahmad741@gmail.com" ? "/secretpanel" : "/",
      });

      if (result?.error) {
        const message = result.error === "CredentialsSignin"
          ? "Invalid email or password. Please try again."
          : "Sign in failed. Please check your credentials.";

        setError(message);
        toast.error(`❌ ${message}`);
        return;
      }

      if (result?.ok) {
        toast.success("✅ Sign in successful!");
        setTimeout(() => {
          router.push(formData.email.trim().toLowerCase() === "ranaahmadranaahmad741@gmail.com" ? "/secretpanel" : "/");
        }, 1000);
        return;
      }

      setError("Sign in failed. Please try again.");
      toast.error("❌ Sign in failed. Please try again.");
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("❌ An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      toast.info("🔄 Redirecting to Google...");
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("❌ Failed to connect to Google. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#ffd3b6] via-rose-200 to-rose-300 flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/75 rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-rose-800">
            Welcome To Saltiam
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-rose-700/70 sm:text-base">
            Sign in to send an inquiry.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form className="space-y-4 text-black" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className="w-full px-6 py-3 bg-white/90 border-2 border-rose-200 rounded-2xl focus:border-pink-500 focus:ring-0 focus:ring-offset-0 transition-all text-gray-800 placeholder-gray-500 text-base outline-none"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-6 py-3 bg-white/90 border-2 border-rose-200 rounded-2xl focus:border-pink-500 focus:ring-0 focus:ring-offset-0 transition-all text-gray-800 placeholder-gray-500 text-base outline-none"
          />
          
          <div className="flex justify-end">
            <Link href="/forgetpassword">
              <span className="text-sm font-semibold cursor-pointer text-rose-600 hover:text-rose-700">
                Forgot Password?
              </span>
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-rose-700 to-rose-800 text-white font-bold text-lg py-3 rounded-2xl shadow-2xl hover:shadow-rose-700/50 cursor-pointer flex items-center justify-center gap-3 outline-none focus:outline-none transition-all disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        
        <div className="my-4 text-center text-gray-500 text-sm">or</div>
        
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 border-2 border-rose-200 rounded-2xl cursor-pointer py-2 hover:bg-gray-100 text-gray-800 font-medium transition"
        >
          <Image src="/google.png" alt="Google" width={20} height={20} />
          Continue with Google
        </button>
        
        <p className="text-sm text-center text-black mt-4">
          Don't have an account?{" "}
          <Link href="/signup">
            <span className="font-semibold text-rose-600 hover:text-rose-700 cursor-pointer">
              Sign Up
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
