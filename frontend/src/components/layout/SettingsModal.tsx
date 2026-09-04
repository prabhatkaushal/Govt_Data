"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("Appearance");
  const { theme, setTheme } = useTheme();
  const { user, updateUser } = useAuth();
  
  // Account Edit States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFullName, setEditFullName] = useState(user?.full_name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [isSaving, setIsSaving] = useState(false);

  // Dummy states for other settings
  const [language, setLanguage] = useState("English");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  if (!isOpen) return null;

  const tabs = [
    { id: "Account", icon: "👤" },
    { id: "Appearance", icon: "🎨" },
    { id: "General", icon: "⚙️" },
    { id: "Notifications", icon: "🔔" },
    { id: "Security", icon: "🛡️" },
    { id: "Integrations", icon: "🔌" },
    { id: "Privacy", icon: "🔒" },
  ];

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const res = await api.patch(`/users/${user.id}/`, {
        full_name: editFullName,
        phone: editPhone
      });
      updateUser({ full_name: editFullName, phone: editPhone });
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Settings</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Manage your application preferences</p>
          </div>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 border-r border-border bg-muted/10 p-4 space-y-1 overflow-y-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.id}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-8 overflow-y-auto bg-background/50">
            
            {activeTab === "Account" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Account Profile</h3>
                  <p className="text-sm text-muted-foreground mb-6">Manage your public and official profile details.</p>
                  
                  <div className="space-y-4 max-w-xl">
                    <div className="flex items-start gap-6 p-6 rounded-xl border border-border bg-card shadow-sm">
                      <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-inner">
                        {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        {!isEditingProfile ? (
                          <>
                            <div>
                              <p className="text-xl font-bold text-foreground">{user?.full_name || "User"}</p>
                              <p className="text-sm text-primary font-medium">{user?.role?.replace('_', ' ')}</p>
                            </div>
                            <div className="space-y-1.5">
                              <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Phone:</span> {user?.phone || "Not provided"}</p>
                              <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Email:</span> {user?.email}</p>
                              <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Badge ID:</span> {user?.employee_id}</p>
                            </div>
                            <button 
                              onClick={() => setIsEditingProfile(true)}
                              className="mt-2 px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-lg hover:bg-muted/80 transition-colors"
                            >
                              Edit Profile
                            </button>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">Full Name</label>
                              <input 
                                type="text"
                                value={editFullName}
                                onChange={(e) => setEditFullName(e.target.value)}
                                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">Phone Number</label>
                              <input 
                                type="text"
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button 
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                              >
                                {isSaving ? "Saving..." : "Save Changes"}
                              </button>
                              <button 
                                onClick={() => {
                                  setIsEditingProfile(false);
                                  setEditFullName(user?.full_name || "");
                                  setEditPhone(user?.phone || "");
                                }}
                                disabled={isSaving}
                                className="px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-lg hover:bg-muted/80 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Appearance" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Theme Preferences</h3>
                  <p className="text-sm text-muted-foreground mb-6">Customize how the application looks on your device.</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {(["light", "dark", "system"] as const).map((t) => (
                      <button 
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all duration-200 ${
                          theme === t 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted/30"
                        }`}
                      >
                        <span className="text-3xl mb-3">
                          {t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '💻'}
                        </span>
                        <span className="font-medium capitalize">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "General" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Language</h3>
                  <p className="text-sm text-muted-foreground mb-6">Select your preferred interface language.</p>
                  
                  <div className="max-w-md">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 bg-card border-2 border-border rounded-xl text-foreground font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer appearance-none"
                    >
                      <option value="English">🇬🇧 English</option>
                      <option value="Hindi">🇮🇳 Hindi (हिंदी)</option>
                      <option value="Marathi">🇮🇳 Marathi (मराठी)</option>
                      <option value="Tamil">🇮🇳 Tamil (தமிழ்)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Communication</h3>
                  <p className="text-sm text-muted-foreground mb-6">Manage how we contact you with updates.</p>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                    <div>
                      <p className="font-medium text-foreground">Email Alerts</p>
                      <p className="text-xs text-muted-foreground mt-1">Receive notifications via email for urgent updates.</p>
                    </div>
                    <button 
                      onClick={() => setEmailAlerts(!emailAlerts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${emailAlerts ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Security" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-6">Enhance your account security.</p>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">Two-Factor Authentication (2FA)</p>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">RECOMMENDED</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Require a secondary code when logging in.</p>
                    </div>
                    <button 
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${twoFactor ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Integrations" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Connected Services</h3>
                  <p className="text-sm text-muted-foreground mb-6">Manage API connections and third-party database integrations.</p>
                  
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 text-xl">
                          🏛️
                        </div>
                        <div>
                          <p className="font-medium text-foreground">National Crime Records Bureau (NCRB)</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Sync criminal records automatically.</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-semibold rounded-full border border-emerald-500/20">Connected</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded bg-orange-500/10 flex items-center justify-center text-orange-500 text-xl">
                          ⚖️
                        </div>
                        <div>
                          <p className="font-medium text-foreground">eCourts API</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Fetch ongoing hearing statuses.</p>
                        </div>
                      </div>
                      <button className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Privacy" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Data & Privacy</h3>
                  <p className="text-sm text-muted-foreground mb-6">Control your footprint and request data exports.</p>
                  
                  <div className="space-y-4 max-w-xl">
                    <div className="p-4 rounded-xl border border-border bg-card space-y-4">
                      <div>
                        <p className="font-medium text-foreground">Export Activity Log</p>
                        <p className="text-xs text-muted-foreground mt-1">Download a CSV of all your actions in the system.</p>
                      </div>
                      <button className="px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2">
                        <span>⬇️</span> Request Data Export
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
