"use client";

import React, { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    role: "BUYER",
    // Specialized fields
    store_name: "",
    vehicle_type: "MOTORCYCLE",
    license_number: "",
    // Address
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "United States",
  });

  const isSpecialRole =
    formData.role === "VENDOR" || formData.role === "DRIVER";
  const totalSteps = isSpecialRole ? 4 : 3;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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
        store_name:
          formData.role === "VENDOR" ? formData.store_name : undefined,
        vehicle_type:
          formData.role === "DRIVER" ? formData.vehicle_type : undefined,
        license_number:
          formData.role === "DRIVER" ? formData.license_number : undefined,
      };

      await apiClient.register(registerData);
      router.push("/login?registered=true");
    } catch (err: any) {
      console.error(err);
      if (err.errors) {
        const firstErr = Object.values(err.errors)[0];
        const message = Array.isArray(firstErr)
          ? firstErr[0]
          : typeof firstErr === "string"
            ? firstErr
            : "Registration failed.";
        setError(message);
      } else {
        setError("Connection failed. Please check your network and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const isSpecialSuccess =
      formData.role === "VENDOR" || formData.role === "DRIVER";

    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/50 p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 p-12 text-center animate-in fade-in zoom-in-95 duration-700">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
            {isSpecialSuccess ? "Registration Received!" : "Account Created!"}
          </h2>
          <p className="text-zinc-500 mt-4 leading-relaxed font-medium">
            {isSpecialSuccess
              ? `Next Step: As a ${formData.role === "VENDOR" ? "Merchant" : "Delivery Partner"}, you need to submit your KYC documents to activate your account.`
              : "Welcome to the future of commerce. Your account is ready. Let's get you signed in."}
          </p>

          {isSpecialSuccess ? (
            <div className="space-y-4 mt-10">
              <Link
                href="/kyc"
                className="block w-full py-5 px-6 bg-indigo-600 hover:bg-zinc-900 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-100 uppercase tracking-widest text-xs"
              >
                Submit KYC Documents
              </Link>
              <Link
                href="/login"
                className="block text-zinc-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-600 transition-colors"
              >
                I'll do it later
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="mt-10 block w-full py-5 px-6 bg-indigo-600 hover:bg-zinc-900 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-100 uppercase tracking-widest text-xs"
            >
              Sign in to Dashboard
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Define steps dynamically
  const steps = [
    { id: 1, name: "Credentials", tag: "Step 01" },
    { id: 2, name: "Profile Info", tag: "Step 02" },
  ];

  if (isSpecialRole) {
    steps.push({ id: 3, name: "Professional", tag: "Step 03" });
    steps.push({ id: 4, name: "Address Details", tag: "Step 04" });
  } else {
    steps.push({ id: 3, name: "Address Details", tag: "Step 03" });
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 selection:bg-indigo-100">
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20 flex flex-col items-center">
        {/* Header Section */}
        <header className="mb-16 text-center max-w-lg">
          <Link
            href="/"
            className="text-3xl font-black text-indigo-600 tracking-tighter mb-4 inline-block"
          >
            TrestBiyyo.
          </Link>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-3">
            Begin your journey.
          </h1>
          <p className="text-zinc-500 font-medium">
            Join thousands of businesses and shoppers on the most advanced
            platform.
          </p>
        </header>

        {/* Global Progress Line (Horizontal) */}
        <div className="w-full max-w-4xl mb-20 relative px-4">
          <div className="flex justify-between items-center relative z-10 w-full">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500 ${
                    step >= s.id
                      ? "bg-zinc-900 text-white shadow-2xl shadow-zinc-200"
                      : "bg-white text-zinc-300 border border-zinc-100 shadow-sm"
                  }`}
                >
                  {step > s.id ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    `0${s.id}`
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <p
                    className={`text-[9px] uppercase font-bold tracking-[0.2em] mb-0.5 ${step >= s.id ? "text-indigo-600" : "text-zinc-300"}`}
                  >
                    {s.tag}
                  </p>
                  <h4
                    className={`text-xs font-black tracking-tight ${step >= s.id ? "text-zinc-900" : "text-zinc-300"}`}
                  >
                    {s.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute top-6 left-8 right-8 h-[1px] bg-zinc-100 -z-0">
            <div
              className={cn(
                "h-full bg-indigo-600 transition-all duration-700 ease-out",
                step === 1 && "w-0",
                step === 2 && "w-1/2",
                step === 3 && "w-full",
              )}
            />
          </div>
        </div>

        {/* Form Body */}
        <main className="w-full max-w-4xl">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] border border-zinc-100/50 p-8 sm:p-16 relative overflow-hidden transition-all duration-500 min-h-[500px]"
          >
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="mb-12">
                  <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
                    Account Credentials
                  </h2>
                  <p className="text-zinc-500 mt-2 font-medium">
                    Start with your base identity metrics.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label
                      htmlFor="username"
                      className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5 cursor-pointer"
                    >
                      Username
                    </label>
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
                    <label
                      htmlFor="email"
                      className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5 cursor-pointer"
                    >
                      Email Address
                    </label>
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
                    <label
                      htmlFor="password"
                      className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5 cursor-pointer"
                    >
                      Create Password
                    </label>
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
                    <label
                      htmlFor="confirmPassword"
                      className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5 cursor-pointer"
                    >
                      Confirm Password
                    </label>
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

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="mb-12">
                  <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
                    Identity Profile
                  </h2>
                  <p className="text-zinc-500 mt-2 font-medium">
                    Establish your personal brand presence.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label
                      htmlFor="first_name"
                      className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5 cursor-pointer"
                    >
                      First Name
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      name="first_name"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label
                      htmlFor="last_name"
                      className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5 cursor-pointer"
                    >
                      Last Name
                    </label>
                    <input
                      id="last_name"
                      type="text"
                      name="last_name"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                      placeholder="Doe"
                    />
                  </div>
                  <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label
                      htmlFor="phone_number"
                      className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5 cursor-pointer"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone_number"
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label
                      htmlFor="role"
                      className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5 cursor-pointer"
                    >
                      Ecosystem Role
                    </label>
                    <div className="relative group">
                      <select
                        id="role"
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold appearance-none cursor-pointer"
                      >
                        <option value="BUYER">Shopper (Buyer Account)</option>
                        <option value="VENDOR">
                          Merchant (Vendor Account)
                        </option>
                        <option value="DRIVER">
                          Delivery Partner (Driver Account)
                        </option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-focus-within:text-indigo-600 transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isSpecialRole && step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="mb-12">
                  <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
                    Professional Config
                  </h2>
                  <p className="text-zinc-500 mt-2 font-medium">
                    Specific parameters based on your ecosystem role.
                  </p>
                </div>
                <div className="space-y-10">
                  {formData.role === "VENDOR" ? (
                    <div>
                      <label
                        htmlFor="store_name"
                        className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5 cursor-pointer"
                      >
                        Official Store Name
                      </label>
                      <input
                        id="store_name"
                        type="text"
                        name="store_name"
                        required
                        value={formData.store_name}
                        onChange={handleChange}
                        className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                        placeholder="e.g. Trest Premium Store"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label
                          htmlFor="vehicle_type"
                          className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5 cursor-pointer"
                        >
                          Vehicle Asset Class
                        </label>
                        <select
                          id="vehicle_type"
                          name="vehicle_type"
                          value={formData.vehicle_type}
                          onChange={handleChange}
                          className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold appearance-none"
                        >
                          <option value="MOTORCYCLE">Motorcycle</option>
                          <option value="CAR">Car</option>
                          <option value="VAN">Van</option>
                          <option value="BICYCLE">Bicycle</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="license_number"
                          className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5 cursor-pointer"
                        >
                          License/Permit Number
                        </label>
                        <input
                          id="license_number"
                          type="text"
                          name="license_number"
                          required
                          value={formData.license_number}
                          onChange={handleChange}
                          className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                          placeholder="e.g. DL-12345678"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === (isSpecialRole ? 4 : 3) && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="mb-12">
                  <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
                    Geographic Data
                  </h2>
                  <p className="text-zinc-500 mt-2 font-medium">
                    Verify your primary locational nexus.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-10">
                  <div className="md:col-span-12 space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label
                      htmlFor="street_address"
                      className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5 cursor-pointer"
                    >
                      Street Address
                    </label>
                    <input
                      id="street_address"
                      type="text"
                      name="street_address"
                      value={formData.street_address}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                      placeholder="123 Luxury Ave"
                    />
                  </div>
                  <div className="md:col-span-6 space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label
                      htmlFor="city"
                      className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5 cursor-pointer"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                      placeholder="New York"
                    />
                  </div>
                  <div className="md:col-span-6 space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label
                      htmlFor="state"
                      className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5 cursor-pointer"
                    >
                      State
                    </label>
                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                      placeholder="NY"
                    />
                  </div>
                  <div className="md:col-span-4 space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label
                      htmlFor="postal_code"
                      className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5 cursor-pointer"
                    >
                      ZIP Code
                    </label>
                    <input
                      id="postal_code"
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold"
                      placeholder="10001"
                    />
                  </div>
                  <div className="md:col-span-8 space-y-1.5">
                    <label
                      htmlFor="country"
                      className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1 mb-1.5 cursor-pointer"
                    >
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-zinc-50 border border-zinc-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300 outline-none rounded-2xl text-zinc-900 font-semibold appearance-none"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-12 p-5 bg-red-50 text-red-700 rounded-[1.5rem] text-sm font-bold flex items-center gap-4">
                {error}
              </div>
            )}

            <div className="mt-16 flex items-center justify-between gap-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="h-14 px-10 bg-white border border-zinc-100 text-zinc-500 font-bold rounded-2xl hover:bg-zinc-50 transition-all duration-300"
                >
                  Back
                </button>
              )}
              <div className="flex-1" />
              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="h-14 px-12 bg-zinc-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all duration-500 shadow-2xl shadow-zinc-200"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="h-14 px-12 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-zinc-900 transition-all duration-500 shadow-2xl shadow-indigo-100 flex items-center gap-3 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Complete Phase"}
                </button>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
