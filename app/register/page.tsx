'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    role: 'BUYER',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const registerData = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        role: formData.role,
      };

      await apiClient.register(registerData);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      if (err.errors) {
        // More professional error handling: extract first error message
        const firstErr = Object.values(err.errors)[0];
        const message = Array.isArray(firstErr) ? firstErr[0] : (typeof firstErr === 'string' ? firstErr : 'Registration failed.');
        setError(message);
      } else {
        setError('Connection failed. Please check your network and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/50 p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 p-12 text-center animate-in fade-in zoom-in-95 duration-700">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Account Created!</h2>
          <p className="text-zinc-500 mt-4 leading-relaxed font-medium">Welcome to the future of commerce. Your account is ready. Let's get you signed in.</p>
          <Link
            href="/login"
            className="mt-10 block w-full py-5 px-6 bg-indigo-600 hover:bg-zinc-900 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-100 uppercase tracking-widest text-xs"
          >
            Sign in to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 selection:bg-indigo-100">
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20 flex flex-col items-center">
        
        {/* Header Section */}
        <header className="mb-16 text-center max-w-lg">
          <Link href="/" className="text-3xl font-black text-indigo-600 tracking-tighter mb-4 inline-block">TREST.</Link>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-3">Begin your journey.</h1>
          <p className="text-zinc-500 font-medium">Join thousands of businesses and shoppers on the most advanced platform.</p>
        </header>

        {/* Professional Step Progress bar */}
        <div className="w-full max-w-4xl mb-20 relative">
          <div className="flex justify-between items-center relative z-10 w-full px-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-4 bg-zinc-50 group cursor-default">
                <div 
                   className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black transition-all duration-500 ${
                     step >= s 
                     ? 'bg-zinc-900 text-white shadow-2xl shadow-zinc-200' 
                     : 'bg-white text-zinc-300 border border-zinc-100 shadow-sm'
                   }`}
                >
                  {step > s ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : `0${s}`}
                </div>
                <div className="hidden sm:block text-left">
                  <p className={`text-[10px] uppercase font-bold tracking-[0.2em] transition-colors ${step >= s ? 'text-indigo-600' : 'text-zinc-300'}`}>Step 0{s}</p>
                  <h4 className={`text-sm font-black tracking-tight transition-colors ${step >= s ? 'text-zinc-900' : 'text-zinc-300'}`}>
                    {s === 1 ? 'Credentials' : s === 2 ? 'Profile Info' : 'Address Details'}
                  </h4>
                </div>
              </div>
            ))}
          </div>
          
          {/* Connector Line */}
          <div className="absolute top-7 left-8 right-8 h-[2px] bg-zinc-100 -z-0">
            <div 
              className="h-full bg-indigo-600 transition-all duration-700 ease-out"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Form Container - No Side Bar */}
        <main className="w-full max-w-4xl">
          <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] border border-zinc-100/50 p-8 sm:p-16 relative overflow-hidden transition-all duration-500">
            
            {/* Step 1: Account */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="mb-12">
                   <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Account Credentials</h2>
                   <p className="text-zinc-500 mt-2 font-medium">Protect your store with a secure account.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label htmlFor="username" className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5">Username</label>
                    <input
                      id="username"
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                      placeholder="e.g. creative_mind"
                    />
                  </div>
                  <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label htmlFor="email" className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                      placeholder="name@trusted.com"
                    />
                  </div>
                  <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label htmlFor="password" className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5">Create Password</label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label htmlFor="confirmPassword" className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Profile */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="mb-12">
                   <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Personal Profile</h2>
                   <p className="text-zinc-500 mt-2 font-medium">How should we address you within Trest?</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                   <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label htmlFor="first_name" className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5">First Name</label>
                    <input
                      id="first_name"
                      type="text"
                      name="first_name"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label htmlFor="last_name" className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5">Last Name</label>
                    <input
                      id="last_name"
                      type="text"
                      name="last_name"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label htmlFor="phone_number" className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5">Mobile Number (Optional)</label>
                    <input
                      id="phone_number"
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-3">I am joining as a</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'BUYER' })}
                        className={`h-14 rounded-2xl font-black text-sm tracking-tight transition-all duration-300 border ${
                          formData.role === 'BUYER' 
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xl shadow-zinc-200' 
                          : 'bg-white text-zinc-400 border-zinc-100 hover:border-indigo-200'
                        }`}
                      >
                        Shopper
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'VENDOR' })}
                        className={`h-14 rounded-2xl font-black text-sm tracking-tight transition-all duration-300 border ${
                          formData.role === 'VENDOR' 
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xl shadow-zinc-200' 
                          : 'bg-white text-zinc-400 border-zinc-100 hover:border-indigo-200'
                        }`}
                      >
                        Merchant
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Address */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="mb-12">
                   <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Preferred Residence</h2>
                   <p className="text-zinc-500 mt-2 font-medium">Necessary for shipping and billing compliance.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-10">
                  <div className="md:col-span-12 space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label htmlFor="street_address" className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5">Street Address</label>
                    <input
                      id="street_address"
                      type="text"
                      name="street_address"
                      value={formData.street_address}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                    />
                  </div>
                  <div className="md:col-span-6 space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label htmlFor="city" className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5">City</label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                    />
                  </div>
                  <div className="md:col-span-6 space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label htmlFor="state" className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5">State / Province</label>
                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                    />
                  </div>
                  <div className="md:col-span-4 space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label htmlFor="postal_code" className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5">ZIP Code</label>
                    <input
                      id="postal_code"
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                    />
                  </div>
                  <div className="md:col-span-8 space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label htmlFor="country" className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5">Country</label>
                    <div className="relative">
                       <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold appearance-none bg-no-repeat bg-[right_1.5rem_center]"
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                      </select>
                      <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-zinc-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-12 p-5 bg-red-50 text-red-700 rounded-[1.5rem] text-sm font-bold flex items-center gap-4 animate-in slide-in-from-right-4 duration-500">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4 w-full sm:w-auto">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="h-14 px-10 bg-white border border-zinc-100 text-zinc-500 font-bold rounded-2xl hover:bg-zinc-50 transition-all duration-300"
                  >
                    Go Back
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 1 && (!formData.username || !formData.email || !formData.password || !formData.confirmPassword)) {
                        setError('Please define your account security first.');
                        return;
                      }
                      setError(null);
                      nextStep();
                    }}
                    className="w-full sm:w-auto h-14 px-12 bg-zinc-900 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all duration-500 shadow-2xl shadow-zinc-200 flex items-center justify-center gap-3"
                  >
                    Next Step
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto h-14 px-12 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-zinc-900 transition-all duration-500 shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Finish Registration
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            
            <div className="mt-12 text-center border-t border-zinc-50 pt-10">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest leading-loose">
                Already registered? <Link href="/login" className="text-indigo-600 hover:text-zinc-900 transition-colors ml-2 decoration-2 underline-offset-4">Identity Sign In</Link>
              </p>
            </div>
          </form>
        </main>

        <footer className="mt-20 text-center">
           <p className="text-zinc-300 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 Trest World Systems</p>
        </footer>
      </div>
    </div>
  );
}
