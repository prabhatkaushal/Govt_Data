'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TestTube, Search, Filter, Clock, ChevronDown, Lock, ShieldAlert } from 'lucide-react';
import api from '@/services/api';
import Link from 'next/link';

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
  const [evidence, setEvidence] = React.useState<any[]>([]);
  const [documents, setDocuments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [caseFilter, setCaseFilter] = React.useState("");
  const [timeFilter, setTimeFilter] = React.useState("");
  const [locationFilter, setLocationFilter] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [evRes, docRes] = await Promise.all([
          api.get('/evidence/'),
          api.get('/documents/')
        ]);
        setEvidence(evRes.data);
        setDocuments(docRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper to find document and its case for a given evidence item
  const getCaseForEvidence = (item: any) => {
    const docId = typeof item.document === 'object' ? item.document?.id : item.document;
    const doc = documents.find(d => d.id === docId);
    return doc?.case?.case_number || doc?.case;
  };

  // Compute unique values for dropdowns
  const uniqueStatuses = Array.from(new Set(evidence.map(e => e.action))).filter(Boolean);
  const uniqueCases = Array.from(new Set(evidence.map(e => getCaseForEvidence(e)))).filter(Boolean);
  const uniqueLocations = Array.from(new Set(evidence.map(e => e.location))).filter(Boolean);

  // Filter evidence
  const filteredEvidence = evidence.filter(item => {
    const matchesSearch = searchQuery === "" || 
      `EV-${item.id}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.comments || "").toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "" || item.action === statusFilter;
    
    const itemCase = getCaseForEvidence(item);
    const matchesCase = caseFilter === "" || String(itemCase) === String(caseFilter);
    const matchesLocation = locationFilter === "" || item.location === locationFilter;

    let matchesTime = true;
    if (timeFilter) {
      const itemDate = new Date(item.timestamp);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - itemDate.getTime());
      const diffHours = diffTime / (1000 * 60 * 60);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (timeFilter === "hour") matchesTime = diffHours <= 1;
      else if (timeFilter === "today") matchesTime = diffHours <= 24;
      else if (timeFilter === "week") matchesTime = diffDays <= 7;
      else if (timeFilter === "month") matchesTime = diffDays <= 30;
    }
    
    return matchesSearch && matchesStatus && matchesCase && matchesLocation && matchesTime;
  });

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

        <motion.div variants={itemVariants} className="flex justify-end mb-4">
           <Link href="/evidence/chain-of-custody" className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded text-[10px] font-bold tracking-widest uppercase transition-all shadow-premium flex items-center gap-2">
             <Lock className="w-4 h-4" /> Record Custody Transfer
           </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-4 mb-8">
          <div className="flex-1 flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2 focus-within:border-accent transition-colors">
            <Search className="w-4 h-4 text-content-muted" />
            <input
              type="text"
              placeholder="Search evidence by ID or description..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-content-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative z-20">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-surface border border-border hover:border-accent px-4 py-2 rounded-lg text-sm transition-colors relative"
            >
              <Filter className="w-4 h-4 text-content-muted" />
              Advanced Filters
              {(caseFilter || statusFilter || locationFilter || timeFilter) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full border border-surface"></span>
              )}
            </button>

            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-surface border border-border rounded-lg shadow-premium p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-[10px] font-bold tracking-widest text-content-primary uppercase">Filter Options</h4>
                  <button 
                    onClick={() => { setCaseFilter(""); setStatusFilter(""); setLocationFilter(""); setTimeFilter(""); }}
                    className="text-[10px] text-accent hover:underline font-mono"
                  >
                    Reset
                  </button>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-content-muted tracking-widest uppercase mb-1">Case Ref</label>
                  <select 
                    className="w-full bg-background border border-border rounded px-3 py-2 text-xs text-content-secondary cursor-pointer focus:outline-none focus:border-accent/50 appearance-none transition-colors"
                    value={caseFilter}
                    onChange={(e) => setCaseFilter(e.target.value)}
                  >
                    <option value="">All Cases</option>
                    {uniqueCases.map((c: any) => (
                      <option key={c} value={c}>Case {c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-content-muted tracking-widest uppercase mb-1">Status Action</label>
                  <select 
                    className="w-full bg-background border border-border rounded px-3 py-2 text-xs text-content-secondary cursor-pointer focus:outline-none focus:border-accent/50 appearance-none transition-colors"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    {uniqueStatuses.map((s: any) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-content-muted tracking-widest uppercase mb-1">Location</label>
                  <select 
                    className="w-full bg-background border border-border rounded px-3 py-2 text-xs text-content-secondary cursor-pointer focus:outline-none focus:border-accent/50 appearance-none transition-colors"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((loc: any) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-content-muted tracking-widest uppercase mb-1">Time Range</label>
                  <select 
                    className="w-full bg-background border border-border rounded px-3 py-2 text-xs text-content-secondary cursor-pointer focus:outline-none focus:border-accent/50 appearance-none transition-colors"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                  >
                    <option value="">All Time</option>
                    <option value="hour">Last 1 Hour</option>
                    <option value="today">Last 24 Hours</option>
                    <option value="week">Past 7 Days</option>
                    <option value="month">Past 30 Days</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-sm font-bold text-content-primary mb-4">Registered Evidence</h3>
              {loading ? (
                <div className="flex justify-center p-12">
                  <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredEvidence.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-lg bg-background/50">
                  <ShieldAlert className="w-8 h-8 text-content-muted mb-3 opacity-50" />
                  <p className="text-sm font-bold text-content-secondary uppercase tracking-widest">No Evidence Found</p>
                  <p className="text-xs text-content-muted mt-2">Try adjusting your filters or search query.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border text-[10px] uppercase text-content-muted">
                        <th className="py-3 px-2">Evidence ID</th>
                        <th className="py-3 px-2">Action</th>
                        <th className="py-3 px-2">Location</th>
                        <th className="py-3 px-2">Date & Time</th>
                        <th className="py-3 px-2">TX Hash</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredEvidence.map((item: any) => (
                        <tr key={item.id} className="text-sm text-content-secondary group cursor-pointer hover:bg-elevated/50 transition-colors" onClick={() => window.location.href = `/evidence/${item.id}`}>
                          <td className="py-3 px-2 font-mono text-accent group-hover:underline">EV-{item.id}</td>
                          <td className="py-3 px-2">{item.action}</td>
                          <td className="py-3 px-2 text-[11px] max-w-[150px] truncate">{item.location || "N/A"}</td>
                          <td className="py-3 px-2 text-[11px]">{new Date(item.timestamp).toLocaleString()}</td>
                          <td className="py-3 px-2 font-mono text-[10px] truncate max-w-[100px]">{item.blockchain_tx_id || "PENDING"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
