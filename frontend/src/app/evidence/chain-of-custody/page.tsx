"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { ChevronRight, Link as LinkIcon, RefreshCw, ShieldCheck, MapPin, AlignLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ChainOfCustodyPage() {
  const router = useRouter();
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    document: "",
    action: "TRANSFERRED",
    location: "",
    comments: "",
  });

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        // Here we just fetch all documents that could be evidence to attach to the chain
        const docRes = await api.get('/documents/');
        setEvidenceList(docRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvidence();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.document) return alert("Select an evidence item.");
    
    try {
      const res = await api.post('/evidence/', {
        ...formData,
      });
      router.push(`/evidence/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to record custody transfer.");
    }
  };

  if (loading) return <div className="p-8 text-center text-content-muted">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-2 text-xs font-mono text-content-muted mb-4 uppercase tracking-[0.2em]">
        <Link href="/evidence" className="hover:text-accent transition-colors">Evidence</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-content-primary">Chain of Custody</span>
      </div>

      <div className="border-b border-border pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-content-primary tracking-tight font-mono mb-2">Record Custody Transfer</h1>
          <p className="text-content-secondary tracking-wide uppercase text-sm font-bold flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-accent" /> Log Physical or Digital Handoff
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-border p-8 rounded-xl shadow-premium space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase">Select Evidence Item</label>
          <select 
            required
            value={formData.document}
            onChange={e => setFormData({...formData, document: e.target.value})}
            className="w-full bg-background border border-border rounded px-4 py-3 text-sm text-content-primary focus:border-accent/50 focus:bg-elevated transition-colors appearance-none"
          >
            <option value="">-- Choose Item --</option>
            {evidenceList.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.title} ({doc.document_id})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase">Action Type</label>
          <select 
            required
            value={formData.action}
            onChange={e => setFormData({...formData, action: e.target.value})}
            className="w-full bg-background border border-border rounded px-4 py-3 text-sm text-content-primary focus:border-accent/50 focus:bg-elevated transition-colors appearance-none"
          >
            <option value="COLLECTED">COLLECTED</option>
            <option value="TRANSFERRED">TRANSFERRED</option>
            <option value="ANALYZED">ANALYZED (Forensics)</option>
            <option value="COURT_SUBMISSION">COURT SUBMISSION</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> Transfer Location
          </label>
          <input 
            type="text" 
            required
            placeholder="e.g. Cyber Cell HQ Evidence Room A"
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
            className="w-full bg-background border border-border rounded px-4 py-3 text-sm text-content-primary focus:border-accent/50 focus:bg-elevated transition-colors"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase flex items-center gap-2">
            <AlignLeft className="w-3.5 h-3.5" /> Details / Handover Notes
          </label>
          <textarea 
            rows={4}
            placeholder="Document condition, recipient authority..."
            value={formData.comments}
            onChange={e => setFormData({...formData, comments: e.target.value})}
            className="w-full bg-background border border-border rounded px-4 py-3 text-sm text-content-primary focus:border-accent/50 focus:bg-elevated transition-colors resize-none"
          />
        </div>

        <div className="pt-6 border-t border-border flex items-center justify-between">
          <div className="text-[10px] font-mono text-status-verification flex items-center gap-2 uppercase tracking-widest bg-status-verification/10 px-3 py-1.5 rounded border border-status-verification/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Will be cryptographically anchored
          </div>
          <button 
            type="submit" 
            className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-premium hover:shadow-premium flex items-center gap-3"
          >
            Record Transfer
          </button>
        </div>
      </form>
    </div>
  );
}
