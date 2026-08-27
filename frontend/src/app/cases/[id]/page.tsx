"use client";

import { useState } from "react";
import Link from "next/link";

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = ["Overview", "Documents", "Evidence", "Timeline"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
        <Link href="/cases" className="hover:text-white transition-colors">Cases</Link>
        <span>/</span>
        <span className="text-slate-200">{params.id}</span>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">{params.id}</h1>
            <span className="bg-red-900/50 text-red-400 px-2 py-0.5 rounded text-xs font-bold border border-red-800">
              TOP SECRET
            </span>
            <span className="bg-emerald-900/30 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-medium border border-emerald-800">
              Active
            </span>
          </div>
          <p className="text-slate-400 mt-2 text-lg">Operation Northern Light</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors border border-slate-700">
            Edit Case
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <div className="border-b border-slate-800">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-4">
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Case Summary</h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Operation Northern Light focuses on the investigation of unauthorized access attempts originating from advanced persistent threat (APT) actors targeting critical infrastructure sub-networks. Initial detection occurred on Oct 12, 2023. Currently gathering telemetry and isolating affected nodes.
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Personnel</h3>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center text-blue-400 font-bold text-xs">SA</div>
                      <span className="text-slate-200">Special Agent Smith</span>
                    </div>
                    <span className="text-slate-500">Lead Investigator</span>
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-900 flex items-center justify-center text-purple-400 font-bold text-xs">JD</div>
                      <span className="text-slate-200">Jane Doe</span>
                    </div>
                    <span className="text-slate-500">Cyber Analyst</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Metadata</h3>
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="text-slate-500 font-medium">Opened Date</dt>
                    <dd className="text-slate-200 mt-1">October 12, 2023</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 font-medium">Primary Agency</dt>
                    <dd className="text-slate-200 mt-1">CISA</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 font-medium">Reference IDs</dt>
                    <dd className="text-slate-200 mt-1 font-mono text-xs">REF-2023-A91B</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Documents" && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center py-12">
            <span className="text-4xl">📄</span>
            <h3 className="text-lg font-medium text-white mt-4">No documents yet</h3>
            <p className="text-slate-400 text-sm mt-1 mb-4">Upload documents related to this case to track them securely.</p>
            <Link href="/documents/upload" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-block">
              Upload Document
            </Link>
          </div>
        )}
        
        {activeTab === "Evidence" && (
           <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center py-12 text-slate-400">
             Evidence module tracking loaded. No items to display.
           </div>
        )}

        {activeTab === "Timeline" && (
           <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center py-12 text-slate-400">
             Timeline module loaded. No events recorded.
           </div>
        )}
      </div>
    </div>
  );
}
