'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Users, Shield, Building2, Sliders, AlertCircle } from 'lucide-react';

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

export default function AdminPage() {
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
              <Settings className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">ADMINISTRATION</h1>
              <p className="text-sm text-content-secondary tracking-[0.2em] uppercase mt-1">
                Platform Configuration
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-status-critical/10 border border-status-critical/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-status-critical" />
            <span className="text-xs font-mono text-status-critical">REQUIRES BACKEND ADMIN API</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex border-b border-border mb-8">
          <button className="flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 border-accent text-accent">
            <Users className="w-4 h-4" /> Users
          </button>
          <button className="flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 border-transparent text-content-secondary hover:text-content-primary transition-colors" disabled>
            <Shield className="w-4 h-4" /> Roles & Permissions
          </button>
          <button className="flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 border-transparent text-content-secondary hover:text-content-primary transition-colors" disabled>
            <Building2 className="w-4 h-4" /> Departments
          </button>
          <button className="flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 border-transparent text-content-secondary hover:text-content-primary transition-colors" disabled>
            <Sliders className="w-4 h-4" /> Settings
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center bg-elevated">
            <h2 className="text-sm font-medium">User Management Placeholder</h2>
            <button className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
              Add User
            </button>
          </div>
          
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Users className="w-12 h-12 text-content-muted mb-4 opacity-50" />
            <h3 className="text-lg font-bold mb-2">User Table Pending</h3>
            <p className="text-sm text-content-secondary max-w-md">
              This area will contain a fully functional data table for user management, role assignment, and access control once the backend admin API is integrated.
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-surface border border-border rounded-lg overflow-hidden mt-6">
          <div className="p-6 border-b border-border bg-elevated">
            <h2 className="text-sm font-medium">Permission Matrix Placeholder</h2>
          </div>
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Shield className="w-12 h-12 text-content-muted mb-4 opacity-50" />
            <p className="text-sm text-content-secondary max-w-md">
              Matrix view for role-based access control (RBAC) requires backend definitions.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
