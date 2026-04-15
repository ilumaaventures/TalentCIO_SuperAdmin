import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, Loader2, Save, Component } from 'lucide-react';
import toast from 'react-hot-toast';

const Modules = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [modules, setModules] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get(`/companies/${id}/modules`).then(res => {
            setModules(res.data.modules);
            setCompanyName(res.data.companyName);
            setLoading(false);
        }).catch(() => {
            toast.error('Failed to load modules');
            navigate('/companies');
        });
    }, [id]);

    const handleToggle = (moduleId) => {
        setModules(modules.map(m => m.id === moduleId ? { ...m, enabled: !m.enabled } : m));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const enabledModules = modules.filter(m => m.enabled).map(m => m.id);
            await api.put(`/companies/${id}/modules`, { enabledModules });
            toast.success('Module configuration saved');
        } catch (err) {
            toast.error('Failed to save modules');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate(`/companies/${id}`)} className="p-3 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all text-slate-400 bg-white border border-slate-100 shadow-sm active:scale-90">
                        <ArrowLeft size={24} strokeWidth={3} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Feature Modules</h1>
                        <p className="text-slate-500 font-medium mt-1">Configuring capabilities for <span className="text-indigo-600 font-bold">{companyName}</span></p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-slate-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-xl shadow-slate-900/10 disabled:opacity-30 active:scale-[0.98]"
                >
                    {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {modules.map(mod => (
                    <div
                        key={mod.id}
                        onClick={() => handleToggle(mod.id)}
                        className={`p-1 group cursor-pointer rounded-[32px] transition-all duration-300 transform hover:-translate-y-1
                            ${mod.enabled ? 'bg-indigo-600 shadow-xl shadow-indigo-600/20' : 'bg-slate-200 hover:bg-slate-300 shadow-sm'}`}
                    >
                        <div className="bg-white p-7 rounded-[30px] h-full flex flex-col">
                            <div className="flex items-start justify-between mb-8">
                                <div className={`p-4 rounded-2xl transition-all duration-300 ${mod.enabled ? 'bg-indigo-50 text-indigo-600 ring-4 ring-indigo-50' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                                    <Component size={32} strokeWidth={2.5} />
                                </div>
                                <div className={`relative inline-block w-14 h-7 rounded-full transition-all duration-500 ${mod.enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                    <span className={`absolute left-1.5 top-1.5 bg-white w-4 h-4 rounded-full shadow-lg transition-all duration-500 ${mod.enabled ? 'translate-x-7 scale-110' : 'translate-x-0'}`} />
                                </div>
                            </div>
                            
                            <h3 className={`text-xl font-black tracking-tight transition-colors ${mod.enabled ? 'text-indigo-900' : 'text-slate-700'}`}>{mod.label}</h3>
                            <p className={`text-sm mt-3 font-semibold leading-relaxed transition-colors flex-1 ${mod.enabled ? 'text-indigo-600/80' : 'text-slate-400'}`}>
                                {mod.enabled 
                                    ? 'This module is currently active and fully accessible to all company stakeholders.' 
                                    : 'This module is restricted and will not be visible in the company dashboard.'}
                            </p>
                            
                            <div className={`mt-8 pt-6 border-t font-black text-[10px] uppercase tracking-widest transition-colors ${mod.enabled ? 'border-indigo-50 text-indigo-500' : 'border-slate-50 text-slate-300'}`}>
                                {mod.enabled ? 'Priority Access' : 'Disabled'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Modules;
