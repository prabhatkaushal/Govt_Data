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
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ChevronRight, ShieldCheck, Download, Link2, Copy, History, Terminal, UploadCloud, Gavel, Microscope, PlusCircle } from "lucide-react";

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const { isInvestigator, isLawyer, isForensic, user } = useAuth();
  
  // States for interactive modules
  const [legalNote, setLegalNote] = useState("");
  const [forensicTool, setForensicTool] = useState("");
  const [forensicHashMatch, setForensicHashMatch] = useState("");
  const [forensicFindings, setForensicFindings] = useState("");
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Local state for dynamic chain of custody (simulating DB updates)
  const [timeline, setTimeline] = useState([
    {
      id: 1,
      type: 'upload',
      title: 'v1.0 - Initial Upload',
      timestamp: 'Oct 12, 2023, 14:30 EST',
      actor: 'Special Agent Smith',
      color: 'blue'
    },
    {
      id: 2,
      type: 'verify',
      title: 'Cryptographic Hash Verified',
      timestamp: 'Oct 12, 2023, 15:05 EST',
      actor: 'System Automated Scan',
      color: 'emerald'
    }
  ]);

  const handleLegalReview = async () => {
    if (!legalNote.trim()) return;
    setIsSubmitting(true);
    // Simulate API verification call
    await new Promise(res => setTimeout(res, 800));
    
    setTimeline(prev => [...prev, {
      id: Date.now(),
      type: 'legal',
      title: 'Legal Review & Verification Appended',
      timestamp: new Date().toLocaleString('en-US', { hour12: false }),
      actor: user?.full_name || user?.username || 'Legal Officer',
      color: 'amber'
    }]);
    setLegalNote("");
    setIsSubmitting(false);
  };

  const handleForensicSubmit = async () => {
    if (!forensicTool.trim() || !forensicFindings.trim()) return;
    setIsSubmitting(true);
    // Simulate API call for forensic append
    await new Promise(res => setTimeout(res, 800));
    
    setTimeline(prev => [...prev, {
      id: Date.now(),
      type: 'forensic',
      title: `Forensic Analysis Added (${forensicTool})`,
      timestamp: new Date().toLocaleString('en-US', { hour12: false }),
      actor: user?.full_name || user?.username || 'Forensic Expert',
      color: 'purple'
    }]);
    setForensicTool("");
    setForensicHashMatch("");
    setForensicFindings("");
    setIsSubmitting(false);
  };

  const handleRevisionUpload = async () => {
    if (!replacementFile) return;
    setIsSubmitting(true);
    // Simulate API call for new file version upload
    await new Promise(res => setTimeout(res, 1200));
    
    setTimeline(prev => [...prev, {
      id: Date.now(),
      type: 'upload',
      title: `v1.1 - Document Revision Appended`,
      timestamp: new Date().toLocaleString('en-US', { hour12: false }),
      actor: user?.full_name || user?.username || 'Investigating Officer',
      color: 'blue'
    }]);
    setReplacementFile(null);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
        <Link href="/documents" className="hover:text-blue-400 transition-colors">VAULT</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-200">{params.id}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-slate-900/40 p-6 rounded-xl border border-slate-800/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Network Audit Log - Server 4</h1>
            <span className="badge-emerald px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </span>
          </div>
          <p className="text-slate-400 text-sm flex items-center gap-2">
            Case Reference: <Link href="/cases/CASE-0092" className="text-blue-400 hover:underline font-mono bg-blue-950/30 px-2 rounded">CASE-0092</Link> 
            <span className="text-slate-600">•</span> Uploaded on Oct 12, 2023
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Global Action */}
          <button className="bg-slate-800/50 hover:bg-slate-700/50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-slate-700 flex items-center gap-2">
            <Download className="w-4 h-4" /> Download Raw File
          </button>
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
        {/* Left Column - Log Viewer & Role Modules */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-[500px] border-t-slate-700">
            <div className="px-4 py-3 border-b border-slate-800/80 bg-[#0B0F17]/80 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-500" /> Preview: {params.id}.log
              </span>
              <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">12.4 MB</span>
            </div>
            <div className="p-4 bg-[#090C12] flex-1 overflow-auto text-slate-300 font-mono text-[13px] leading-loose">
              <span className="text-blue-400">[2023-10-12 04:12:33]</span> <span className="text-emerald-400">INFO:</span> Server boot sequence initiated.<br/>
              <span className="text-blue-400">[2023-10-12 04:12:35]</span> <span className="text-emerald-400">INFO:</span> Services loaded successfully.<br/>
              <span className="text-blue-400">[2023-10-12 04:15:01]</span> <span className="text-amber-400">WARN:</span> Unauthorized access attempt from IP 192.168.1.104.<br/>
              <span className="text-blue-400">[2023-10-12 04:15:01]</span> <span className="text-red-400">ERROR:</span> Auth module failed to validate credentials. Code 401.<br/>
              <span className="text-blue-400">[2023-10-12 04:15:05]</span> <span className="text-amber-400">WARN:</span> Multiple failed login attempts (5) detected for user 'admin'.<br/>
              <span className="text-blue-400">[2023-10-12 04:15:10]</span> <span className="text-red-500 font-bold">CRITICAL:</span> System lockdown engaged by security protocol Alpha.<br/>
              <span className="text-slate-600 animate-pulse">... (EOF)</span>
            </div>
          </div>

          {/* ROLE SPECIFIC MODULES */}
          {isInvestigator && (
            <div className="glass-panel border-t-blue-500/50 rounded-xl p-6 animate-fade-in-up">
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-400" /> Version Control (Investigator)
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Documents are immutable. However, you can append a newer version of this evidence. The old hash will remain verifiable in the ledger.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1 w-full relative">
                  <input 
                    type="file" 
                    id="replace-doc" 
                    className="sr-only" 
                    onChange={(e) => setReplacementFile(e.target.files?.[0] || null)}
                  />
                  <label 
                    htmlFor="replace-doc" 
                    className={`w-full bg-slate-950/60 border border-slate-800 border-dashed rounded-lg px-4 py-3 text-sm text-slate-500 flex items-center justify-center hover:bg-slate-900/60 transition-colors cursor-pointer ${replacementFile ? 'border-blue-500 text-blue-400' : ''}`}
                  >
                    {replacementFile ? replacementFile.name : "Click or drag to select replacement file..."}
                  </label>
                </div>
                <button 
                  onClick={handleRevisionUpload}
                  disabled={!replacementFile || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] shrink-0 w-full sm:w-auto"
                >
                  {isSubmitting ? "Uploading..." : "Upload Revision"}
                </button>
              </div>
            </div>
          )}

          {isLawyer && (
            <div className="glass-panel border-t-amber-500/50 rounded-xl p-6 animate-fade-in-up">
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest flex items-center gap-2">
                <Gavel className="w-4 h-4 text-amber-400" /> Legal Review (Lawyer)
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Add legal annotations and digitally verify the authenticity of this document for court admission.
              </p>
              <textarea 
                rows={3}
                value={legalNote}
                onChange={(e) => setLegalNote(e.target.value)}
                placeholder="Enter legal remarks, citations, or verification notes..."
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all mb-4 resize-none"
              ></textarea>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={handleLegalReview}
                  disabled={!legalNote.trim() || isSubmitting}
                  className="bg-amber-600 hover:bg-amber-500 disabled:bg-amber-600/50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> {isSubmitting ? "Verifying..." : "Add Note & Verify"}
                </button>
              </div>
            </div>
          )}

          {isForensic && (
            <div className="glass-panel border-t-purple-500/50 rounded-xl p-6 animate-fade-in-up">
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest flex items-center gap-2">
                <Microscope className="w-4 h-4 text-purple-400" /> Forensic Analysis (Forensics)
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Append forensic metadata, tool outputs (e.g., Autopsy, EnCase), and analysis summaries.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input 
                  type="text" 
                  value={forensicTool}
                  onChange={(e) => setForensicTool(e.target.value)}
                  placeholder="Forensic Tool Used..." 
                  className="bg-slate-950/60 border border-slate-700/80 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all" 
                />
                <input 
                  type="text" 
                  value={forensicHashMatch}
                  onChange={(e) => setForensicHashMatch(e.target.value)}
                  placeholder="MD5 / Secondary Hash Match..." 
                  className="bg-slate-950/60 border border-slate-700/80 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all" 
                />
              </div>
              <textarea 
                rows={2}
                value={forensicFindings}
                onChange={(e) => setForensicFindings(e.target.value)}
                placeholder="Detailed findings..."
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all mb-4 resize-none"
              ></textarea>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={handleForensicSubmit}
                  disabled={(!forensicTool.trim() || !forensicFindings.trim()) || isSubmitting}
                  className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> {isSubmitting ? "Appending..." : "Append Forensic Log"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Crypto Details */}
        <div className="space-y-6">
          <div className="glass-panel border-t-emerald-500/50 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Link2 className="w-24 h-24 text-emerald-500" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
            
            <h3 className="text-xs font-bold text-slate-300 mb-6 uppercase tracking-widest relative z-10 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Integrity Verification
            </h3>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-950/50 border border-emerald-900/50 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-400">Cryptographic Signature Valid</p>
                  <p className="text-xs text-slate-400 mt-1">Signed by Special Agent Smith using RSA-2048 keypair.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-950/50 border border-blue-900/50 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <Link2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-400">Blockchain Anchored</p>
                  <p className="text-xs text-slate-400 mt-1">Confirmed in Block <span className="font-mono bg-slate-900 px-1 rounded text-slate-300 border border-slate-700">#1499201</span> on the Secure-Ops ledger.</p>
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
            <div className="mt-8 pt-5 border-t border-slate-800/80 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SHA-256 Checksum Hash</p>
                <button className="text-slate-500 hover:text-blue-400 transition-colors p-1" title="Copy to clipboard">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="bg-[#090C12] p-3 rounded-lg text-xs font-mono text-emerald-400/80 break-all border border-emerald-900/30 shadow-inner leading-relaxed selection:bg-emerald-500/30">
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <h3 className="text-xs font-bold text-slate-300 mb-6 uppercase tracking-widest flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" /> Chain of Custody
            </h3>
            <div className="relative pl-5 border-l-2 border-slate-800/80 space-y-6">
              {timeline.map((event, idx) => (
                <div key={event.id} className="relative animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-[#0B0F17] ${
                    event.color === 'blue' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' :
                    event.color === 'emerald' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' :
                    event.color === 'amber' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]' :
                    'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                  }`}></div>
                  <p className="text-sm font-medium text-slate-200">{event.title}</p>
                  <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">{event.timestamp}</p>
                  <p className="text-xs text-slate-400 mt-2 bg-slate-900/50 p-2 rounded-md border border-slate-800/50 inline-block">By {event.actor}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
