import { motion } from "framer-motion";
import { 
  Briefcase, FileText, CheckCircle, TestTube, AlertOctagon, ClipboardCheck
} from "lucide-react";

interface Stats {
  casesCount: number;
  documentsCount: number;
  verifiedCount: number;
  pendingCount: number;
  alertsCount: number;
}

interface DashboardStatsProps {
  stats: Stats;
}

const fadeUp = { 
  hidden: { opacity: 0, y: 12 }, 
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } } 
};

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded overflow-hidden">
      {[
        { label: "Active Cases", value: stats.casesCount, icon: Briefcase, color: "text-accent" },
        { label: "Documents", value: stats.documentsCount, icon: FileText, color: "text-content-primary" },
        { label: "Verified", value: stats.verifiedCount, sub: `${stats.documentsCount > 0 ? Math.round((stats.verifiedCount / stats.documentsCount) * 100) : 0}% integrity`, icon: CheckCircle, color: "text-status-verification" },
        { label: "Pending Review", value: stats.pendingCount, icon: ClipboardCheck, color: "text-status-warning" },
        { label: "Evidence Items", value: "—", sub: "Awaiting backend", icon: TestTube, color: "text-content-muted" },
        { label: "Security Alerts", value: stats.alertsCount.toString().padStart(2, '0'), sub: stats.alertsCount > 0 ? `${stats.alertsCount} require attention` : "All clear", icon: AlertOctagon, color: stats.alertsCount > 0 ? "text-status-critical" : "text-status-verification" },
      ].map((kpi, idx) => (
        <div key={idx} className="bg-surface p-5 flex flex-col justify-between min-h-[100px] group hover:bg-elevated transition-colors">
          <div className="flex items-center justify-between">
            <kpi.icon className={`w-4 h-4 ${kpi.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-bold ${kpi.color} tracking-tight`}>{kpi.value}</div>
            <div className="text-[10px] text-content-muted tracking-[0.1em] uppercase mt-1">{kpi.label}</div>
            {kpi.sub && <div className="text-[10px] text-content-muted font-mono mt-0.5">{kpi.sub}</div>}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
