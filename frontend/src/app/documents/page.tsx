"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Search, Filter, Upload, FileText, ChevronRight, ShieldCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Search, UploadCloud, FileDigit, ShieldCheck, Clock, FileText, CheckCircle2, QrCode } from "lucide-react";

interface DocumentItem {
  id: string;
  document_id: string;
  title: string;
  document_type: string;
  case: string;
  uploaded_by: {
    username: string;
  };
  created_at: string;
  status: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInvestigator, isLawyer } = useAuth();

  const fetchDocs = async () => {
    try {
      const res = await api.get('/documents/');
      setDocuments(res.data);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
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
            <FileText className="w-5 h-5 text-accent" /> Document Vault
          </h1>
          <p className="text-content-muted mt-2 text-xs font-mono tracking-widest uppercase">Secure document repository</p>
        </div>
        <Link href="/documents/upload" className="bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 px-5 py-2.5 rounded text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2">
          <Upload className="w-4 h-4" /> UPLOAD DOCUMENT
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px] group">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-content-muted group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search documents by ID, title, or case..." 
              className="w-full bg-surface border border-border rounded pl-9 pr-4 py-2 text-sm text-content-primary focus:outline-none focus:border-accent/50 focus:bg-elevated transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-2.5 text-content-muted pointer-events-none" />
              <select className="bg-surface border border-border rounded pl-9 pr-8 py-2 text-xs font-bold tracking-widest uppercase text-content-secondary focus:outline-none focus:border-accent/50 appearance-none transition-colors">
                <option>Type: All</option>
                <option>FIR</option>
                <option>Police Report</option>
                <option>Witness Statement</option>
              </select>
            </div>
            <select className="bg-surface border border-border rounded px-4 py-2 text-xs font-bold tracking-widest uppercase text-content-secondary focus:outline-none focus:border-accent/50 appearance-none transition-colors">
              <option>Status: All</option>
              <option>Verified</option>
              <option>Pending</option>
            </select>
          </div>
  const handleVerify = async (id: string) => {
    try {
      await api.post(`/documents/${id}/verify/`);
      await fetchDocs(); // Refresh list after verifying
    } catch (err) {
      console.error("Failed to verify", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Document Vault
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Secure storage with cryptographic integrity and blockchain verification.</p>
        </div>
        {isInvestigator && (
          <Link href="/documents/upload" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center gap-2">
            <UploadCloud className="w-4 h-4" /> Upload Evidence
          </Link>
        )}
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by Document ID, Title or Case..." 
              className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-4">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              <p className="text-content-muted font-mono tracking-[0.2em] text-[10px] uppercase">Retrieving Records</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded">
              <FileText className="w-8 h-8 text-content-muted mb-4 opacity-50" />
              <p className="text-content-secondary font-medium text-sm">No documents found.</p>
            </div>
          ) : (
            <div className="border border-border rounded bg-surface overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-elevated/50 text-[10px] font-bold uppercase tracking-[0.15em] text-content-muted">
                    <th className="px-6 py-4 font-normal">Document</th>
                    <th className="px-6 py-4 font-normal">Case Ref</th>
                    <th className="px-6 py-4 font-normal">Type</th>
                    <th className="px-6 py-4 font-normal">Integrity</th>
                    <th className="px-6 py-4 font-normal">Timestamp</th>
                    <th className="px-6 py-4 font-normal text-right">Action</th>
            <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-4">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-sm font-mono animate-pulse">DECRYPTING VAULT INVENTORY...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No documents found in vault.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800/80 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                  <th className="px-6 py-4">Doc ID</th>
                  <th className="px-6 py-4">Title / Type</th>
                  <th className="px-6 py-4">Case Ref</th>
                  <th className="px-6 py-4">Integrity Status</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {documents.map((doc, idx) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors group relative" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-400">
                      <Link href={`/documents/${doc.id}`} className="hover:text-blue-300 hover:underline flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-slate-500" />
                        {doc.document_id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
                          {doc.document_type?.includes('FIR') ? <FileText className="w-4 h-4 text-blue-400" /> : doc.document_type?.includes('REPORT') ? <FileDigit className="w-4 h-4 text-purple-400" /> : <FileText className="w-4 h-4 text-slate-400" />}
                        </div>
                        {doc.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">
                      <Link href={`/cases/${doc.case}`} className="hover:text-blue-400 transition-colors bg-slate-900 px-2 py-1 rounded border border-slate-700/50">CASE-{doc.case}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {doc.status === 'ACTIVE' ? (
                        <span className="badge-emerald inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="badge-amber inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5 animate-spin-slow" />
                          Processing
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3 items-center">
                    {isLawyer && doc.status !== 'ACTIVE' && (
                      <button 
                        onClick={() => handleVerify(doc.id)} 
                        className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/50"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Verify
                      </button>
                    )}
                    <Link href={`/documents/${doc.id}`} className="text-slate-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100">
                      View Details
                    </Link>
                  </td>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="group hover:bg-elevated transition-colors cursor-pointer relative">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/documents/${doc.id}`} className="absolute inset-0" />
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center text-content-muted group-hover:border-accent group-hover:text-accent transition-colors">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-content-primary tracking-wide">{doc.title}</p>
                            <p className="text-[10px] font-mono text-content-muted mt-1">{doc.document_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 bg-background border border-border rounded text-[10px] font-mono text-accent">
                          {doc.case}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[10px] font-bold tracking-widest text-content-secondary uppercase">
                        {doc.document_type?.replace(/_/g, ' ') || 'OTHER'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {doc.status === 'ACTIVE' || doc.status === 'VERIFIED' ? (
                          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] text-[9px] font-bold tracking-widest bg-status-verification/10 text-status-verification border border-status-verification/20 uppercase">
                            <ShieldCheck className="w-3 h-3" /> VERIFIED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] text-[9px] font-bold tracking-widest bg-status-warning/10 text-status-warning border border-status-warning/20 uppercase">
                            <AlertCircle className="w-3 h-3" /> PENDING
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-content-muted font-mono">
                        {new Date(doc.created_at).toLocaleDateString()}
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
