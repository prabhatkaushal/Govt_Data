"use client";

import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; role: string; id: string } | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Dummy auth state: default to true for the sake of the demo
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState<{ name: string; role: string; id: string } | null>({
    name: "Admin User",
    role: "System Administrator",
    id: "USR-9831",
  });

  const login = () => {
    setIsAuthenticated(true);
    setUser({ name: "Admin User", role: "System Administrator", id: "USR-9831" });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
