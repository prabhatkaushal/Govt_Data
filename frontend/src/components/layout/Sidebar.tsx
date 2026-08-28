"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Shield, LayoutDashboard, FolderLock, FileKey2, UploadCloud, Activity } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { isInvestigator, user } = useAuth();

  const allNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Active Cases", href: "/cases", icon: FolderLock },
    { name: "Document Vault", href: "/documents", icon: FileKey2 },
    { name: "Secure Upload", href: "/documents/upload", icon: UploadCloud, investigatorOnly: true },
  ];

  const navItems = allNavItems.filter(item => !item.investigatorOnly || isInvestigator);

  return (
    <aside className="w-64 bg-[#0B0F17]/95 backdrop-blur-xl border-r border-slate-800/80 hidden md:flex flex-col relative z-20 shadow-2xl">
      <div className="h-16 flex items-center px-6 border-b border-slate-800/80 bg-slate-900/50">
        <span className="text-lg font-bold text-white tracking-widest flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-500 animate-pulse-glow" /> 
          NYAYAVAULT
        </span>
      </div>
      
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-slate-500 tracking-wider mb-4">COMMAND CENTER</p>
        {navItems.map((item) => {
          const isActive = 
            pathname === item.href || 
            (pathname.startsWith(item.href + "/") && 
             !(item.href === "/documents" && pathname.startsWith("/documents/upload")) && 
             !(item.href === "/cases" && pathname.startsWith("/cases/upload")));
             
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative ${
                isActive
                  ? "bg-blue-600/10 text-blue-400"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              )}
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-slate-400 font-bold tracking-widest">SYSTEM POSTURE</p>
            <Activity className="w-3 h-3 text-emerald-500" />
          </div>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span className="text-xs text-emerald-400 font-medium tracking-wide">SECURE & ACTIVE</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/50">
             <p className="text-[10px] text-slate-500 font-mono truncate">{user?.role?.replace('_', ' ')} • ID: {user?.username}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
