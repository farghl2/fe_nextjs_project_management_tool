'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/lib/httpClient';
import { API_ENDPOINTS } from '@/src/shared/constans/api-endpoints';
import type { AuthUser, UserRole } from '@/src/shared/types/api.types';

export type { UserRole };
export type User = AuthUser;

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const fetchCurrentUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.get<AuthUser>(API_ENDPOINTS.AUTH.ME);
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const logout = async () => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setUser(null);
      queryClient.clear();
      if (typeof window !== 'undefined') {
        const locale = window.location.pathname.split('/')[1] || 'ar';
        window.location.href = `/${locale}/login`;
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isLoading,
        isAuthenticated: !!user,
        setUser,
        logout,
        refetchUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
