"use client";

import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { 
  Upload, FileText, ShieldCheck, Lock, 
  Activity, CheckCircle, File, Info
} from "lucide-react";
import { motion } from "framer-motion";

export default function DocumentUploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [caseId, setCaseId] = useState("");
  const [confidentiality, setConfidentiality] = useState("CONFIDENTIAL");
  const [remarks, setRemarks] = useState("");
  
  const [uploadState, setUploadState] = useState<'IDLE' | 'UPLOADING' | 'VALIDATING' | 'HASHING' | 'COMPLETE'>('IDLE');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    setUploadState('UPLOADING');
    
    setTimeout(() => setUploadState('VALIDATING'), 1000);
    setTimeout(() => setUploadState('HASHING'), 2500);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("document_type", documentType);
    if (caseId) formData.append("case", caseId);
    formData.append("confidentiality_level", confidentiality);
    formData.append("remarks", remarks);

    try {
      await api.post("/documents/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setTimeout(() => {
        setUploadState('COMPLETE');
        setTimeout(() => router.push("/documents"), 1000);
      }, 4000); 
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload document");
      setUploadState('IDLE');
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
      className="space-y-8 max-w-[1200px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3 text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase mb-[-1rem]">
        <Link href="/documents" className="hover:text-content-primary transition-colors">Documents</Link>
        <span>/</span>
        <span className="text-content-primary">Upload</span>
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-start gap-4 pb-6 border-b border-border">
        <div className="w-12 h-12 rounded bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-content-primary tracking-wide uppercase">Secure Document Ingestion</h1>
          <p className="text-content-muted mt-2 text-xs font-mono tracking-widest uppercase">All files are cryptographically hashed and anchored.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* FORM */}
        <motion.form variants={itemVariants} onSubmit={handleUpload} className="xl:col-span-2 space-y-8">
            
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase">Document File</label>
              <span className="text-[10px] text-content-muted font-mono tracking-widest uppercase">MAX 50MB</span>
            </div>
            
            <div 
              className={`relative flex flex-col items-center justify-center rounded border-2 border-dashed px-6 py-16 transition-all duration-300 ${
                isDragging ? "border-accent bg-accent/5" : 
                file ? "border-status-verification/50 bg-status-verification/5" : "border-border bg-surface/30 hover:bg-surface/50 hover:border-border-hover"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  setFile(e.dataTransfer.files[0]);
                }
              }}
            >
              <div className="text-center">
                {file ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-status-verification/10 text-status-verification rounded-full flex items-center justify-center border border-status-verification/20">
                      <File className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-content-primary font-bold tracking-wide">{file.name}</p>
                      <p className="text-[10px] font-mono text-content-muted mt-2 uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'UNKNOWN'}</p>
                    </div>
                    <button type="button" onClick={() => setFile(null)} className="text-[10px] text-status-critical hover:text-red-300 mt-4 font-bold uppercase tracking-widest border-b border-transparent hover:border-status-critical transition-all">
                      Remove File
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-background border border-border text-content-muted rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="mt-2 flex text-sm text-content-muted justify-center items-center gap-2">
                      <label className="relative cursor-pointer rounded font-bold text-accent hover:text-accent-hover uppercase tracking-widest text-[10px] bg-accent/10 px-4 py-2 border border-accent/20 transition-colors">
                        <span>Browse Files</span>
                        <input type="file" required className="sr-only" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                      </label>
                      <p className="text-xs font-medium tracking-wide">or drag and drop here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase">Document Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Witness Statement - John Doe"
                className="w-full bg-surface border border-border rounded px-4 py-3 text-sm text-content-primary placeholder-content-muted focus:border-accent/50 focus:bg-elevated transition-colors"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase">Case Link (Optional)</label>
              <input 
                type="text" 
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                placeholder="e.g. CASE-2026-0142"
                className="w-full bg-surface border border-border rounded px-4 py-3 text-sm text-content-primary placeholder-content-muted focus:border-accent/50 focus:bg-elevated transition-colors font-mono"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase">Document Type</label>
              <select 
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                required
                className="w-full bg-surface border border-border rounded px-4 py-3 text-sm text-content-primary focus:border-accent/50 focus:bg-elevated transition-colors appearance-none"
              >
                <option value="">Select type...</option>
                <option value="FIR">FIR (First Information Report)</option>
                <option value="POLICE_REPORT">Police Report</option>
                <option value="WITNESS_STATEMENT">Witness Statement</option>
                <option value="CHARGE_SHEET">Charge Sheet</option>
                <option value="FORENSIC_REPORT">Forensic Report</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase">Confidentiality Classification</label>
              <div className="grid grid-cols-3 gap-4">
                {['UNCLASSIFIED', 'CONFIDENTIAL', 'TOP_SECRET'].map(level => (
                  <label key={level} className={`flex items-center justify-center gap-3 p-4 rounded border cursor-pointer transition-colors ${
                    confidentiality === level ? 'bg-surface border-content-secondary' : 'bg-transparent border-border hover:border-content-muted'
                  }`}>
                    <input type="radio" name="confidentiality" value={level} checked={confidentiality === level} onChange={() => setConfidentiality(level)} className="sr-only" />
                    <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${
                      level === 'TOP_SECRET' ? 'text-status-critical' : level === 'CONFIDENTIAL' ? 'text-accent' : 'text-content-muted'
                    }`}>{level.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase">Chain of Custody Remarks</label>
              <textarea 
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Optional notes regarding origin or context..."
                className="w-full bg-surface border border-border rounded px-4 py-3 text-sm text-content-primary placeholder-content-muted focus:border-accent/50 focus:bg-elevated transition-colors resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-border">
            <Link href="/documents" className="px-6 py-3 rounded text-[10px] font-bold text-content-muted hover:text-content-primary hover:bg-surface transition-colors uppercase tracking-widest">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={uploadState !== 'IDLE' || !file} 
              className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-premium hover:shadow-premium disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-3"
            >
              {uploadState !== 'IDLE' ? (
                <><Activity className="w-4 h-4 animate-spin" /> Processing</>
              ) : (
                <><ShieldCheck className="w-4 h-4" /> Initialize Upload</>
              )}
            </button>
          </div>
        </motion.form>

        {/* SIDEBAR INFOPANEL */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-surface/30 border border-border/50 rounded p-6">
            <h3 className="text-[10px] font-bold text-content-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-accent" /> Security Protocol
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-3.5 h-3.5 text-status-verification shrink-0 mt-0.5" />
                <span className="text-xs text-content-secondary leading-relaxed">All uploads are cryptographically hashed (SHA-256) upon receipt.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-3.5 h-3.5 text-status-verification shrink-0 mt-0.5" />
                <span className="text-xs text-content-secondary leading-relaxed">Actions are permanently anchored in the immutable audit trail.</span>
              </li>
              <li className="flex items-start gap-3">
                <Lock className="w-3.5 h-3.5 text-status-warning shrink-0 mt-0.5" />
                <span className="text-xs text-content-secondary leading-relaxed">Top Secret documents trigger immediate supervisor alerts.</span>
              </li>
            </ul>
          </div>

          {uploadState !== 'IDLE' && (
            <div className="bg-surface/30 border border-border/50 rounded p-6">
              <h3 className="text-[10px] font-bold text-content-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-accent" /> Processing Pipeline
              </h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className={`w-1.5 h-1.5 rounded-full ${uploadState === 'UPLOADING' ? 'bg-accent animate-ping' : 'bg-status-verification'}`} />
                  <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${uploadState === 'UPLOADING' ? 'text-accent' : 'text-status-verification'}`}>
                    1. SECURE TRANSFER
                  </span>
                </div>
                <div className="flex items-center gap-4 opacity-50">
                  <div className={`w-1.5 h-1.5 rounded-full ${uploadState === 'VALIDATING' ? 'bg-accent animate-ping' : uploadState === 'HASHING' || uploadState === 'COMPLETE' ? 'bg-status-verification' : 'bg-content-muted'}`} />
                  <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${uploadState === 'VALIDATING' ? 'text-accent opacity-100' : uploadState === 'HASHING' || uploadState === 'COMPLETE' ? 'text-status-verification opacity-100' : 'text-content-muted'}`}>
                    2. FILE VALIDATION
                  </span>
                </div>
                <div className="flex items-center gap-4 opacity-50">
                  <div className={`w-1.5 h-1.5 rounded-full ${uploadState === 'HASHING' ? 'bg-accent animate-ping' : uploadState === 'COMPLETE' ? 'bg-status-verification' : 'bg-content-muted'}`} />
                  <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${uploadState === 'HASHING' ? 'text-accent opacity-100' : uploadState === 'COMPLETE' ? 'text-status-verification opacity-100' : 'text-content-muted'}`}>
                    3. GENERATING HASH
                  </span>
                </div>
                <div className="flex items-center gap-4 opacity-50">
                  <div className={`w-1.5 h-1.5 rounded-full ${uploadState === 'COMPLETE' ? 'bg-status-verification' : 'bg-content-muted'}`} />
                  <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${uploadState === 'COMPLETE' ? 'text-status-verification opacity-100' : 'text-content-muted'}`}>
                    4. INDEXED TO VAULT
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
