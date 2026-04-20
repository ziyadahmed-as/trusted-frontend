'use client';

import React, { useState, useEffect } from 'react';
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
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    role: '',
    is_active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getUsers();
      setUsers(data.results || data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
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
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'USER',
        is_active: user.is_active !== undefined ? user.is_active : true
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
        console.error('Failed to update user', err);
        alert('Failed to update user. Please check data.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete user ${name}? This action cannot be undone.`)) {
        try {
            await apiClient.deleteUser(id);
            fetchUsers();
        } catch (err) {
            console.error('Delete failed', err);
            alert('Failed to delete user.');
        }
    }
  };

  const roleStyles = {
    SUPER_ADMIN: "bg-purple-100 text-purple-700",
    ADMIN: "bg-[#3c50e0]/10 text-[#3c50e0]",
    VENDOR: "bg-[#10b981]/10 text-[#10b981]",
    BUYER: "bg-[#64748b]/10 text-[#64748b]",
    DRIVER: "bg-[#f59e0b]/10 text-[#f59e0b]",
  };

  const filteredUsers = users.filter(u => 
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black md:text-3xl">User Management</h2>
          <p className="text-sm font-medium text-[#64748b]">Manage the platform directory, roles, and access control.</p>
        </div>
        <button className="flex items-center gap-2 rounded bg-[#3c50e0] py-2 px-4 font-medium text-white hover:bg-opacity-90 transition shadow-sm">
          <UserPlus className="w-5 h-5" /> Invite User
        </button>
      </div>

      {/* FILTER BAR 
      <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..." 
              className="w-full bg-white border border-[#e2e8f0] focus:border-[#3c50e0] outline-none rounded py-3 pl-12 pr-4 text-sm font-medium transition shadow-sm"
            />
          </div>
      </div>
      */}

      {/* TABLE */}
      <div className="rounded-sm border border-[#e2e8f0] bg-white px-5 pt-6 pb-2.5 shadow-sm sm:px-7.5 xl:pb-1 relative min-h-[400px]">
        {loading ? (
           <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <Loader2 className="w-8 h-8 text-[#3c50e0] animate-spin" />
           </div>
        ) : null}
        
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#f7f9fc] text-left">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black xl:pl-11">User</th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black">Role</th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black">Status</th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black">Joined</th>
                <th className="py-4 px-4 font-medium text-black text-right xl:pr-11">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && !loading ? (
                <tr>
                   <td colSpan={5} className="py-10 text-center text-[#64748b]">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#e2e8f0] last:border-0 hover:bg-[#f9fafb] transition">
                    <td className="py-5 px-4 pl-9 xl:pl-11">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#f7f9fc] uppercase font-bold text-[#3c50e0]">
                           {user.username?.charAt(0) || 'U'}
                         </div>
                         <div>
                            <h5 className="font-medium text-black">{user.username}</h5>
                            <p className="text-sm text-[#64748b]">{user.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 border-b border-[#e2e8f0] last:border-0">
                      <span className={cn("inline-flex rounded-full px-3 py-1 text-sm font-medium", roleStyles[user.role as keyof typeof roleStyles] || "bg-gray-100 text-gray-700")}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-5 px-4 border-b border-[#e2e8f0] last:border-0">
                      <div className="flex items-center gap-2">
                        {user.is_active ? 
                           <ShieldCheck className="w-5 h-5 text-[#10b981]" /> : 
                           <ShieldAlert className="w-5 h-5 text-[#d34053]" />
                        }
                        <span className="text-sm font-medium text-black">{user.is_active ? 'Active' : 'Disabled'}</span>
                      </div>
                    </td>
                    <td className="py-5 px-4 border-b border-[#e2e8f0] last:border-0">
                      <p className="text-sm text-black">{new Date(user.date_joined).toLocaleDateString()}</p>
                    </td>
                    <td className="py-5 px-4 pr-9 xl:pr-11 text-right border-b border-[#e2e8f0] last:border-0">
                      <div className="flex items-center justify-end gap-3">
                        <button title="View Details" className="text-[#64748b] hover:text-[#3c50e0] transition">
                           <Eye className="w-5 h-5" />
                        </button>
                        <button onClick={() => openEditModal(user)} title="Edit Configuration" className="text-[#64748b] hover:text-[#10b981] transition">
                           <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(user.id, user.username)} title="Delete User" className="text-[#64748b] hover:text-[#d34053] transition">
                           <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-sm border border-[#e2e8f0] bg-white shadow-default">
             <div className="border-b border-[#e2e8f0] py-4 px-6.5 flex justify-between items-center bg-[#f7f9fc]">
                 <h3 className="font-semibold text-black">Update User: {editingUser?.username}</h3>
                 <button onClick={() => setShowEditModal(false)} className="text-[#64748b] hover:text-black">
                    <XCircle className="w-5 h-5" />
                 </button>
             </div>
             <form onSubmit={handleUpdate} className="p-6.5">
                 <div className="mb-4.5 flex gap-4">
                     <div className="w-1/2">
                         <label className="mb-2.5 block text-sm font-medium text-black">First Name</label>
                         <input 
                           type="text"
                           value={formData.first_name}
                           onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                           className="w-full rounded border border-[#e2e8f0] bg-transparent py-2.5 px-4 text-sm font-medium outline-none transition focus:border-[#3c50e0]"
                         />
                     </div>
                     <div className="w-1/2">
                         <label className="mb-2.5 block text-sm font-medium text-black">Last Name</label>
                         <input 
                           type="text"
                           value={formData.last_name}
                           onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                           className="w-full rounded border border-[#e2e8f0] bg-transparent py-2.5 px-4 text-sm font-medium outline-none transition focus:border-[#3c50e0]"
                         />
                     </div>
                 </div>
                 
                 <div className="mb-4.5">
                     <label className="mb-2.5 block text-sm font-medium text-black">Platform Role</label>
                     <select 
                       value={formData.role}
                       onChange={(e) => setFormData({...formData, role: e.target.value})}
                       className="w-full rounded border border-[#e2e8f0] bg-transparent py-2.5 px-4 text-sm font-medium outline-none transition focus:border-[#3c50e0]"
                     >
                       <option value="BUYER">BUYER</option>
                       <option value="VENDOR">VENDOR</option>
                       <option value="DRIVER">DRIVER</option>
                       <option value="ADMIN">ADMIN</option>
                     </select>
                 </div>

                 <div className="mb-6 flex items-center gap-3">
                     <input 
                       type="checkbox"
                       id="isActive"
                       checked={formData.is_active}
                       onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                       className="w-4 h-4 text-[#3c50e0] border-[#e2e8f0] rounded focus:ring-[#3c50e0]"
                     />
                     <label htmlFor="isActive" className="text-sm font-medium text-black cursor-pointer">
                        Account is Active (Can Login)
                     </label>
                 </div>

                 <div className="flex justify-end gap-3 border-t border-[#e2e8f0] pt-5">
                    <button 
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="rounded bg-[#f7f9fc] py-2 px-4 text-sm font-medium text-black hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center rounded bg-[#3c50e0] py-2 px-6 text-sm font-medium text-white hover:bg-opacity-90 transition disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                    </button>
                 </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
