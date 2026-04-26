"use client";

import React, { useState, useEffect } from "react";
import {
  Users as UsersIcon,
  Search,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Edit,
  Trash2,
  Eye,
  XCircle,
  MoreVertical,
  Loader2,
  Calendar,
  ArrowRight,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    role: "",
    is_active: true,
  });

  // Add User Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    role: "BUYER",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getUsers();
      setUsers(data.results || data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      role: user.role || "USER",
      is_active: user.is_active !== undefined ? user.is_active : true,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSubmitting(true);
    try {
      await apiClient.updateUser(editingUser.id, formData);
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.register(addFormData);
      setShowAddModal(false);
      setAddFormData({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        role: "BUYER",
      });
      fetchUsers();
    } catch (err: any) {
      console.error("Failed to add user", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to permanently delete user ${name}?`
      )
    ) {
      try {
        await apiClient.deleteUser(id);
        fetchUsers();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const roleStyles = {
    SUPER_ADMIN: "bg-purple-50 text-purple-600 border-purple-100",
    ADMIN: "bg-indigo-50 text-indigo-600 border-indigo-100",
    VENDOR: "bg-emerald-50 text-emerald-600 border-emerald-100",
    BUYER: "bg-gray-50 text-gray-500 border-gray-100",
    DRIVER: "bg-amber-50 text-amber-600 border-amber-100",
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-gray-100 pb-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic">
            User <span className="text-gray-300">Directory.</span>
          </h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <UsersIcon className="w-3 h-3" />
            {users.length} Registered Accounts Managed
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Find account..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 py-3 pl-12 pr-4 bg-gray-50 border border-gray-50 rounded-xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
              />
           </div>
           <button
             onClick={() => setShowAddModal(true)}
             className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-gray-200"
           >
             <UserPlus className="w-4 h-4" /> Provision User
           </button>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center">
             <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="py-6 px-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">User Entity</th>
                <th className="py-6 px-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Permission Level</th>
                <th className="py-6 px-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Security Status</th>
                <th className="py-6 px-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredUsers.map((user, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={user.id}
                    className="group hover:bg-indigo-50/30 transition-colors"
                  >
                    <td className="py-6 px-10">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-sm font-black italic group-hover:rotate-6 transition-transform">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                           <h5 className="text-sm font-black text-gray-900 tracking-tight italic">{user.username}</h5>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-10">
                      <span className={cn(
                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                        roleStyles[user.role as keyof typeof roleStyles] || "bg-gray-50"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-6 px-10">
                       <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            user.is_active ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                          )} />
                          <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                            {user.is_active ? "Active" : "Locked"}
                          </span>
                       </div>
                    </td>
                    <td className="py-6 px-10">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(user)} className="p-3 bg-white text-gray-400 hover:text-indigo-600 hover:shadow-lg rounded-xl transition-all border border-gray-100">
                             <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(user.id, user.username)} className="p-3 bg-white text-gray-400 hover:text-rose-600 hover:shadow-lg rounded-xl transition-all border border-gray-100">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS (Shared Design) */}
      <AnimatePresence>
        {(showEditModal || showAddModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => { setShowEditModal(false); setShowAddModal(false); }}
               className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-xl bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden"
             >
                <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                   <div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic">
                        {showEditModal ? "Modify Access" : "Provision User"}
                      </h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {showEditModal ? `Configuring ID: ${editingUser?.username}` : "Onboarding new platform entity"}
                      </p>
                   </div>
                   <button onClick={() => { setShowEditModal(false); setShowAddModal(false); }} className="p-3 bg-gray-50 text-gray-400 hover:text-rose-500 rounded-2xl transition-colors">
                      <XCircle className="w-6 h-6" />
                   </button>
                </div>

                <div className="p-10">
                   {showEditModal ? (
                      <form onSubmit={handleUpdate} className="space-y-8">
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">First Name</label>
                               <input 
                                 value={formData.first_name}
                                 onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                 className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-bold italic focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                               />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Name</label>
                               <input 
                                 value={formData.last_name}
                                 onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                 className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-bold italic focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                               />
                            </div>
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Role</label>
                            <select 
                               value={formData.role}
                               onChange={(e) => setFormData({...formData, role: e.target.value})}
                               className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-black uppercase italic tracking-widest focus:ring-4 focus:ring-indigo-100 outline-none transition-all appearance-none cursor-pointer"
                            >
                               {["BUYER", "VENDOR", "DRIVER", "ADMIN"].map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                         </div>
                         <div className="flex items-center gap-3 p-6 bg-gray-50 rounded-2xl">
                            <input 
                              type="checkbox"
                              id="active_check"
                              checked={formData.is_active}
                              onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                              className="w-5 h-5 rounded-lg border-gray-200 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="active_check" className="text-xs font-bold italic text-gray-600 select-none cursor-pointer">Entity is authorized for platform login</label>
                         </div>
                         <button disabled={isSubmitting} type="submit" className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-3">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authorize Changes"}
                         </button>
                      </form>
                   ) : (
                      <form onSubmit={handleAddUser} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                           <input placeholder="First Name" required value={addFormData.first_name} onChange={(e) => setAddFormData({...addFormData, first_name: e.target.value})} className="bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-bold italic focus:ring-4 focus:ring-indigo-100 outline-none" />
                           <input placeholder="Last Name" required value={addFormData.last_name} onChange={(e) => setAddFormData({...addFormData, last_name: e.target.value})} className="bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-bold italic focus:ring-4 focus:ring-indigo-100 outline-none" />
                        </div>
                        <input placeholder="Username" required value={addFormData.username} onChange={(e) => setAddFormData({...addFormData, username: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-bold italic focus:ring-4 focus:ring-indigo-100 outline-none" />
                        <input placeholder="Email" type="email" required value={addFormData.email} onChange={(e) => setAddFormData({...addFormData, email: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-bold italic focus:ring-4 focus:ring-indigo-100 outline-none" />
                        <input placeholder="Security Key (Password)" type="password" required value={addFormData.password} onChange={(e) => setAddFormData({...addFormData, password: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-bold italic focus:ring-4 focus:ring-indigo-100 outline-none" />
                        <select 
                           value={addFormData.role}
                           onChange={(e) => setAddFormData({...addFormData, role: e.target.value})}
                           className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-black uppercase italic tracking-widest appearance-none cursor-pointer"
                        >
                           {["BUYER", "VENDOR", "DRIVER", "ADMIN"].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <button disabled={isSubmitting} type="submit" className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
                           {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Provisioning"}
                        </button>
                      </form>
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
