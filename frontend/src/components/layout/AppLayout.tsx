"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && pathname !== "/login") {
        router.push("/login");
      } else if (isAuthenticated && pathname === "/login") {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Redirecting to login...</div>;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LayoutContent>{children}</LayoutContent>
      </AuthProvider>
    </ThemeProvider>
  );
}
