import { FileText, Users, Activity } from "lucide-react";

export function CaseDetailOverview({ caseData }: { caseData: any }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
      <div className="xl:col-span-8 space-y-12">
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase flex items-center gap-2 border-b border-border pb-2">
            <FileText className="w-4 h-4 text-accent" /> Case Summary
          </h3>
          <p className="text-content-primary leading-relaxed text-sm tracking-wide bg-surface/30 p-6 rounded border border-border/50">
            {caseData.description || "No description provided."}
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase flex items-center gap-2 border-b border-border pb-2">
            <Users className="w-4 h-4 text-accent" /> Assigned Personnel
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-surface/30 rounded border border-border/50">
              <div className="h-12 w-12 rounded bg-surface border border-border flex items-center justify-center text-content-secondary font-bold text-sm">
                {caseData.investigating_officer?.username ? caseData.investigating_officer.username.substring(0, 2).toUpperCase() : 'NA'}
              </div>
              <div>
                <p className="text-content-primary text-sm font-bold tracking-wide">
                  {caseData.investigating_officer?.full_name || caseData.investigating_officer?.username || 'Unassigned'}
                </p>
                <p className="text-[10px] font-mono text-content-muted mt-1 uppercase">Lead Investigator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="xl:col-span-4 space-y-6">
        <div className="bg-surface/30 border border-border/50 rounded p-6">
           <h3 className="text-[10px] font-bold text-content-primary uppercase tracking-[0.2em] mb-4">Metadata</h3>
           <dl className="space-y-4">
             <div>
               <dt className="text-content-muted font-bold text-[10px] uppercase tracking-widest">Date Opened</dt>
               <dd className="text-content-primary font-mono text-sm mt-1">{new Date(caseData.created_at).toLocaleDateString()}</dd>
             </div>
             <div>
               <dt className="text-content-muted font-bold text-[10px] uppercase tracking-widest">Case Type</dt>
               <dd className="text-content-primary font-mono text-sm mt-1 uppercase">{caseData.case_type}</dd>
             </div>
             <div>
               <dt className="text-content-muted font-bold text-[10px] uppercase tracking-widest">Priority</dt>
               <dd className="text-content-primary font-mono text-sm mt-1 uppercase">{caseData.priority}</dd>
             </div>
             <div>
               <dt className="text-content-muted font-bold text-[10px] uppercase tracking-widest">Police Station</dt>
               <dd className="text-content-primary font-mono text-sm mt-1">{caseData.police_station || 'N/A'}</dd>
             </div>
             <div>
               <dt className="text-content-muted font-bold text-[10px] uppercase tracking-widest">Classification</dt>
               <dd className={`font-mono text-sm mt-1 ${caseData.confidentiality_level === 'TOP_SECRET' ? 'text-status-danger' : 'text-accent'}`}>
                 {caseData.confidentiality_level.replace('_', ' ')}
               </dd>
             </div>
           </dl>
        </div>
      </div>
    </div>
  );
}
