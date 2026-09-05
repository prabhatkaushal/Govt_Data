import Link from "next/link";
import { ChevronRight, FileText, Activity, ShieldCheck, Download, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface DocumentDetailViewProps {
  id: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
  isVerifying: boolean;
  verified: boolean;
  handleVerify: () => Promise<void>;
  summary: string | null;
  isSummarizing: boolean;
  handleSummarize: () => Promise<void>;
  docData?: any;
  fullText?: string | null;
  isLoadingText?: boolean;
  auditLogs?: any[];
}

export default function DocumentDetailView({
  id,
  activeTab,
  setActiveTab,
  tabs,
  isVerifying,
  verified,
  handleVerify,
  summary,
  isSummarizing,
  handleSummarize,
  docData,
  fullText,
  isLoadingText,
  auditLogs = [],
}: DocumentDetailViewProps) {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in-up">
      <div className="flex items-center gap-2 text-xs font-mono text-content-muted mb-4 uppercase tracking-[0.2em]">
        <Link href="/documents" className="hover:text-accent transition-colors">Vault</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-content-primary">{id}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-content-primary tracking-tight font-mono">{docData?.title || id}</h1>
            {docData?.status === 'VERIFIED' && (
              <span className="bg-status-verification/10 text-status-verification border border-status-verification/20 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> VERIFIED
              </span>
            )}
          </div>
          <p className="text-content-secondary text-lg font-medium tracking-wide">
            {docData?.document_type?.replace(/_/g, ' ') || 'Document'} {docData?.case ? `| Case: ${docData.case}` : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleVerify}
            disabled={isVerifying || verified}
            className="bg-accent text-white hover:bg-accent-hover px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all shadow-premium hover:shadow-premium flex items-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <><Activity className="w-4 h-4 animate-spin" /> Verifying...</>
            ) : verified ? (
              <>Integrity Verified ✓</>
            ) : (
              <><ShieldCheck className="w-4 h-4" /> Verify Signature</>
            )}
          </button>
          <button className="bg-surface hover:bg-elevated text-content-primary px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-colors border border-border flex items-center gap-2">
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>

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
        {activeTab === "Details" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
            <div className="xl:col-span-8 space-y-12">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase flex items-center gap-2 border-b border-border pb-2">
                  <FileText className="w-4 h-4 text-accent" /> File Contents (Decrypted Text)
                </h3>
                <div className="bg-surface/30 p-6 rounded border border-border/50 font-mono text-[11px] text-content-primary overflow-auto max-h-[500px] space-y-1 whitespace-pre-wrap">
                  {isLoadingText ? (
                    <div className="flex items-center gap-2 text-content-muted">
                      <Activity className="w-4 h-4 animate-spin" /> Decrypting and loading text...
                    </div>
                  ) : fullText ? (
                    fullText
                  ) : (
                    <span className="text-content-muted italic">No text content available for this document.</span>
                  )}
                </div>
              </div>
            </div>
            <div className="xl:col-span-4 space-y-6">
              <div className="bg-surface/30 border border-border/50 rounded p-6">
                 <h3 className="text-[10px] font-bold text-content-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                   <Lock className="w-3.5 h-3.5 text-accent" /> Security & Integrity
                 </h3>
                 <dl className="space-y-4">
                   <div>
                     <dt className="text-content-muted font-bold text-[10px] uppercase tracking-widest">Status</dt>
                     <dd className="mt-1">
                       {docData?.status === 'DELETED' ? (
                         <span className="text-status-danger font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                           <Activity className="w-3.5 h-3.5" /> Deleted — Awaiting Restoration
                         </span>
                       ) : docData?.flagged ? (
                         <span className="text-status-warning font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                           <Activity className="w-3.5 h-3.5" /> Flagged / Suspicious
                         </span>
                       ) : docData?.status === 'VERIFIED' ? (
                         <span className="text-status-verification font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                           <ShieldCheck className="w-3.5 h-3.5" /> Integrity Verified
                         </span>
                       ) : (
                         <span className="text-content-secondary font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                           Verification Pending
                         </span>
                       )}
                     </dd>
                   </div>
                   
                   <div>
                     <dt className="text-content-muted font-bold text-[10px] uppercase tracking-widest">SHA-256 Hash</dt>
                     <dd className="text-content-primary font-mono text-xs mt-1 truncate" title={docData?.sha256_hash}>
                       {docData?.sha256_hash || 'N/A'}
                     </dd>
                   </div>
                   
                   {docData?.verifier && (
                     <>
                       <div>
                         <dt className="text-content-muted font-bold text-[10px] uppercase tracking-widest">Verified By</dt>
                         <dd className="text-content-primary font-mono text-sm mt-1">{docData.verifier.username}</dd>
                       </div>
                       {docData.verified_at && (
                         <div>
                           <dt className="text-content-muted font-bold text-[10px] uppercase tracking-widest">Verified On</dt>
                           <dd className="text-content-primary font-mono text-xs mt-1">{new Date(docData.verified_at).toLocaleString()}</dd>
                         </div>
                       )}
                     </>
                   )}
                   
                   {docData?.flagged && docData?.flagger && (
                     <>
                       <div>
                         <dt className="text-content-muted font-bold text-[10px] uppercase tracking-widest">Flagged By</dt>
                         <dd className="text-status-warning font-mono text-sm mt-1">{docData.flagger.username}</dd>
                       </div>
                       {docData.flag_reason && (
                         <div>
                           <dt className="text-content-muted font-bold text-[10px] uppercase tracking-widest">Reason</dt>
                           <dd className="text-content-primary text-xs mt-1">{docData.flag_reason}</dd>
                         </div>
                       )}
                     </>
                   )}
                 </dl>
              </div>

              <div className="bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 rounded p-6 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-[#8B5CF6]" />
                 <h3 className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
                   <span className="flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> AI Synthesis</span>
                   <button 
                     onClick={handleSummarize}
                     disabled={isSummarizing}
                     className="bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-[#8B5CF6] px-2 py-1 rounded transition-colors disabled:opacity-50"
                   >
                     {isSummarizing ? "GENERATING..." : "SUMMARIZE"}
                   </button>
                 </h3>
                 <div className="text-content-primary text-xs leading-relaxed space-y-2 font-medium">
                   {summary ? (
                     <div className="whitespace-pre-wrap">{summary}</div>
                   ) : (
                     <p className="text-content-muted italic">Click summarize to generate an AI analysis of this document.</p>
                   )}
                 </div>
              </div>

            </div>
          </div>
        )}
        {activeTab === "Blockchain Trace" && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase flex items-center gap-2 border-b border-border pb-2">
              <Activity className="w-4 h-4 text-accent" /> Hyperledger Fabric Trace
            </h3>
            <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-elevated/20 text-[10px] font-bold text-content-muted tracking-[0.12em] uppercase">
                    <th className="px-6 py-4 font-normal">Transaction ID</th>
                    <th className="px-6 py-4 font-normal">Action</th>
                    <th className="px-6 py-4 font-normal">Timestamp</th>
                    <th className="px-6 py-4 font-normal">Actor</th>
                    <th className="px-6 py-4 font-normal text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 font-mono text-xs">
                  {docData ? (
                    <tr className="hover:bg-elevated/40 transition-colors">
                      <td className="px-6 py-4 text-accent">TXN-{docData.sha256_hash?.substring(0, 8).toUpperCase() || 'PENDING'}</td>
                      <td className="px-6 py-4 text-content-primary">ANCHORED</td>
                      <td className="px-6 py-4 text-content-secondary">{new Date(docData.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4 text-content-secondary">{docData.uploaded_by?.username || 'SYSTEM'}</td>
                      <td className="px-6 py-4 text-right text-status-verification">COMMITTED</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-content-muted text-sm italic">
                        No blockchain records available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          )}

        {activeTab === "Audit Trail" && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase flex items-center gap-2 border-b border-border pb-2">
              <Lock className="w-4 h-4 text-accent" /> Access Audit Log
            </h3>
            <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-elevated/20 text-[10px] font-bold text-content-muted tracking-[0.12em] uppercase">
                    <th className="px-6 py-4 font-normal">Action</th>
                    <th className="px-6 py-4 font-normal">User (Role)</th>
                    <th className="px-6 py-4 font-normal">Timestamp</th>
                    <th className="px-6 py-4 font-normal text-right">Metadata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-sm">
                  {auditLogs && auditLogs.length > 0 ? (
                    auditLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-elevated/40 transition-colors">
                        <td className="px-6 py-4 text-content-primary font-bold">{log.action}</td>
                        <td className="px-6 py-4 text-content-secondary">
                          {log.actor_details ? `${log.actor_details.full_name} (${log.actor_details.role})` : `User ID: ${log.actor}`}
                        </td>
                        <td className="px-6 py-4 text-content-muted font-mono text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right text-xs text-content-muted">
                          {log.metadata_info?.description || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-content-muted text-sm italic">
                        No audit logs available for this document.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        </div>
      </div>
  );
}
