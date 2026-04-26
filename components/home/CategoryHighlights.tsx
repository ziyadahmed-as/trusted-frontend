"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const highlightCategories = [
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600&auto=format&fit=crop",
    color: "bg-indigo-600",
    slug: "electronics"
  },
  {
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600&auto=format&fit=crop",
    color: "bg-rose-500",
    slug: "fashion"
  },
  {
    name: "Home & Living",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=600&auto=format&fit=crop",
    color: "bg-amber-500",
    slug: "home-living"
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
    color: "bg-emerald-500",
    slug: "accessories"
  }
];

export function CategoryHighlights() {
  return (
    <section className="py-32 bg-white px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
           <div className="space-y-4">
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] italic">Explore Departments</h2>
              <h3 className="text-6xl font-black text-gray-900 tracking-tighter italic">
                Curated <span className="text-gray-300">Collections.</span>
              </h3>
           </div>
           <Link href="/#catalog" className="flex items-center gap-2 group text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
              View All Categories
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlightCategories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-gray-100 shadow-2xl shadow-gray-200/50 cursor-pointer"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-4">
                <span className="text-white font-black text-3xl italic tracking-tighter leading-none">
                   {cat.name}
                </span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                   <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Shop Now</span>
                   <ChevronRight className="w-3 h-3 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
