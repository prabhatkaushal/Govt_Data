"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { Search, ShieldCheck, AlertOctagon, FileText, ChevronDown, ChevronRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function VerifyDocumentsPage() {
  const router = useRouter();
  const { isLawyer } = useAuth();
  
  const [cases, setCases] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCases, setExpandedCases] = useState<Record<string, boolean>>({});
  const [flagModal, setFlagModal] = useState<{isOpen: boolean, docId: string}>({isOpen: false, docId: ""});
  const [flagReason, setFlagReason] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesRes, docsRes] = await Promise.all([
          api.get('/cases/'),
          api.get('/documents/')
        ]);
        setCases(casesRes.data);
        setDocuments(docsRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVerify = (docId: string) => {
    router.push(`/documents/${docId}/verify`);
  };

  const handleFlag = (docId: string) => {
    setFlagModal({ isOpen: true, docId });
  };

  const handleFlagSubmit = async () => {
    if (!flagReason.trim()) return;
    try {
      await api.post(`/documents/${flagModal.docId}/flag/`, { reason: flagReason });
      const docsRes = await api.get('/documents/');
      setDocuments(docsRes.data);
      setFlagModal({ isOpen: false, docId: "" });
      setFlagReason("");
    } catch (err) {
      console.error("Failed to flag", err);
      alert("Failed to flag document. Make sure you have the correct permissions.");
    }
  };

  const toggleCase = (caseId: string) => {
    setExpandedCases(prev => ({ ...prev, [caseId]: !prev[caseId] }));
  };

  if (!isLawyer) {
    return (
      <div className="p-8 text-center text-status-danger font-bold uppercase tracking-widest mt-20">
        Unauthorized. Only Legal Officers and Admins can access this section.
      </div>
    );
  }

  const filteredCases = cases.filter(c => 
    c.case_number?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="border-b border-border pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-content-primary tracking-tight font-mono mb-2">Legal Verification Hub</h1>
          <p className="text-content-secondary tracking-wide">Search cases to review and cryptographically verify associated documents.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-premium p-6">
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-content-muted" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case ID or Title..." 
            className="w-full bg-background border border-border rounded-lg pl-12 pr-4 py-3 text-sm text-content-primary focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Activity className="w-8 h-8 text-accent animate-spin mb-4" />
            <p className="text-content-muted font-mono tracking-widest text-[10px] uppercase">Loading Cases...</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-12 text-content-muted italic">No cases found matching your search.</div>
        ) : (
          <div className="space-y-4">
            {filteredCases.map(c => {
              const actualCaseDocs = documents.filter(d => d.case === c.id || d.case?.id === c.id);

              return (
                <div key={c.id} className="border border-border rounded-lg overflow-hidden bg-background">
                  <button 
                    onClick={() => toggleCase(c.id)}
                    className="w-full flex items-center justify-between p-4 bg-elevated/30 hover:bg-elevated transition-colors text-left"
                  >
                    <div>
                      <h3 className="font-bold text-content-primary">{c.title}</h3>
                      <p className="text-xs text-content-muted font-mono mt-1">{c.case_number}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-content-secondary px-2 py-1 bg-surface border border-border rounded">
                        {actualCaseDocs.length} Document(s)
                      </span>
                      {expandedCases[c.id] ? <ChevronDown className="w-5 h-5 text-content-muted" /> : <ChevronRight className="w-5 h-5 text-content-muted" />}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedCases[c.id] && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 border-t border-border">
                          {actualCaseDocs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                              <p className="text-sm text-content-muted italic">No documents attached to this case.</p>
                              {c.verification_status !== 'VERIFIED' ? (
                                <button
                                  onClick={async () => {
                                    try {
                                      await api.post(`/cases/${c.id}/verify/`);
                                      const res = await api.get('/cases/');
                                      setCases(res.data);
                                      alert("Case verified successfully.");
                                    } catch (err) {
                                      alert("Failed to verify case.");
                                    }
                                  }}
                                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-status-verification/10 text-status-verification hover:bg-status-verification hover:text-white border border-status-verification/20 rounded transition-colors"
                                >
                                  Verify Case Independent of Documents
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-bold tracking-widest bg-status-verification/10 text-status-verification border border-status-verification/20 uppercase">
                                  <ShieldCheck className="w-4 h-4" /> Case Verified
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {actualCaseDocs.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between p-3 border border-border/50 rounded bg-surface">
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-content-muted" />
                                    <div>
                                      <Link href={`/documents/${doc.id}`} className="font-bold text-sm text-content-primary hover:text-accent transition-colors">
                                        {doc.title}
                                      </Link>
                                      <p className="text-[10px] text-content-muted font-mono uppercase">{doc.document_id} • {doc.document_type?.replace(/_/g, ' ')}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-4">
                                    
                                    <div className="flex flex-col items-end gap-1">
                                      {doc.status === 'VERIFIED' ? (
                                        <>
                                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold tracking-widest bg-status-verification/10 text-status-verification border border-status-verification/20 uppercase">
                                            <ShieldCheck className="w-3 h-3" /> Verified
                                          </span>
                                          {doc.verifier && <span className="text-[9px] text-content-muted">By: {doc.verifier.full_name || doc.verifier.username}</span>}
                                        </>
                                      ) : doc.flagged ? (
                                        <>
                                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold tracking-widest bg-status-warning/10 text-status-warning border border-status-warning/20 uppercase">
                                            <AlertOctagon className="w-3 h-3" /> Flagged
                                          </span>
                                          {doc.flagger && <span className="text-[9px] text-content-muted">By: {doc.flagger.full_name || doc.flagger.username}</span>}
                                          {doc.flag_reason && <span className="text-[9px] text-status-warning/70 max-w-[200px] truncate" title={doc.flag_reason}>Reason: {doc.flag_reason}</span>}
                                        </>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold tracking-widest bg-content-muted/10 text-content-secondary border border-content-muted/20 uppercase">
                                          Pending
                                        </span>
                                      )}
                                    </div>

                                    
                                    <div className="flex items-center gap-2">
                                      <Link href={`/documents/${doc.id}`} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-surface border border-border hover:bg-elevated rounded transition-colors text-content-primary">
                                        Read
                                      </Link>
                                      {doc.status !== 'VERIFIED' && (
                                        <button 
                                          onClick={() => handleVerify(doc.id)}
                                          className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-status-verification/10 text-status-verification hover:bg-status-verification hover:text-white border border-status-verification/20 rounded transition-colors"
                                        >
                                          Verify
                                        </button>
                                      )}
                                      {!doc.flagged && (
                                        <button 
                                          onClick={() => handleFlag(doc.id)}
                                          className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-status-warning/10 text-status-warning hover:bg-status-warning hover:text-white border border-status-warning/20 rounded transition-colors"
                                        >
                                          Flag
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      
      <AnimatePresence>
        {flagModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border rounded-xl shadow-premium w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-border bg-elevated/50 flex items-center gap-3">
                <AlertOctagon className="w-6 h-6 text-status-warning" />
                <h3 className="font-bold text-lg text-content-primary">Flag Document</h3>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-content-secondary">
                  Please provide a detailed reason for flagging this document. This will be recorded in the audit trail.
                </p>
                <textarea
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  className="w-full bg-background border border-border rounded px-4 py-3 text-sm text-content-primary focus:outline-none focus:border-accent transition-colors min-h-[100px]"
                  placeholder="Reason for flagging..."
                  autoFocus
                />
              </div>
              <div className="p-4 border-t border-border bg-elevated/30 flex justify-end gap-3">
                <button
                  onClick={() => { setFlagModal({isOpen: false, docId: ""}); setFlagReason(""); }}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-content-secondary hover:text-content-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFlagSubmit}
                  disabled={!flagReason.trim()}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-status-warning hover:bg-status-warning/90 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Flag
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
