"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-white px-6">
      {/* Background Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[80%] bg-indigo-50/50 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] bg-rose-50/50 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-10"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 shadow-sm">
            <Sparkles className="w-4 h-4 fill-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">New Season Arrivals</span>
          </div>

          <h1 className="text-7xl lg:text-8xl font-black text-gray-900 leading-[0.85] tracking-tighter italic">
            Elegance <br />
            <span className="text-gray-300">In Every</span> <br />
            Detail.
          </h1>

          <p className="text-xl font-medium text-gray-500 max-w-lg leading-relaxed italic">
            Curating the finest products from verified global vendors. Experience a marketplace built on trust, quality, and speed.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <Link
              href="/#catalog"
              className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-gray-200 flex items-center gap-3 group"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black overflow-hidden shadow-sm">
                   <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-sm italic">
                +2k
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined this week</p>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-10 border-t border-gray-50">
             <div className="space-y-2">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Verified Vendors</p>
             </div>
             <div className="space-y-2">
                <Zap className="w-6 h-6 text-indigo-600" />
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Express Delivery</p>
             </div>
             <div className="space-y-2">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Premium Support</p>
             </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          {/* Main Visual */}
          <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_80px_100px_-20px_rgba(0,0,0,0.15)] border-[12px] border-white bg-gray-50 group">
             <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
             <div className="absolute inset-0 flex items-center justify-center">
                <img 
                   src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop" 
                   alt="Premium Watch" 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                />
             </div>
             <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/20">
                <p className="text-white font-black text-2xl italic tracking-tighter mb-1">Ethereal Series 01</p>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Limited Edition Release</p>
             </div>
          </div>

          {/* Floating Card */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 -left-16 p-6 bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex items-center gap-4 z-20"
          >
             <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <Sparkles className="w-8 h-8" />
             </div>
             <div>
                <p className="text-xs font-black text-gray-900 italic tracking-tighter">High Fidelity</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Quality</p>
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
