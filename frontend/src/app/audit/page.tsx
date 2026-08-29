'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ListOrdered, Filter, Search, Terminal, User, AlertCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { ease: [0.22, 1, 0.36, 1] as const } },
};

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-background text-content-primary p-6">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-elevated rounded-lg border border-border">
              <ListOrdered className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">SECURITY AUDIT TRAIL</h1>
              <p className="text-sm text-content-secondary tracking-[0.2em] uppercase mt-1">
                Immutable System Logs
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-status-warning/10 border border-status-warning/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-status-warning" />
            <span className="text-xs font-mono text-status-warning">AWAITING /API/AUDIT-LOGS/</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-4 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2">
            <Search className="w-4 h-4 text-content-muted" />
            <input
              type="text"
              placeholder="Search audit trail..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-content-muted"
              disabled
            />
          </div>
          <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm text-content-secondary" disabled>
            <User className="w-4 h-4" /> User
          </button>
          <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm text-content-secondary" disabled>
            <Filter className="w-4 h-4" /> Action
          </button>
          <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm text-content-secondary" disabled>
            <Terminal className="w-4 h-4" /> Resource
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-elevated text-[10px] font-bold tracking-[0.2em] uppercase text-content-muted">
            <div className="col-span-2">Timestamp</div>
            <div className="col-span-2">User / ID</div>
            <div className="col-span-2">Action</div>
            <div className="col-span-4">Resource Details</div>
            <div className="col-span-2">IP Address</div>
          </div>
          
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <Terminal className="w-10 h-10 text-content-muted mb-4 opacity-50" />
            <h3 className="text-base font-medium mb-1">Audit Logs Pending</h3>
            <p className="text-sm text-content-secondary max-w-md">
              The audit trail interface is prepared but requires the backend API to stream events. Real data will appear here once connected.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
