import Link from "next/link";
import { ChevronRight, Briefcase } from "lucide-react";

export interface Case {
  id: string;
  case_number: string;
  title: string;
  status: string;
  confidentiality_level: string;
  created_at: string;
  updated_at?: string;
  lead_investigator?: any;
}

interface CaseListTableProps {
  cases: Case[];
  loading: boolean;
}

export function CaseListTable({ cases, loading }: CaseListTableProps) {
  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-content-muted font-mono tracking-[0.2em] text-[10px] uppercase">Retrieving Records</p>
        </div>
      ) : cases.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded">
          <Briefcase className="w-8 h-8 text-content-muted mb-4 opacity-50" />
          <p className="text-content-secondary font-medium text-sm">No cases match the current filters.</p>
        </div>
      ) : (
        <div className="border border-border rounded bg-surface overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-elevated/50 text-[10px] font-bold uppercase tracking-[0.15em] text-content-muted">
                <th className="px-6 py-4 font-normal">Case ID</th>
                <th className="px-6 py-4 font-normal">Title</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Classification</th>
                <th className="px-6 py-4 font-normal">Officer</th>
                <th className="px-6 py-4 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {cases.map((c) => (
                <tr key={c.id} className="group hover:bg-elevated transition-colors cursor-pointer relative">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold font-mono text-accent">
                    <Link href={`/cases/${c.id}`} className="absolute inset-0" />
                    {c.case_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-content-primary font-medium tracking-wide">
                    {c.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[9px] font-bold tracking-widest border ${
                      c.status === 'UNDER_INVESTIGATION' ? 'bg-status-warning/10 text-status-warning border-status-warning/20' : 
                      c.status === 'OPEN' || c.status === 'ACTIVE' ? 'bg-status-verification/10 text-status-verification border-status-verification/20' : 
                      'bg-surface text-content-muted border-border'
                    }`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center text-[10px] font-bold tracking-[0.2em] uppercase ${
                      c.confidentiality_level === 'TOP_SECRET' ? 'text-status-critical' :
                      c.confidentiality_level === 'CONFIDENTIAL' ? 'text-accent' :
                      'text-content-muted'
                    }`}>
                      {c.confidentiality_level.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-content-secondary tracking-wide">
                    {c.lead_investigator?.username || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="inline-flex items-center justify-center p-1.5 rounded text-content-muted group-hover:text-accent group-hover:bg-accent/10 transition-all">
                      <ChevronRight className="w-4 h-4" />
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
