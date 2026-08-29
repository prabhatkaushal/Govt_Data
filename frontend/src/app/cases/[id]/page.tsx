"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { CaseDetailHeader } from "@/components/features/cases/CaseDetailHeader";
import { CaseDetailOverview } from "@/components/features/cases/CaseDetailOverview";

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Documents", "Evidence", "Timeline"];
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    await new Promise(res => setTimeout(res, 1500));
    setIsGenerating(false);
    setReportGenerated(true);
    setTimeout(() => setReportGenerated(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in-up">
      <div className="flex items-center gap-2 text-xs font-mono text-content-muted mb-4 uppercase tracking-[0.2em]">
        <Link href="/cases" className="hover:text-accent transition-colors">Cases</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-content-primary">{params.id}</span>
      </div>

      <CaseDetailHeader 
        id={params.id}
        isGenerating={isGenerating}
        reportGenerated={reportGenerated}
        onGenerateReport={handleGenerateReport}
      />

      <div className="border-b border-border overflow-x-auto scrollbar-none relative">
        <nav className="flex space-x-8 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-4 px-1 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors flex items-center gap-2 group ${
                activeTab === tab
                  ? "text-accent"
                  : "text-content-muted hover:text-content-secondary"
              }`}
            >
              {tab}
              {activeTab === tab && (
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
      </div>

      <div className="py-4">
        {activeTab === "Overview" && (
          <CaseDetailOverview />
        )}
      </div>
    </div>
  );
}
