'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

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
    // Mocking address details for Step 3 (not part of the register endpoint, but for UI)
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
      // Backend registration data (only what serializer expects)
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
      // In a real app, I would then login or redirect.
      // Since address is a separate endpoint requiring auth, I'll stop here or just show success.
    } catch (err: any) {
      console.error(err);
      if (err.errors) {
        // Simple error stringify for demo
        setError(JSON.stringify(err.errors));
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Registration Successful!</h2>
          <p className="text-gray-500 text-lg">Your account has been created. You can now log in and manage your profile.</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full">
        {/* Progress Bar */}
        <div className="mb-12 relative">
          <div className="flex justify-between items-center px-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center relative z-10">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 border-2 border-gray-100'
                  }`}
                >
                  {step > s ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s}
                </div>
                <span className={`mt-3 text-sm font-semibold transition-colors ${step >= s ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {s === 1 ? 'Account' : s === 2 ? 'Profile' : 'Address'}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute top-6 left-8 right-8 h-[2px] bg-gray-200 -z-0">
             <div 
              className="h-full bg-indigo-600 transition-all duration-500" 
              style={{ width: `${((step - 1) / 2) * 100}%` }}
             />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
            {/* Left Side: Illustration or Visual */}
            <div className="hidden md:flex md:col-span-4 bg-indigo-600 p-12 text-white flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-4xl font-bold leading-tight mb-4 tracking-tight">Create your account.</h1>
                <p className="text-indigo-100/80 text-lg">Join our community and start your journey today.</p>
              </div>
              <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <p className="text-sm font-medium italic">"The process is amazingly smooth and the design is top notch."</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-400"></div>
                  <span className="text-xs font-bold opacity-80 uppercase tracking-widest">A. Django</span>
                </div>
              </div>
              
              {/* Abstract backgrounds */}
              <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl"></div>
            </div>

            {/* Right Side: Form Content */}
            <form onSubmit={handleSubmit} className="md:col-span-8 p-8 sm:p-12">
              <input type="hidden" name="role" value={formData.role} />
              
              <div className="min-h-[350px]">
                {step === 1 && (
                  <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Setup</h2>
                    <p className="text-gray-500 mb-8">Let's get your credentials sorted first.</p>
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="username" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 cursor-pointer">Username</label>
                        <input
                          id="username"
                          type="text"
                          name="username"
                          required
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700"
                          placeholder="johndoe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 cursor-pointer">Email Address</label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="password" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 cursor-pointer">Password</label>
                          <input
                            id="password"
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 cursor-pointer">Confirm Password</label>
                          <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Profile</h2>
                    <p className="text-gray-500 mb-8">Tell us a bit more about yourself.</p>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="first_name" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 cursor-pointer">First Name</label>
                          <input
                            id="first_name"
                            type="text"
                            name="first_name"
                            required
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label htmlFor="last_name" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 cursor-pointer">Last Name</label>
                          <input
                            id="last_name"
                            type="text"
                            name="last_name"
                            required
                            value={formData.last_name}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="phone_number" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 cursor-pointer">Phone Number</label>
                        <input
                          id="phone_number"
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                       <div>
                        <label className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Join as</label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'BUYER' })}
                            className={`px-5 py-4 rounded-2xl font-bold transition-all duration-300 border-2 ${
                              formData.role === 'BUYER' 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100' 
                              : 'bg-white text-gray-600 border-gray-100 hover:border-indigo-200'
                            }`}
                          >
                            Buyer
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'VENDOR' })}
                            className={`px-5 py-4 rounded-2xl font-bold transition-all duration-300 border-2 ${
                              formData.role === 'VENDOR' 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100' 
                              : 'bg-white text-gray-600 border-gray-100 hover:border-indigo-200'
                            }`}
                          >
                            Vendor
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Primary Address</h2>
                    <p className="text-gray-500 mb-8">Where should we reach you?</p>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="street_address" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 cursor-pointer">Street Address</label>
                        <input
                          id="street_address"
                          type="text"
                          name="street_address"
                          value={formData.street_address}
                          onChange={handleChange}
                          className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700"
                          placeholder="123 Luxury Ave"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                          <label htmlFor="city" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 cursor-pointer">City</label>
                          <input
                            id="city"
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700"
                            placeholder="New York"
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 cursor-pointer">State</label>
                          <input
                            id="state"
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700"
                            placeholder="NY"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="postal_code" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 cursor-pointer">Postal Code</label>
                          <input
                            id="postal_code"
                            type="text"
                            name="postal_code"
                            value={formData.postal_code}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700"
                            placeholder="10001"
                          />
                        </div>
                        <div>
                          <label htmlFor="country" className="block text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 cursor-pointer">Country</label>
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none rounded-2xl text-gray-700 appearance-none bg-no-repeat bg-[right_1.25rem_center]"
                          >
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="mt-12 flex justify-between gap-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-4 px-8 border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all duration-300"
                  >
                    Back
                  </button>
                )}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      // Basic validation for steps
                      if (step === 1 && (!formData.username || !formData.email || !formData.password)) {
                        setError('Please fill all fields.');
                        return;
                      }
                      if (step === 1 && formData.password !== formData.confirmPassword) {
                        setError("Passwords don't match.");
                        return;
                      }
                      setError(null);
                      nextStep();
                    }}
                    className="flex-1 py-4 px-8 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                  >
                    Continue
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 px-8 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Complete Registration
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-400 text-sm">
                  Already have an account? <a href="/login" className="text-indigo-600 font-bold hover:underline">Sign In</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
