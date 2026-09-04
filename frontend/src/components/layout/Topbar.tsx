"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { SettingsModal } from "./SettingsModal";

import { TimeDisplay } from "./TimeDisplay";

export function Topbar() {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu button could go here */}
        <h2 className="text-foreground font-semibold text-lg hidden sm:block">Command Center</h2>
        <TimeDisplay />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-slate-400 hover:text-slate-200 transition-colors relative"
          >
            <span className="text-xl">🔔</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-slate-900">
              3
            </span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-md shadow-lg overflow-hidden z-50">
              <div className="p-3 border-b border-slate-700 bg-slate-900">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
              </div>
              <ul className="max-h-64 overflow-y-auto">
                <li className="p-3 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer">
                  <p className="text-sm text-slate-200">New document uploaded in FIR-2026-00482</p>
                  <p className="text-xs text-slate-400 mt-1">2 mins ago</p>
                </li>
                <li className="p-3 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer">
                  <p className="text-sm text-slate-200">Legal Review required for Document REF-2023-A91B</p>
                  <p className="text-xs text-slate-400 mt-1">1 hour ago</p>
                </li>
                <li className="p-3 hover:bg-slate-700/50 cursor-pointer">
                  <p className="text-sm text-slate-200">System maintenance scheduled</p>
                  <p className="text-xs text-slate-400 mt-1">Yesterday</p>
                </li>
              </ul>
            </div>
          )}
        </div>

        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Settings"
        >
          <span className="text-xl">⚙️</span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">{user?.full_name || user?.username || "User"}</p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold border-2 border-border">
            {user?.full_name?.charAt(0) || user?.username?.charAt(0) || "U"}
          </div>
          <button 
            onClick={logout}
            className="ml-2 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </header>
    
    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
