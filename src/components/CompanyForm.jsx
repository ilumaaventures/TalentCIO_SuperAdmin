import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const CompanyForm = ({ isOpen, onClose, company = null, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', subdomain: '', email: '', contactPerson: '', contactPhone: '',
        industry: '', country: '', timezone: 'Asia/Kolkata', planId: '',
        allowedDomains: '' // comma-separated domains string for UI
    });
    const [plans, setPlans] = useState([]);
    const [createAdmin, setCreateAdmin] = useState(false);
    const [adminData, setAdminData] = useState({
        firstName: '', lastName: '', email: '', password: ''
    });

    useEffect(() => {
        if (isOpen) {
            api.get('/plans').then(res => setPlans(res.data)).catch(console.error);
            if (company) {
                setFormData({
                    name: company.name || '',
                    subdomain: company.subdomain || '',
                    email: company.email || '',
                    contactPerson: company.contactPerson || '',
                    contactPhone: company.contactPhone || '',
                    industry: company.industry || '',
                    country: company.country || '',
                    timezone: company.timezone || 'Asia/Kolkata',
                    planId: company.planId?._id || company.planId || '',
                    allowedDomains: Array.isArray(company.allowedDomains) ? company.allowedDomains.join(', ') : ''
                });
            } else {
                setFormData({
                    name: '', subdomain: '', email: '', contactPerson: '', contactPhone: '',
                    industry: '', country: '', timezone: 'Asia/Kolkata', planId: '',
                    allowedDomains: ''
                });
                setCreateAdmin(false);
                setAdminData({ firstName: '', lastName: '', email: '', password: '' });
            }
        }
    }, [isOpen, company]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { 
                ...formData,
                allowedDomains: formData.allowedDomains.split(',').map(d => d.trim()).filter(d => d !== '')
            };
            if (!company) {
                payload.adminUser = adminData;
            }

            if (company) {
                await api.put(`/companies/${company._id}`, payload);
                toast.success('Company updated successfully');
            } else {
                await api.post('/companies', payload);
                toast.success('Company and Admin created successfully');
            }
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800">{company ? 'Edit Company' : 'Add New Company'}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 flex-1">
                    <form id="company-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                                <input required type="text" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-white transition-all outline-none text-sm"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subdomain *</label>
                                <div className="flex rounded-lg shadow-sm">
                                    <input required type="text" className="flex-1 min-w-0 px-4 py-2.5 border border-slate-300 rounded-none rounded-l-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-white transition-all outline-none text-sm"
                                        value={formData.subdomain} onChange={e => setFormData({ ...formData, subdomain: e.target.value })} disabled={!!company} placeholder="e.g. acme" />
                                    <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                                        {import.meta.env.VITE_MAIN_DOMAIN || '.talentcio.in'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Company Email *</label>
                                <input required type="email" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-white transition-all outline-none text-sm"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subscription Plan</label>
                                <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-white transition-all outline-none text-sm appearance-none"
                                    value={formData.planId} onChange={e => setFormData({ ...formData, planId: e.target.value })}>
                                    <option value="">Select a plan</option>
                                    {plans.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                                <input type="text" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-white transition-all outline-none text-sm"
                                    value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                                <input type="text" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-white transition-all outline-none text-sm"
                                    value={formData.contactPhone} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                                <input type="text" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-white transition-all outline-none text-sm"
                                    value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                                <input type="text" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-white transition-all outline-none text-sm"
                                    value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
                            </div>

                            <div className="col-span-full">
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                    Allowed Email Domains
                                    <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded italic">Security Policy</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="example.com, example.in (separate with commas)"
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-white transition-all outline-none text-sm"
                                    value={formData.allowedDomains} 
                                    onChange={e => setFormData({ ...formData, allowedDomains: e.target.value })} 
                                />
                                <p className="mt-1 text-xs text-slate-500">Only users with these email domains will be able to join this company. Leave empty for no restriction.</p>
                            </div>

                            {/* Section for Initial Admin User */}
                            {!company && (
                                <div className="col-span-full border-t border-slate-100 pt-6 mt-2">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">Setup Initial Admin Account</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Admin First Name *</label>
                                            <input required type="text" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-white transition-all outline-none text-sm"
                                                value={adminData.firstName} onChange={e => setAdminData({ ...adminData, firstName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Admin Last Name *</label>
                                            <input required type="text" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-white transition-all outline-none text-sm"
                                                value={adminData.lastName} onChange={e => setAdminData({ ...adminData, lastName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Admin Email *</label>
                                            <input required type="email" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-white transition-all outline-none text-sm"
                                                value={adminData.email} onChange={e => setAdminData({ ...adminData, email: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Admin Password *</label>
                                            <input required type="password" title="At least 6 characters" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-white transition-all outline-none text-sm"
                                                value={adminData.password} onChange={e => setAdminData({ ...adminData, password: e.target.value })} minLength={6} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form="company-form" disabled={loading} className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-slate-900 flex items-center gap-2 disabled:opacity-70 transition-colors">
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {company ? 'Save Changes' : 'Create Company'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyForm;
