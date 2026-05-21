"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-10 px-6 border-t border-gray-200 mt-auto">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-red-500">Help Center</Link></li>
              <li><Link href="#" className="hover:text-red-500">Transaction Services</Link></li>
              <li><Link href="#" className="hover:text-red-500">Agreement for non-EU/UK Consumers</Link></li>
              <li><Link href="#" className="hover:text-red-500">Terms and Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Shopping with Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-red-500">Making payments</Link></li>
              <li><Link href="#" className="hover:text-red-500">Delivery options</Link></li>
              <li><Link href="#" className="hover:text-red-500">Buyer Protection</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Collaborate with Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-red-500">Partnerships</Link></li>
              <li><Link href="#" className="hover:text-red-500">Affiliate program</Link></li>
              <li><Link href="#" className="hover:text-red-500">Seller Log In</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4">About TrestBiyyo</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-red-500">About Us</Link></li>
              <li><Link href="#" className="hover:text-red-500">Careers</Link></li>
              <li><Link href="#" className="hover:text-red-500">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            © 2026 TrestBiyyo. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="w-8 h-8 bg-gray-300 rounded-full"></span>
            <span className="w-8 h-8 bg-gray-300 rounded-full"></span>
            <span className="w-8 h-8 bg-gray-300 rounded-full"></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
