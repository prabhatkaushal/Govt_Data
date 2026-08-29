"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";


import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const isLegal = user?.role === 'LEGAL_OFFICER' || user?.username === '26010003' || user?.username?.includes('legal');
  const isForensic = user?.role === 'FORENSIC_OFFICER' || user?.username === '26010002' || user?.username?.includes('forensic');
  
  const bgImage = isLegal ? "url('/bg-legal.jpg')" : 
                  isForensic ? "url('/bg-forensic.jpg')" : 
                  "url('/bg-inspector.jpg')";
  
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isLegal) {
      document.body.classList.add('theme-legal');
    } else {
      document.body.classList.remove('theme-legal');
    }
  }, [isLegal]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-content-muted font-mono tracking-[0.2em] text-xs uppercase">Initializing System</p>
      <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center text-slate-200 gap-4">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-sm font-mono text-blue-400 animate-pulse">ESTABLISHING SECURE CONNECTION...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (pathname === "/login") {
      return (
        <div className="relative min-h-screen bg-background">
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </div>
      );
    }
    return <div className="min-h-screen bg-background flex items-center justify-center text-content-primary">Redirecting...</div>;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {mounted && resolvedTheme === 'dark' ? (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat fixed"
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.15 }}
            transition={{ duration: 3, ease: "easeOut" }}
            style={{ backgroundImage: bgImage, mixBlendMode: 'screen' }}
          ></motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background opacity-90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,transparent_0%,var(--background)_100%)] opacity-80"></div>
        </div>
      ) : mounted ? (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat fixed"
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.12 }}
            transition={{ duration: 3, ease: "easeOut" }}
            style={{ backgroundImage: bgImage, mixBlendMode: 'multiply' }}
          ></motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background opacity-90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,transparent_0%,var(--background)_100%)] opacity-60"></div>
        </div>
      ) : (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-background"></div>
      )}
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center text-slate-200 gap-4">
        <ShieldAlert className="w-12 h-12 text-red-500 animate-pulse-glow" />
        <p className="text-sm font-mono text-red-400">UNAUTHORIZED. REDIRECTING...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0B0F17] overflow-hidden text-slate-200 selection:bg-blue-500/30">
      {/* Background Cyber Effect */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Topbar />
        
        {/* Page content with smooth spatial transitions */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.995 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 overflow-y-auto p-8 scroll-smooth"
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}
