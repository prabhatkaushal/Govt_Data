"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function Sidebar() {
  const pathname = usePathname();
  const { isInvestigator, user } = useAuth();

  const allNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Cases", href: "/cases", icon: "📁" },
    { name: "Documents", href: "/documents", icon: "📄" },
    { name: "Upload Document", href: "/documents/upload", icon: "📤", investigatorOnly: true },
  ];

  const navItems = allNavItems.filter(item => !item.investigatorOnly || isInvestigator);

  return (
    <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold tracking-tight text-primary">NyayaVault</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard" && item.href !== "/documents/upload" && item.href !== "/cases/upload");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-xs font-semibold text-foreground">SECURITY CLEARANCE</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {user?.role?.replace('_', ' ') || "LEVEL 4 ACTIVE"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
