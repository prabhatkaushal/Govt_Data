"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";
import DocumentUploadForm from "@/components/features/documents/DocumentUploadForm";
import SecurityProtocolPanel from "@/components/features/documents/SecurityProtocolPanel";
import { useAuth } from "@/context/AuthContext";

export default function DocumentUploadPage() {
  const { isInvestigator } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledCase = searchParams.get("caseId") || "";

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [caseId, setCaseId] = useState(prefilledCase);
  const [confidentiality, setConfidentiality] = useState("CONFIDENTIAL");
  const [remarks, setRemarks] = useState("");
  
  useEffect(() => {
    if (prefilledCase) {
      setCaseId(prefilledCase);
    }
  }, [prefilledCase]);
  
  const [uploadState, setUploadState] = useState<'IDLE' | 'UPLOADING' | 'VALIDATING' | 'HASHING' | 'COMPLETE'>('IDLE');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInvestigator) return alert("Only Investigators have the authority to upload documents.");
    if (!file) return alert("Please select a file");

    const doUpload = async (replace = false) => {
      setUploadState('UPLOADING');
      
      setTimeout(() => setUploadState('VALIDATING'), 200);
      setTimeout(() => setUploadState('HASHING'), 400);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("document_type", documentType);
      if (caseId) formData.append("case", caseId);
      formData.append("confidentiality_level", confidentiality);
      formData.append("remarks", remarks);
      if (replace) formData.append("replace", "true");

      try {
        await api.post("/documents/", formData);
        setUploadState('COMPLETE');
        setTimeout(() => router.push("/documents"), 400);
      } catch (err: any) {
        if (err.response?.status === 409 && err.response?.data?.code === "DUPLICATE_NAME") {
          const wantReplace = window.confirm("A document with this exact file name already exists. Do you want to replace it?");
          if (wantReplace) {
            doUpload(true);
            return;
          } else {
            setUploadState('IDLE');
            return;
          }
        }
        console.error("Upload failed", err);
        alert("Failed to upload document");
        setUploadState('IDLE');
      }
    };

    await doUpload();
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
        <DocumentUploadForm 
          handleUpload={handleUpload}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          file={file}
          setFile={setFile}
          title={title}
          setTitle={setTitle}
          documentType={documentType}
          setDocumentType={setDocumentType}
          caseId={caseId}
          setCaseId={setCaseId}
          confidentiality={confidentiality}
          setConfidentiality={setConfidentiality}
          remarks={remarks}
          setRemarks={setRemarks}
          uploadState={uploadState}
          itemVariants={itemVariants}
        />

        <SecurityProtocolPanel 
          uploadState={uploadState} 
          itemVariants={itemVariants} 
        />
      </div>
    </motion.div>
  );
}
