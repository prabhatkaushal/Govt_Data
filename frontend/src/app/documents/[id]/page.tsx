"use client";

import { useState } from "react";
import DocumentDetailView from "@/components/features/documents/DocumentDetailView";

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("Details");
  const tabs = ["Details", "Blockchain Trace", "Versions"];
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    await new Promise(res => setTimeout(res, 1500));
    setIsVerifying(false);
    setVerified(true);
  };

  return (
    <DocumentDetailView
      id={params.id}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={tabs}
      isVerifying={isVerifying}
      verified={verified}
      handleVerify={handleVerify}
    />
  );
}
