"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        {/* Brand */}
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-white/10">
              <span className="text-gray-900 font-black text-xl italic tracking-tighter">
                TB
              </span>
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              Trest<span className="text-indigo-400">Biyyo</span>
            </span>
          </Link>
          <p className="text-sm font-medium leading-relaxed italic">
            Redefining the digital marketplace with premium products and seamless logistics. Experience the future of commerce.
          </p>
          <div className="flex items-center gap-4">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-1"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-8">
          <h3 className="text-white font-black uppercase tracking-widest text-xs italic">
            Marketplace
          </h3>
          <ul className="space-y-4">
            {["All Products", "New Arrivals", "Featured", "Top Rated", "Vendor Stores"].map((link) => (
              <li key={link}>
                <Link href="/" className="text-sm font-bold hover:text-indigo-400 transition-colors">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-8">
          <h3 className="text-white font-black uppercase tracking-widest text-xs italic">
            Support
          </h3>
          <ul className="space-y-4">
            {["Help Center", "Track Order", "Shipping Info", "Returns & Refunds", "Contact Us"].map((link) => (
              <li key={link}>
                <Link href="/" className="text-sm font-bold hover:text-indigo-400 transition-colors">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-8">
          <h3 className="text-white font-black uppercase tracking-widest text-xs italic">
            Get in Touch
          </h3>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-indigo-400 shrink-0" />
              <span className="text-sm font-medium italic">
                123 Commerce Way, Digital District, TB 90210
              </span>
            </li>
            <li className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-indigo-400 shrink-0" />
              <span className="text-sm font-medium italic">+1 (555) 000-TREST</span>
            </li>
            <li className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
              <span className="text-sm font-medium italic">hello@trestbiyyo.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
          © 2026 TrestBiyyo. All Rights Reserved. Built for Excellence.
        </p>
        <div className="flex gap-8">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
            <a key={link} href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
