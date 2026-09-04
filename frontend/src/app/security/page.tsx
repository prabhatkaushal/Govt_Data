'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, AlertCircle, FileKey, Activity, Link2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { ease: [0.22, 1, 0.36, 1] as const } },
};

export default function SecurityPage() {
  const [blocks, setBlocks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/blockchain/', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setBlocks(data);
        }
      } catch (err) {
        console.error("Failed to fetch blockchain records", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlocks();
  }, []);

  return (
    <div className="min-h-screen bg-background text-content-primary p-6">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-elevated rounded-lg border border-border">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">SECURITY CENTER</h1>
              <p className="text-sm text-content-secondary tracking-[0.2em] uppercase mt-1">
                Immutable Ledger & Block Viewer
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-status-verification/10 border border-status-verification/20 rounded-lg flex items-center gap-2">
            <Activity className="w-4 h-4 text-status-verification" />
            <span className="text-xs font-mono text-status-verification">LEDGER SYNCED</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <motion.div variants={itemVariants} className="bg-surface border border-border rounded-lg p-6 lg:col-span-1 space-y-6">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-content-muted">
              System Security Status
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-elevated rounded border border-border">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-status-verification" />
                  <span className="text-sm font-medium">Authentication</span>
                </div>
                <span className="text-[10px] font-bold tracking-widest text-status-verification uppercase">ACTIVE</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-elevated rounded border border-border">
                <div className="flex items-center gap-3">
                  <FileKey className="w-5 h-5 text-status-verification" />
                  <span className="text-sm font-medium">Encryption (AES)</span>
                </div>
                <span className="text-[10px] font-bold tracking-widest text-status-verification uppercase">ACTIVE</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-elevated rounded border border-border">
                <div className="flex items-center gap-3">
                  <Link2 className="w-5 h-5 text-status-verification" />
                  <span className="text-sm font-medium">Ledger Node</span>
                </div>
                <span className="text-[10px] font-bold tracking-widest text-status-verification uppercase">SYNCED</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-content-muted mb-3">Verification Tools</h4>
              <p className="text-xs text-content-secondary mb-4 leading-relaxed">
                To verify the cryptographic integrity of a file against the immutable ledger, use the Document Verification Protocol.
              </p>
              <a 
                href="/documents" 
                className="w-full bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/20 transition-colors py-3 rounded flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase"
              >
                <ShieldCheck className="w-4 h-4" /> Go To Document Vault
              </a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-surface border border-border rounded-lg p-6 lg:col-span-2 flex flex-col">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-content-muted mb-6">
              Blockchain Ledger Explorer
            </h3>
            
            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-content-muted text-xs">Syncing Ledger...</div>
              ) : blocks.length === 0 ? (
                <div className="p-8 text-center text-content-muted text-xs">No blocks recorded yet.</div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {blocks.map((block, i) => (
                    <div key={block.id} className="relative flex items-start gap-4">
                      {/* Connection Line */}
                      {i !== blocks.length - 1 && (
                        <div className="absolute left-[11px] top-6 w-[2px] h-full bg-border -z-10" />
                      )}
                      
                      <div className="mt-1 w-6 h-6 rounded-full bg-background border-2 border-accent flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      
                      <div className="flex-1 bg-elevated border border-border rounded p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xs font-bold text-accent uppercase tracking-widest">BLOCK #{block.block_number}</h4>
                          <span className="text-[10px] font-mono text-content-muted">{new Date(block.timestamp).toLocaleString()}</span>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <div>
                            <span className="text-[10px] font-bold text-content-muted uppercase tracking-widest">TX ID</span>
                            <p className="text-[10px] font-mono text-content-primary mt-1 truncate">{block.transaction_id}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-content-muted uppercase tracking-widest">Document SHA-256 Hash</span>
                            <p className="text-[10px] font-mono text-status-verification mt-1 break-all bg-background border border-status-verification/20 p-2 rounded">
                              {block.document_hash}
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <div>
                              <span className="text-[10px] font-bold text-content-muted uppercase tracking-widest">Action</span>
                              <p className="text-xs font-medium text-content-primary mt-1">{block.action}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-content-muted uppercase tracking-widest">Status</span>
                              <p className="text-[10px] font-mono font-medium text-content-secondary mt-1">{block.status}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
