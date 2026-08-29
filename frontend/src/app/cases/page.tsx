"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Search, Filter, Plus, ChevronRight, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { Search, Filter, Plus, ArrowRight, Shield, FolderLock } from "lucide-react";

interface Case {
  id: string;
  case_number: string;
  title: string;
  status: string;
  confidentiality_level: string;
  created_at: string;
  updated_at?: string;
  lead_investigator?: any;
}

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get('/cases/');
        setCases(res.data);
      } catch (err) {
        console.error("Failed to fetch cases", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

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
      className="space-y-8 max-w-[1600px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-content-primary tracking-wide uppercase flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-accent" /> Active Cases
          </h1>
          <p className="text-content-muted mt-2 text-xs font-mono tracking-widest uppercase">Manage and monitor ongoing investigations</p>
        </div>
        <button className="bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 px-5 py-2.5 rounded text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2">
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Active Cases
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Manage and monitor active investigations and operations.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Case
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px] group">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-content-muted group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search cases by ID or title..." 
              className="w-full bg-surface border border-border rounded pl-9 pr-4 py-2 text-sm text-content-primary focus:outline-none focus:border-accent/50 focus:bg-elevated transition-colors"
      <div className="glass-panel rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search cases by ID or title..." 
              className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-2.5 text-content-muted pointer-events-none" />
              <select className="bg-surface border border-border rounded pl-9 pr-8 py-2 text-xs font-bold tracking-widest uppercase text-content-secondary focus:outline-none focus:border-accent/50 appearance-none transition-colors">
                <option>Status: All</option>
                <option>Active</option>
                <option>Under Investigation</option>
                <option>Closed</option>
              </select>
            </div>
            <select className="bg-surface border border-border rounded px-4 py-2 text-xs font-bold tracking-widest uppercase text-content-secondary focus:outline-none focus:border-accent/50 appearance-none transition-colors">
              <option>Priority: All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
            </select>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-4">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              <p className="text-content-muted font-mono tracking-[0.2em] text-[10px] uppercase">Retrieving Records</p>
            </div>
          ) : cases.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded">
              <Briefcase className="w-8 h-8 text-content-muted mb-4 opacity-50" />
              <p className="text-content-secondary font-medium text-sm">No cases match the current filters.</p>
            </div>
          ) : (
            <div className="border border-border rounded bg-surface overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-elevated/50 text-[10px] font-bold uppercase tracking-[0.15em] text-content-muted">
                    <th className="px-6 py-4 font-normal">Case ID</th>
                    <th className="px-6 py-4 font-normal">Title</th>
                    <th className="px-6 py-4 font-normal">Status</th>
                    <th className="px-6 py-4 font-normal">Classification</th>
                    <th className="px-6 py-4 font-normal">Officer</th>
                    <th className="px-6 py-4 font-normal text-right">Action</th>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select className="bg-slate-950/50 border border-slate-700/50 rounded-lg pl-10 pr-8 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 appearance-none transition-all">
                <option>All Statuses</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-4">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-sm font-mono animate-pulse">FETCHING CASES...</span>
            </div>
          ) : cases.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No cases found matching criteria.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800/80 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                  <th className="px-6 py-4">Case ID</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Classification</th>
                  <th className="px-6 py-4">Date Opened</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {cases.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors group relative" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-400">
                      <Link href={`/cases/${c.id}`} className="hover:text-blue-300 hover:underline flex items-center gap-2">
                        <FolderLock className="w-4 h-4 text-slate-500" />
                        {c.case_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200 font-medium">{c.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                        c.status === 'UNDER_INVESTIGATION' ? 'badge-amber' : 
                        c.status === 'OPEN' ? 'badge-blue' : 
                        'bg-slate-800/50 text-slate-400 border-slate-700/50'
                      }`}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                        c.confidentiality_level === 'TOP_SECRET' ? 'badge-red' :
                        c.confidentiality_level === 'CONFIDENTIAL' ? 'badge-emerald' :
                        'bg-slate-800/50 text-slate-400 border-slate-700/50'
                      }`}>
                        {c.confidentiality_level === 'TOP_SECRET' && <Shield className="w-3 h-3" />}
                        {c.confidentiality_level.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/cases/${c.id}`} className="inline-flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100">
                        View <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {cases.map((c) => (
                    <tr key={c.id} className="group hover:bg-elevated transition-colors cursor-pointer relative">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold font-mono text-accent">
                        <Link href={`/cases/${c.id}`} className="absolute inset-0" />
                        {c.case_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-content-primary font-medium tracking-wide">
                        {c.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[9px] font-bold tracking-widest border ${
                          c.status === 'UNDER_INVESTIGATION' ? 'bg-status-warning/10 text-status-warning border-status-warning/20' : 
                          c.status === 'OPEN' || c.status === 'ACTIVE' ? 'bg-status-verification/10 text-status-verification border-status-verification/20' : 
                          'bg-surface text-content-muted border-border'
                        }`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center text-[10px] font-bold tracking-[0.2em] uppercase ${
                          c.confidentiality_level === 'TOP_SECRET' ? 'text-status-critical' :
                          c.confidentiality_level === 'CONFIDENTIAL' ? 'text-accent' :
                          'text-content-muted'
                        }`}>
                          {c.confidentiality_level.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-content-secondary tracking-wide">
                        {c.lead_investigator?.username || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-center p-1.5 rounded text-content-muted group-hover:text-accent group-hover:bg-accent/10 transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
