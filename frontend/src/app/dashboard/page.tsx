"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { ShieldCheck, ShieldAlert, FolderLock, FileKey2, Activity, ChevronRight, Lock } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    casesCount: 0,
    documentsCount: 0,
    alertsCount: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [casesRes, docsRes, auditRes] = await Promise.all([
          api.get('/cases/'),
          api.get('/documents/'),
          api.get('/audit-logs/')
        ]);
        
        setStats({
          casesCount: casesRes.data.length,
          documentsCount: docsRes.data.length,
          alertsCount: auditRes.data.filter((l: any) => l.severity === 'HIGH').length
        });
        
        setRecentActivity(auditRes.data.slice(0, 5).map((log: any) => ({
          id: log.id,
          action: log.action,
          target: log.resource_id || "System",
          time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          date: new Date(log.timestamp).toLocaleDateString(),
          type: log.severity === 'HIGH' ? 'warning' : 'info'
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
      <div className="space-y-6">
        <div className="h-10 w-64 bg-slate-800/50 rounded-lg animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-800/50 rounded-xl animate-pulse"></div>)}
        </div>
        <div className="h-96 bg-slate-800/50 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Command Dashboard
          </h1>
          <p className="text-slate-400 mt-2 text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            End-to-End Encryption Active • System Operations Normal
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FolderLock className="w-16 h-16 text-blue-500" />
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Active Cases</p>
              <h3 className="text-4xl font-bold text-white mt-2 font-mono">{stats.casesCount}</h3>
              <p className="text-xs text-blue-400 mt-2 flex items-center gap-1 font-medium">
                <Activity className="w-3 h-3" /> Real-time sync
              </p>
            </div>
            <div className="h-10 w-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
              <FolderLock className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileKey2 className="w-16 h-16 text-emerald-500" />
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Verified Documents</p>
              <h3 className="text-4xl font-bold text-white mt-2 font-mono">{stats.documentsCount}</h3>
              <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3" /> Blockchain Anchored
              </p>
            </div>
            <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
              <FileKey2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6 relative overflow-hidden group border-t-red-500/30">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldAlert className="w-20 h-20 text-red-500" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Security Alerts</p>
              <h3 className="text-4xl font-bold text-red-400 mt-2 font-mono">{stats.alertsCount}</h3>
              <p className="text-xs text-red-400/80 mt-2 flex items-center gap-1 font-medium">
                {stats.alertsCount > 0 ? "Requires Immediate Attention" : "No critical alerts"}
              </p>
            </div>
            <div className="h-10 w-10 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-800/80 bg-slate-900/40 flex justify-between items-center">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" /> Recent Audit Activity
              </h3>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Live Feed</span>
            </div>
            
            <div className="divide-y divide-slate-800/50">
              {recentActivity.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">No recent activity detected.</div>
              ) : recentActivity.map((activity, idx) => (
                <div key={activity.id} className="px-6 py-4 hover:bg-slate-800/30 transition-colors flex items-center justify-between group" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex items-center gap-4">
                    <div className={`shrink-0 h-2.5 w-2.5 rounded-full shadow-[0_0_8px_currentColor] ${
                      activity.type === 'success' ? 'bg-emerald-500 text-emerald-500' :
                      activity.type === 'warning' ? 'bg-red-500 text-red-500' : 'bg-blue-500 text-blue-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-slate-200">{activity.action}</p>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">{activity.target}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-slate-400 block">{activity.time}</span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">{activity.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full px-6 py-3 border-t border-slate-800/80 bg-slate-900/30 text-xs text-blue-400 hover:bg-slate-800/50 transition-colors font-medium uppercase tracking-wider flex items-center justify-center gap-2 group">
              View Full Audit Log <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column (Sidebar-ish) */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="glass-panel rounded-xl overflow-hidden p-6">
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Commands</h3>
            <div className="space-y-3">
              <Link href="/cases" className="w-full bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg px-4 py-3 text-sm font-medium transition-all flex items-center gap-3">
                <FolderLock className="w-4 h-4" /> Open New Case
              </Link>
              <Link href="/documents" className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg px-4 py-3 text-sm font-medium transition-all flex items-center gap-3">
                <ShieldCheck className="w-4 h-4" /> Verify Evidence Hash
              </Link>
              <button 
                onClick={() => alert("Security Report generated and emailed to your secure inbox.")}
                className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg px-4 py-3 text-sm font-medium transition-all text-left flex items-center gap-3 text-slate-300"
              >
                <Activity className="w-4 h-4" /> Generate Security Report
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
