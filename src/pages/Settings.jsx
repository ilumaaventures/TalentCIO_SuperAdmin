import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Key, Loader2, Save } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const Settings = () => {
    const { admin, setAdmin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [infoLoading, setInfoLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: admin?.name || '',
        email: admin?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setInfoLoading(true);
        try {
            const { data } = await api.put('/auth/profile', { 
                name: formData.name, 
                email: formData.email 
            });
            setAdmin(data.admin);
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setInfoLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            return toast.error("New passwords don't match");
        }
        
        setLoading(true);
        try {
            await api.put('/auth/password', { 
                currentPassword: formData.currentPassword, 
                newPassword: formData.newPassword 
            });
            toast.success('Password updated successfully');
            setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Account Settings</h1>
                <p className="text-slate-500 text-sm mt-1">Manage your Super Admin profile and security preferences</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-start gap-6">
                    <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-4 border-white shadow-lg shrink-0">
                        <User size={40} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{admin?.name}</h2>
                        <p className="text-slate-500">{admin?.email}</p>
                        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                            <Shield size={14} />
                            Super Administrator
                        </div>
                    </div>
                </div>

                    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                <User size={18} className="text-indigo-500"/> Personal Information
                            </h3>
                            <form onSubmit={handleUpdateProfile} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1.5">Full Name</label>
                                    <input 
                                        type="text" required
                                        className="w-full border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 placeholder:text-slate-400 py-2.5 transition-all" 
                                        value={formData.name} 
                                        placeholder="Enter your full name"
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1.5">Email Address</label>
                                    <input 
                                        type="email" required
                                        className="w-full border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 placeholder:text-slate-400 py-2.5 transition-all" 
                                        value={formData.email} 
                                        placeholder="Enter your email address"
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={infoLoading || (formData.name === admin?.name && formData.email === admin?.email)}
                                    className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-30 mt-6 shadow-md hover:shadow-lg active:scale-[0.98]"
                                >
                                    {infoLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    Update Profile
                                </button>
                            </form>
                        </div>

                        <div>
                             <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                 <Key size={18} className="text-indigo-500"/> Security & Password
                            </h3>
                            <form onSubmit={handlePasswordChange} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1.5">Current Password</label>
                                    <input 
                                        type="password" required
                                        className="w-full border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 py-2.5 transition-all"
                                        value={formData.currentPassword} 
                                        placeholder="••••••••"
                                        onChange={e => setFormData({ ...formData, currentPassword: e.target.value })} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1.5">New Password</label>
                                    <input 
                                        type="password" required minLength="8"
                                        className="w-full border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 py-2.5 transition-all"
                                        value={formData.newPassword} 
                                        placeholder="Minimum 8 characters"
                                        onChange={e => setFormData({ ...formData, newPassword: e.target.value })} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1.5">Confirm New Password</label>
                                    <input 
                                        type="password" required minLength="8"
                                        className="w-full border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 py-2.5 transition-all"
                                        value={formData.confirmPassword} 
                                        placeholder="Re-type new password"
                                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} 
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-30 mt-6 shadow-md hover:shadow-lg active:scale-[0.98]"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
                                    Change Password
                                </button>
                            </form>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default Settings;
