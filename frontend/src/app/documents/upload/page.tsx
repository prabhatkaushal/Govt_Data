"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, UploadCloud, File, AlertCircle, ShieldCheck } from "lucide-react";

export default function DocumentUploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in-up">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
        <Link href="/documents" className="hover:text-blue-400 transition-colors">VAULT</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-200">UPLOAD</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          Secure Upload
        </h1>
        <p className="text-slate-400 mt-2 text-sm">Submit new evidence. All uploads are hashed via SHA-256 and anchored to the blockchain.</p>
      </div>

      <form className="glass-panel rounded-xl p-8 space-y-8 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Document Title</label>
            <input 
              type="text" 
              placeholder="e.g. Server Audit Log"
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Document Type</label>
            <select className="w-full bg-slate-950/60 border border-slate-700/80 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none">
              <option value="">Select classification...</option>
              <option value="log">Log File</option>
              <option value="report">Report (PDF)</option>
              <option value="media">Media / Video</option>
              <option value="transcript">Transcript</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Associated Case</label>
            <select className="w-full bg-slate-950/60 border border-slate-700/80 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none">
              <option value="">Link to case (Optional)...</option>
              <option value="CASE-0092">CASE-0092: Operation Northern Light</option>
              <option value="CASE-0091">CASE-0091: Cybercom Audit Q3</option>
              <option value="CASE-0089">CASE-0089: Vendor Risk Assessment</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Clearance Level</label>
            <select className="w-full bg-slate-950/60 border border-slate-700/80 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none">
              <option value="unclassified">Unclassified</option>
              <option value="confidential">Confidential</option>
              <option value="secret">Secret</option>
              <option value="top_secret">Top Secret</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 relative z-10">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex justify-between">
            <span>Evidence Upload</span>
            <span className="text-slate-500">Max 50MB</span>
          </label>
          <div 
            className={`mt-2 flex flex-col justify-center items-center rounded-xl border-2 border-dashed px-6 py-12 transition-all duration-300 ${
              isDragging ? "border-blue-500 bg-blue-900/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]" : "border-slate-700/80 bg-slate-950/40 hover:bg-slate-900/60 hover:border-slate-600"
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
            <div className="text-center flex flex-col items-center">
              <div className={`p-4 rounded-full mb-4 transition-colors ${file ? 'bg-emerald-900/30 text-emerald-500' : 'bg-slate-800 text-slate-400'}`}>
                {file ? <File className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
              </div>
              <div className="flex text-sm leading-6 text-slate-400 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-semibold text-blue-400 hover:text-blue-300 focus-within:outline-none"
                >
                  <span>Select a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-slate-500 mt-2 font-mono">
                {file ? `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` : "Supported formats: PDF, LOG, DOCX, MP4"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 relative z-10">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            Chain of Custody Remarks <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
          </label>
          <textarea 
            rows={3}
            placeholder="Provide context regarding the acquisition of this evidence..."
            className="w-full bg-slate-950/60 border border-slate-700/80 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-500 resize-none"
          ></textarea>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-slate-800/80 relative z-10">
          <Link href="/documents" className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
            Cancel
          </Link>
          <button 
            type="button" 
            onClick={async () => {
              if (!file) return alert("Please select a file to upload.");
              setIsSubmitting(true);
              await new Promise(res => setTimeout(res, 1500));
              router.push('/documents');
            }}
            disabled={isSubmitting || !file}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center gap-2 group"
          >
            {isSubmitting ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Encrypting...</>
            ) : (
              <><ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" /> Sign & Upload</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
