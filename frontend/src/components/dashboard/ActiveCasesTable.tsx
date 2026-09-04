import { motion } from "framer-motion";
import Link from "next/link";
import { Activity, ChevronRight } from "lucide-react";

interface Case {
  id: string | number;
  case_number: string;
  title: string;
  status: string;
  confidentiality_level: string;
}

interface ActiveCasesTableProps {
  cases: Case[];
}

const fadeUp = { 
  hidden: { opacity: 0, y: 12 }, 
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } } 
};

export default function ActiveCasesTable({ cases }: ActiveCasesTableProps) {
  return (
    <motion.div variants={fadeUp}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-accent" /> Active Investigations
        </h2>
        <Link href="/cases" className="text-[10px] text-content-muted hover:text-accent transition-colors tracking-widest uppercase">
          View All
        </Link>
      </div>
      <div className="border border-border rounded-xl overflow-hidden bg-surface shadow-sm">
        {cases.length === 0 ? (
          <div className="p-8 text-center text-content-muted text-sm">No active cases.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-elevated/20 text-[10px] font-bold text-content-muted tracking-[0.12em] uppercase">
                <th className="px-6 py-4 font-normal">Case ID</th>
                <th className="px-6 py-4 font-normal">Title</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Classification</th>
                <th className="px-6 py-4 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {cases.map((c: any) => (
                <tr key={c.id} className="group hover:bg-elevated/40 transition-colors cursor-pointer relative">
                  <td className="px-6 py-4 text-xs font-mono text-accent font-bold">
                    <Link href={`/cases/${c.id}`} className="absolute inset-0" aria-label={`View case ${c.case_number}`} />
                    {c.case_number}
                  </td>
                  <td className="px-6 py-4 text-sm text-content-primary font-medium">{c.title}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-[2px] border ${
                      c.status === 'UNDER_INVESTIGATION' ? 'text-status-warning bg-status-warning/10 border-status-warning/20' :
                      c.status === 'OPEN' || c.status === 'ACTIVE' ? 'text-status-verification bg-status-verification/10 border-status-verification/20' :
                      'text-content-muted bg-surface border-border'
                    }`}>
                      {c.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-content-muted">
                    {c.confidentiality_level?.replace(/_/g, ' ')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="w-4 h-4 text-content-muted opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
