"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Search, Filter, Plus, ArrowRight, Shield, FolderLock } from "lucide-react";

interface Case {
  id: string;
  case_number: string;
  title: string;
  status: string;
  confidentiality_level: string;
  created_at: string;
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

  return (
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
      </div>

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
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
