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
        )}
      </motion.div>
    </motion.div>
  );
}
