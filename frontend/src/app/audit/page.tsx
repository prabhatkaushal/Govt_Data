'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ListOrdered, Filter, Search, Terminal, User, AlertCircle } from 'lucide-react';

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

export default function AuditPage() {
  const [logs, setLogs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/audit-logs/', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action?.toLowerCase().includes(search.toLowerCase()) ||
    log.resource_type?.toLowerCase().includes(search.toLowerCase()) ||
    log.actor_details?.username?.toLowerCase().includes(search.toLowerCase())
  );

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
              <ListOrdered className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">SECURITY AUDIT TRAIL</h1>
              <p className="text-sm text-content-secondary tracking-[0.2em] uppercase mt-1">
                Immutable System Logs
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-status-verification/10 border border-status-verification/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-status-verification" />
            <span className="text-xs font-mono text-status-verification">LIVE</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-4 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2">
            <Search className="w-4 h-4 text-content-muted" />
            <input
              type="text"
              placeholder="Search audit trail by user, action, or resource..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-content-muted"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm text-content-secondary">
            <User className="w-4 h-4" /> User
          </button>
          <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm text-content-secondary">
            <Filter className="w-4 h-4" /> Action
          </button>
          <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm text-content-secondary">
            <Terminal className="w-4 h-4" /> Resource
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-elevated text-[10px] font-bold tracking-[0.2em] uppercase text-content-muted">
            <div className="col-span-2">Timestamp</div>
            <div className="col-span-2">User / ID</div>
            <div className="col-span-2">Action</div>
            <div className="col-span-4">Resource Details</div>
            <div className="col-span-2">IP Address</div>
          </div>
          
          <div className="flex flex-col">
            {loading ? (
              <div className="p-8 text-center text-content-muted text-xs">Loading logs...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-content-muted text-xs">No audit logs found.</div>
            ) : (
              <div className="divide-y divide-border/50 max-h-[600px] overflow-y-auto">
                {filteredLogs.map(log => (
                  <div key={log.id} className="grid grid-cols-12 gap-4 p-4 text-xs text-content-secondary hover:bg-elevated transition-colors">
                    <div className="col-span-2 font-mono text-[10px]">{new Date(log.timestamp).toLocaleString()}</div>
                    <div className="col-span-2">
                      <span className="font-bold text-content-primary">{log.actor_details?.username}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="bg-background border border-border px-2 py-1 rounded text-[10px] font-mono text-accent">{log.action}</span>
                    </div>
                    <div className="col-span-4 truncate">
                      <span className="text-content-primary font-bold mr-2">{log.resource_type}: {log.resource_id}</span>
                      {log.metadata_info?.description || JSON.stringify(log.metadata_info)}
                    </div>
                    <div className="col-span-2 font-mono text-[10px] text-content-muted">{log.ip_address || '127.0.0.1'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
