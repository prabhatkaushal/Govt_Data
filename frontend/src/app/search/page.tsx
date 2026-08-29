'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BrainCircuit, Filter, FileText, Users, Box, Terminal, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';

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
  const [results, setResults] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setResults(null);
    try {
      const res = await axios.get(`http://localhost:8001/search/?query=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (err) {
      console.error("AI Search failed", err);
      alert("Failed to connect to AI Microservice (Port 8001)");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-content-primary p-6">
      <motion.div className="max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-12 mt-8 text-center">
          <div className="p-4 bg-elevated rounded-xl border border-border mb-6">
            <BrainCircuit className="w-8 h-8 text-[#8B5CF6]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">AI SEMANTIC SEARCH</h1>
          <p className="text-sm text-content-secondary tracking-[0.2em] uppercase">
            RAG-Powered Legal Intelligence
          </p>
        </motion.div>

        <motion.form onSubmit={handleSearch} variants={itemVariants} className="mb-8">
          <div className={`relative flex items-center bg-surface border transition-all rounded-xl p-2 shadow-lg ${isLoading ? 'border-[#8B5CF6] shadow-[#8B5CF6]/10' : 'border-border hover:border-accent'}`}>
            <div className="pl-4 pr-2">
              <Terminal className={`w-5 h-5 ${isLoading ? 'text-[#8B5CF6]' : 'text-accent'}`} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a natural language question about any case..."
              className="bg-transparent border-none outline-none text-lg w-full py-4 placeholder:text-content-muted font-mono"
              disabled={isLoading}
              autoFocus
            />
            <div className="pr-2">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-[#8B5CF6] animate-spin" />
              ) : (
                <span className="text-xs text-content-muted font-mono bg-elevated px-2 py-1 rounded border border-border">
                  ENTER ↵
                </span>
              )}
            </div>
          </div>
        </motion.form>

        <AnimatePresence mode="wait">
          {!results && !isLoading && (
            <motion.div key="empty" variants={itemVariants} initial="hidden" animate="visible" exit="hidden" className="flex flex-wrap justify-center gap-4 mb-16 opacity-50">
              <div className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm"><Filter className="w-4 h-4" /> Cases</div>
              <div className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm"><FileText className="w-4 h-4" /> Documents</div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
              <p className="text-sm text-content-muted font-mono animate-pulse">Running LangChain Vector Search...</p>
            </motion.div>
          )}

          {results && !isLoading && (
            <motion.div key="results" variants={itemVariants} initial="hidden" animate="visible" className="space-y-6">
              
              {/* AI Synthesis Box */}
              <div className="bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#8B5CF6]" />
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-[#8B5CF6] uppercase tracking-widest">
                  <BrainCircuit className="w-4 h-4" /> AI Synthesis
                </h3>
                <p className="text-sm text-content-primary leading-relaxed font-medium">
                  {results.ai_synthesis}
                </p>
              </div>

              {/* Source Documents */}
              <h4 className="text-xs font-bold text-content-muted tracking-[0.2em] uppercase mt-8 mb-4">Source Evidence (pgvector)</h4>
              <div className="space-y-3">
                {results.results.map((doc: any, i: number) => (
                  <div key={i} className="bg-surface border border-border rounded-lg p-5 hover:border-accent/50 transition-colors group cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-accent" />
                        <span className="font-bold text-sm">{doc.title}</span>
                        <span className="text-[10px] bg-elevated px-2 py-0.5 rounded font-mono text-content-muted border border-border">
                          {doc.document_id}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono flex items-center gap-1 text-status-verification bg-status-verification/10 px-2 py-0.5 rounded border border-status-verification/20">
                        {(doc.similarity_score * 100).toFixed(0)}% MATCH
                      </div>
                    </div>
                    <p className="text-xs text-content-secondary leading-relaxed pl-7 border-l-2 border-border/50 ml-[7px] mt-3 italic">
                      "{doc.snippet}"
                    </p>
                  </div>
                ))}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
