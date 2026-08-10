"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authApi, clearToken, getToken, setToken } from "@/lib/api";
import type { User } from "@/types/api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  /** Step 1: submit login/password, returns whether OTP is required + user_id */
  startLogin: (login: string, password: string) => Promise<{ userId: string | number }>;
  /** Step 2: submit the OTP the user received, completes login */
  completeLogin: (userId: string | number, otp: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user } = await authApi.me();
      setUser(user);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const startLogin = useCallback(async (login: string, password: string) => {
    const data = await authApi.login({ login, password });
    return { userId: data.user_id };
  }, []);

  const completeLogin = useCallback(async (userId: string | number, otp: string) => {
    const data = await authApi.verifyOtp({
      user_id: userId,
      otp,
      purpose: "login",
      device_name: "GCMS Web",
    });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout, clear locally regardless
    }
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, startLogin, completeLogin, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
