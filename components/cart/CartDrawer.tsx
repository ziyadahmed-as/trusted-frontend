"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function CartDrawer() {
  const {
    isDrawerOpen,
    closeDrawer,
    items,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">
                  Your Cart
                </h2>
              </div>
              <button
                onClick={closeDrawer}
                aria-label="Close Cart"
                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
                    <ShoppingBag className="w-12 h-12" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-gray-500 max-w-[200px]">
                    Looks like you haven't added anything yet.
                  </p>
                  <button
                    onClick={closeDrawer}
                    className="mt-4 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={item.id}
                      className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm"
                    >
                      {/* Product Image Placeholder */}
                      <div className="w-20 h-20 rounded-xl bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingBag className="w-8 h-8 text-gray-300" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-gray-900 text-sm line-clamp-2 pr-4">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              aria-label="Remove item from cart"
                              className="text-gray-400 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm font-black text-indigo-600 mt-1">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 px-2 py-1 bg-gray-50 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                              className="text-gray-400 hover:text-gray-900 disabled:opacity-50"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-gray-900 w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.stock}
                              aria-label="Increase quantity"
                              className="text-gray-400 hover:text-gray-900 disabled:opacity-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-xs font-bold text-gray-400">
                            Subtotal: ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">Subtotal</span>
                    <span className="font-bold text-gray-900">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">Shipping</span>
                    <span className="text-emerald-600 font-bold">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="h-px bg-gray-200 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-black text-gray-900 tracking-tighter italic">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-[0.98]"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="mt-4 text-center">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                    Secure checkout via Stripe
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
