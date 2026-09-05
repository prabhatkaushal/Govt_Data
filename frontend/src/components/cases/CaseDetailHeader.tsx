import Link from "next/link";
import { ShieldAlert, Edit, Activity, Download, Upload, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface CaseDetailHeaderProps {
  caseData: any;
  isGenerating: boolean;
  reportGenerated: boolean;
  onGenerateReport: () => void;
  onStatusChange: (status: string) => void;
  onDeleteCase: () => void;
}

export function CaseDetailHeader({ caseData, isGenerating, reportGenerated, onGenerateReport, onStatusChange, onDeleteCase }: CaseDetailHeaderProps) {
  const { isInvestigator, user } = useAuth();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-6">
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-content-primary tracking-tight font-mono">{caseData.case_number}</h1>
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest flex items-center gap-1 border ${
            caseData.confidentiality_level === 'TOP_SECRET' ? 'bg-status-danger/10 text-status-danger border-status-danger/20' : 
            caseData.confidentiality_level === 'CONFIDENTIAL' ? 'bg-accent/10 text-accent border-accent/20' : 
            'bg-surface text-content-muted border-border'
          }`}>
            {caseData.confidentiality_level === 'TOP_SECRET' && <ShieldAlert className="w-3 h-3" />} 
            {caseData.confidentiality_level.replace('_', ' ')}
          </span>
          
            <select 
              value={caseData.status}
              onChange={(e) => onStatusChange(e.target.value)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-widest border outline-none bg-transparent ${
                caseData.status === 'UNDER_INVESTIGATION' ? 'text-status-warning border-status-warning/20 bg-status-warning/10' : 
                caseData.status === 'OPEN' || caseData.status === 'ACTIVE' ? 'text-status-verification border-status-verification/20 bg-status-verification/10' : 
                'text-content-muted border-border bg-surface'
              }`}
            >
              <option value="OPEN">OPEN</option>
              <option value="UNDER_INVESTIGATION">UNDER INVESTIGATION</option>
              <option value="CLOSED">CLOSED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>

            {caseData.verification_status && (
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest border ${
                caseData.verification_status === 'VERIFIED' ? 'bg-status-verification/10 text-status-verification border-status-verification/20' : 
                caseData.verification_status === 'FLAGGED' ? 'bg-status-warning/10 text-status-warning border-status-warning/20' : 
                'bg-surface text-content-muted border-border'
              }`}>
                {caseData.verification_status.replace('_', ' ')}
              </span>
            )}
          </div>
        <p className="text-content-secondary text-lg font-medium tracking-wide">{caseData.title}</p>
      </div>
      <div className="flex gap-3">
        {isInvestigator && (
          <Link href={`/documents/upload?caseId=${caseData.id}`} className="bg-status-verification/10 text-status-verification hover:bg-status-verification/20 border border-status-verification/30 px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload Evidence
          </Link>
        )}
        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
          <button 
            onClick={onDeleteCase}
            className="bg-status-danger/10 text-status-danger hover:bg-status-danger hover:text-white border border-status-danger/30 px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center gap-2"
          >
            Delete Case
          </button>
        )}
        <button 
          onClick={onGenerateReport}
          disabled={isGenerating || reportGenerated}
          className="bg-accent text-white hover:bg-accent-hover px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all shadow-premium hover:shadow-premium flex items-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <><Activity className="w-4 h-4 animate-spin" /> Generating...</>
          ) : reportGenerated ? (
            <><CheckCircle className="w-4 h-4" /> Report Ready ✓</>
          ) : (
            <><Download className="w-4 h-4" /> Export Report</>
          )}
        </button>
      </div>
    </div>
  );
}
