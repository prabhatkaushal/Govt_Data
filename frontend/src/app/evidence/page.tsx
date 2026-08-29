'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TestTube, Search, Filter, Clock, ChevronDown, Lock, ShieldAlert } from 'lucide-react';

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

export default function EvidencePage() {
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
            <TestTube className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">EVIDENCE REGISTRY</h1>
            <p className="text-sm text-content-secondary tracking-[0.2em] uppercase mt-1">
              Secure Chain of Custody
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-4 mb-8">
          <div className="flex-1 flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2 focus-within:border-accent transition-colors">
            <Search className="w-4 h-4 text-content-muted" />
            <input
              type="text"
              placeholder="Search evidence by ID, case, or description..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-content-muted"
              disabled
            />
          </div>
          <button className="flex items-center gap-2 bg-surface border border-border hover:border-border-hover px-4 py-2 rounded-lg text-sm text-content-secondary transition-colors" disabled>
            <Filter className="w-4 h-4" />
            Case Filter
          </button>
          <button className="flex items-center gap-2 bg-surface border border-border hover:border-border-hover px-4 py-2 rounded-lg text-sm text-content-secondary transition-colors" disabled>
            <Filter className="w-4 h-4" />
            Status Filter
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-border rounded-lg p-12 flex flex-col items-center justify-center text-center">
              <ShieldAlert className="w-12 h-12 text-status-warning mb-4" />
              <h3 className="text-lg font-bold mb-2">Awaiting Backend Integration</h3>
              <p className="text-content-secondary text-sm max-w-md">
                The Evidence module requires backend integration. Once connected, this area will display a paginated registry of all digital and physical evidence items associated with active cases.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-content-muted mb-6">
                Chain of Custody Process
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-elevated rounded-full border border-border">
                    <Lock className="w-4 h-4 text-status-verification" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">COLLECTED</div>
                    <div className="text-xs text-content-muted">Initial intake & hash</div>
                  </div>
                </div>
                
                <div className="pl-4 border-l border-border ml-3 h-4 flex items-center">
                  <ChevronDown className="w-4 h-4 text-content-muted -ml-[13px] bg-surface" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2 bg-elevated rounded-full border border-border">
                    <Lock className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">TRANSFERRED</div>
                    <div className="text-xs text-content-muted">Secure handoff logged</div>
                  </div>
                </div>

                <div className="pl-4 border-l border-border ml-3 h-4 flex items-center">
                  <ChevronDown className="w-4 h-4 text-content-muted -ml-[13px] bg-surface" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2 bg-elevated rounded-full border border-border">
                    <Clock className="w-4 h-4 text-status-warning" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">FORENSIC</div>
                    <div className="text-xs text-content-muted">Analysis in progress</div>
                  </div>
                </div>

                <div className="pl-4 border-l border-border ml-3 h-4 flex items-center">
                  <ChevronDown className="w-4 h-4 text-content-muted -ml-[13px] bg-surface" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2 bg-elevated rounded-full border border-border">
                    <Lock className="w-4 h-4 text-status-verification" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">COURT</div>
                    <div className="text-xs text-content-muted">Admissible record</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
