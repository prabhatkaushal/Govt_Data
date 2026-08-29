'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, BrainCircuit, Filter, FileText, Users, Box, Terminal } from 'lucide-react';

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

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background text-content-primary p-6">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-12 mt-12 text-center">
          <div className="p-4 bg-elevated rounded-xl border border-border mb-6">
            <Search className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">INTELLIGENCE CENTER</h1>
          <p className="text-sm text-content-secondary tracking-[0.2em] uppercase">
            Global Search & Analysis
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative flex items-center bg-surface border border-border hover:border-accent transition-colors rounded-xl p-2 shadow-lg">
            <div className="pl-4 pr-2">
              <Terminal className="w-5 h-5 text-accent" />
            </div>
            <input
              type="text"
              placeholder="Enter search query, case ID, or entity..."
              className="bg-transparent border-none outline-none text-lg w-full py-4 placeholder:text-content-muted font-mono"
              disabled
            />
            <div className="pr-4">
              <span className="text-xs text-content-muted font-mono bg-elevated px-2 py-1 rounded border border-border">
                CTRL+K
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-16">
          <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm hover:bg-elevated transition-colors" disabled>
            <Filter className="w-4 h-4 text-content-secondary" />
            Cases
          </button>
          <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm hover:bg-elevated transition-colors" disabled>
            <FileText className="w-4 h-4 text-content-secondary" />
            Documents
          </button>
          <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm hover:bg-elevated transition-colors" disabled>
            <Box className="w-4 h-4 text-content-secondary" />
            Evidence
          </button>
          <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm hover:bg-elevated transition-colors" disabled>
            <Users className="w-4 h-4 text-content-secondary" />
            People
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-surface border border-border rounded-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#8B5CF6]" />
          <div className="flex items-start gap-6">
            <div className="p-3 bg-elevated rounded-lg border border-border">
              <BrainCircuit className="w-6 h-6 text-status-ai" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                AI Assistant
                <span className="text-[10px] bg-[#8B5CF6]/10 text-[#8B5CF6] px-2 py-1 rounded tracking-[0.2em] uppercase">
                  Awaiting Integration
                </span>
              </h3>
              <p className="text-sm text-content-secondary leading-relaxed max-w-2xl">
                The semantic search and AI intelligence module requires backend AI integration. Once connected, this assistant will provide natural language querying, automated entity extraction, and cross-case pattern recognition.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
