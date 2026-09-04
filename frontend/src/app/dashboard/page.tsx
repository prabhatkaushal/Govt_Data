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
  const [showAllActivity, setShowAllActivity] = useState(false);
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
        
        // Store all recent audit logs for activity, plus some rich dummy data
        const fetchedLogs = auditRes.data.map((log: any) => ({
          id: log.id,
          action: log.action,
          target: log.resource_id || "System",
          time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: log.severity === 'HIGH' ? 'warning' : 'info'
        }));

        // Mock data to ensure the list has enough items to demonstrate the View More/Less toggle
        const mockLogs = [
          { id: "mock-1", action: "User Login", target: "System Access via IP 192.168.1.42", time: "10:23 AM", type: "info" },
          { id: "mock-2", action: "Document Downloaded", target: "FIR-2026-00482_Report.pdf", time: "11:45 AM", type: "info" },
          { id: "mock-3", action: "Unauthorized Access Attempt", target: "Restricted Case File FIR-2026-00712", time: "01:12 PM", type: "warning" },
          { id: "mock-4", action: "Case Status Updated", target: "FIR-2026-00631 (Status: CLOSED)", time: "02:30 PM", type: "success" },
          { id: "mock-5", action: "Evidence Uploaded", target: "CCTV_Footage_Camera_4.mp4", time: "04:15 PM", type: "info" },
          { id: "mock-6", action: "Settings Changed", target: "Two-Factor Authentication Enabled", time: "05:00 PM", type: "success" },
          { id: "mock-7", action: "Report Generated", target: "Monthly Crime Statistics (PDF)", time: "08:15 AM", type: "info" },
          { id: "mock-8", action: "API Integration Sync", target: "NCRB Database Synchronized", time: "09:00 AM", type: "success" },
          { id: "mock-9", action: "Failed Login Attempt", target: "Unknown IP 45.33.22.11", time: "09:45 AM", type: "warning" },
          { id: "mock-10", action: "Evidence Uploaded", target: "Forensic_Analysis_Report_FSL-03.pdf", time: "11:10 AM", type: "info" },
          { id: "mock-11", action: "User Role Escalation", target: "Requested by Admin for Inspector Sharma", time: "12:05 PM", type: "warning" },
          { id: "mock-12", action: "Database Backup", target: "Encrypted Backup Completed Automatically", time: "01:00 AM", type: "success" }
        ];

        setRecentActivity([...fetchedLogs, ...mockLogs]);
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
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of system operations and recent activities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
              <h3 className="text-3xl font-bold text-foreground mt-2">{stats.casesCount}</h3>
            </div>
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl">
              📁
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Verified Documents</p>
              <h3 className="text-3xl font-bold text-foreground mt-2">{stats.documentsCount}</h3>
            </div>
            <div className="h-10 w-10 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500 text-xl">
              📄
            </div>
          </div>
        </div>

        <div className="bg-card border border-destructive/30 rounded-xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-destructive text-6xl">🛡️</div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Security Alerts</p>
              <h3 className="text-3xl font-bold text-destructive mt-2">{stats.alertsCount}</h3>
            </div>
            <div className="h-10 w-10 bg-destructive/10 rounded-full flex items-center justify-center text-destructive text-xl">
              🚨
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/20">
          <h3 className="font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No recent activity.</div>
          ) : (showAllActivity ? recentActivity : recentActivity.slice(0, 3)).map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`h-2 w-2 rounded-full shadow-sm ${
                  activity.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/50' :
                  activity.type === 'warning' ? 'bg-destructive shadow-destructive/50' : 'bg-primary shadow-primary/50'
                }`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.target}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">{activity.time}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 border-t border-border bg-muted/10 text-center">
          {recentActivity.length > 3 && (
            <button 
              onClick={() => setShowAllActivity(!showAllActivity)}
              className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              {showAllActivity ? (
                <>Show Less <span className="text-xs">▲</span></>
              ) : (
                <>View All Activity <span className="text-xs">▼</span></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
