"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-20 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <span className="text-white font-black">TrestBiyyo</span>
        <span className="text-xs">© 2026 All Rights Reserved</span>
      </div>
    </footer>
  );
}
