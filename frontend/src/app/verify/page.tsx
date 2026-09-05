"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import { ShieldCheck, Upload, File, ShieldAlert, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function GlobalVerificationPage() {
  const { isLawyer } = useAuth();
  
  const [file, setFile] = useState<File | null>(null);
  const [verificationState, setVerificationState] = useState<'IDLE' | 'HASHING' | 'MATCH' | 'NOT_FOUND'>('IDLE');
  const [calculatedHash, setCalculatedHash] = useState("");
  
  const [doc, setDoc] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [evidenceChain, setEvidenceChain] = useState<any[]>([]);

  const handleVerify = async () => {
    if (!file) return;
    setVerificationState('HASHING');
    setDoc(null);
    setAuditLogs([]);
    setEvidenceChain([]);
    
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setCalculatedHash(hashHex);
      
      const docsRes = await api.get('/documents/');
      const allDocs = docsRes.data;
      const matchedDoc = allDocs.find((d: any) => d.sha256_hash === hashHex);
      
      setTimeout(async () => {
        if (matchedDoc) {
          setDoc(matchedDoc);
          setVerificationState('MATCH');
          
          const auditRes = await api.get(`/audit-logs/?resource_id=${matchedDoc.document_id}`);
          setAuditLogs(auditRes.data);

          const evRes = await api.get(`/evidence/`);
          const relatedEvidence = evRes.data.filter((e: any) => 
            e.document === matchedDoc.id || e.document?.id === matchedDoc.id
          );
          setEvidenceChain(relatedEvidence);
          
          if (matchedDoc.status !== 'ACTIVE' && isLawyer) {
             await api.post(`/documents/${matchedDoc.id}/verify/`);
          }
        } else {
          setVerificationState('NOT_FOUND');
        }
      }, 800);
    } catch (err) {
      console.error(err);
      setVerificationState('IDLE');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-content-primary tracking-tight font-mono mb-2">Global Cryptographic Verification</h1>
        <p className="text-content-secondary tracking-wide">Upload a file to automatically verify its integrity and instantly retrieve its entire immutable lifecycle history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-surface border border-border p-6 rounded-xl shadow-premium">
            <h3 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase mb-4">Select Local File</h3>
            
            <div className="flex flex-col items-center gap-4">
              {file ? (
                <div className="w-full bg-background border border-border rounded p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <File className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm font-bold text-content-primary truncate max-w-[200px]">{file.name}</p>
                      <p className="text-[10px] font-mono text-content-muted uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button onClick={() => {setFile(null); setVerificationState('IDLE'); setDoc(null);}} className="text-[10px] text-status-danger font-bold uppercase hover:underline">
                    Clear
                  </button>
                </div>
              ) : (
                <label className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
                  <Upload className="w-6 h-6 text-content-muted mb-3" />
                  <span className="text-[10px] font-bold tracking-widest text-accent uppercase">Browse Local File</span>
                  <input type="file" className="sr-only" onChange={e => {
                    if (e.target.files?.[0]) setFile(e.target.files[0]);
                  }} />
                </label>
              )}
            </div>

            <button
              onClick={handleVerify}
              disabled={!file || verificationState === 'HASHING'}
              className="mt-6 w-full bg-accent hover:bg-accent-hover text-white py-3 rounded text-[10px] font-bold tracking-[0.2em] uppercase transition-all disabled:opacity-50"
            >
              {verificationState === 'HASHING' ? 'Calculating Hash & Searching...' : 'Run Global Search & Verify'}
            </button>
          </div>
        </div>

        <div>
          {verificationState !== 'IDLE' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 rounded-xl border shadow-premium ${
                verificationState === 'MATCH' ? 'bg-status-verification/10 border-status-verification/30' :
                verificationState === 'NOT_FOUND' ? 'bg-status-danger/10 border-status-danger/30' :
                'bg-surface border-border'
              }`}
            >
              <h3 className="text-[10px] font-bold text-content-primary tracking-[0.2em] uppercase mb-6 text-center">Protocol Results</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-content-muted tracking-widest uppercase mb-2">Calculated Local Hash</p>
                  <div className="bg-background border border-border/50 p-3 rounded font-mono text-[10px] break-all text-content-primary">
                    {calculatedHash || "Calculating..."}
                  </div>
                </div>

                {verificationState === 'MATCH' && doc && (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-status-verification/20 border-2 border-status-verification flex items-center justify-center text-status-verification">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-status-verification tracking-widest uppercase">Match Found & Verified</h2>
                      <p className="text-xs text-content-secondary mt-2">The local file perfectly matches the anchored ledger record for <Link href={`/documents/${doc.id}`} className="font-bold text-content-primary underline">{doc.document_id}</Link>.</p>
                    </div>
                  </div>
                )}

                {verificationState === 'NOT_FOUND' && (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-status-danger/20 border-2 border-status-danger flex items-center justify-center text-status-danger">
                      <Search className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-status-danger tracking-widest uppercase">No Match Found</h2>
                      <p className="text-xs text-content-secondary mt-2">This file's hash does not exist in the ledger. It may be unregistered, tampered, or corrupted.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      
      {verificationState === 'MATCH' && doc && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 bg-surface border border-border rounded-xl shadow-premium overflow-hidden">
          <div className="p-6 border-b border-border bg-elevated/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-content-primary tracking-widest uppercase">Document History & Lifecycle</h3>
              <p className="text-xs text-content-muted mt-1">Immutable audit trail of all changes and custody transfers for <span className="text-content-primary font-bold">{doc.document_id}</span>.</p>
            </div>
            <div className="bg-background border border-border px-3 py-1.5 rounded flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-mono font-bold text-accent">ANCHORED</span>
            </div>
          </div>

          <div className="p-6">
            <div className="relative border-l-2 border-border/50 ml-4 space-y-8">
              
              
              {[
                ...auditLogs.map(log => ({ ...log, type: 'AUDIT', ts: new Date(log.timestamp).getTime() })),
                ...evidenceChain.map(ev => ({ ...ev, type: 'EVIDENCE', ts: new Date(ev.timestamp).getTime() }))
              ]
              .sort((a, b) => b.ts - a.ts) // Sort newest first
              .map((record: any) => {
                if (record.type === 'AUDIT') {
                  const log = record;
                  return (
                    <div key={`audit-${log.id}`} className="relative pl-8">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-surface bg-content-muted"></div>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-1">
                        <div>
                          <span className="inline-block px-2 py-0.5 bg-background border border-border rounded text-[10px] font-mono text-content-primary font-bold mr-3 uppercase">
                            {log.action.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs text-content-secondary">{log.metadata_info?.description || "System action recorded."}</span>
                        </div>
                        <span className="text-[10px] font-mono text-content-muted shrink-0">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono mt-2">
                        <span className="text-content-muted">Performed By:</span>
                        <span className="font-bold text-accent">{log.actor_details?.username || "SYSTEM"}</span>
                        {log.actor_details?.role && (
                          <span className="px-1.5 py-0.5 bg-accent/10 text-accent rounded uppercase text-[8px] tracking-widest">
                            {log.actor_details.role.replace(/_/g, ' ')}
                          </span>
                        )}
                        {log.ip_address && (
                          <>
                            <span className="text-content-muted ml-2">| IP:</span>
                            <span className="text-content-secondary">{log.ip_address}</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                } else {
                  const ev = record;
                  return (
                    <div key={`ev-${ev.id}`} className="relative pl-8">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-surface bg-status-warning"></div>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-1">
                        <div>
                          <span className="inline-block px-2 py-0.5 bg-status-warning/10 border border-status-warning/30 text-status-warning rounded text-[10px] font-mono font-bold mr-3 uppercase">
                            CUSTODY TRANSFER
                          </span>
                          <span className="text-xs text-content-secondary">
                            <span className="font-bold text-content-primary mr-2">Action: {ev.action}</span>
                            {ev.remarks}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-content-muted shrink-0">
                          {new Date(ev.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono mt-2">
                        <span className="text-content-muted">Location:</span>
                        <span className="font-bold text-content-primary">{ev.location || "Unknown"}</span>
                        {ev.blockchain_tx_id && (
                          <>
                            <span className="text-content-muted ml-2">| TX:</span>
                            <span className="text-accent truncate max-w-[200px] inline-block">{ev.blockchain_tx_id}</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                }
              })}

              {auditLogs.length === 0 && evidenceChain.length === 0 && (
                <div className="pl-8 text-xs text-content-muted italic">No history records found for this document.</div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
