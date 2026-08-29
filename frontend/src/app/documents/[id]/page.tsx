"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldCheck, Download, Share2, FileText, 
  Clock, Lock, Hexagon, PenTool, ChevronRight 
} from "lucide-react";

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Breadcrumbs */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm text-content-muted mb-2">
        <Link href="/documents" className="hover:text-content-primary transition-colors">Documents</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-content-primary">{params.id}</span>
      </motion.div>

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-content-primary tracking-tight">
            Network Audit Log - Server 4
          </h1>
          <p className="text-content-muted mt-2 text-sm">
            Case Reference: <Link href="/cases/CASE-0092" className="text-accent hover:text-accent-hover transition-colors">CASE-0092</Link> • Uploaded on Oct 12, 2023
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE (2/3 width) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col h-[600px]">
            {/* Toolbar */}
            <div className="px-4 py-3 border-b border-border bg-elevated flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-content-muted" />
                <span className="text-sm font-medium text-content-primary">{params.id}.log</span>
                <span className="text-xs text-content-muted ml-2">12.4 MB</span>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-bold text-content-secondary hover:text-content-primary tracking-[0.2em] uppercase transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            {/* Document Preview */}
            <div className="p-4 bg-background flex-1 overflow-auto text-content-secondary font-mono text-sm leading-relaxed">
              [2023-10-12 04:12:33] INFO: Server boot sequence initiated.<br/>
              [2023-10-12 04:12:35] INFO: Services loaded successfully.<br/>
              [2023-10-12 04:15:01] WARN: Unauthorized access attempt from IP 192.168.1.104.<br/>
              [2023-10-12 04:15:01] ERROR: Auth module failed to validate credentials. Code 401.<br/>
              [2023-10-12 04:15:05] WARN: Multiple failed login attempts (5) detected for user 'admin'.<br/>
              [2023-10-12 04:15:10] CRITICAL: System lockdown engaged by security protocol Alpha.<br/>
              ... (EOF)
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE (1/3 width) */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* DOCUMENT INTELLIGENCE PANEL */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase mb-6">
              Document Intelligence
            </h2>

            <div className="space-y-6">
              {/* 1. VERIFICATION STATUS */}
              <div>
                <h3 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase mb-3">
                  Integrity Status
                </h3>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-status-verification/10 flex items-center justify-center text-status-verification border border-status-verification/20">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-status-verification tracking-[0.2em] uppercase">
                    Verified
                  </span>
                </div>
              </div>

              {/* 2. CRYPTOGRAPHIC HASH */}
              <div>
                <h3 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase mb-3">
                  SHA-256
                </h3>
                <div className="bg-background p-3 rounded text-xs font-mono text-content-secondary break-all border border-border">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </div>
              </div>

              {/* 3. DIGITAL SIGNATURE */}
              <div>
                <h3 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase mb-3">
                  Digital Signature
                </h3>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-content-primary">
                    <PenTool className="w-4 h-4 text-content-secondary" />
                    <span>Signature Valid</span>
                  </div>
                  <p className="text-xs text-content-muted ml-6">Signed by SA Smith</p>
                </div>
              </div>

              {/* 5. ACCESS & CLASSIFICATION */}
              <div>
                <h3 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase mb-3">
                  Access & Classification
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-status-warning" />
                    <span className="text-sm text-status-warning font-medium tracking-[0.2em] uppercase">
                      Confidential
                    </span>
                  </div>
                  <div className="text-xs text-content-muted ml-6">
                    Owner: Special Agent Smith
                  </div>
                </div>
              </div>

              {/* 4. VERSION HISTORY */}
              <div>
                <h3 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase mb-3">
                  Version History
                </h3>
                <div className="relative pl-4 border-l border-border space-y-4 ml-2">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-surface"></div>
                    <p className="text-sm font-medium text-content-primary">v1.0 Initial Upload</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-content-muted" />
                      <p className="text-xs text-content-muted">Oct 12, 2023, 14:30 EST</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="mt-8 pt-4 border-t border-border">
              <p className="text-[10px] text-content-muted italic">
                Verification data is placeholder — actual verification requires backend integration
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-3">
            <button className="bg-surface border border-border hover:border-border-hover hover:bg-elevated text-content-primary py-3 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex flex-col items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button className="bg-surface border border-border hover:border-border-hover hover:bg-elevated text-content-primary py-3 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex flex-col items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Verify
            </button>
            <button className="bg-surface border border-border hover:border-border-hover hover:bg-elevated text-content-primary py-3 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex flex-col items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
