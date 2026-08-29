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
        { name: "Command Center", href: "/dashboard", icon: Target },
      ]
    },
    {
      name: "INVESTIGATIONS",
      items: [
        { name: "Cases", href: "/cases", icon: Briefcase },
        { name: "Active Investigations", href: "/cases?view=active", icon: FileSearch },
        { name: "Case Timeline", href: "/cases/timeline", icon: Clock },
        { name: "Assignments", href: "/cases/assignments", icon: Users },
      ]
    },
    {
      name: "DOCUMENTS",
      items: [
        { name: "Documents", href: "/documents", icon: FileText },
        { name: "Upload Document", href: "/documents/upload", icon: Upload },
        { name: "Categories", href: "/documents/categories", icon: FolderTree },
        { name: "Versions", href: "/documents/versions", icon: History },
        { name: "Verification", href: "/security", icon: CheckCircle },
        { name: "Secure Sharing", href: "/documents/sharing", icon: Share2 },
      ]
    },
    {
      name: "EVIDENCE",
      items: [
        { name: "Evidence Registry", href: "/evidence", icon: TestTube },
        { name: "Evidence Vault", href: "/evidence/vault", icon: Archive },
        { name: "Chain of Custody", href: "/evidence/chain", icon: LinkIcon },
        { name: "Transfers", href: "/evidence/transfers", icon: Replace },
        { name: "Forensics", href: "/evidence/forensics", icon: Fingerprint },
      ]
    },
    {
      name: "INTELLIGENCE",
      items: [
        { name: "Global Search", href: "/search", icon: Search },
        { name: "AI Search", href: "/search/ai", icon: Sparkles },
        { name: "AI Assistant", href: "/search/assistant", icon: Bot },
        { name: "OCR", href: "/search/ocr", icon: ScanText },
        { name: "People & Entities", href: "/search/people", icon: UserSearch },
      ]
    },
    {
      name: "SECURITY",
      items: [
        { name: "Security Center", href: "/security", icon: ShieldCheck },
        { name: "Integrity Verification", href: "/security/integrity", icon: CheckCircle },
        { name: "Blockchain Verification", href: "/security/blockchain", icon: Hexagon },
        { name: "Digital Signatures", href: "/security/signatures", icon: PenTool },
        { name: "Security Alerts", href: "/security/alerts", icon: AlertOctagon },
      ]
    },
    {
      name: "AUDIT",
      items: [
        { name: "Audit Trail", href: "/audit", icon: ListOrdered },
        { name: "Activity Logs", href: "/audit/activity", icon: Activity },
        { name: "Access Logs", href: "/audit/access", icon: Lock },
        { name: "Reports", href: "/audit/reports", icon: BarChart3 },
        { name: "Compliance", href: "/audit/compliance", icon: ClipboardCheck },
      ]
    },
    {
      name: "ADMIN",
      roles: ["ADMIN", "admin"],
      items: [
        { name: "Users", href: "/admin", icon: UserCog },
        { name: "Roles & Permissions", href: "/admin/roles", icon: Key },
        { name: "Departments", href: "/admin/departments", icon: Building2 },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      ]
    }
  ], []);

  // Filter groups by role
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
    <aside className="w-[260px] bg-surface/80 backdrop-blur-md border-r border-border hidden md:flex flex-col h-full shrink-0 relative z-20">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-border shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:border-accent/40 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="text-xs font-bold text-content-primary tracking-[0.2em] uppercase">SECURE-OPS</span>
        </Link>
      </div>
      
      {/* Navigation */}
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
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden mt-1"
                  >
                    <div className="space-y-px">
                      {group.items.map((item) => {
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
                                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
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

      {/* System Status */}
      <div className="px-4 py-3 border-t border-border shrink-0">
        <div className="flex items-center gap-2.5 px-1">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-verification opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-verification"></span>
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
          <span className="text-[10px] text-content-muted font-mono tracking-[0.15em] uppercase">System Nominal</span>
        </div>
      </div>
    </aside>
  );
}
