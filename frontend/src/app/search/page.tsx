'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, FileText, Loader2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { ease: [0.22, 1, 0.36, 1] as const } },
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{cases: any[], documents: any[]}>({ cases: [], documents: [] });
  const [hasSearched, setHasSearched] = useState(false);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim() || !text) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} className="bg-accent/30 text-accent font-bold px-1 rounded">{part}</span> : part
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const api = (await import('@/services/api')).default;
      const [casesRes, docsRes] = await Promise.all([
        api.get('/cases/'),
        api.get('/documents/')
      ]);
      
      const q = query.toLowerCase();
      
      const filteredCases = casesRes.data.filter((c: any) => 
        c.title?.toLowerCase().includes(q) || 
        c.description?.toLowerCase().includes(q) ||
        c.case_number?.toLowerCase().includes(q)
      );
      
      const filteredDocs = docsRes.data.filter((d: any) => 
        d.title?.toLowerCase().includes(q) || 
        d.document_id?.toLowerCase().includes(q)
      );
      
      setResults({ cases: filteredCases, documents: filteredDocs });
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-content-primary p-6">
      <motion.div className="max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-12 mt-8 text-center">
          <div className="p-4 bg-elevated rounded-xl border border-border mb-6">
            <Search className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">GLOBAL SEARCH</h1>
          <p className="text-sm text-content-secondary tracking-[0.2em] uppercase">
            Search Across Cases & Evidence
          </p>
        </motion.div>

        <motion.form onSubmit={handleSearch} variants={itemVariants} className="mb-8">
          <div className={`relative flex items-center bg-surface border transition-all rounded-xl p-2 shadow-lg ${isLoading ? 'border-accent shadow-accent/10' : 'border-border hover:border-accent'}`}>
            <div className="pl-4 pr-2">
              <Search className={`w-5 h-5 ${isLoading ? 'text-accent animate-pulse' : 'text-content-muted'}`} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, title, or keywords..."
              className="bg-transparent border-none outline-none text-lg w-full py-4 placeholder:text-content-muted font-sans"
              disabled={isLoading}
              autoFocus
            />
            <div className="pr-2">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-accent animate-spin" />
              ) : (
                <button type="submit" className="text-xs text-content-muted font-mono bg-elevated px-3 py-1.5 rounded border border-border hover:text-accent hover:border-accent transition-colors">
                  SEARCH ↵
                </button>
              )}
            </div>
          </div>
        </motion.form>

        <AnimatePresence mode="wait">
          {!hasSearched && !isLoading && (
            <motion.div key="empty" variants={itemVariants} initial="hidden" animate="visible" exit="hidden" className="flex flex-wrap justify-center gap-4 mb-16 opacity-50">
              <div className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm"><Filter className="w-4 h-4" /> Cases</div>
              <div className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm"><FileText className="w-4 h-4" /> Documents</div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
              <p className="text-sm text-content-muted font-mono animate-pulse">Searching global registry...</p>
            </motion.div>
          )}

          {hasSearched && !isLoading && (
            <motion.div key="results" variants={itemVariants} initial="hidden" animate="visible" className="space-y-8">
              
              <div className="text-sm text-content-muted tracking-widest uppercase">
                Found {results.cases.length} Cases and {results.documents.length} Documents
              </div>

              {results.cases.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-accent tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Cases
                  </h4>
                  <div className="space-y-3">
                    {results.cases.map((c: any) => (
                      <a href={`/cases/${c.id}`} key={c.id} className="block bg-surface border border-border rounded-lg p-5 hover:border-accent/50 transition-colors group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-sm text-content-primary">{highlightText(c.title, query)}</span>
                            <span className="text-[10px] bg-elevated px-2 py-0.5 rounded font-mono text-content-muted border border-border">
                              {highlightText(c.case_number, query)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-content-secondary leading-relaxed mt-2">
                          {highlightText(c.description, query)}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {results.documents.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-status-verification tracking-[0.2em] uppercase mt-8 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Documents
                  </h4>
                  <div className="space-y-3">
                    {results.documents.map((doc: any) => (
                      <a href={`/documents/${doc.id}`} key={doc.id} className="block bg-surface border border-border rounded-lg p-5 hover:border-status-verification/50 transition-colors group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-sm text-content-primary">{highlightText(doc.title, query)}</span>
                            <span className="text-[10px] bg-elevated px-2 py-0.5 rounded font-mono text-content-muted border border-border">
                              {highlightText(doc.document_id, query)}
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
