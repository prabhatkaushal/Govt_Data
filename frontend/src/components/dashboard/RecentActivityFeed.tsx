import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface ActivityEvent {
  id: string | number;
  actor: string;
  action: string;
  target: string;
  time: string;
  date: string;
  severity: string;
}

interface RecentActivityFeedProps {
  recentActivity: ActivityEvent[];
}

const fadeUp = { 
  hidden: { opacity: 0, y: 12 }, 
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } } 
};

export default function RecentActivityFeed({ recentActivity }: RecentActivityFeedProps) {
  return (
    <motion.div variants={fadeUp}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-status-warning" /> Recent Activity
        </h2>
      </div>
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        {recentActivity.length === 0 ? (
          <div className="py-8 text-center text-content-muted text-sm border border-dashed border-border rounded">No activity recorded.</div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((event) => (
              <div key={event.id} className="flex items-start gap-4 px-4 py-3 rounded-lg hover:bg-elevated transition-colors group border border-transparent hover:border-border/50">
                <div className="shrink-0 mt-1">
                  <div className={`w-2 h-2 rounded-full ${
                    event.severity === 'HIGH' ? 'bg-status-danger' : 'bg-status-verification'
                  } ring-4 ${event.severity === 'HIGH' ? 'ring-status-danger/10' : 'ring-status-verification/10'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-content-primary uppercase tracking-wide">{event.action}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-medium text-content-secondary">{event.actor}</span>
                    <span className="text-[11px] text-content-muted">—</span>
                    <span className="text-[11px] font-mono text-content-muted">{event.target}</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-content-muted shrink-0">{event.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
