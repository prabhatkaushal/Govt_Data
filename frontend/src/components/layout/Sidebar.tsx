"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, Target, Briefcase, FileSearch, Clock, Users,
  FileText, Upload, FolderTree, History, CheckCircle, Share2,
  TestTube, Link as LinkIcon, Replace, Fingerprint, Archive,
  Search, Sparkles, Bot, ScanText, UserSearch,
  ShieldCheck, Hexagon, PenTool, AlertOctagon,
  ListOrdered, Activity, Lock, BarChart3, ClipboardCheck,
  UserCog, Key, Building2, Settings,
  ChevronDown, ChevronRight, Radio
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  roles?: string[]; // restrict to these roles; undefined = all
}

interface NavGroup {
  name: string;
  items: NavItem[];
  roles?: string[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const userRole = user?.role || "";

  const navigationGroups: NavGroup[] = useMemo(() => [
    {
      name: "COMMAND",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      ]
    },
    {
      name: "INVESTIGATIONS",
      items: [
        { name: "Cases", href: "/cases", icon: Briefcase },
      ]
    },
    {
      name: "DOCUMENTS",
      items: [
        { name: "Documents Vault", href: "/documents", icon: FileText },
        { name: "Upload Section", href: "/documents/upload", icon: Upload },
      ]
    },
    {
      name: "INTELLIGENCE",
      items: [
        { name: "Global Search", href: "/search", icon: Search },
        { name: "Reports & Analytics", href: "/reports", icon: BarChart3 },
      ]
    },
    {
      name: "SECURITY & AUDIT",
      items: [
        { name: "Security Center", href: "/security", icon: ShieldCheck },
        { name: "Verify Documents", href: "/verify-documents", icon: ClipboardCheck, roles: ["LEGAL_OFFICER", "SUPER_ADMIN"] },
        { name: "Audit Trail", href: "/audit", icon: ListOrdered },
      ]
    },
    {
      name: "SYSTEM",
      items: [
        { name: "Settings", href: "/settings", icon: Settings },
      ]
    },
    {
      name: "ADMIN",
      roles: ["ADMIN", "admin", "SUPER_ADMIN"],
      items: [
        { name: "Users & Roles", href: "/admin", icon: UserCog },
      ]
    }
  ], []);

  const visibleGroups = navigationGroups.filter(g => {
    if (!g.roles) return true;
    return g.roles.includes(userRole);
  });

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navigationGroups.forEach(g => { initial[g.name] = true; });
    return initial;
  });

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  return (
    <aside id="sidebar" className="w-[260px] bg-surface border-r border-border hidden md:flex flex-col h-full shrink-0 relative z-20">
      
      <div className="h-16 flex items-center px-5 border-b border-border shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:border-accent/40 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="text-[13px] font-bold text-content-primary tracking-[0.2em] uppercase">SECURA</span>
        </Link>
      </div>
      
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        <nav className="px-3 space-y-5">
          {visibleGroups.map((group) => (
            <div key={group.name}>
              <button 
                onClick={() => toggleGroup(group.name)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-bold text-content-muted tracking-[0.2em] hover:text-content-secondary transition-colors"
              >
                {group.name}
                <motion.div
                  animate={{ rotate: expandedGroups[group.name] ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3 h-3 opacity-40" />
                </motion.div>
              </button>
              
              <AnimatePresence initial={false}>
                {expandedGroups[group.name] && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
                    className="overflow-hidden mt-1"
                  >
                    <div className="space-y-px">
                      {group.items.filter((item) => !item.roles || item.roles.includes(userRole)).map((item) => {
                        const isActive = pathname === item.href || 
                          (item.href !== "/dashboard" && !item.href.includes("?") && pathname.startsWith(item.href));
                        return (
                          <Link
                            key={item.name + item.href}
                            href={item.href}
                            className={`relative flex items-center gap-2.5 px-2.5 py-[7px] rounded-[3px] transition-all duration-200 text-[13px] group ${
                              isActive
                                ? "text-accent bg-accent/[0.06]"
                                : "text-content-secondary hover:text-content-primary hover:bg-white/[0.02]"
                            }`}
                          >
                            {isActive && (
                              <motion.div 
                                layoutId="sidebar-active"
                                className="absolute left-0 top-[20%] bottom-[20%] w-[2px] bg-accent rounded-r-full"
                                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
                              />
                            )}
                            <item.icon className={`w-[15px] h-[15px] shrink-0 transition-all duration-200 ${
                              isActive ? 'text-accent' : 'text-content-muted group-hover:text-content-secondary'
                            }`} />
                            <span className="truncate leading-none">{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>

      
      <div className="px-4 py-3 border-t border-border shrink-0">
        <div className="flex items-center gap-2.5 px-1">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-verification opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-verification"></span>
          </div>
          <span className="text-[10px] text-content-muted font-mono tracking-[0.15em] uppercase">System Nominal</span>
        </div>
      </div>
    </aside>
  );
}
