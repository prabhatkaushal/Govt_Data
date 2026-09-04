"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import { motion } from "framer-motion";
import { 
  Briefcase, FileText, CheckCircle, TestTube, ShieldCheck,
  AlertOctagon, Activity, ChevronRight, Lock, Database,
  Hexagon, PenTool, Plus, Upload, Search, ClipboardCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import ActiveCasesTable from "@/components/dashboard/ActiveCasesTable";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    casesCount: 0,
    documentsCount: 0,
    verifiedCount: 0,
    pendingCount: 0,
    alertsCount: 0,
    evidenceCount: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [casesRes, docsRes, auditRes, evdRes] = await Promise.all([
          api.get('/cases/'),
          api.get('/documents/'),
          api.get('/audit-logs/'),
          api.get('/evidence/').catch(() => ({ data: [] }))
        ]);
        
        setCases(casesRes.data.slice(0, 5));
        
        setStats({
          casesCount: casesRes.data.length,
          documentsCount: docsRes.data.length,
          verifiedCount: docsRes.data.filter((d: any) => d.status === 'ACTIVE' || d.status === 'VERIFIED').length,
          pendingCount: docsRes.data.filter((d: any) => d.status !== 'ACTIVE' && d.status !== 'VERIFIED').length,
          alertsCount: auditRes.data.filter((l: any) => l.severity === 'HIGH').length,
          evidenceCount: evdRes.data.length
        });
        
        setRecentActivity(auditRes.data.slice(0, 6).map((log: any) => ({
          id: log.id,
          actor: log.actor?.username || "System",
          action: log.action,
          target: log.resource_type ? `${log.resource_type} ${log.resource_id}` : (log.resource_id || "System"),
          time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(log.timestamp).toLocaleDateString(),
          severity: log.severity
        })));
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-content-muted font-mono tracking-[0.2em] text-[10px] uppercase">Initializing Command Center</p>
      </div>
    );
  }

  const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } } };

  return (
    <motion.div className="space-y-10 max-w-[1600px]" variants={stagger} initial="hidden" animate="show">
      
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-content-primary tracking-tight">Command Center</h1>
          <p className="text-content-muted text-sm mt-1">Real-time overview of investigation, document and security operations.</p>
        </div>
        <div className="text-[10px] font-mono text-content-muted tracking-widest uppercase bg-surface border border-border rounded px-3 py-1.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
        </div>
      </motion.div>

      {/* KPI Row */}
      <DashboardStats stats={stats} />

      {/* Quick Actions */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
        {[
          { label: "New Case", icon: Plus, href: "/cases/new" },
          { label: "All Cases", icon: Briefcase, href: "/cases" },
          { label: "Upload Section", icon: Upload, href: "/documents/upload" },
          { label: "Global Semantic Search", icon: Search, href: "/search" },
          { label: "Verify Document", icon: CheckCircle, href: "/security", roles: ["LEGAL_OFFICER", "SUPER_ADMIN", "ADMIN"] },
          { label: "View Audit", icon: ClipboardCheck, href: "/audit" },
        ].filter(action => !action.roles || action.roles.includes(user?.role || "")).map(action => (
          <Link key={action.label} href={action.href}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-surface border border-border rounded-lg text-[13px] font-medium text-content-secondary hover:text-content-primary hover:border-border-hover hover:bg-elevated hover:shadow-sm transition-all"
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </Link>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Active Investigations + Recent Activity */}
        <div className="xl:col-span-8 space-y-10">
          
          {/* Active Investigations */}
          <ActiveCasesTable cases={cases} />

          {/* Recent Activity */}
          <RecentActivityFeed recentActivity={recentActivity} />
        </div>

        {/* Right Column: Security + System Status */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Security Status */}
          <motion.div variants={fadeUp} className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase flex items-center gap-2 mb-6">
              <ShieldCheck className="w-4 h-4 text-status-verification" /> System Security
            </h2>
            <div className="space-y-4">
              {[
                { label: "Authentication", status: "Operational", icon: Lock, ok: true },
                { label: "Document Encryption", status: "Operational", icon: ShieldCheck, ok: true },
                { label: "Integrity Verification", status: "Operational", icon: CheckCircle, ok: true },
                { label: "Audit Logging", status: "Operational", icon: Activity, ok: true },
                { label: "Blockchain Integrity", status: "Pending Integration", icon: Hexagon, ok: false },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0 group">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-content-muted" />
                    <span className="text-sm font-medium text-content-secondary">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-1 rounded bg-elevated ${
                    item.ok ? 'text-status-verification' : 'text-status-warning'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={fadeUp}>
            <h2 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase mb-4">
              Data Integrity
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-xs text-content-secondary">Document Integrity</span>
                  <span className="text-[10px] font-mono text-status-verification font-bold">
                    {stats.documentsCount > 0 ? Math.round((stats.verifiedCount / stats.documentsCount) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-background rounded-full h-1">
                  <div
                    className="bg-status-verification h-1 rounded-full transition-all duration-700"
                    style={{ width: `${stats.documentsCount > 0 ? (stats.verifiedCount / stats.documentsCount) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
