"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "reset" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }
      setMsg(data.message || "OTP sent successfully!");
      toast.success(data.message || "OTP sent successfully!");
      // setMsg("OTP sent successfully! Redirecting...");
      setTimeout(() => {
        router.push(`/verifyotp?email=${encodeURIComponent(email)}`);
      }, 1400);
    } catch (error: any) {
      const message = error?.message || "Failed to send OTP";
      setErr(message);
      toast.error(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-linear-to-b from-[#ffd3b6] via-rose-300 to-rose-300 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="https://i.ibb.co/QFMv4DMN/logo.png" alt="Saltiam Logo" className="w-24 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-pink-800">Forgot Password?</h2>
          <p className="text-gray-600 mt-2 text-sm">Enter your email and we'll send you an OTP instantly</p>
        </div>

        {msg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-5 text-center font-medium">
            {msg}
          </div>
        )}

        {err && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-5 text-center font-medium animate-pulse">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@example.com"
            required
            className="w-full px-5 py-4 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition text-gray-800 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-pink-600 to-rose-600 text-white font-bold py-4 rounded-xl hover:from-pink-700 hover:to-rose-700 transform shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP Now"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Remember your password?{' '}
          <Link href="/signin" className="text-pink-700 font-bold hover:underline hover:text-pink-900 transition">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
