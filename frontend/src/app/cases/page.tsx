"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Search, Filter, Plus, ChevronRight, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

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
