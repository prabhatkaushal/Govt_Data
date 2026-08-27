"use client";

import Link from "next/link";
import { useState } from "react";

export default function DocumentUploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
        <Link href="/documents" className="hover:text-white transition-colors">Documents</Link>
        <span>/</span>
        <span className="text-slate-200">Upload</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Upload Document</h1>
        <p className="text-slate-400 mt-1">Submit new evidence or documentation for secure processing and hashing.</p>
      </div>

      <form className="bg-slate-900 border border-slate-800 rounded-lg p-8 space-y-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Document Title</label>
            <input 
              type="text" 
              placeholder="e.g. Server Audit Log"
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Document Type</label>
            <select className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option value="">Select type...</option>
              <option value="log">Log File</option>
              <option value="report">Report (PDF)</option>
              <option value="media">Media / Video</option>
              <option value="transcript">Transcript</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Associated Case (Optional)</label>
            <select className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option value="">Select a case...</option>
              <option value="CASE-0092">CASE-0092: Operation Northern Light</option>
              <option value="CASE-0091">CASE-0091: Cybercom Audit Q3</option>
              <option value="CASE-0089">CASE-0089: Vendor Risk Assessment</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Confidentiality Level</label>
            <select className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option value="unclassified">Unclassified</option>
              <option value="confidential">Confidential</option>
              <option value="secret">Secret</option>
              <option value="top_secret">Top Secret</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">File Upload</label>
          <div 
            className={`mt-2 flex justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${
              isDragging ? "border-blue-500 bg-blue-900/20" : "border-slate-700 bg-slate-950/50"
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
              <span className="mx-auto flex h-12 w-12 items-center justify-center text-4xl mb-4">
                {file ? "📄" : "📥"}
              </span>
              <div className="mt-4 flex text-sm leading-6 text-slate-400 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-semibold text-blue-500 focus-within:outline-none hover:text-blue-400"
                >
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-slate-500 mt-2">
                {file ? `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` : "Any file up to 50MB"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Remarks / Chain of Custody Note</label>
          <textarea 
            rows={4}
            placeholder="Provide any additional context or remarks about this document's acquisition..."
            className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
          <Link href="/documents" className="px-6 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Cancel
          </Link>
          <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-md text-sm font-medium transition-colors shadow-sm">
            Secure Upload & Hash
          </button>
        </div>
      </form>
    </div>
  );
}
