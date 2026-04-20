"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ShieldAlert, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.warn(
          "[Admin Guard] Access denied: Not logged in. Redirecting to login.",
        );
        router.push("/login");
      } else if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
        console.warn(
          `[Admin Guard] Access denied: Role ${user.role} unauthorized. Redirecting to home.`,
        );
        router.push("/");
      } else {
        setAuthorized(true);
      }
      setChecking(false);
    }
  }, [user, loading, router]);

  if (checking) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin"></div>
          <Zap className="w-10 h-10 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black text-gray-900 tracking-tighter italic">
            Securing Environment
          </h3>
          <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] animate-pulse">
            Verifying Administrative Protocols...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null; // Redirection handled in useEffect
  }

  return <>{children}</>;
}
