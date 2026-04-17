'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await apiClient.login(formData);
      if (result.access) {
        const user = await apiClient.getMe();
        console.log("User role: ", user.role)

        // --- Role-Based Redirection Logic ---
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
          router.push('/admin');
        } else if (user.role === 'VENDOR' || user.role === 'DRIVER') {
          // Check KYC status for specialized roles
          if (user.is_verified) {
            router.push(user.role === 'VENDOR' ? '/vendor-profile' : '/');
          } else {
            router.push('/kyc');
          }
        } else {
          router.push('/');
        }
      } else {
        alert(result.detail || 'Access denied. Please check your credentials.');
      }
    } catch (err) {
      console.error(err);
      alert('Login identification failed. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 border border-gray-50 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-indigo-600 mb-2 tracking-tighter">TrestBiyyo.</h1>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Manage your stores and orders with ease.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 cursor-pointer">Email Address</label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label htmlFor="password" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer">Password</label>
              <Link href="/forgot-password" title="Forgot Password?" className="text-xs font-bold text-indigo-600 hover:underline">Forgot?</Link>
            </div>
            <input
              id="password"
              type="password"
              required
              className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-8 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account? <Link href="/register" className="text-indigo-600 font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
