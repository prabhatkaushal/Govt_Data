"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (idNumber: string, passcode: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isInvestigator: boolean;
  isLawyer: boolean;
  isForensic: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    const storedUser = sessionStorage.getItem('user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (idNumber: string, passcode: string) => {
    try {
      // idNumber acts as username
      const res = await api.post("/auth/login/", { username: idNumber, password: passcode });
      const { access, refresh, user: userData } = res.data;
      
      sessionStorage.setItem("access_token", access);
      sessionStorage.setItem("refresh_token", refresh);
      sessionStorage.setItem("user", JSON.stringify(userData));
      
      setIsAuthenticated(true);
      setUser(userData);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  const isInvestigator = user?.role === 'INVESTIGATING_OFFICER' || user?.role === 'SUPER_ADMIN';
  const isLawyer = user?.role === 'LEGAL_OFFICER' || user?.role === 'SUPER_ADMIN';
  const isForensic = user?.role === 'FORENSIC_EXPERT' || user?.role === 'SUPER_ADMIN';

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading, isInvestigator, isLawyer, isForensic }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
