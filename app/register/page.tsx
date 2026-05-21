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
      <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2] p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8"
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
          <h2 className="text-2xl font-bold text-gray-900">
            {isSpecialSuccess ? "Registration Received!" : "Account Created!"}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            {isSpecialSuccess
              ? `Next Step: As a ${formData.role === "VENDOR" ? "Merchant" : "Delivery Partner"}, you need to submit your KYC documents to activate your account.`
              : "Your account is ready. Let's get you signed in."}
          </p>

          {isSpecialSuccess ? (
            <div className="space-y-3 mt-8">
              <Link
                href="/kyc"
                className="block w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors"
              >
                Submit KYC Documents
              </Link>
              <Link
                href="/login"
                className="block text-gray-500 font-semibold text-sm hover:text-red-600 transition-colors"
              >
                I'll do it later
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="mt-8 block w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors"
            >
              Sign in to Dashboard
            </Link>
          )}
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, name: "Credentials" },
    { id: 2, name: "Profile Info" },
  ];

  if (isSpecialRole) {
    steps.push({ id: 3, name: "Professional" });
    steps.push({ id: 4, name: "Address" });
  } else {
    steps.push({ id: 3, name: "Address" });
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] py-12">
      <div className="max-w-3xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-2">TrestBiyyo</h1>
          <h2 className="text-xl font-bold text-gray-900">Create your account</h2>
        </header>

        {/* Global Progress Line (Horizontal) */}
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 rounded" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-red-500 -translate-y-1/2 rounded transition-all duration-300"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            />
            {steps.map((s) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step >= s.id
                      ? "bg-red-500 text-white ring-4 ring-white"
                      : "bg-gray-200 text-gray-500 ring-4 ring-white"
                  }`}
                >
                  {step > s.id ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.id
                  )}
                </div>
                <span className={`text-xs font-semibold ${step >= s.id ? "text-gray-900" : "text-gray-400"}`}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="min-h-[300px] flex flex-col">
            {step === 1 && (
              <div className="space-y-6 flex-1">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Account Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none rounded-md text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none rounded-md text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Create Password</label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none rounded-md text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none rounded-md text-gray-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 flex-1">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Identity Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none rounded-md text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none rounded-md text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none rounded-md text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Account Type</label>
                    <select
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none rounded-md text-gray-900"
                    >
                      <option value="BUYER">Shopper (Buyer Account)</option>
                      <option value="VENDOR">Merchant (Vendor Account)</option>
                      <option value="DRIVER">Delivery Partner (Driver Account)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {isSpecialRole && step === 3 && (
              <div className="space-y-6 flex-1">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Professional Details</h3>
                {formData.role === "VENDOR" ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Store Name</label>
                    <input
                      type="text"
                      name="store_name"
                      required
                      value={formData.store_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none rounded-md text-gray-900"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Vehicle Type</label>
                      <select
                        name="vehicle_type"
                        value={formData.vehicle_type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none rounded-md text-gray-900"
                      >
                        <option value="MOTORCYCLE">Motorcycle</option>
                        <option value="CAR">Car</option>
                        <option value="VAN">Van</option>
                        <option value="BICYCLE">Bicycle</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">License Number</label>
                      <input
                        type="text"
                        name="license_number"
                        required
                        value={formData.license_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none rounded-md text-gray-900"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === (isSpecialRole ? 4 : 3) && (
              <div className="space-y-6 flex-1">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Address Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      name="street_address"
                      value={formData.street_address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none rounded-md text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none rounded-md text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none rounded-md text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">ZIP/Postal Code</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none rounded-md text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none rounded-md text-gray-900"
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
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm font-semibold">
                {error}
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              
              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Complete Registration"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
