'use client';

import React from 'react';
import { VendorSidebar } from './VendorSidebar';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function VendorShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const displayName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : user?.username ?? 'Vendor';

  const initials = user?.first_name && user?.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() ?? 'VN';

  return (
    <div className="flex h-screen overflow-hidden bg-[#f1f5f9]">
      <VendorSidebar />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 flex w-full bg-white drop-shadow-1">
          <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-sm md:px-6 2xl:px-11 min-h-[4.5rem]">
            <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
              {/* Hamburger Button would go here */}
            </div>

            <div className="hidden sm:block">
              <div className="relative">
                <button className="absolute left-0 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
                <input
                  type="text"
                  placeholder="Search products or orders..."
                  className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ul className="flex items-center gap-2">
                <li>
                  <button className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[#e2e8f0] bg-[#f7f9fc] hover:text-[#10b981] p-2">
                    <Bell className="w-4.5 h-4.5 text-[#64748b]" />
                    <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-[#d34053]">
                      <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-[#d34053] opacity-75"></span>
                    </span>
                  </button>
                </li>
              </ul>

              <div className="relative flex items-center gap-4 ml-4">
                <div className="hidden text-right lg:block">
                  <span className="block text-sm font-medium text-black">
                    {displayName}
                  </span>
                  <span className="block text-xs font-medium text-[#64748b]">
                    Store Owner
                  </span>
                </div>

                <div className="h-11 w-11 rounded-full flex items-center justify-center bg-[#10b981] text-white font-bold shadow-lg shadow-[#10b981]/20">
                    {initials}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
