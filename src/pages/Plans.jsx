import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, X, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const PlansForm = ({ isOpen, onClose, plan, onSuccess }) => {
    if (!isOpen) return null;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', price: 0, billingCycle: 'Monthly',
        features: [''], maxUsers: 10, isActive: true
    });

    useEffect(() => {
        if (isOpen && plan) {
            setFormData({
                name: plan.name, price: plan.price, billingCycle: plan.billingCycle,
                features: plan.features.length ? plan.features : [''],
                maxUsers: plan.maxUsers, isActive: plan.isActive
            });
        } else {
             setFormData({
                name: '', price: 0, billingCycle: 'Monthly',
                features: [''], maxUsers: 10, isActive: true
            });
        }
    }, [isOpen, plan]);

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const addFeatureField = () => {
        setFormData({ ...formData, features: [...formData.features, ''] });
    };

    const removeFeatureField = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({ ...formData, features: newFeatures.length ? newFeatures : [''] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSubmit = { ...formData, features: formData.features.filter(f => f.trim()) };
            if (plan) {
                await api.put(`/plans/${plan._id}`, dataToSubmit);
                toast.success('Plan updated');
            } else {
                await api.post('/plans', dataToSubmit);
                toast.success('Plan created');
            }
            onSuccess();
            onClose();
        } catch (err) {
            toast.error('Failed to save plan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] border border-slate-200">
                 <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100 bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{plan ? 'Edit Plan' : 'Create New Plan'}</h2>
                        <p className="text-xs text-slate-500 mt-1">Define pricing and features for tenant companies</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-all p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto">
                    <form id="plan-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                             <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Plan Name *</label>
                                <input required type="text" className="w-full border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 py-2.5 transition-all text-sm"
                                    placeholder="e.g. Enterprise Pro"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Price (USD) *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                    <input required type="number" min="0" className="w-full border-slate-200 pl-8 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 py-2.5 transition-all text-sm"
                                        value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Billing Cycle</label>
                                <select className="w-full border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 py-2.5 transition-all text-sm cursor-pointer"
                                    value={formData.billingCycle} onChange={e => setFormData({ ...formData, billingCycle: e.target.value })}>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Yearly">Yearly</option>
                                </select>
                            </div>
                             <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Max Users / Employees</label>
                                <input required type="number" min="1" className="w-full border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 py-2.5 transition-all text-sm"
                                    value={formData.maxUsers} onChange={e => setFormData({ ...formData, maxUsers: Number(e.target.value) })} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3 mt-4">
                                <label className="text-sm font-semibold text-slate-700">Included Features</label>
                                <button type="button" onClick={addFeatureField} className="text-xs text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg">
                                    <Plus size={14} /> Add Feature
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.features.map((feature, idx) => (
                                    <div key={idx} className="flex gap-2 group">
                                        <input type="text" className="flex-1 border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 py-2.5 transition-all text-sm"
                                            value={feature} onChange={e => handleFeatureChange(idx, e.target.value)} placeholder="e.g. 24/7 Premium Support" />
                                        <button type="button" onClick={() => removeFeatureField(idx)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div className="flex items-center gap-3 mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <input type="checkbox" id="isActive" className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                                checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                            <label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer">Plan is active and available for selection</label>
                        </div>
                    </form>
                </div>

                 <div className="px-8 py-6 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all">
                        Cancel
                    </button>
                    <button type="submit" form="plan-form" disabled={loading} className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98]">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        {plan ? 'Save Changes' : 'Create Plan'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await api.get('/plans');
            setPlans(res.data);
        } catch (err) {
            toast.error('Failed to load plans');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this plan?')) return;
        try {
            await api.delete(`/plans/${id}`);
            toast.success('Plan deleted');
            fetchPlans();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete plan');
        }
    };

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 flex animate-spin text-primary-500" /></div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subscription Plans</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage pricing tiers available for tenant companies</p>
                </div>
                <button
                    onClick={() => { setEditingPlan(null); setIsFormOpen(true); }}
                    className="bg-indigo-600 hover:bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                >
                    <Plus size={20} strokeWidth={3} />
                    New Subscription Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div key={plan._id} className={`bg-white rounded-3xl shadow-sm border-2 p-8 flex flex-col transition-all hover:shadow-xl hover:-translate-y-1 ${plan.isActive ? 'border-indigo-50 bg-white' : 'border-slate-100 opacity-80'}`}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{plan.name}</h3>
                                {!plan.isActive && <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-500 text-[10px] rounded-full font-bold uppercase tracking-wider border border-slate-200">Inactive</span>}
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-black text-indigo-600">${plan.price}</span>
                                <span className="text-xs font-bold text-slate-400 block uppercase mt-1">/{plan.billingCycle?.toLowerCase() === 'yearly' ? 'year' : 'month'}</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 my-6">
                             <div className="flex items-center justify-between py-4 border-y border-slate-50">
                                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Max Capacity</span>
                                 <span className="font-black text-slate-700">{plan.maxUsers} <span className="text-slate-400 font-bold">Users</span></span>
                             </div>

                             <div className="pt-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Features</p>
                                <div className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm font-semibold text-slate-600 group">
                                            <div className="p-0.5 rounded-full bg-indigo-50 text-indigo-500 mt-0.5 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>

                        <div className="flex gap-3 pt-8 border-t border-slate-50 mt-auto">
                            <button
                                onClick={() => { setEditingPlan(plan); setIsFormOpen(true); }}
                                className="flex-1 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition-all active:scale-[0.98]"
                            >
                                Edit Settings
                            </button>
                            <button
                                onClick={() => handleDelete(plan._id)}
                                className="px-5 py-3 text-sm font-bold text-red-500 hover:text-white hover:bg-red-500 rounded-2xl transition-all active:scale-[0.98]"
                            >
                                Trash
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <PlansForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                plan={editingPlan}
                onSuccess={fetchPlans}
            />
        </div>
    );
};

export default Plans;
