import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, ShieldCheck, AlertCircle, Trash2, Activity, RefreshCw } from "lucide-react";

export interface DocumentItem {
  id: string;
  document_id: string;
  title: string;
  document_type: string;
  case: string;
  uploaded_by: {
    username: string;
  };
  created_at: string;
  status: string;
}

interface DocumentListTableProps {
  documents: DocumentItem[];
  loading: boolean;
  isLawyer: boolean;
  handleVerify: (id: string) => Promise<void>;
  handleDelete: (id: string) => void;
  handleReplace: (id: string) => void;
}

export default function DocumentListTable({ documents, loading, isLawyer, handleVerify, handleDelete, handleReplace }: DocumentListTableProps) {
  const router = useRouter();
  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-content-muted font-mono tracking-[0.2em] text-[10px] uppercase">Retrieving Records</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded">
          <FileText className="w-8 h-8 text-content-muted mb-4 opacity-50" />
          <p className="text-content-secondary font-medium text-sm">No documents found.</p>
        </div>
      ) : (
        <div className="border border-border rounded bg-surface overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-elevated/50 text-[10px] font-bold uppercase tracking-[0.15em] text-content-muted">
                <th className="px-6 py-4 font-normal">Document</th>
                <th className="px-6 py-4 font-normal">Case Ref</th>
                <th className="px-6 py-4 font-normal">Type</th>
                <th className="px-6 py-4 font-normal">Integrity</th>
                <th className="px-6 py-4 font-normal">Timestamp</th>
                <th className="px-6 py-4 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {documents.map((doc) => (
                <tr key={doc.id} className="group hover:bg-elevated transition-colors cursor-pointer relative">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/documents/${doc.id}`} className="absolute inset-0" />
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center text-content-muted group-hover:border-accent group-hover:text-accent transition-colors">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-content-primary tracking-wide">{doc.title}</p>
                        <p className="text-[10px] font-mono text-content-muted mt-1">{doc.document_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 bg-background border border-border rounded text-[10px] font-mono text-accent">
                      {doc.case}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[10px] font-bold tracking-widest text-content-secondary uppercase">
                    {doc.document_type?.replace(/_/g, ' ') || 'OTHER'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doc.status === 'ACTIVE' || doc.status === 'VERIFIED' ? (
                      <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] text-[9px] font-bold tracking-widest bg-status-verification/10 text-status-verification border border-status-verification/20 uppercase">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] text-[9px] font-bold tracking-widest bg-status-warning/10 text-status-warning border border-status-warning/20 uppercase">
                        <AlertCircle className="w-3 h-3" /> PENDING
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-content-muted font-mono">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right z-10 relative">
                    <div className="flex justify-end items-center gap-1">
                      {isLawyer && doc.status !== 'ACTIVE' && (
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleVerify(doc.id); }} className="text-status-verification hover:text-white transition-colors bg-status-verification/10 hover:bg-status-verification px-3 py-1 rounded text-xs mr-2">
                          Verify
                        </button>
                      )}
                      <button 
                        title="Generate Summary"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/documents/${doc.id}`); }} 
                        className="p-1.5 rounded text-content-muted hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all"
                      >
                        <Activity className="w-4 h-4" />
                      </button>
                      <button 
                        title="Replace File"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleReplace(doc.id); }} 
                        className="p-1.5 rounded text-content-muted hover:text-accent hover:bg-accent/10 transition-all"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button 
                        title="Delete"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(doc.id); }} 
                        className="p-1.5 rounded text-content-muted hover:text-status-critical hover:bg-status-critical/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
