"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/services/api";
import { ChevronRight, ShieldCheck, Clock, FileText, Link as LinkIcon, Hash } from "lucide-react";

export default function EvidenceDetailPage({ params }: { params: { id: string } }) {
  const [evidenceEvent, setEvidenceEvent] = useState<any>(null);
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const evRes = await api.get(`/evidence/${params.id}/`);
        setEvidenceEvent(evRes.data);
        if (evRes.data.document) {
           const docRes = await api.get(`/documents/${evRes.data.document}/`);
           setDocument(docRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center text-content-muted">Loading...</div>;
  if (!evidenceEvent) return <div className="p-8 text-center text-status-danger">Evidence event not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-2 text-xs font-mono text-content-muted mb-4 uppercase tracking-[0.2em]">
        <Link href="/evidence" className="hover:text-accent transition-colors">Evidence</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-content-primary">EV-{params.id}</span>
      </div>

      <div className="border-b border-border pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-content-primary tracking-tight font-mono mb-2">Custody Event #{params.id}</h1>
          <p className="text-content-secondary tracking-wide uppercase text-sm font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-status-verification" /> {evidenceEvent.action}
          </p>
        </div>
        <div className="text-right">
          <div className="bg-background border border-border px-3 py-1.5 rounded inline-block text-[10px] font-mono text-content-muted mb-1">
            TX: {evidenceEvent.blockchain_tx_id || "PENDING"}
          </div>
          <p className="text-xs text-content-muted">{new Date(evidenceEvent.timestamp).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-surface border border-border p-6 rounded-xl shadow-premium">
            <h3 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" /> Event Details
            </h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-[10px] font-bold text-content-muted uppercase tracking-widest">Location</dt>
                <dd className="text-content-primary text-sm mt-1">{evidenceEvent.location}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold text-content-muted uppercase tracking-widest">Comments</dt>
                <dd className="text-content-primary text-sm mt-1">{evidenceEvent.comments || "No comments provided."}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold text-content-muted uppercase tracking-widest">Previous Hash</dt>
                <dd className="text-content-primary text-[10px] font-mono mt-1 break-all bg-background border border-border/50 p-2 rounded">
                  {evidenceEvent.previous_hash || "GENESIS BLOCK"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          {document && (
            <div className="bg-surface border border-border p-6 rounded-xl shadow-premium">
              <h3 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" /> Associated Evidence Item
              </h3>
              <div className="space-y-4">
                <div>
                  <dt className="text-[10px] font-bold text-content-muted uppercase tracking-widest">Item Name</dt>
                  <dd className="text-content-primary font-bold text-sm mt-1">{document.title}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-content-muted uppercase tracking-widest">Current Hash</dt>
                  <dd className="text-content-primary text-[10px] font-mono mt-1 break-all bg-background border border-border/50 p-2 rounded text-status-verification">
                    {document.sha256_hash}
                  </dd>
                </div>
                <Link href={`/documents/${document.id}`} className="mt-4 inline-flex items-center gap-2 bg-background border border-border hover:border-accent hover:text-accent px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-colors w-full justify-center">
                  <LinkIcon className="w-3.5 h-3.5" /> View Full Record
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
