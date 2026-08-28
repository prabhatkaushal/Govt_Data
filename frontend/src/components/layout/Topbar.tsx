"use client";

import { useAuth } from "@/context/AuthContext";
import { Bell, Search, LogOut, ShieldCheck } from "lucide-react";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-[#0B0F17]/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        {/* Command Search Bar Simulation */}
        <div className="hidden md:flex items-center relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input 
            type="text" 
            placeholder="Search cases, hashes, or audit logs..." 
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-full pl-10 pr-12 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
          />
          <div className="absolute right-3 flex items-center">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">Ctrl+K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-950/30 border border-emerald-900/50 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-xs font-medium text-emerald-400">Ledger Sync: OK</span>
        </div>

        <div className="relative cursor-pointer group">
          <Bell className="w-5 h-5 text-slate-400 group-hover:text-slate-200 transition-colors" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-[#0B0F17] shadow-[0_0_8px_rgba(239,68,68,0.6)]">
            3
          </span>
        </div>

        <div className="flex items-center gap-4 pl-6 border-l border-slate-800/80">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-200">{user?.full_name || user?.username || "Authorized User"}</p>
            <p className="text-[10px] text-blue-400 font-mono uppercase tracking-wider">{user?.role?.replace('_', ' ')}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-white font-bold border border-blue-400/30 shadow-[0_0_10px_rgba(30,58,138,0.5)]">
            {user?.full_name?.charAt(0) || user?.username?.charAt(0) || "U"}
          </div>
          <button 
            onClick={logout}
            className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-slate-800/50"
            title="Secure Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
