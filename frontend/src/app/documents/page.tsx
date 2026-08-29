"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Search, Filter, Upload, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import DocumentListTable, { DocumentItem } from "@/components/features/documents/DocumentListTable";

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

  const handleVerify = async (id: string) => {
    try {
      await api.post(`/documents/${id}/verify/`);
      await fetchDocs();
    } catch (err) {
      console.error("Failed to verify", err);
    }
  };

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
        </div>

        {/* DATA TABLE */}
        <DocumentListTable 
          documents={documents}
          loading={loading}
          isLawyer={isLawyer}
          handleVerify={handleVerify}
        />
      </motion.div>
    </motion.div>
  );
}
