'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, AlertCircle, FileKey, Activity, Link2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { ease: [0.22, 1, 0.36, 1] } },
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background text-content-primary p-6">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-elevated rounded-lg border border-border">
            <ShieldCheck className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">SECURITY CENTER</h1>
            <p className="text-sm text-content-secondary tracking-[0.2em] uppercase mt-1">
              System Integrity & Monitoring
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div variants={itemVariants} className="bg-surface border border-border rounded-lg p-6">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-content-muted mb-6">
              System Security Status
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-elevated rounded border border-border">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-status-verification" />
                  <span className="text-sm font-medium">Authentication</span>
                </div>
                <span className="text-xs font-mono text-status-verification">OPERATIONAL</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-elevated rounded border border-border">
                <div className="flex items-center gap-3">
                  <FileKey className="w-5 h-5 text-status-verification" />
                  <span className="text-sm font-medium">Encryption (At Rest)</span>
                </div>
                <span className="text-xs font-mono text-status-verification">OPERATIONAL</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-elevated rounded border border-border">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-status-warning" />
                  <span className="text-sm font-medium">Audit Logging</span>
                </div>
                <span className="text-xs font-mono text-status-warning">PENDING INTEGRATION</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-elevated rounded border border-border">
                <div className="flex items-center gap-3">
                  <Link2 className="w-5 h-5 text-status-blockchain" />
                  <span className="text-sm font-medium">Blockchain Verification</span>
                </div>
                <span className="text-xs font-mono text-status-warning">PENDING INTEGRATION</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-surface border border-border rounded-lg p-6 flex flex-col">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-content-muted mb-6">
              Document Integrity Verification
            </h3>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="bg-elevated border border-border rounded-lg p-6 text-center">
                <ShieldCheck className="w-10 h-10 text-content-muted mx-auto mb-4" />
                <p className="text-sm text-content-secondary mb-6">
                  Verify the cryptographic hash of any document or evidence record against the ledger.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Document ID or Hash..."
                    className="flex-1 bg-surface border border-border rounded-lg px-4 py-2 text-sm outline-none font-mono placeholder:font-sans"
                    disabled
                  />
                  <button className="bg-accent/10 text-accent border border-accent/20 px-6 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent/20" disabled>
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-content-muted mb-6">
            Recent Security Events
          </h3>
          <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-border rounded-lg">
            <AlertCircle className="w-8 h-8 text-content-muted mb-3" />
            <p className="text-sm text-content-secondary">
              Security events feed requires backend integration.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
