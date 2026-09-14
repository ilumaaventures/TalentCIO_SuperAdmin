import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import {
    ArrowLeft,
    Loader2,
    Save,
    Component,
    Clock,
    Calendar,
    CalendarDays,
    FileText,
    Users,
    MessageSquare,
    BookOpen,
    Building,
    Building2,
    Briefcase,
    Folder,
    UserCog,
    UserPlus,
    LogOut,
    Mail,
    Megaphone,
    Receipt,
    FileStack,
    Network,
    LayoutGrid,
    TrendingUp,
    ShieldCheck,
    Search,
    Check,
    X,
    Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const ICON_MAP = {
    Clock,
    Calendar,
    CalendarDays,
    FileText,
    Users,
    MessageSquare,
    BookOpen,
    Building,
    Building2,
    Briefcase,
    Folder,
    UserCog,
    UserPlus,
    LogOut,
    Mail,
    Megaphone,
    Receipt,
    FileStack,
    Network,
    LayoutGrid,
    TrendingUp,
    ShieldCheck
};

const PROJECTS_MODULE_ID = 'projects';
const PROJECT_DEPENDENCIES = ['businessUnits', 'clients'];

const applyProjectDependencies = (moduleIds = []) => {
    const enabledSet = new Set(moduleIds);

    if (enabledSet.has(PROJECTS_MODULE_ID)) {
        PROJECT_DEPENDENCIES.forEach((dependencyId) => enabledSet.add(dependencyId));
    }

    return Array.from(enabledSet);
};

const Modules = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [modules, setModules] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'enabled' | 'disabled'

    useEffect(() => {
        api.get(`/companies/${id}/modules`).then(res => {
            setModules(res.data.modules || []);
            setCompanyName(res.data.companyName || '');
            setLoading(false);
        }).catch(() => {
            toast.error('Failed to load modules');
            navigate('/companies');
        });
    }, [id, navigate]);

    const handleToggle = (moduleId) => {
        const enabledSet = new Set(modules.filter((module) => module.enabled).map((module) => module.id));
        const isCurrentlyEnabled = enabledSet.has(moduleId);

        if (moduleId === PROJECTS_MODULE_ID) {
            if (isCurrentlyEnabled) {
                enabledSet.delete(PROJECTS_MODULE_ID);
            } else {
                enabledSet.add(PROJECTS_MODULE_ID);
                PROJECT_DEPENDENCIES.forEach((dependencyId) => enabledSet.add(dependencyId));
            }
        } else {
            if (isCurrentlyEnabled) {
                enabledSet.delete(moduleId);
                if (PROJECT_DEPENDENCIES.includes(moduleId)) {
                    enabledSet.delete(PROJECTS_MODULE_ID);
                }
            } else {
                enabledSet.add(moduleId);
            }
        }

        const nextEnabledModules = applyProjectDependencies(Array.from(enabledSet));
        setModules(modules.map((module) => ({
            ...module,
            enabled: nextEnabledModules.includes(module.id)
        })));
    };

    const handleEnableAll = () => {
        const allIds = modules.map((m) => m.id);
        const nextEnabledModules = applyProjectDependencies(allIds);
        setModules(modules.map((m) => ({
            ...m,
            enabled: nextEnabledModules.includes(m.id)
        })));
        toast.success('All modules enabled');
    };

    const handleDisableAll = () => {
        setModules(modules.map((m) => ({
            ...m,
            enabled: false
        })));
        toast('All modules disabled', { icon: '⚠️' });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const enabledModules = applyProjectDependencies(modules.filter(m => m.enabled).map(m => m.id));
            await api.put(`/companies/${id}/modules`, { enabledModules });
            toast.success('Module configuration saved successfully');
        } catch (err) {
            toast.error('Failed to save modules');
        } finally {
            setSaving(false);
        }
    };

    const enabledCount = modules.filter(m => m.enabled).length;

    const filteredModules = useMemo(() => {
        return modules.filter(mod => {
            const matchesSearch = !searchQuery || 
                mod.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                mod.id.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (!matchesSearch) return false;
            if (filterStatus === 'enabled') return mod.enabled;
            if (filterStatus === 'disabled') return !mod.enabled;
            return true;
        });
    }, [modules, searchQuery, filterStatus]);

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex items-center gap-4 sm:gap-6">
                    <button onClick={() => navigate(`/companies/${id}`)} className="p-3 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all text-slate-400 bg-white border border-slate-100 shadow-sm active:scale-90 cursor-pointer">
                        <ArrowLeft size={24} strokeWidth={3} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Feature Modules</h1>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                                {enabledCount} of {modules.length} Active
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1">
                            Configuring capabilities for <span className="text-indigo-600 font-bold">{companyName}</span>
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-slate-900 hover:bg-black text-white px-7 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all shadow-xl shadow-slate-900/10 disabled:opacity-40 active:scale-[0.98] cursor-pointer shrink-0"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>Save Changes</span>
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search modules (e.g. Sales CRM, Attendance, Leaves)..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end">
                    <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
                        <button
                            type="button"
                            onClick={() => setFilterStatus('all')}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${filterStatus === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
                        >
                            All ({modules.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterStatus('enabled')}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${filterStatus === 'enabled' ? 'bg-indigo-600 text-white shadow-2xs' : 'hover:text-slate-900'}`}
                        >
                            Active ({enabledCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterStatus('disabled')}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${filterStatus === 'disabled' ? 'bg-slate-700 text-white shadow-2xs' : 'hover:text-slate-900'}`}
                        >
                            Disabled ({modules.length - enabledCount})
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={handleEnableAll}
                            className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all cursor-pointer border border-indigo-200/60"
                        >
                            Enable All
                        </button>
                        <button
                            type="button"
                            onClick={handleDisableAll}
                            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                        >
                            Disable All
                        </button>
                    </div>
                </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.map(mod => {
                    const IconComponent = ICON_MAP[mod.icon] || Component;

                    return (
                        <div
                            key={mod.id}
                            onClick={() => handleToggle(mod.id)}
                            className={`p-1 group cursor-pointer rounded-[32px] transition-all duration-300 transform hover:-translate-y-1 select-none
                                ${mod.enabled ? 'bg-indigo-600 shadow-xl shadow-indigo-600/20' : 'bg-slate-200 hover:bg-slate-300 shadow-sm'}`}
                        >
                            <div className="bg-white p-7 rounded-[30px] h-full flex flex-col">
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-4 rounded-2xl transition-all duration-300 ${mod.enabled ? 'bg-indigo-50 text-indigo-600 ring-4 ring-indigo-50' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                                        <IconComponent size={30} strokeWidth={2.5} />
                                    </div>
                                    <div className={`relative inline-block w-14 h-7 rounded-full transition-all duration-500 ${mod.enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                        <span className={`absolute left-1.5 top-1.5 bg-white w-4 h-4 rounded-full shadow-lg transition-all duration-500 ${mod.enabled ? 'translate-x-7 scale-110' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                                
                                <h3 className={`text-lg font-black tracking-tight transition-colors ${mod.enabled ? 'text-indigo-900' : 'text-slate-700'}`}>{mod.label}</h3>
                                <p className={`text-xs mt-2.5 font-semibold leading-relaxed transition-colors flex-1 ${mod.enabled ? 'text-indigo-600/80' : 'text-slate-400'}`}>
                                    {mod.enabled 
                                        ? 'This module is currently active and fully accessible to all company stakeholders.' 
                                        : 'This module is restricted and will not be visible in the company dashboard.'}
                                </p>
                                
                                <div className={`mt-6 pt-4 border-t font-black text-[10px] uppercase tracking-widest transition-colors flex items-center justify-between ${mod.enabled ? 'border-indigo-50 text-indigo-500' : 'border-slate-50 text-slate-300'}`}>
                                    <span>{mod.enabled ? 'Priority Access' : 'Disabled'}</span>
                                    <span className="text-[11px] font-bold lowercase opacity-70">#{mod.id}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredModules.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
                    <p className="text-slate-400 font-bold text-sm">No modules matching your filter "{searchQuery}"</p>
                    <button
                        type="button"
                        onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
                        className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default Modules;
