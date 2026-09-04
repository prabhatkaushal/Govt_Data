"use client";

import { Settings, Shield, Bell, User, Key, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto animate-fade-in-up">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-content-primary tracking-wide uppercase flex items-center gap-3">
          <Settings className="w-5 h-5 text-accent" /> System Settings
        </h1>
        <p className="text-content-muted mt-2 text-xs font-mono tracking-widest uppercase">Platform Configuration & Preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 space-y-2">
          {['Profile', 'Security', 'Notifications', 'System Preferences', 'Data Archival'].map((tab, i) => (
             <button key={tab} className={`w-full text-left px-4 py-3 rounded text-xs font-bold uppercase tracking-widest transition-colors ${i === 0 ? 'bg-accent/10 text-accent border border-accent/20' : 'text-content-secondary hover:text-content-primary hover:bg-surface'}`}>
               {tab}
             </button>
          ))}
        </div>

        <div className="col-span-3 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6 shadow-premium space-y-6">
            <h3 className="text-sm font-bold text-content-primary uppercase tracking-[0.1em] border-b border-border pb-4">Personal Information</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-content-muted uppercase tracking-widest">Full Name</label>
                <input type="text" disabled value="Investigating Officer" className="w-full bg-background border border-border rounded px-4 py-2 text-sm text-content-primary opacity-70 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-content-muted uppercase tracking-widest">Officer ID / Username</label>
                <input type="text" disabled value="26010001" className="w-full bg-background border border-border rounded px-4 py-2 text-sm text-content-primary opacity-70 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-content-muted uppercase tracking-widest">Clearance Level</label>
                <input type="text" disabled value="Level 4 - TOP SECRET" className="w-full bg-background border border-border rounded px-4 py-2 text-sm text-content-primary opacity-70 cursor-not-allowed" />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
               <button className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors shadow-premium opacity-50 cursor-not-allowed">
                 Save Changes
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
