import { ShieldAlert, Edit, Activity, Download } from "lucide-react";

interface CaseDetailHeaderProps {
  id: string;
  isGenerating: boolean;
  reportGenerated: boolean;
  onGenerateReport: () => void;
}

export function CaseDetailHeader({ id, isGenerating, reportGenerated, onGenerateReport }: CaseDetailHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-content-primary tracking-tight font-mono">{id}</h1>
          <span className="bg-status-critical/10 text-status-critical px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest flex items-center gap-1 border border-status-critical/20">
            <ShieldAlert className="w-3 h-3" /> TOP SECRET
          </span>
          <span className="bg-status-verification/10 text-status-verification border border-status-verification/20 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest">
            ACTIVE
          </span>
        </div>
        <p className="text-content-secondary text-lg font-medium tracking-wide">Operation Northern Light</p>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={() => alert("Inline Edit Mode Activated (Mock)")}
          className="bg-surface hover:bg-elevated text-content-primary px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-colors border border-border flex items-center gap-2"
        >
          <Edit className="w-4 h-4" /> Edit
        </button>
        <button 
          onClick={onGenerateReport}
          disabled={isGenerating || reportGenerated}
          className="bg-accent text-white hover:bg-accent-hover px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all shadow-premium hover:shadow-premium flex items-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <><Activity className="w-4 h-4 animate-spin" /> Generating...</>
          ) : reportGenerated ? (
            <>Report Ready ✓</>
          ) : (
            <><Download className="w-4 h-4" /> Export Report</>
          )}
        </button>
      </div>
    </div>
  );
}
