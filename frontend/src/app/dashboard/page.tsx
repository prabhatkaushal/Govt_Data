"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Briefcase, FileText, CheckCircle, TestTube, ShieldCheck,
  AlertOctagon, Activity, ChevronRight, Lock, Database,
  Hexagon, PenTool, Plus, Upload, Search, ClipboardCheck
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    casesCount: 0,
    documentsCount: 0,
    verifiedCount: 0,
    pendingCount: 0,
    alertsCount: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [casesRes, docsRes, auditRes] = await Promise.all([
          api.get('/cases/'),
          api.get('/documents/'),
          api.get('/audit-logs/')
        ]);
        
        setCases(casesRes.data.slice(0, 5));
        
        setStats({
          casesCount: casesRes.data.length,
          documentsCount: docsRes.data.length,
          verifiedCount: docsRes.data.filter((d: any) => d.status === 'ACTIVE' || d.status === 'VERIFIED').length,
          pendingCount: docsRes.data.filter((d: any) => d.status !== 'ACTIVE' && d.status !== 'VERIFIED').length,
          alertsCount: auditRes.data.filter((l: any) => l.severity === 'HIGH').length
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
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };

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
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded overflow-hidden">
        {[
          { label: "Active Cases", value: stats.casesCount, icon: Briefcase, color: "text-accent" },
          { label: "Documents", value: stats.documentsCount, icon: FileText, color: "text-content-primary" },
          { label: "Verified", value: stats.verifiedCount, sub: `${stats.documentsCount > 0 ? Math.round((stats.verifiedCount / stats.documentsCount) * 100) : 0}% integrity`, icon: CheckCircle, color: "text-status-verification" },
          { label: "Pending Review", value: stats.pendingCount, icon: ClipboardCheck, color: "text-status-warning" },
          { label: "Evidence Items", value: "—", sub: "Awaiting backend", icon: TestTube, color: "text-content-muted" },
          { label: "Security Alerts", value: stats.alertsCount.toString().padStart(2, '0'), sub: stats.alertsCount > 0 ? `${stats.alertsCount} require attention` : "All clear", icon: AlertOctagon, color: stats.alertsCount > 0 ? "text-status-critical" : "text-status-verification" },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-surface p-5 flex flex-col justify-between min-h-[100px] group hover:bg-elevated transition-colors">
            <div className="flex items-center justify-between">
              <kpi.icon className={`w-4 h-4 ${kpi.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
            </div>
            <div className="mt-3">
              <div className={`text-2xl font-bold ${kpi.color} tracking-tight`}>{kpi.value}</div>
              <div className="text-[10px] text-content-muted tracking-[0.1em] uppercase mt-1">{kpi.label}</div>
              {kpi.sub && <div className="text-[10px] text-content-muted font-mono mt-0.5">{kpi.sub}</div>}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
        {[
          { label: "New Case", icon: Plus, href: "/cases" },
          { label: "Upload Document", icon: Upload, href: "/documents/upload" },
          { label: "Register Evidence", icon: TestTube, href: "/evidence" },
          { label: "Search", icon: Search, href: "/search" },
          { label: "Verify Document", icon: CheckCircle, href: "/security" },
          { label: "View Audit", icon: ClipboardCheck, href: "/audit" },
        ].map(action => (
          <Link key={action.label} href={action.href}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-surface border border-border rounded text-xs text-content-secondary hover:text-content-primary hover:border-border-hover hover:bg-elevated transition-all"
          >
            <action.icon className="w-3.5 h-3.5" />
            {action.label}
          </Link>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Active Investigations + Recent Activity */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Active Investigations */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-accent" /> Active Investigations
              </h2>
              <Link href="/cases" className="text-[10px] text-content-muted hover:text-accent transition-colors tracking-widest uppercase">
                View All
              </Link>
            </div>
            <div className="border border-border rounded overflow-hidden bg-surface">
              {cases.length === 0 ? (
                <div className="p-8 text-center text-content-muted text-sm">No active cases.</div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-elevated/30 text-[10px] font-bold text-content-muted tracking-[0.12em] uppercase">
                      <th className="px-4 py-3 font-normal">Case ID</th>
                      <th className="px-4 py-3 font-normal">Title</th>
                      <th className="px-4 py-3 font-normal">Status</th>
                      <th className="px-4 py-3 font-normal">Classification</th>
                      <th className="px-4 py-3 font-normal text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {cases.map((c: any) => (
                      <tr key={c.id} className="group hover:bg-elevated/40 transition-colors cursor-pointer relative">
                        <td className="px-4 py-3 text-xs font-mono text-accent font-medium">
                          <Link href={`/cases/${c.id}`} className="absolute inset-0" aria-label={`View case ${c.case_number}`} />
                          {c.case_number}
                        </td>
                        <td className="px-4 py-3 text-sm text-content-primary">{c.title}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-[2px] border ${
                            c.status === 'UNDER_INVESTIGATION' ? 'text-status-warning bg-status-warning/10 border-status-warning/20' :
                            c.status === 'OPEN' || c.status === 'ACTIVE' ? 'text-status-verification bg-status-verification/10 border-status-verification/20' :
                            'text-content-muted bg-surface border-border'
                          }`}>
                            {c.status?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[10px] font-bold tracking-widest uppercase text-content-muted">
                          {c.confidentiality_level?.replace(/_/g, ' ')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <ChevronRight className="w-3.5 h-3.5 text-content-muted opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all inline-block" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-status-warning" /> Recent Activity
              </h2>
            </div>
            <div className="space-y-1">
              {recentActivity.length === 0 ? (
                <div className="py-8 text-center text-content-muted text-sm border border-dashed border-border rounded">No activity recorded.</div>
              ) : recentActivity.map((event) => (
                <div key={event.id} className="flex items-start gap-4 px-4 py-3 rounded hover:bg-surface/60 transition-colors group">
                  <div className="shrink-0 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      event.severity === 'HIGH' ? 'bg-status-critical' : 'bg-status-verification'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-content-primary uppercase tracking-wide">{event.action}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-content-secondary">{event.actor}</span>
                      <span className="text-[10px] text-content-muted">—</span>
                      <span className="text-[10px] font-mono text-content-muted">{event.target}</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-content-muted shrink-0">{event.time}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Security + System Status */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Security Status */}
          <motion.div variants={fadeUp}>
            <h2 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase flex items-center gap-2 mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-status-verification" /> System Security
            </h2>
            <div className="space-y-3">
              {[
                { label: "Authentication", status: "Operational", icon: Lock, ok: true },
                { label: "Document Encryption", status: "Operational", icon: ShieldCheck, ok: true },
                { label: "Integrity Verification", status: "Operational", icon: CheckCircle, ok: true },
                { label: "Audit Logging", status: "Operational", icon: Activity, ok: true },
                { label: "Blockchain Integrity", status: "Pending Integration", icon: Hexagon, ok: false },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0 group">
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-3.5 h-3.5 text-content-muted" />
                    <span className="text-xs text-content-secondary">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-bold tracking-[0.1em] uppercase ${
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
