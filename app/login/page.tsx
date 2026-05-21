"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await apiClient.login(formData);
      if (result.access) {
        const user = await apiClient.getMe();
        console.log("User role: ", user.role);

        // --- Role-Based Redirection Logic ---
        if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
          router.push("/admin");
        } else if (user.role === "VENDOR" || user.role === "DRIVER") {
          // Check KYC status for specialized roles
          if (user.is_verified) {
            router.push(user.role === "VENDOR" ? "/vendor-profile" : "/");
          } else {
            router.push("/kyc");
          }
        } else {
          router.push("/");
        }
      } else {
        alert(result.detail || "Access denied. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      alert("Login identification failed. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            TrestBiyyo
          </h1>
          <h2 className="text-xl font-bold text-gray-900">Sign in to your account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors outline-none rounded-md text-gray-900"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors outline-none rounded-md text-gray-900"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center pt-6 border-t border-gray-100">
          <p className="text-gray-600 text-sm">
            New to TrestBiyyo?{" "}
            <Link
              href="/register"
              className="text-red-600 font-bold hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
