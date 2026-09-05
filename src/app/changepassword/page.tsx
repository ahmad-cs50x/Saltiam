"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryEmail = searchParams?.get("email");
    const storedEmail = typeof window !== "undefined" ? sessionStorage.getItem("passwordResetEmail") : null;
    if (queryEmail) {
      setEmail(queryEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email) {
      const message = "Email is required to update the password.";
      setError(message);
      toast.error(`❌ ${message}`);
      return;
    }
    if (password.length < 6) {
      const message = "Password must be at least 6 characters.";
      setError(message);
      toast.error(`❌ ${message}`);
      return;
    }
    if (password !== confirmPassword) {
      const message = "Passwords do not match.";
      setError(message);
      toast.error(`❌ ${message}`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to change password.");
      }

      toast.success("✅ Password changed successfully");
      sessionStorage.removeItem("passwordResetEmail");
      setTimeout(() => {
        router.push("/signin");
      }, 1400);
    } catch (err: any) {
      const message = err.message || "Failed to change password.";
      setError(message);
      toast.error(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-linear-to-b from-[#ffd3b6] via-rose-300 to-rose-300 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="https://i.ibb.co/QFMv4DMN/logo.png" alt="Saltiam Logo" className="w-24 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-pink-700">Set New Password</h2>
          <p className="text-gray-600 mt-2">Enter a new password for your account.</p>
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            required
            minLength={6}
            className="w-full px-5 py-4 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition text-gray-800 placeholder-gray-500"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            required
            minLength={6}
            className="w-full px-5 py-4 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition text-gray-800 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-pink-600 to-rose-600 text-white font-semibold py-4 rounded-xl hover:from-pink-700 hover:to-rose-700 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Remembered your password?{' '}
          <Link href="/signin" className="text-pink-600 font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ChangePassword;