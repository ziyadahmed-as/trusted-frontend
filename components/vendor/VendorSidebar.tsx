"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navGroups = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/vendor-profile", icon: LayoutDashboard },
    ],
  },
  {
    label: "Store Operations",
    items: [
      { name: "Products", href: "/vendor-profile/products", icon: Package },
      { name: "Orders", href: "/vendor-profile/orders", icon: ShoppingCart },
      { name: "Finance", href: "/vendor-profile/finance", icon: DollarSign },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Settings", href: "/vendor-profile/settings", icon: Settings },
    ],
  },
];

export function VendorSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const initials =
    user?.first_name && user?.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
      : "VN";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col overflow-y-hidden bg-[#1c2434] duration-300 ease-linear lg:static lg:translate-x-0 transition-transform",
        sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:w-72",
      )}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 min-h-[4.5rem]">
        <Link href="/vendor-profile" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#10b981] rounded-lg flex items-center justify-center text-white font-bold text-xl">
            V
          </div>
          <span className="text-2xl font-bold text-white">VendorHub</span>
        </Link>
      </div>
      {/* SIDEBAR HEADER */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* Sidebar Menu */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-[#8a99af] uppercase tracking-wider">
                {group.label}
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5">
                {group.items.map((item, itemIdx) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={itemIdx}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-[#dee4ee] duration-300 ease-in-out hover:bg-[#333a48]",
                          isActive && "bg-[#333a48]",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "w-5 h-5",
                            isActive ? "text-[#10b981]" : "text-[#dee4ee]",
                          )}
                        />
                        {item.name}
                        {isActive && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-[#8a99af] uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <Link
                  href="/"
                  className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-[#dee4ee] duration-300 ease-in-out hover:bg-[#333a48]"
                >
                  <ExternalLink className="w-5 h-5 text-[#dee4ee]" />
                  Go to live store
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        {/* Sidebar Menu */}
      </div>

      <div className="mt-auto px-6 py-6 border-t border-[#2e3a47]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center text-white font-bold">
            {initials}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">
              {user?.username || "Vendor"}
            </p>
            <p className="text-xs text-[#8a99af] truncate lowercase">
              {user?.role === "VENDOR" ? "Store Owner" : "Vendor"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#333a48] px-4 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 transition-all border border-transparent hover:border-[#10b981]/30"
        >
          <LogOut className="w-4 h-4 text-[#8a99af]" />
          Logout
        </button>
      </div>
    </aside>
  );
}
