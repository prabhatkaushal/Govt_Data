"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { CaseFilters } from "@/components/features/cases/CaseFilters";
import { CaseListTable, Case } from "@/components/features/cases/CaseListTable";

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
        <CaseFilters />

        {/* DATA TABLE */}
        <CaseListTable cases={cases} loading={loading} />
      </motion.div>
    </motion.div>
  );
}
