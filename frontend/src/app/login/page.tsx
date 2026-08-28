"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-900 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(30,58,138,0.5)]">
             <span className="text-2xl">🏛️</span>
          </div>
          <h2 className="mt-2 text-4xl font-extrabold text-white tracking-tight">
            NyayaVault Portal
          </h2>
          <p className="mt-3 text-sm text-blue-400 font-mono tracking-widest uppercase">
            Restricted Government Access
          </p>
        </div>

        <Card className="border border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">Authentication Required</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your authorized department credentials. (e.g. 250101 for Police, 250201 for Legal)
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5">
              {error && (
                <div className="p-3 rounded bg-red-900/20 border border-red-900 text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="id-number" className="text-slate-300 font-mono">ID Number</Label>
                <Input 
                  id="id-number" 
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="e.g. 250101" 
                  required 
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-blue-500 font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 font-mono">Passcode</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-blue-500 font-mono"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-5 pt-4">
              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all">
                {loading ? "Authenticating..." : "Authenticate"}
              </Button>
              <div className="text-xs text-center text-slate-500 font-mono">
                UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
