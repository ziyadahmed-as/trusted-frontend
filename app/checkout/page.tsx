"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  Truck,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await apiClient.syncCart(items);
      const result = await apiClient.checkoutOrder({
        currency: "USD",
        payment_gateway: "STRIPE",
      });

      clearCart();
      router.push("/orders?confirmed=true");
    } catch (err: any) {
      console.error(err);
      setError(
        err.errors?.detail ||
          err.errors?.error ||
          "Failed to place order. Please check your delivery information.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-lg border border-gray-200 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-gray-500 font-medium mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white rounded-md font-bold hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] pb-20 pt-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content: Order Summary */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Delivery Info */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                <Truck className="w-5 h-5 text-gray-600" />
                Shipping Information
              </h2>
              {user ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 font-bold border border-gray-200">
                      {user.username?.[0] || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                    Authenticated
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-orange-50 rounded-md border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-orange-900">
                    Sign in to use your saved addresses.
                  </p>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      href="/login?redirect=/checkout"
                      className="flex-1 sm:flex-none text-center px-4 py-2 bg-white text-orange-700 border border-orange-300 rounded-md text-sm font-bold hover:bg-orange-100 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register?redirect=/checkout"
                      className="flex-1 sm:flex-none text-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-bold hover:bg-red-700 transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm font-bold">
                  {error}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                <ShoppingBag className="w-5 h-5 text-gray-600" />
                Review Your Order
              </h2>
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 pr-4">
                          {item.name}
                        </h3>
                        <p className="text-base font-bold text-gray-900 whitespace-nowrap">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Quantity: {item.quantity} | ${item.price.toFixed(2)} / item
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar: Totals & Action */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-20">
              <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                Order Summary
              </h3>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Items Total</span>
                  <span className="font-semibold text-gray-900">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">
                    Free
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-bold text-gray-900">
                  Total
                </span>
                <span className="text-2xl font-black text-red-600">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!user || loading}
                className="w-full py-3 bg-red-600 text-white rounded-md font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Place Order"
                )}
              </button>

              <div className="mt-6 flex justify-center items-center gap-4 text-center">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-semibold">Secure</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs font-semibold">Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
