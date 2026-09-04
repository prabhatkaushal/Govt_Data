import Link from "next/link";
import { Upload, File, Activity, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface DocumentUploadFormProps {
  handleUpload: (e: React.FormEvent) => Promise<void>;
  isDragging: boolean;
  setIsDragging: (val: boolean) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  title: string;
  setTitle: (val: string) => void;
  documentType: string;
  setDocumentType: (val: string) => void;
  caseId: string;
  setCaseId: (val: string) => void;
  confidentiality: string;
  setConfidentiality: (val: string) => void;
  remarks: string;
  setRemarks: (val: string) => void;
  uploadState: 'IDLE' | 'UPLOADING' | 'VALIDATING' | 'HASHING' | 'COMPLETE';
  itemVariants: any;
}

export default function DocumentUploadForm({
  handleUpload,
  isDragging,
  setIsDragging,
  file,
  setFile,
  title,
  setTitle,
  documentType,
  setDocumentType,
  caseId,
  setCaseId,
  confidentiality,
  setConfidentiality,
  remarks,
  setRemarks,
  uploadState,
  itemVariants
}: DocumentUploadFormProps) {
  return (
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
                <button type="button" onClick={() => setFile(null)} className="text-[10px] text-status-danger hover:text-red-300 mt-4 font-bold uppercase tracking-widest border-b border-transparent hover:border-status-danger transition-all">
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
            <option value="EVIDENCE">Evidence</option>
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
                  level === 'TOP_SECRET' ? 'text-status-danger' : level === 'CONFIDENTIAL' ? 'text-accent' : 'text-content-muted'
                }`}>{level.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3 md:col-span-2">
          <label className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase">Description / Remarks (Optional)</label>
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
  );
}
