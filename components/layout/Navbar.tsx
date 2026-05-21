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
// Removed CSS module import; styling now handled via Tailwind classes
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
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm" >
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
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-xl tracking-tighter">
                  TB
                </span>
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight hidden sm:block">
                Trest<span className="text-red-600">Biyyo</span>
              </span>
            </Link>
          </div>

          {/* Search (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl mx-8"
          >
            <div className="flex w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="I'm shopping for..."
                className="w-full bg-white border-2 border-red-500 border-r-0 text-gray-900 text-sm rounded-l-full outline-none block pl-6 p-2.5 shadow-sm"
              />
              <button type="submit" className="bg-red-500 text-white px-6 rounded-r-full hover:bg-red-600 transition-colors flex items-center justify-center">
                <Search className="h-5 w-5" />
              </button>
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
                  <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 text-xs font-black uppercase">
                    {user.username?.[0] || "U"}
                  </div>
                  <span className="text-sm font-bold hidden lg:block tracking-tight">
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
                              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
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
                className="flex items-center gap-2 p-2 px-4 rounded-xl text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <UserCircle className="w-7 h-7" />
                <div className="hidden lg:flex flex-col items-start leading-none gap-1">
                  <span className="text-[10px] text-gray-500">Welcome</span>
                  <span className="text-sm font-bold">Sign In / Register</span>
                </div>
              </Link>
            )}

            {/* Cart Reveal Button */}
            <button
              onClick={openDrawer}
              className="relative p-2 rounded-xl text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all group flex items-center gap-2"
            >
              <div className="relative">
                <ShoppingBag className="w-7 h-7" />
                {cartCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                  >
                    {cartCount}
                  </motion.div>
                )}
              </div>
              <div className="hidden lg:flex flex-col items-start leading-none gap-1">
                <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded font-bold">{cartCount > 0 ? cartCount : '0'}</span>
                <span className="text-sm font-bold">Cart</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
