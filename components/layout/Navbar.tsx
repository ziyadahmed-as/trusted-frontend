"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Menu,
  UserCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { cartCount, openDrawer } = useCart();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              aria-label="Open Menu"
              className="p-2 -ml-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-50 md:hidden transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-gray-900 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-gray-200">
                <span className="text-white font-black text-xl italic tracking-tighter">
                  TB
                </span>
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight hidden sm:block">
                Trest<span className="text-indigo-600">Biyyo</span>
              </span>
            </Link>
          </div>

          {/* Search (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-8"
          >
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-all" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium products..."
                className="w-full bg-gray-50 border-2 border-transparent text-gray-900 text-sm rounded-2xl focus:ring-0 focus:border-indigo-600 outline-none block pl-12 p-3.5 transition-all shadow-inner"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Account / User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl text-gray-900 hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-black uppercase">
                    {user.username?.[0] || "U"}
                  </div>
                  <span className="text-sm font-bold hidden lg:block italic tracking-tight">
                    {user.username}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-gray-400 transition-transform",
                      isUserMenuOpen && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20"
                      >
                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {user.role}
                          </p>
                        </div>
                        {(() => {
                          let dashboardUrl = "/";
                          if (
                            user.role === "ADMIN" ||
                            user.role === "SUPER_ADMIN"
                          )
                            dashboardUrl = "/admin";
                          else if (user.role === "VENDOR")
                            dashboardUrl = user.is_verified
                              ? "/vendor-profile"
                              : "/kyc";
                          else if (user.role === "DRIVER")
                            dashboardUrl = user.is_verified ? "/" : "/kyc";

                          return (
                            <Link
                              href={dashboardUrl}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <UserCircle className="w-4 h-4" />
                              Dashboard
                            </Link>
                          );
                        })()}
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 p-2 px-4 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all active:scale-95"
              >
                <UserCircle className="w-6 h-6" />
                <span className="text-sm font-black uppercase tracking-widest hidden lg:block">
                  Sign In
                </span>
              </Link>
            )}

            {/* Cart Reveal Button */}
            <button
              onClick={openDrawer}
              className="relative p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all group flex items-center gap-3 active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-[9px] font-black text-white shadow-sm"
                  >
                    {cartCount}
                  </motion.div>
                )}
              </div>
              {cartCount > 0 && (
                <span className="text-sm font-bold text-gray-900 hidden sm:block italic tracking-tight">
                  {cartCount}{" "}
                  <span className="text-gray-400 font-medium">items</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
