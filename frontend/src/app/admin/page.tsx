'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Users, Shield, Building2, Sliders, AlertCircle, X } from 'lucide-react';
import api from '@/services/api';

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

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newRole, setNewRole] = useState("INVESTIGATING_OFFICER");

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/');
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/', {
        username: newUsername,
        password: newPassword,
        full_name: newFullName,
        role: newRole,
      });
      setShowAddModal(false);
      setNewUsername("");
      setNewPassword("");
      setNewFullName("");
      await fetchUsers(); // Refresh the list
    } catch (error) {
      alert("Failed to create user. Ensure username is unique and you have permission.");
      console.error(error);
    }
  };

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
              <Settings className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">ADMINISTRATION</h1>
              <p className="text-sm text-content-secondary tracking-[0.2em] uppercase mt-1">
                Platform Configuration
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex border-b border-border mb-8">
          <button className="flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 border-accent text-accent">
            <Users className="w-4 h-4" /> Users
          </button>
          <button className="flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 border-transparent text-content-secondary hover:text-content-primary transition-colors">
            <Shield className="w-4 h-4" /> Roles & Permissions
          </button>
          <button className="flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 border-transparent text-content-secondary hover:text-content-primary transition-colors">
            <Building2 className="w-4 h-4" /> Departments
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center bg-elevated">
            <h2 className="text-sm font-medium">User Management</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent-hover">
              Add User
            </button>
          </div>
          
          <div className="p-0">
            {loading ? (
              <div className="p-12 text-center text-content-muted">Loading users...</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-content-muted uppercase bg-elevated border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Username (ID)</th>
                    <th className="px-6 py-4">Full Name</th>
                    <th className="px-6 py-4">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id} className="border-b border-border hover:bg-elevated transition-colors">
                      <td className="px-6 py-4 font-mono">{u.username}</td>
                      <td className="px-6 py-4">{u.full_name || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className="bg-accent/10 text-accent px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase">
                          {u.role.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-content-muted">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-border bg-elevated">
                <h3 className="font-bold text-lg">Create New Account</h3>
                <button onClick={() => setShowAddModal(false)} className="text-content-muted hover:text-content-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-content-secondary uppercase tracking-wider mb-2">Username / Employee ID</label>
                  <input required type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-content-secondary uppercase tracking-wider mb-2">Full Name</label>
                  <input required type="text" value={newFullName} onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-content-secondary uppercase tracking-wider mb-2">Password</label>
                  <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-content-secondary uppercase tracking-wider mb-2">Role</label>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none transition-colors appearance-none">
                    <option value="SUPER_ADMIN">SUPER ADMIN</option>
                    <option value="INVESTIGATING_OFFICER">INVESTIGATING OFFICER</option>
                    <option value="LEGAL_OFFICER">LEGAL OFFICER</option>
                    <option value="FORENSIC_OFFICER">FORENSIC OFFICER</option>
                    <option value="AUDITOR">AUDITOR</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-content-secondary hover:text-content-primary transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]">
                    Create Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
