"use client";

import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function ReportsPage() {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto animate-fade-in-up">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-content-primary tracking-wide uppercase flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-accent" /> Intelligence Reports
        </h1>
        <p className="text-content-muted mt-2 text-xs font-mono tracking-widest uppercase">System-wide Analytics & Trend Tracking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface border border-border rounded-xl p-6 shadow-premium flex flex-col justify-between h-64 opacity-80 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <TrendingUp className="w-8 h-8 text-status-warning/20" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-content-muted uppercase tracking-[0.2em] mb-2">Case Velocity</h3>
            <p className="text-4xl font-display text-content-primary">12.4</p>
            <p className="text-[10px] text-content-muted mt-2 uppercase tracking-widest">Avg days to resolution</p>
          </div>
          <div className="h-16 w-full bg-accent/5 rounded flex items-end justify-between px-2 pb-2">
             <div className="w-2 bg-accent/20 h-4 rounded-t"></div>
             <div className="w-2 bg-accent/40 h-8 rounded-t"></div>
             <div className="w-2 bg-accent/60 h-6 rounded-t"></div>
             <div className="w-2 bg-accent/80 h-12 rounded-t"></div>
             <div className="w-2 bg-accent h-10 rounded-t"></div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 shadow-premium flex flex-col justify-between h-64 opacity-80 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <AlertTriangle className="w-8 h-8 text-status-danger/20" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-content-muted uppercase tracking-[0.2em] mb-2">Security Anomalies</h3>
            <p className="text-4xl font-display text-content-primary">3</p>
            <p className="text-[10px] text-status-danger mt-2 uppercase tracking-widest">+2 this month</p>
          </div>
          <p className="text-xs text-content-secondary leading-relaxed">
            Minor integrity check failures reported during document upload processes across 2 external access nodes.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 shadow-premium flex items-center justify-center h-64 text-center">
           <div>
              <p className="text-sm font-bold text-content-muted uppercase tracking-widest mb-4">Export Full Data</p>
              <button className="bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 px-6 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors">
                Generate PDF
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
