"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/services/api";
import { CaseDetailHeader } from "@/components/cases/CaseDetailHeader";
import { CaseDetailOverview } from "@/components/cases/CaseDetailOverview";

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Documents", "Timeline"];
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [caseData, setCaseData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const [caseRes, docRes, auditRes] = await Promise.all([
          api.get(`/cases/${params.id}/`),
          api.get(`/documents/?case=${params.id}`),
          api.get(`/audit-logs/?resource_id=${params.id}`)
        ]);
        setCaseData(caseRes.data);
        // Sometimes backend filters aren't perfect in dummy setups, filter manually just in case
        setDocuments(docRes.data.filter((d: any) => d.case === parseInt(params.id) || d.case?.id === parseInt(params.id)));
        setTimeline(auditRes.data.filter((l: any) => l.resource_type === 'Case' && l.resource_id === params.id));
      } catch (err) {
        console.error("Failed to fetch case details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseDetails();
  }, [params.id]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    await new Promise(res => setTimeout(res, 800)); // Simulating generation time
    setIsGenerating(false);
    setReportGenerated(true);
    
    // Trigger mock download
    const blob = new Blob([`CONFIDENTIAL CASE REPORT: ${caseData.case_number}\n\nTitle: ${caseData.title}\nStatus: ${caseData.status}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${caseData.case_number}_Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    setTimeout(() => setReportGenerated(false), 3000);
  };

  const updateCaseStatus = async (newStatus: string) => {
    try {
      const res = await api.patch(`/cases/${params.id}/`, { status: newStatus });
      setCaseData(res.data);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDeleteCase = async () => {
    if (window.confirm("CRITICAL WARNING: Are you sure you want to permanently delete this entire Case? This will permanently delete all attached documents, FIRs, and the entire evidence chain associated with it!")) {
      try {
        await api.delete(`/cases/${params.id}/`);
        window.location.href = '/cases';
      } catch (err) {
        console.error("Failed to delete case", err);
        alert("Failed to delete case. You may not have sufficient permissions.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-content-muted font-mono tracking-[0.2em] text-[10px] uppercase">Loading Case Data</p>
      </div>
    );
  }

  if (!caseData) {
    return <div className="text-center text-status-danger p-8">Case not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in-up">
      <div className="flex items-center gap-2 text-xs font-mono text-content-muted mb-4 uppercase tracking-[0.2em]">
        <Link href="/cases" className="hover:text-accent transition-colors">Cases</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-content-primary">{caseData.case_number}</span>
      </div>

      <CaseDetailHeader 
        caseData={caseData}
        isGenerating={isGenerating}
        reportGenerated={reportGenerated}
        onGenerateReport={handleGenerateReport}
        onStatusChange={updateCaseStatus}
        onDeleteCase={handleDeleteCase}
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
          <CaseDetailOverview caseData={caseData} />
        )}
        {activeTab === "Documents" && (
          <div className="bg-surface border border-border p-6 rounded">
            <h3 className="text-sm font-bold text-content-primary mb-4">Case Documents ({documents.length})</h3>
            {documents.length > 0 ? (
              <ul className="space-y-2">
                {documents.map((doc: any) => (
                  <li key={doc.id} className="text-xs text-content-secondary border border-border/50 p-2 rounded">
                    <Link href={`/documents/${doc.id}`} className="hover:text-accent hover:underline">
                      {doc.title} ({doc.document_id})
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-content-muted">No documents attached to this case.</p>
            )}
          </div>
        )}
        {activeTab === "Timeline" && (
          <div className="bg-surface border border-border p-6 rounded">
            <h3 className="text-sm font-bold text-content-primary mb-4">Case Timeline</h3>
            {timeline.length > 0 ? (
              <ul className="space-y-4">
                {timeline.map((log: any) => (
                  <li key={log.id} className="text-xs text-content-secondary border-l-2 border-accent pl-4 py-1">
                    <p className="font-bold text-content-primary">{log.action}</p>
                    <p className="text-content-muted mt-1">{new Date(log.timestamp).toLocaleString()} by {log.actor?.username}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-content-muted">No timeline events found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
