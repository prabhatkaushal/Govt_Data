"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, Lock, AlertOctagon, User, Eye, Users, Hexagon, Search, Link2, Scale, Database } from "lucide-react";
import { motion } from "framer-motion";
import { SecureBackground3D } from "@/components/SecureBackground3D";

export default function LoginPage() {
  const { login } = useAuth();
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(idNumber, password);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Authentication failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1214] p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans text-[#EDF3F1]">
      
      
      <SecureBackground3D />

      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-[1050px] bg-[rgba(18,29,32,0.82)] backdrop-blur-2xl border border-[#304347] rounded-[26px] shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex flex-col md:flex-row overflow-hidden relative z-10"
      >
        
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3C9D91]/30 to-transparent" />

        
        <div className="w-full md:w-[50%] p-8 lg:p-12 bg-gradient-to-b from-[#0d1518] to-[#111b21] border-b md:border-b-0 md:border-r border-slate-700/50 flex flex-col justify-center relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#14b8a6] rounded-full blur-[120px] opacity-10" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2dd4bf] rounded-full blur-[120px] opacity-10" />
          </div>

          <div className="max-w-[420px] mx-auto md:mx-0 w-full relative z-10 flex flex-col items-center md:items-start text-center md:text-left mt-10">
            
            <div className="mb-10 w-full flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-bold tracking-widest mb-6 bg-gradient-to-r from-white via-white to-[#2dd4bf] bg-clip-text text-transparent drop-shadow-sm">
                SECURA
              </h1>
              
              <p className="text-[#14b8a6]/90 italic text-lg leading-relaxed max-w-sm mb-12">
                "Safeguarding evidentiary integrity from first report to final verdict."
              </p>

              <div className="w-full space-y-4">
                <div className="bg-white/[0.03] backdrop-blur-md border border-slate-700/50 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                  <h3 className="text-white font-medium text-base tracking-wide">
                    Digitalized and Centralized Storage
                  </h3>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-md border border-slate-700/50 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                  <h3 className="text-white font-medium text-base tracking-wide">
                    Secure Access
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="w-full md:w-[52%] p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-transparent">
          <div className="max-w-[380px] w-full mx-auto md:mx-0 lg:mx-auto">
            <h2 className="text-[26px] font-semibold text-[#EDF3F1] mb-1 tracking-tight">Welcome back</h2>
            <p className="text-[#9DAFAD] text-[14px] mb-6">Sign in to continue to your secure workspace.</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl flex items-start gap-2 mb-3"
                >
                  <AlertOctagon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[13px] font-medium text-red-300">
                    {error}
                  </p>
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="id-number" className="text-[13px] font-medium text-[#9DAFAD] block">Employee ID</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#304347] peer-focus:text-[#3C9D91] transition-colors" />
                  <input 
                    id="id-number" 
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Enter employee ID" 
                    required 
                    autoComplete="username"
                    className="w-full h-[46px] bg-[#1A292C] border border-[#304347] rounded-xl pl-10 pr-4 text-[14px] text-[#EDF3F1] placeholder-[#304347] focus:border-[#3C9D91] focus:ring-1 focus:ring-[#3C9D91] transition-all outline-none shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-[13px] font-medium text-[#9DAFAD] block">Passcode</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#304347] transition-colors" />
                  <input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your passcode" 
                    required 
                    autoComplete="current-password"
                    className="w-full h-[46px] bg-[#1A292C] border border-[#304347] rounded-xl pl-10 pr-10 text-[14px] text-[#EDF3F1] placeholder-[#304347] focus:border-[#3C9D91] focus:ring-1 focus:ring-[#3C9D91] transition-all outline-none shadow-inner"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#304347] hover:text-[#9DAFAD] focus:outline-none transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-0.5 pb-1">
                <a href="#" className="text-[13px] font-medium text-[#3C9D91] hover:text-[#4EB3A6] transition-colors focus:outline-none focus:underline">
                  forget deatils
                </a>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full h-[46px] bg-[#3C9D91] hover:bg-[#4EB3A6] text-[#101719] rounded-xl text-[15px] font-bold transition-all shadow-[0_4px_14px_rgba(60,157,145,0.2)] hover:shadow-[0_6px_20px_rgba(60,157,145,0.3)] disabled:opacity-50 disabled:shadow-none relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[#6BAE91] focus:ring-offset-2 focus:ring-offset-[#121D20]"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-[#101719]/30 border-t-[#101719] rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="relative z-10">Sign in securely</span>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#304347]/50 flex justify-center items-center gap-2 text-[11px] font-medium text-[#9DAFAD]">
              <ShieldCheck className="w-[12px] h-[12px] text-[#6BAE91]" /> Access monitored • Sessions encrypted
            </div>
            
            
            {process.env.NODE_ENV !== 'production' && (
              <div className="mt-4 text-[10px] text-[#9DAFAD] font-medium leading-relaxed bg-[#1A292C]/50 rounded-lg p-2.5 text-center border border-[#304347]/30">
                Demo: Admin (<span className="font-semibold text-[#3C9D91]">26000000</span>) | Inv. (<span className="font-semibold text-[#3C9D91]">26010001</span>) | Pass: <span className="font-semibold text-[#3C9D91]">gov123</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
