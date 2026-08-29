"use client";

import { useAuth } from "@/context/AuthContext";
import { Search, Bell, LogOut, CheckCircle, X, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export function Topbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };
  
  // Derive section title from pathname
  let pageTitle = "Command Center";
  if (pathname.includes("/cases")) pageTitle = "Case Management";
  if (pathname.includes("/documents")) pageTitle = "Document Repository";
  if (pathname.includes("/evidence")) pageTitle = "Evidence Registry";
  if (pathname.includes("/search")) pageTitle = "Intelligence";
  if (pathname.includes("/security")) pageTitle = "Security Center";
  if (pathname.includes("/audit")) pageTitle = "Audit & Compliance";
  if (pathname.includes("/admin")) pageTitle = "Administration";

  // Keyboard shortcut: Ctrl+K / Cmd+K
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setIsSearchOpen(prev => !prev);
    }
    if (e.key === "Escape") {
      setIsSearchOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Click outside to close search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-background/70 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 sticky top-0 z-50 shrink-0">
      {/* LEFT: Section Title */}
      <div className="flex items-center gap-3 min-w-0 shrink-0">
        <span className="text-[10px] font-bold text-content-muted tracking-[0.15em] uppercase hidden sm:block">
          {pageTitle}
        </span>
      </div>

      {/* CENTER: Command Search */}
      <div className="flex-1 flex justify-center px-8 max-w-2xl" ref={searchRef}>
        <div className="relative w-full">
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`w-full flex items-center gap-3 bg-surface/60 border border-border rounded-md px-4 py-2 text-sm text-content-muted hover:border-border-hover hover:bg-surface transition-all ${
              isSearchOpen ? 'border-accent/40 bg-elevated' : ''
            }`}
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 text-left text-xs">Search cases, documents, evidence...</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] text-content-muted font-mono border border-border rounded px-1.5 py-0.5 bg-background/50">
              ⌘K
            </kbd>
          </button>

          {/* Search Overlay */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
                className="absolute top-0 left-0 right-0 bg-elevated border border-accent/20 rounded-md shadow-2xl shadow-black/40 overflow-hidden z-50"
              >
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                  <Search className="w-4 h-4 text-accent shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cases, documents, evidence, officers..."
                    className="flex-1 bg-transparent text-sm text-content-primary placeholder-content-muted outline-none"
                  />
                  <button onClick={() => setIsSearchOpen(false)} className="text-content-muted hover:text-content-primary transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3">
                  <div className="text-[10px] font-bold text-content-muted tracking-[0.15em] uppercase px-2 py-1.5">
                    Quick Access
                  </div>
                  <div className="space-y-px">
                    {[
                      { label: "Cases", shortcut: "→ /cases" },
                      { label: "Documents", shortcut: "→ /documents" },
                      { label: "Evidence", shortcut: "→ /evidence" },
                      { label: "Audit Trail", shortcut: "→ /audit" },
                    ].map(item => (
                      <button key={item.label} className="w-full flex items-center justify-between px-3 py-2 rounded text-sm text-content-secondary hover:text-content-primary hover:bg-white/[0.03] transition-colors">
                        <span>{item.label}</span>
                        <span className="text-[10px] font-mono text-content-muted">{item.shortcut}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT: Status + User */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Security Status */}
        <div className="hidden lg:flex items-center gap-1.5 text-status-verification text-[10px] font-bold tracking-[0.15em] uppercase">
          <CheckCircle className="w-3 h-3" />
          <span>Secure</span>
        </div>

        <div className="h-4 w-px bg-border hidden lg:block" />
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className="text-content-muted hover:text-content-primary transition-colors p-1"
          title="Toggle Theme"
        >
          {mounted && resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-border" />

        {/* Notifications */}
        <button className="relative text-content-muted hover:text-content-primary transition-colors p-1">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-white">
            3
          </span>
        </button>

        <div className="h-4 w-px bg-border" />

        {/* User Profile */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-content-primary leading-none">
              {user?.username || "Officer"}
            </p>
            <p className="text-[9px] text-accent font-mono tracking-[0.15em] uppercase mt-1 leading-none">
              {user?.role?.replace(/_/g, " ") || "VIEWER"}
            </p>
          </div>
          <div className="h-7 w-7 rounded-[3px] bg-surface flex items-center justify-center text-content-secondary text-[10px] font-bold border border-border hover:border-accent/30 transition-colors">
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <button 
            onClick={logout}
            className="text-content-muted hover:text-status-critical transition-colors p-1"
            title="Secure Logout"
            aria-label="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
