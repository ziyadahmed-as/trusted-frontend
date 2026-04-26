"use client";

import React from "react";
import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Global Shipping",
    desc: "Swift delivery to over 100+ countries with real-time tracking."
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "Protected by industry-leading encryption and adaptive gateways."
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "Not satisfied? Return your premium goods within 30 days."
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Our concierge team is always available for your needs."
  }
];

export function FeatureSection() {
  return (
    <section className="py-24 bg-gray-50 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {features.map((feature, i) => (
          <div key={i} className="flex flex-col items-center text-center space-y-6 group">
            <div className="w-20 h-20 rounded-[2rem] bg-white border border-gray-100 flex items-center justify-center text-indigo-600 shadow-xl shadow-gray-200/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
               <feature.icon className="w-10 h-10" />
            </div>
            <div className="space-y-2">
               <h3 className="text-lg font-black text-gray-900 tracking-tight italic">{feature.title}</h3>
               <p className="text-sm font-medium text-gray-400 max-w-[200px] italic">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
