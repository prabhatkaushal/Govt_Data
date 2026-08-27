"use client";

import Link from "next/link";

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
        <Link href="/documents" className="hover:text-white transition-colors">Documents</Link>
        <span>/</span>
        <span className="text-slate-200">{params.id}</span>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Network Audit Log - Server 4</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Blockchain Verified
            </span>
          </div>
          <p className="text-slate-400 mt-2 text-sm">Case Reference: <Link href="/cases/CASE-0092" className="text-blue-400 hover:underline">CASE-0092</Link> • Uploaded on Oct 12, 2023</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors border border-slate-700 flex items-center gap-2">
            <span>⬇️</span> Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-[600px]">
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-300">Preview: {params.id}.log</span>
              <span className="text-xs text-slate-500">12.4 MB</span>
            </div>
            <div className="p-4 bg-slate-950 flex-1 overflow-auto text-slate-300 font-mono text-xs leading-relaxed">
              [2023-10-12 04:12:33] INFO: Server boot sequence initiated.<br/>
              [2023-10-12 04:12:35] INFO: Services loaded successfully.<br/>
              [2023-10-12 04:15:01] WARN: Unauthorized access attempt from IP 192.168.1.104.<br/>
              [2023-10-12 04:15:01] ERROR: Auth module failed to validate credentials. Code 401.<br/>
              [2023-10-12 04:15:05] WARN: Multiple failed login attempts (5) detected for user 'admin'.<br/>
              [2023-10-12 04:15:10] CRITICAL: System lockdown engaged by security protocol Alpha.<br/>
              ... (EOF)
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-emerald-900/50 rounded-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-500 text-6xl">⛓️</div>
            <h3 className="text-lg font-medium text-white mb-4 relative z-10">Verification Status</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Signature Valid</p>
                  <p className="text-xs text-slate-400">Signed by SA Smith</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Blockchain Anchored</p>
                  <p className="text-xs text-slate-400">Block #1499201</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500 font-medium mb-1">SHA-256 Hash</p>
              <div className="bg-slate-950 p-2 rounded text-[10px] font-mono text-slate-400 break-all border border-slate-800">
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Version History</h3>
            <div className="relative pl-4 border-l border-slate-800 space-y-6">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-slate-900"></div>
                <p className="text-sm font-medium text-slate-200">v1.0 - Initial Upload</p>
                <p className="text-xs text-slate-400 mt-0.5">Oct 12, 2023, 14:30 EST</p>
                <p className="text-xs text-slate-500 mt-1">Uploaded by Special Agent Smith</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
