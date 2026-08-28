"use client";

import { useAuth } from "@/context/AuthContext";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu button could go here */}
        <h2 className="text-slate-200 font-semibold text-lg hidden sm:block">Command Center</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button className="text-slate-400 hover:text-slate-200 transition-colors relative">
            <span className="text-xl">🔔</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-slate-900">
              3
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.full_name || user?.username || "User"}</p>
            <p className="text-xs text-slate-400">{user?.role}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold border-2 border-slate-700">
            {user?.full_name?.charAt(0) || user?.username?.charAt(0) || "U"}
          </div>
          <button 
            onClick={logout}
            className="ml-2 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </header>
  );
}
