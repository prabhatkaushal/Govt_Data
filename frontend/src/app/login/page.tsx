"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, Lock, AlertOctagon, User, Eye, Users, Hexagon, Search } from "lucide-react";
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
      
      {/* Real CSS-3D Background */}
      <SecureBackground3D />

      {/* Main Authentication Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-[1050px] bg-[rgba(18,29,32,0.82)] backdrop-blur-2xl border border-[#304347] rounded-[26px] shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex flex-col md:flex-row overflow-hidden relative z-10"
      >
        {/* Subtle internal highlight along the top edge */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3C9D91]/30 to-transparent" />

        {/* Left Section (Branding & Features) */}
        <div className="w-full md:w-[48%] p-8 lg:p-12 bg-[#172326]/60 border-b md:border-b-0 md:border-r border-[#304347] flex flex-col justify-center">
          <div className="max-w-[340px] mx-auto md:mx-0 w-full">
            <div className="w-12 h-12 rounded-2xl bg-[#1A292C] flex items-center justify-center border border-[#304347] text-[#3C9D91] mb-5 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            
            <h1 className="text-[28px] font-semibold text-[#EDF3F1] mb-1 tracking-tight">SECURA</h1>
            <p className="text-[#9DAFAD] text-[15px] font-medium">Secure Case Intelligence</p>
            
            <div className="w-10 h-[3px] bg-[#3C9D91] my-5 rounded-full opacity-80" />
            
            <p className="text-[#9DAFAD] font-medium mb-6 text-[14px]">Protected case and evidence management</p>
            
            <div className="space-y-3 hidden sm:block">
              <div className="flex items-center gap-4 group p-2 -ml-2 rounded-xl transition-all duration-300 hover:bg-[#1A292C]/50 hover:border-[#3C9D91]/30 hover:shadow-[inset_0_0_15px_rgba(60,157,145,0.08)] border border-transparent cursor-default">
                <div className="w-9 h-9 rounded-[10px] bg-[#1A292C] flex items-center justify-center text-[#3C9D91] border border-[#304347] transition-all duration-300 group-hover:border-[#3C9D91]/50 group-hover:bg-[#121D20]">
                  <Lock className="w-[16px] h-[16px]" />
                </div>
                <span className="text-[13px] font-medium text-[#EDF3F1]">End-to-end encryption</span>
              </div>
              
              <div className="flex items-center gap-4 group p-2 -ml-2 rounded-xl transition-all duration-300 hover:bg-[#1A292C]/50 hover:border-[#3C9D91]/30 hover:shadow-[inset_0_0_15px_rgba(60,157,145,0.08)] border border-transparent cursor-default">
                <div className="w-9 h-9 rounded-[10px] bg-[#1A292C] flex items-center justify-center text-[#3C9D91] border border-[#304347] transition-all duration-300 group-hover:border-[#3C9D91]/50 group-hover:bg-[#121D20]">
                  <Users className="w-[16px] h-[16px]" />
                </div>
                <span className="text-[13px] font-medium text-[#EDF3F1]">Role-based access control</span>
              </div>

              <div className="flex items-center gap-4 group p-2 -ml-2 rounded-xl transition-all duration-300 hover:bg-[#1A292C]/50 hover:border-[#3C9D91]/30 hover:shadow-[inset_0_0_15px_rgba(60,157,145,0.08)] border border-transparent cursor-default">
                <div className="w-9 h-9 rounded-[10px] bg-[#1A292C] flex items-center justify-center text-[#3C9D91] border border-[#304347] transition-all duration-300 group-hover:border-[#3C9D91]/50 group-hover:bg-[#121D20]">
                  <Hexagon className="w-[16px] h-[16px]" />
                </div>
                <span className="text-[13px] font-medium text-[#EDF3F1]">Blockchain verification</span>
              </div>

              <div className="flex items-center gap-4 group p-2 -ml-2 rounded-xl transition-all duration-300 hover:bg-[#1A292C]/50 hover:border-[#3C9D91]/30 hover:shadow-[inset_0_0_15px_rgba(60,157,145,0.08)] border border-transparent cursor-default">
                <div className="w-9 h-9 rounded-[10px] bg-[#1A292C] flex items-center justify-center text-[#3C9D91] border border-[#304347] transition-all duration-300 group-hover:border-[#3C9D91]/50 group-hover:bg-[#121D20]">
                  <Search className="w-[16px] h-[16px]" />
                </div>
                <span className="text-[13px] font-medium text-[#EDF3F1]">AI-powered search</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Login Form) */}
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
                  Forgot passcode?
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
            
            {/* Dev Only Demo Credentials */}
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
