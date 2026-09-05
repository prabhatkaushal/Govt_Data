"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { Briefcase, ArrowLeft, Save, ShieldCheck, Upload } from "lucide-react";
import Link from "next/link";

export default function NewCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firFile, setFirFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    case_type: "CRIMINAL",
    priority: "MEDIUM",
    confidentiality_level: "INTERNAL",
    police_station: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firFile) {
      setError("An FIR document is required to register a new case.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/cases/", formData);
      const caseId = res.data.id;

      const docFormData = new FormData();
      docFormData.append('file', firFile);
      docFormData.append('title', `FIR - ${formData.title}`);
      docFormData.append('document_type', 'FIR');
      docFormData.append('case', caseId.toString());
      
      await api.post('/documents/', docFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      router.push(`/cases/${caseId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.response?.data?.title?.[0] || err.response?.data?.error || "Failed to create case and register FIR.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <Link href="/cases" className="p-2 border border-border rounded hover:bg-elevated text-content-muted hover:text-content-primary transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-content-primary tracking-wide uppercase flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-accent" /> New Investigation
            </h1>
            <p className="text-content-muted mt-2 text-xs font-mono tracking-widest uppercase">Register a new case in the system</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-status-danger/10 border border-status-danger/30 rounded text-status-danger text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-surface border border-border rounded-xl p-6 shadow-premium">
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-content-secondary tracking-widest uppercase mb-2">Case Title</label>
            <input 
              required
              type="text" 
              className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm text-content-primary focus:border-accent transition-colors"
              placeholder="e.g. Operation Silk Road"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-content-secondary tracking-widest uppercase mb-2">Description</label>
            <textarea 
              required
              rows={4}
              className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm text-content-primary focus:border-accent transition-colors"
              placeholder="Detailed description of the incident..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-content-secondary tracking-widest uppercase mb-2">Case Type</label>
              <select 
                className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm text-content-primary focus:border-accent transition-colors"
                value={formData.case_type}
                onChange={e => setFormData({...formData, case_type: e.target.value})}
              >
                <option value="CRIMINAL">Criminal</option>
                <option value="CYBER">Cyber</option>
                <option value="FRAUD">Financial Fraud</option>
                <option value="NARCOTICS">Narcotics</option>
                <option value="TERRORISM">Terrorism</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-content-secondary tracking-widest uppercase mb-2">Police Station / Branch</label>
              <input 
                type="text" 
                className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm text-content-primary focus:border-accent transition-colors"
                placeholder="e.g. Central Cyber Cell"
                value={formData.police_station}
                onChange={e => setFormData({...formData, police_station: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-content-secondary tracking-widest uppercase mb-2">Priority</label>
              <select 
                className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm text-content-primary focus:border-accent transition-colors"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-content-secondary tracking-widest uppercase mb-2">Classification</label>
              <select 
                className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm text-content-primary focus:border-accent transition-colors"
                value={formData.confidentiality_level}
                onChange={e => setFormData({...formData, confidentiality_level: e.target.value})}
              >
                <option value="PUBLIC">Public</option>
                <option value="INTERNAL">Internal</option>
                <option value="CONFIDENTIAL">Confidential</option>
                <option value="RESTRICTED">Restricted</option>
                <option value="TOP_SECRET">Top Secret</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border mt-4">
            <label className="block text-xs font-bold text-content-secondary tracking-widest uppercase mb-2">First Information Report (FIR) Document</label>
            <p className="text-[10px] text-content-muted mb-4 uppercase">Upload the official FIR document to register this case. Only one FIR is allowed per case. Additional evidence can be linked later.</p>
            
            <div className="flex flex-col items-center gap-4">
              {firFile ? (
                <div className="w-full bg-background border border-border rounded p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm font-bold text-content-primary truncate max-w-[300px]">{firFile.name}</p>
                      <p className="text-[10px] font-mono text-content-muted uppercase">{(firFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setFirFile(null)} className="text-[10px] text-status-danger font-bold uppercase hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <label className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
                  <Upload className="w-6 h-6 text-content-muted mb-3" />
                  <span className="text-[10px] font-bold tracking-widest text-accent uppercase">Select FIR Document</span>
                  <input type="file" required className="sr-only" onChange={e => {
                    if (e.target.files?.[0]) setFirFile(e.target.files[0]);
                  }} />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-content-muted text-[10px] font-mono uppercase">
            <ShieldCheck className="w-3.5 h-3.5" /> All activities are logged
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded text-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Register Case
          </button>
        </div>
      </form>
    </div>
  );
}
