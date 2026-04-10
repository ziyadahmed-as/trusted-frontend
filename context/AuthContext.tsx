'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (credentials: any) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      try {
        const userData = await apiClient.getMe();
        setUser(userData);
      } catch (err) {
        console.error('Failed to refresh user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const result = await apiClient.login(credentials);
      if (result.access) {
        await refreshUser();
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
