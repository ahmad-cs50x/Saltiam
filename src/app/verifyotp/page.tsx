"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryEmail = searchParams?.get("email");
    if (queryEmail) {
      setEmail(queryEmail);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please provide your email before verifying OTP.");
      toast.error("Please provide your email before verifying OTP.");
      return;
    }

    if (otp.trim().length !== 6) {
      setError("Enter a valid 6-digit OTP.");
      toast.error("Enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "OTP verification failed.");
      }

      toast.success("✅ OTP correct");
      sessionStorage.setItem("passwordResetEmail", email);
      router.push(`/changepassword?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      const message = err.message || "OTP verification failed.";
      setError(message);
      toast.error(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#ffd3b6] via-rose-300 to-rose-300 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="https://i.ibb.co/QFMv4DMN/logo.png" alt="Saltiam Logo" className="w-24 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-pink-700">Verify OTP</h2>
          <p className="text-gray-600 mt-2">Enter the 6-digit code sent to your email address.</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full px-5 py-4 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition text-gray-800 placeholder-gray-500"
          />
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            required
            className="w-full text-black text-center text-2xl tracking-widest px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-pink-600 to-rose-600 text-white font-semibold py-3 rounded-xl hover:from-pink-700 hover:to-rose-700 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Didn&apos;t receive the code?{' '}
          <Link href="/forgetpassword" className="text-pink-600 font-semibold hover:underline">
            Request again
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;