import { Info, CheckCircle, Lock, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface SecurityProtocolPanelProps {
  uploadState: 'IDLE' | 'UPLOADING' | 'VALIDATING' | 'HASHING' | 'COMPLETE';
  itemVariants: any;
}

export default function SecurityProtocolPanel({ uploadState, itemVariants }: SecurityProtocolPanelProps) {
  return (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="bg-surface/30 border border-border/50 rounded p-6">
        <h3 className="text-[10px] font-bold text-content-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-accent" /> Security Protocol
        </h3>
        <ul className="space-y-5">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-3.5 h-3.5 text-status-verification shrink-0 mt-0.5" />
            <span className="text-xs text-content-secondary leading-relaxed">All uploads are cryptographically hashed (SHA-256) upon receipt.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-3.5 h-3.5 text-status-verification shrink-0 mt-0.5" />
            <span className="text-xs text-content-secondary leading-relaxed">Actions are permanently anchored in the immutable audit trail.</span>
          </li>
          <li className="flex items-start gap-3">
            <Lock className="w-3.5 h-3.5 text-status-warning shrink-0 mt-0.5" />
            <span className="text-xs text-content-secondary leading-relaxed">Top Secret documents trigger immediate supervisor alerts.</span>
          </li>
        </ul>
      </div>

      {uploadState !== 'IDLE' && (
        <div className="bg-surface/30 border border-border/50 rounded p-6">
          <h3 className="text-[10px] font-bold text-content-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-accent" /> Processing Pipeline
          </h3>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className={`w-1.5 h-1.5 rounded-full ${uploadState === 'UPLOADING' ? 'bg-accent animate-ping' : 'bg-status-verification'}`} />
              <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${uploadState === 'UPLOADING' ? 'text-accent' : 'text-status-verification'}`}>
                1. SECURE TRANSFER
              </span>
            </div>
            <div className="flex items-center gap-4 opacity-50">
              <div className={`w-1.5 h-1.5 rounded-full ${uploadState === 'VALIDATING' ? 'bg-accent animate-ping' : uploadState === 'HASHING' || uploadState === 'COMPLETE' ? 'bg-status-verification' : 'bg-content-muted'}`} />
              <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${uploadState === 'VALIDATING' ? 'text-accent opacity-100' : uploadState === 'HASHING' || uploadState === 'COMPLETE' ? 'text-status-verification opacity-100' : 'text-content-muted'}`}>
                2. FILE VALIDATION
              </span>
            </div>
            <div className="flex items-center gap-4 opacity-50">
              <div className={`w-1.5 h-1.5 rounded-full ${uploadState === 'HASHING' ? 'bg-accent animate-ping' : uploadState === 'COMPLETE' ? 'bg-status-verification' : 'bg-content-muted'}`} />
              <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${uploadState === 'HASHING' ? 'text-accent opacity-100' : uploadState === 'COMPLETE' ? 'text-status-verification opacity-100' : 'text-content-muted'}`}>
                3. GENERATING HASH
              </span>
            </div>
            <div className="flex items-center gap-4 opacity-50">
              <div className={`w-1.5 h-1.5 rounded-full ${uploadState === 'COMPLETE' ? 'bg-status-verification' : 'bg-content-muted'}`} />
              <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${uploadState === 'COMPLETE' ? 'text-status-verification opacity-100' : 'text-content-muted'}`}>
                4. INDEXED TO VAULT
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
