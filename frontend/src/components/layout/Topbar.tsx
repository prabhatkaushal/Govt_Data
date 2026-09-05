"use client";

import { useAuth } from "@/context/AuthContext";
import { Search, Bell, LogOut, CheckCircle, X, Moon, Sun, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import api from "@/services/api";

function InlineSearchResults({ query, onClose }: { query: string, onClose: () => void }) {
  const [results, setResults] = useState<{cases: any[], docs: any[]}>({cases: [], docs: []});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const [casesRes, docsRes] = await Promise.all([
          api.get('/cases/'),
          api.get('/documents/')
        ]);
        const q = query.toLowerCase();
        const cases = casesRes.data.filter((c: any) => c.title?.toLowerCase().includes(q) || c.case_number?.toLowerCase().includes(q)).slice(0, 3);
        const docs = docsRes.data.filter((d: any) => d.title?.toLowerCase().includes(q) || d.document_id?.toLowerCase().includes(q)).slice(0, 3);
        setResults({ cases, docs });
      } catch (err) {
        console.error("Inline search failed", err);
      }
      setLoading(false);
    };
    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (loading) return <div className="p-4 text-xs text-content-muted text-center animate-pulse">Searching...</div>;
  if (results.cases.length === 0 && results.docs.length === 0) return <div className="p-4 text-xs text-content-muted text-center">No results found.</div>;

  return (
    <div className="space-y-4">
      {results.cases.length > 0 && (
        <div>
          <div className="text-[10px] font-bold text-accent tracking-[0.15em] uppercase px-2 mb-2">Cases</div>
          {results.cases.map(c => (
            <Link key={c.id} href={`/cases/${c.id}`} onClick={onClose} className="block px-3 py-2 rounded hover:bg-surface transition-colors">
              <div className="text-sm font-medium text-content-primary">{c.title}</div>
              <div className="text-xs text-content-muted font-mono">{c.case_number}</div>
            </Link>
          ))}
        </div>
      )}
      {results.docs.length > 0 && (
        <div>
          <div className="text-[10px] font-bold text-status-verification tracking-[0.15em] uppercase px-2 mb-2">Documents</div>
          {results.docs.map(d => (
            <Link key={d.id} href={`/documents/${d.id}`} onClick={onClose} className="block px-3 py-2 rounded hover:bg-surface transition-colors">
              <div className="text-sm font-medium text-content-primary">{d.title}</div>
              <div className="text-xs text-content-muted font-mono">{d.document_id}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Topbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
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
  
  const toggleMobileMenu = () => {
    document.body.classList.toggle('mobile-sidebar-open');
  };
  
  let pageTitle = "Command Center";
  if (pathname.includes("/cases")) pageTitle = "Case Management";
  if (pathname.includes("/documents")) pageTitle = "Document Repository";
  if (pathname.includes("/evidence")) pageTitle = "Evidence Registry";
  if (pathname.includes("/search")) pageTitle = "Intelligence";
  if (pathname.includes("/security")) pageTitle = "Security Center";
  if (pathname.includes("/audit")) pageTitle = "Audit & Compliance";
  if (pathname.includes("/admin")) pageTitle = "Administration";

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
    <header className="h-14 bg-surface/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 sticky top-0 z-50 shrink-0">
      
      <div className="flex items-center gap-3 min-w-0 shrink-0">
        <button className="md:hidden text-content-muted hover:text-content-primary p-1" onClick={toggleMobileMenu}>
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-[10px] font-bold text-content-muted tracking-[0.15em] uppercase hidden sm:block">
          {pageTitle}
        </span>
      </div>

      
      <div className="flex-1 flex justify-center px-8 max-w-2xl" ref={searchRef}>
        <div className="relative w-full">
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`w-full flex items-center gap-3 bg-surface/60 border border-border rounded-md px-4 py-2 text-sm text-content-muted hover:border-border-hover hover:bg-surface transition-all ${
              isSearchOpen ? 'border-accent/40 bg-elevated' : ''
            }`}
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 text-left text-xs">Global Semantic Search...</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] text-content-muted font-mono border border-border rounded px-1.5 py-0.5 bg-background/50">
              ⌘K
            </kbd>
          </button>

          
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
                    placeholder="Global semantic search across cases, documents..."
                    className="flex-1 bg-transparent text-sm text-content-primary placeholder-content-muted outline-none"
                  />
                  <button onClick={() => {setIsSearchOpen(false); setSearchQuery("");}} className="text-content-muted hover:text-content-primary transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-3">
                  {searchQuery.trim().length >= 2 ? (
                    <InlineSearchResults query={searchQuery} onClose={() => setIsSearchOpen(false)} />
                  ) : (
                    <>
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
                          <button key={item.label} onClick={() => { setIsSearchOpen(false); router.push(item.shortcut.split(" ")[1]); }} className="w-full flex items-center justify-between px-3 py-2 rounded text-sm text-content-secondary hover:text-content-primary hover:bg-white/[0.03] transition-colors">
                            <span>{item.label}</span>
                            <span className="text-[10px] font-mono text-content-muted">{item.shortcut}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      
      <div className="flex items-center gap-4 shrink-0">
        
        <div className="hidden lg:flex items-center gap-1.5 text-status-verification text-[10px] font-bold tracking-[0.15em] uppercase">
          <CheckCircle className="w-3 h-3" />
          <span>Secure</span>
        </div>

        <div className="h-4 w-px bg-border hidden lg:block" />
        
        
        <button 
          onClick={toggleTheme} 
          className="text-content-muted hover:text-content-primary transition-colors p-1"
          title="Toggle Theme"
        >
          {mounted && resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-border" />

        
        <button className="relative text-content-muted hover:text-content-primary transition-colors p-1">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-white">
            3
          </span>
        </button>

        <div className="h-4 w-px bg-border" />

        
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
            className="text-content-muted hover:text-status-danger transition-colors p-1"
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
