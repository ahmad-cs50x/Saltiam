"use client";

import { toast } from 'react-toastify';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import Link from 'next/link';
import Image from 'next/image';

const SignUpPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Enter details, 2: Verify OTP
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSignIn = async () => {
    try {
      toast.info("🔄 Redirecting to Google...");
      const result = await signIn("google", { 
        callbackUrl: "/",
        redirect: true 
      });
      
      if (result?.error) {
        toast.error(`❌ Google sign in failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("❌ Failed to connect to Google. Please try again.");
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          purpose: "register",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      toast.success("✅ OTP sent to your email!");
      setStep(2);
    } catch (err: any) {
      const msg = err.message || "Failed to send OTP";
      toast.error(`❌ ${msg}`);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          otp: formData.otp
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success("✅ Registration successful!");
      setTimeout(() => {
        router.push('/signin');
      }, 1300);
    } catch (err: any) {
      const msg = err.message || "Registration failed";
      toast.error(`❌ ${msg}`);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: ""
    });
    setError("");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#ffd3b6] via-rose-200 to-rose-300 flex justify-center items-center py-1 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/75 rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-rose-800">
            {step === 1 ? "Create an Account" : "Verify Your Email"}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-rose-700/70 sm:text-base">
            {step === 1 ? "Join Saltiam to place an order" : `We sent a code to ${formData.email}`}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {step === 1 ? (
          <form className="space-y-4 text-black" onSubmit={handleSendOTP}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full px-6 py-3 bg-white/90 border-2 border-rose-200 rounded-2xl focus:border-pink-500 focus:ring-0 focus:ring-offset-0 transition-all text-gray-800 placeholder-gray-500 text-base outline-none"
            />
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
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full px-6 py-3 bg-white/90 border-2 border-rose-200 rounded-2xl focus:border-pink-500 focus:ring-0 focus:ring-offset-0 transition-all text-gray-800 placeholder-gray-500 text-base outline-none"
            />
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-rose-700 to-rose-800 text-white font-bold text-lg py-3 rounded-2xl shadow-2xl hover:shadow-rose-700/50 cursor-pointer flex items-center justify-center gap-3 outline-none focus:outline-none transition-all disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Continue & Verify Email"}
            </button>
          </form>
        ) : (
          <form className="space-y-4 text-black" onSubmit={handleVerifyAndRegister}>
            <div>
              <label className="block text-sm font-medium text-rose-800 mb-2">
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="000000"
                maxLength={6}
                required
                className="w-full text-center text-2xl tracking-widest px-4 py-3 bg-white/90 border-2 border-rose-200 rounded-2xl focus:border-pink-500 focus:ring-0 focus:ring-offset-0 transition-all text-gray-800 outline-none"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-rose-700 to-rose-800 text-white font-bold text-lg py-3 rounded-2xl shadow-2xl hover:shadow-rose-700/50 cursor-pointer flex items-center justify-center gap-3 outline-none focus:outline-none transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>
            
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full border-2 border-rose-200 rounded-2xl py-3 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
          </form>
        )}
        
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
          Already have an account?{" "}
          <Link href="/signin">
            <span className="font-semibold text-rose-600 hover:text-rose-700 cursor-pointer">
              Sign In
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;