import Link from "next/link";

interface DocumentItem {
  id: string;
  title: string;
  type: string;
  caseId: string;
  uploadedBy: string;
  date: string;
  verified: boolean;
}

const mockDocs: DocumentItem[] = [
  { id: "DOC-8821", title: "Network Audit Log - Server 4", type: "Log File", caseId: "CASE-0092", uploadedBy: "Special Agent Smith", date: "2023-10-12", verified: true },
  { id: "DOC-8819", title: "Suspect Interview Transcript", type: "Transcript", caseId: "CASE-0085", uploadedBy: "Jane Doe", date: "2023-09-30", verified: true },
  { id: "DOC-8799", title: "Malware Analysis Report", type: "PDF Report", caseId: "CASE-0092", uploadedBy: "System", date: "2023-10-13", verified: true },
  { id: "DOC-8795", title: "CCTV Footage Extracts", type: "Media", caseId: "CASE-0091", uploadedBy: "Special Agent Smith", date: "2023-10-11", verified: false },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Documents</h1>
          <p className="text-slate-400 mt-1">Secure document vault with blockchain verification.</p>
        </div>
        <Link href="/documents/upload" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          + Upload Document
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex gap-4">
          <input 
            type="text" 
            placeholder="Search documents by ID, title or case..." 
            className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4 font-medium">Doc ID</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Case Ref</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                    <Link href={`/documents/${doc.id}`}>{doc.id}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">
                        {doc.type.includes('Log') ? '📝' : doc.type.includes('PDF') ? '📄' : doc.type.includes('Media') ? '🎬' : '📋'}
                      </span>
                      {doc.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    <Link href={`/cases/${doc.caseId}`} className="hover:text-blue-400 transition-colors">{doc.caseId}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doc.verified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900/30 text-amber-400 border border-amber-800">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Processing
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{doc.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/documents/${doc.id}`} className="text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
