"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

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
        
        // Take top 5 recent audit logs for activity
        setRecentActivity(auditRes.data.slice(0, 5).map((log: any) => ({
          id: log.id,
          action: log.action,
          target: log.resource_id || "System",
          time: new Date(log.timestamp).toLocaleDateString(),
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
    return <div className="p-8 text-center text-slate-400">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of system operations and recent activities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Cases</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.casesCount}</h3>
            </div>
            <div className="h-10 w-10 bg-blue-900/50 rounded-full flex items-center justify-center text-blue-500 text-xl">
              📁
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Verified Documents</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.documentsCount}</h3>
            </div>
            <div className="h-10 w-10 bg-purple-900/50 rounded-full flex items-center justify-center text-purple-500 text-xl">
              📄
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-red-900/30 rounded-lg p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500 text-6xl">🛡️</div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Security Alerts</p>
              <h3 className="text-3xl font-bold text-red-400 mt-2">{stats.alertsCount}</h3>
            </div>
            <div className="h-10 w-10 bg-red-900/50 rounded-full flex items-center justify-center text-red-500 text-xl">
              🚨
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900">
          <h3 className="font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="divide-y divide-slate-800">
          {recentActivity.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No recent activity.</div>
          ) : recentActivity.map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`h-2 w-2 rounded-full ${
                  activity.type === 'success' ? 'bg-emerald-500' :
                  activity.type === 'warning' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-slate-200">{activity.action}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.target}</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">{activity.time}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/50 text-center">
          <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">View All Activity →</button>
        </div>
      </div>
    </div>
  );
}
