"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { Search, Filter, Upload, FileText, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import DocumentListTable, { DocumentItem } from "@/components/documents/DocumentListTable";

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInvestigator, isLawyer } = useAuth();

  const [isRecycleBin, setIsRecycleBin] = useState(false);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/documents/${isRecycleBin ? '?deleted=true' : ''}`);
      setDocuments(res.data);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [isRecycleBin]);

  const handleVerify = async (id: string) => {
    router.push(`/documents/${id}/verify`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to move this document to the Recycle Bin?")) return;
    try {
      await api.delete(`/documents/${id}/`);
      fetchDocs();
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Failed to delete document. Admin privileges required.");
    }
  };

  const handleRestore = async (id: string) => {
    if (!window.confirm("Restore this document? The document will return to its previous active state. This action will be permanently recorded in the audit trail.")) return;
    try {
      await api.post(`/documents/${id}/restore/`);
      fetchDocs();
    } catch (err) {
      console.error("Failed to restore", err);
      alert("Failed to restore document. Admin privileges required.");
    }
  };

  const handleFlag = async (id: string) => {
    const reason = window.prompt("Reason for flagging this document:");
    if (!reason) return;
    try {
      await api.post(`/documents/${id}/flag/`, { reason });
      fetchDocs();
    } catch (err) {
      console.error("Failed to flag", err);
      alert("Failed to flag document.");
    }
  };

  const handleReplace = (id: string) => {
    alert("File replacement protocol requires a new cryptographic hash and chain of custody entry. Feature currently locked to maintain audit trail integrity.");
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const uniqueTypes = Array.from(new Set(documents.map(d => d.document_type))).filter(Boolean);
  const uniqueStatuses = Array.from(new Set(documents.map(d => d.status))).filter(Boolean);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doc.document_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.case && String(doc.case).toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesType = typeFilter === "" || doc.document_type === typeFilter;
    const matchesStatus = statusFilter === "" || doc.status === statusFilter;

    let matchesDate = true;
    if (dateFilter) {
      const docDate = new Date(doc.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - docDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (dateFilter === "today") matchesDate = diffDays <= 1;
      else if (dateFilter === "week") matchesDate = diffDays <= 7;
      else if (dateFilter === "month") matchesDate = diffDays <= 30;
    }

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { ease: [0.22, 1, 0.36, 1] as const, duration: 0.4 } }
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
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px] group">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-content-muted group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by ID, title, or case..." 
              className="w-full bg-surface border border-border rounded pl-9 pr-4 py-2 text-sm text-content-primary focus:outline-none focus:border-accent/50 focus:bg-elevated transition-colors"
            />
          </div>
            <button 
              onClick={() => setIsRecycleBin(!isRecycleBin)}
              className={`flex items-center gap-2 border px-4 py-2 rounded-lg text-sm transition-colors ${
                isRecycleBin 
                ? 'bg-status-danger/10 border-status-danger text-status-danger' 
                : 'bg-surface border-border hover:border-status-danger text-content-primary hover:text-status-danger'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              {isRecycleBin ? 'Exit Recycle Bin' : 'Recycle Bin'}
            </button>
            <div className="relative z-20">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-surface border border-border hover:border-accent px-4 py-2 rounded-lg text-sm transition-colors relative"
            >
              <Filter className="w-4 h-4 text-content-muted" />
              Advanced Filters
              {(typeFilter || statusFilter || dateFilter) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full border border-surface"></span>
              )}
            </button>

            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-surface border border-border rounded-lg shadow-premium p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-[10px] font-bold tracking-widest text-content-primary uppercase">Filter Options</h4>
                  <button 
                    onClick={() => { setTypeFilter(""); setStatusFilter(""); setDateFilter(""); }}
                    className="text-[10px] text-accent hover:underline font-mono"
                  >
                    Reset
                  </button>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-content-muted tracking-widest uppercase mb-1">Document Type</label>
                  <select 
                    className="w-full bg-background border border-border rounded px-3 py-2 text-xs text-content-secondary cursor-pointer focus:outline-none focus:border-accent/50 appearance-none transition-colors"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="">All Types</option>
                    {uniqueTypes.map((t: string) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-content-muted tracking-widest uppercase mb-1">Verification Status</label>
                  <select 
                    className="w-full bg-background border border-border rounded px-3 py-2 text-xs text-content-secondary cursor-pointer focus:outline-none focus:border-accent/50 appearance-none transition-colors"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    {uniqueStatuses.map((s: string) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-content-muted tracking-widest uppercase mb-1">Upload Date</label>
                  <select 
                    className="w-full bg-background border border-border rounded px-3 py-2 text-xs text-content-secondary cursor-pointer focus:outline-none focus:border-accent/50 appearance-none transition-colors"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="">All Time</option>
                    <option value="today">Last 24 Hours</option>
                    <option value="week">Past 7 Days</option>
                    <option value="month">Past 30 Days</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DATA TABLE */}
        <DocumentListTable 
          documents={filteredDocuments}
          loading={loading}
          isLawyer={isLawyer}
          isRecycleBin={isRecycleBin}
          handleVerify={handleVerify}
          handleDelete={handleDelete}
          handleReplace={handleReplace}
          handleRestore={handleRestore}
          handleFlag={handleFlag}
        />
      </motion.div>
    </motion.div>
  );
}
