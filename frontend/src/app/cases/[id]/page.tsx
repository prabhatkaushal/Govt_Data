"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Upload, ShieldCheck, Share2, PenTool, MoreHorizontal,
  FileText, TestTube, Clock, Users, Sparkles, ListOrdered
} from "lucide-react";

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    { name: "Overview", icon: ShieldCheck },
    { name: "Documents", icon: FileText },
    { name: "Evidence", icon: TestTube },
    { name: "Timeline", icon: Clock },
    { name: "People", icon: Users },
    { name: "AI Insights", icon: Sparkles },
    { name: "Audit", icon: ListOrdered }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { ease: [0.22, 1, 0.36, 1], duration: 0.4 } }
  };

  return (
    <motion.div 
      className="space-y-10 max-w-[1600px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3 text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase mb-[-1rem]">
        <Link href="/dashboard" className="hover:text-content-primary transition-colors">Command</Link>
        <span>/</span>
        <Link href="/cases" className="hover:text-content-primary transition-colors">Cases</Link>
        <span>/</span>
        <span className="text-content-primary">CASE-{params.id}</span>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-6 border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-content-primary tracking-tight uppercase">CASE-{params.id}</h1>
            <span className="bg-status-critical/10 text-status-critical px-2.5 py-1 rounded-[2px] text-[9px] font-bold border border-status-critical/20 tracking-widest uppercase">
              HIGH PRIORITY
            </span>
            <span className="bg-status-verification/10 text-status-verification px-2.5 py-1 rounded-[2px] text-[9px] font-bold border border-status-verification/20 tracking-widest uppercase">
              ACTIVE
            </span>
          </div>
          <p className="text-content-secondary mt-3 text-sm tracking-wide">Cyber Crime Investigation • Organized Fraud Syndicate</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button className="bg-surface hover:bg-elevated text-content-primary px-4 py-2 rounded text-[10px] font-bold transition-all border border-border flex items-center gap-2 uppercase tracking-widest">
            <Upload className="w-3.5 h-3.5" /> Upload Doc
          </button>
          <button className="bg-surface hover:bg-elevated text-content-primary px-4 py-2 rounded text-[10px] font-bold transition-all border border-border flex items-center gap-2 uppercase tracking-widest">
            <TestTube className="w-3.5 h-3.5" /> Add Evidence
          </button>
          <button className="bg-accent text-white hover:bg-accent-hover px-4 py-2 rounded text-[10px] font-bold transition-all flex items-center gap-2 uppercase tracking-widest shadow-premium hover:shadow-premium">
            <ShieldCheck className="w-3.5 h-3.5" /> Verify Integrity
          </button>
          <button className="bg-surface hover:bg-elevated text-content-primary px-3 py-2 rounded text-[10px] transition-all border border-border flex items-center">
            <MoreHorizontal className="w-4 h-4" />
import { ChevronRight, FileText, Activity, ShieldAlert, Users, Calendar, Download, Edit } from "lucide-react";

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Documents", "Evidence", "Timeline"];
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate generation delay
    await new Promise(res => setTimeout(res, 1500));
    setIsGenerating(false);
    setReportGenerated(true);
    setTimeout(() => setReportGenerated(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-4">
        <Link href="/cases" className="hover:text-blue-400 transition-colors">CASES</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-200">{params.id}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-slate-900/40 p-6 rounded-xl border border-slate-800/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white tracking-tight font-mono">{params.id}</h1>
            <span className="badge-red px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> TOP SECRET
            </span>
            <span className="badge-blue px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest">
              ACTIVE
            </span>
          </div>
          <p className="text-slate-300 text-lg font-medium">Operation Northern Light</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => alert("Inline Edit Mode Activated (Mock)")}
            className="bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" /> Edit Case
          </button>
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating || reportGenerated}
            className={`${reportGenerated ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'} text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed`}
          >
            {isGenerating ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Generating...</>
            ) : reportGenerated ? (
              <>Report Downloaded ✓</>
            ) : (
              <><Download className="w-4 h-4" /> Generate Report</>
            )}
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="border-b border-border overflow-x-auto scrollbar-none relative">
        <nav className="flex space-x-8 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative py-4 px-1 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors flex items-center gap-2 group ${
                activeTab === tab.name
                  ? "text-accent"
                  : "text-content-muted hover:text-content-secondary"
              }`}
            >
              <tab.icon className={`w-4 h-4 transition-transform duration-200 ${activeTab === tab.name ? 'scale-110' : 'group-hover:scale-110'}`} />
              {tab.name}
              {activeTab === tab.name && (
                <motion.div 
                  layoutId="active-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                  initial={false}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
      {/* Navigation Tabs */}
      <div className="border-b border-slate-800/80">
        <nav className="flex space-x-8 px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 relative ${
                activeTab === tab
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              )}
            </button>
          ))}
        </nav>
      </motion.div>

      <motion.div variants={itemVariants} className="py-4">
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
            <div className="xl:col-span-8 space-y-12">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase flex items-center gap-2 border-b border-border pb-2">
                  <ShieldCheck className="w-4 h-4 text-accent" /> Case Summary
                </h3>
                <p className="text-content-primary leading-relaxed text-sm tracking-wide bg-surface/30 p-6 rounded border border-border/50">
                  This investigation centers on a coordinated phishing and credential stuffing campaign targeting government infrastructure. The threat actors have attempted to exfiltrate restricted documents. Initial detection occurred on Oct 12, 2023. Currently gathering telemetry, isolating affected nodes, and interviewing witnesses.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase flex items-center gap-2 border-b border-border pb-2">
                  <Users className="w-4 h-4 text-accent" /> Assigned Personnel
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 bg-surface/30 rounded border border-border/50 group hover:border-border transition-colors cursor-pointer">
                    <div className="h-12 w-12 rounded bg-surface border border-border flex items-center justify-center text-content-secondary font-bold text-sm group-hover:border-accent transition-colors">2601</div>
                    <div>
                      <p className="text-content-primary text-sm font-bold tracking-wide">Officer 26010001</p>
                      <p className="text-[10px] text-content-muted font-mono tracking-widest mt-1">LEAD INVESTIGATOR</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-surface/30 rounded border border-border/50 group hover:border-border transition-colors cursor-pointer">
                    <div className="h-12 w-12 rounded bg-surface border border-border flex items-center justify-center text-content-secondary font-bold text-sm group-hover:border-accent transition-colors">2602</div>
                    <div>
                      <p className="text-content-primary text-sm font-bold tracking-wide">Officer 26020002</p>
                      <p className="text-[10px] text-content-muted font-mono tracking-widest mt-1">LEGAL ADVISOR</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="xl:col-span-4 space-y-12">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase border-b border-border pb-2">Metadata</h3>
                <dl className="space-y-4">
                  <div className="flex justify-between items-end border-b border-border/30 pb-3">
                    <dt className="text-content-muted font-bold text-[10px] uppercase tracking-widest">Opened Date</dt>
                    <dd className="text-content-primary font-mono text-sm">2026-08-12</dd>
                  </div>
                  <div className="flex justify-between items-end border-b border-border/30 pb-3">
                    <dt className="text-content-muted font-bold text-[10px] uppercase tracking-widest">Department</dt>
                    <dd className="text-content-primary text-sm tracking-wide">Cyber Forensics</dd>
                  </div>
                  <div className="flex justify-between items-end border-b border-border/30 pb-3">
                    <dt className="text-content-muted font-bold text-[10px] uppercase tracking-widest">Reference IDs</dt>
                    <dd className="text-accent font-mono text-sm">CYB-2026-A91B</dd>
                  </div>
                  <div className="flex justify-between items-end pb-3">
                    <dt className="text-content-muted font-bold text-[10px] uppercase tracking-widest">Clearance Req</dt>
                    <dd className="text-status-critical font-bold text-[10px] tracking-widest bg-status-critical/10 px-2 py-1 rounded">LEVEL 3</dd>
      {/* Tab Content */}
      <div className="py-2 animate-fade-in-up">
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" /> Case Summary
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Operation Northern Light focuses on the investigation of unauthorized access attempts originating from advanced persistent threat (APT) actors targeting critical infrastructure sub-networks. Initial detection occurred on Oct 12, 2023. Currently gathering telemetry and isolating affected nodes.
                </p>
              </div>
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" /> Assigned Personnel
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">SA</div>
                      <div>
                        <p className="text-slate-200 font-medium text-sm">Special Agent Smith</p>
                        <p className="text-[10px] text-slate-500 font-mono tracking-wider">LEAD INVESTIGATOR</p>
                      </div>
                    </div>
                    <span className="badge-emerald px-2 py-0.5 rounded text-[10px]">ACTIVE</span>
                  </li>
                  <li className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm">JD</div>
                      <div>
                        <p className="text-slate-200 font-medium text-sm">Jane Doe</p>
                        <p className="text-[10px] text-slate-500 font-mono tracking-wider">CYBER ANALYST</p>
                      </div>
                    </div>
                    <span className="badge-emerald px-2 py-0.5 rounded text-[10px]">ACTIVE</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Metadata</h3>
                <dl className="space-y-5 text-sm">
                  <div className="border-b border-slate-800/50 pb-3">
                    <dt className="text-slate-500 font-medium text-xs uppercase tracking-wider flex items-center gap-2 mb-1">
                      <Calendar className="w-3.5 h-3.5" /> Opened Date
                    </dt>
                    <dd className="text-slate-200 font-mono">October 12, 2023</dd>
                  </div>
                  <div className="border-b border-slate-800/50 pb-3">
                    <dt className="text-slate-500 font-medium text-xs uppercase tracking-wider flex items-center gap-2 mb-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> Primary Agency
                    </dt>
                    <dd className="text-slate-200 font-mono">CISA</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 font-medium text-xs uppercase tracking-wider mb-1">
                      Reference IDs
                    </dt>
                    <dd className="mt-1">
                      <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800 font-mono text-[11px] text-blue-400">REF-2023-A91B</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Documents" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 border border-dashed border-border rounded bg-surface/10"
          >
            <FileText className="w-10 h-10 text-content-muted mb-6 opacity-50" />
            <h3 className="text-sm font-bold text-content-secondary tracking-wide uppercase">No documents linked</h3>
            <Link href="/documents/upload" className="mt-6 text-accent hover:text-accent-hover text-[10px] font-bold uppercase tracking-widest border-b border-accent/30 hover:border-accent pb-1 transition-all">
              Upload Document →
          <div className="glass-panel rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
               <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-white">No documents uploaded yet</h3>
            <p className="text-slate-400 text-sm mt-2 mb-6 max-w-sm">Securely upload and hash documents to this case to maintain chain of custody.</p>
            <Link href="/documents/upload" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              Upload Document
            </Link>
          </motion.div>
        )}
        
        {["Evidence", "Timeline", "People", "AI Insights", "Audit"].includes(activeTab) && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-col items-center justify-center py-32 border border-dashed border-border rounded bg-surface/10"
           >
             {activeTab === "Evidence" && <TestTube className="w-10 h-10 text-content-muted mb-6 opacity-50" />}
             {activeTab === "Timeline" && <Clock className="w-10 h-10 text-content-muted mb-6 opacity-50" />}
             {activeTab === "People" && <Users className="w-10 h-10 text-content-muted mb-6 opacity-50" />}
             {activeTab === "AI Insights" && <Sparkles className="w-10 h-10 text-status-ai mb-6 opacity-50" />}
             {activeTab === "Audit" && <ListOrdered className="w-10 h-10 text-content-muted mb-6 opacity-50" />}
             <h3 className="text-sm font-bold text-content-secondary tracking-wide uppercase">{activeTab} MODULE LOADED</h3>
             <p className="text-[10px] text-content-muted tracking-widest uppercase mt-4">NO RECORDS FOUND IN VAULT</p>
           </motion.div>
        {activeTab === "Evidence" && (
           <div className="glass-panel rounded-xl p-12 text-center text-slate-500 flex flex-col items-center justify-center font-mono text-sm border-dashed">
             <Activity className="w-8 h-8 text-slate-600 mb-4 animate-pulse" />
             [EVIDENCE_MODULE_TRACKING_LOADED]<br/>
             NO_ITEMS_FOUND_IN_REGISTRY
           </div>
        )}

        {activeTab === "Timeline" && (
           <div className="glass-panel rounded-xl p-12 text-center text-slate-500 flex flex-col items-center justify-center font-mono text-sm border-dashed">
             <Activity className="w-8 h-8 text-slate-600 mb-4 animate-pulse" />
             [TIMELINE_MODULE_INITIALIZED]<br/>
             AWAITING_EVENTS
           </div>
        )}
      </motion.div>
    </motion.div>
  );
}
