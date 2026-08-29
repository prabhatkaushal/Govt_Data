"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, Lock, AlertOctagon, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login } = useAuth();
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(idNumber, password);
    } catch (err: any) {
      setError(err.response?.data?.detail || "AUTHENTICATION FAILED. CREDENTIALS REJECTED.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Minimalist Background */}
      <div className="absolute inset-0 z-0 bg-background"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
        className="w-full max-w-[400px] space-y-12 relative z-10"
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="h-16 w-16 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent shadow-premium relative">
            <ShieldCheck className="w-6 h-6" />
            <motion.div 
              className="absolute inset-0 rounded-full border border-accent/30"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-content-primary tracking-[0.2em] uppercase">
              SECURE-OPS
            </h2>
            <p className="mt-2 text-[10px] text-content-muted font-mono tracking-[0.3em] uppercase">
              Law Enforcement Command Platform
            </p>
          </div>
        </div>

        <div className="bg-surface/50 border border-border rounded backdrop-blur-xl p-8 relative">
          
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>

          <div className="mb-8">
            <h3 className="text-xs font-bold text-content-secondary tracking-widest uppercase flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> Authentication Required
            </h3>
            <div className="text-[9px] text-content-muted mt-3 font-mono uppercase tracking-widest leading-relaxed border border-border/50 rounded bg-background/50 p-3 space-y-1">
              <div className="font-bold mb-2 text-content-primary">Demo Credentials (pass: gov123):</div>
              <div className="flex justify-between"><span>Admin:</span><span className="text-accent">26000000</span></div>
              <div className="flex justify-between"><span>Investigator:</span><span className="text-accent">26010001</span></div>
              <div className="flex justify-between"><span>Forensic:</span><span className="text-accent">26010002</span></div>
              <div className="flex justify-between"><span>Legal:</span><span className="text-accent">26010003</span></div>
              <div className="flex justify-between"><span>Auditor:</span><span className="text-accent">26010004</span></div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 bg-status-critical/10 border border-status-critical/30 rounded flex items-start gap-2"
              >
                <AlertOctagon className="w-4 h-4 text-status-critical shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-status-critical tracking-widest uppercase leading-relaxed">
                  {error}
                </p>
              </motion.div>
            )}

            <div className="space-y-2">
              <label htmlFor="id-number" className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase">Employee ID</label>
              <div className="relative">
                <ChevronRight className="absolute left-3 top-3 w-4 h-4 text-accent opacity-50" />
                <input 
                  id="id-number" 
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="ID NUMBER" 
                  required 
                  className="w-full bg-background border border-border rounded pl-10 pr-4 py-3 text-sm text-content-primary placeholder-content-muted/30 focus:border-accent/50 focus:bg-elevated transition-colors font-mono tracking-widest outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-bold text-content-muted tracking-[0.2em] uppercase">Passcode</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-3.5 h-3.5 text-accent opacity-50" />
                <input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                  className="w-full bg-background border border-border rounded pl-10 pr-4 py-3 text-sm text-content-primary placeholder-content-muted/30 focus:border-accent/50 focus:bg-elevated transition-colors font-mono tracking-widest outline-none"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-accent hover:bg-accent-hover text-white py-3.5 rounded text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-premium hover:shadow-premium disabled:opacity-50 disabled:shadow-none mt-4 relative overflow-hidden group"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  AUTHENTICATING...
                </span>
              ) : (
                <span className="relative z-10">INITIALIZE SECURE SESSION</span>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-[9px] text-content-muted font-mono tracking-[0.2em] uppercase">
            Unauthorized access is strictly prohibited
          </p>
        </div>
      </motion.div>
    </div>
  );
}
