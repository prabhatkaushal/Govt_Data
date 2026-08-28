"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function Sidebar() {
  const pathname = usePathname();
  const { isInvestigator } = useAuth();

  const allNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Cases", href: "/cases", icon: "📁" },
    { name: "Documents", href: "/documents", icon: "📄" },
    { name: "Upload Document", href: "/documents/upload", icon: "📤", investigatorOnly: true },
  ];

  const navItems = allNavItems.filter(item => !item.investigatorOnly || isInvestigator);

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
          <span className="text-blue-500">🛡️</span> SECURE-OPS
        </span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard" && item.href !== "/documents/upload" && item.href !== "/cases/upload");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-md p-4">
          <p className="text-xs text-slate-400 font-semibold mb-1">SYSTEM STATUS</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm text-emerald-500 font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
