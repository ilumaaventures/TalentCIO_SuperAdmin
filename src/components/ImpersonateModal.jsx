import React, { useState } from 'react';
import { UserCheck, X, AlertTriangle, Loader2, Building2 } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const ImpersonateModal = ({ isOpen, onClose, user, onSuccess }) => {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !user) return null;

    const displayName = user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email);
    const companyName = user.companyId?.name || 'Workspace';
    const companyDomain = user.companyId?.domain || '';

    const handleImpersonate = async (e) => {
        e.preventDefault();
        const trimmedReason = reason.trim();
        if (!trimmedReason) {
            toast.error('Please enter a reason or ticket reference for impersonation');
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Initiating impersonation session...');

        try {
            const response = await api.post(`/users/${user._id}/impersonate`, { reason: trimmedReason });
            toast.success(`Impersonation session created for ${displayName}`, { id: toastId });

            if (onSuccess) {
                onSuccess(response.data);
            }

            // If target company domain exists, redirect or open tenant app
            if (companyDomain) {
                const targetUrl = window.location.protocol === 'https:'
                    ? `https://${companyDomain}/dashboard`
                    : `http://${companyDomain}:5173/dashboard`;
                
                window.open(targetUrl, '_blank');
            } else {
                toast.success('Session cookie established for tenant application.');
            }

            onClose();
        } catch (error) {
            console.error('Superadmin impersonation failed:', error);
            toast.error(error.response?.data?.message || 'Failed to start impersonation session', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                            <UserCheck size={18} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-base">Impersonate Tenant User</h3>
                            <p className="text-xs text-slate-500">Platform Super Admin Impersonation</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleImpersonate} className="p-6 space-y-4">
                    {/* User info card */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-slate-800 text-sm">{displayName}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-200 text-slate-700">
                                {user.role || 'User'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1.5 border-t border-slate-200/60 font-medium">
                            <Building2 size={13} className="text-indigo-500 shrink-0" />
                            <span>{companyName}</span>
                            {companyDomain && <span className="text-slate-400">({companyDomain})</span>}
                        </div>
                    </div>

                    {/* Warning Notice */}
                    <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600" />
                        <div className="space-y-0.5 leading-relaxed">
                            <p className="font-semibold text-amber-900">Tier B Super Admin Access (30 Min Expiry)</p>
                            <p className="text-amber-800">
                                This action is logged permanently in the system audit logs. Your super admin session will remain active.
                            </p>
                        </div>
                    </div>

                    {/* Reason input (REQUIRED) */}
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">
                            Reason / Support Ticket Reference <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Support ticket #TC-9821 - Customer requested assistance with leave calculation error"
                            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                            maxLength={500}
                            required
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors disabled:opacity-60"
                        >
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
                            <span>{loading ? 'Initiating...' : 'Start Impersonation'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ImpersonateModal;
