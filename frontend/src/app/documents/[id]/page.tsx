"use client";

import { useState, useEffect } from "react";
import DocumentDetailView from "@/components/features/documents/DocumentDetailView";
import api from "@/lib/api";

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("Details");
  const tabs = ["Details", "Blockchain Trace", "Versions"];
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [docData, setDocData] = useState<any>(null);
  const [fullText, setFullText] = useState<string | null>(null);
  const [isLoadingText, setIsLoadingText] = useState(false);

  useEffect(() => {
    api.get(`/documents/${params.id}/`).then(res => setDocData(res.data)).catch(console.error);
  }, [params.id]);

  useEffect(() => {
    if (docData) {
      setIsLoadingText(true);
      fetch(`http://localhost:8001/document-text/?document_id=${docData.document_id}`)
        .then(res => res.json())
        .then(data => setFullText(data.text))
        .catch(() => setFullText("Failed to load text."))
        .finally(() => setIsLoadingText(false));
    }
  }, [docData]);

  const handleVerify = async () => {
    setIsVerifying(true);
    await new Promise(res => setTimeout(res, 1500));
    setIsVerifying(false);
    setVerified(true);
  };

  const handleSummarize = async () => {
    if (!docData) return;
    setIsSummarizing(true);
    try {
      const res = await fetch(`http://localhost:8001/summarize/?document_id=${docData.document_id}`);
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setSummary("Error connecting to AI service.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <DocumentDetailView
      id={docData ? docData.document_id : params.id}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={tabs}
      isVerifying={isVerifying}
      verified={verified}
      handleVerify={handleVerify}
      summary={summary}
      isSummarizing={isSummarizing}
      handleSummarize={handleSummarize}
      fullText={fullText}
      isLoadingText={isLoadingText}
    />
  );
}
