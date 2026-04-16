import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Building2, Mail, Phone, MapPin, Globe, Loader2, ArrowLeft, Settings, Activity, Component } from 'lucide-react';
import toast from 'react-hot-toast';

const CompanyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [compRes, anRes] = await Promise.all([
                    api.get(`/companies/${id}`),
                    api.get(`/companies/${id}/analytics`)
                ]);
                setCompany(compRes.data);
                setAnalytics(anRes.data);
            } catch (err) {
                toast.error('Failed to load company details');
                navigate('/companies');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, navigate]);

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 flex items-center animate-spin text-primary-500" /></div>;
    if (!company) return null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-6">
                <button onClick={() => navigate('/companies')} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 bg-white border border-slate-100 shadow-sm active:scale-90">
                    <ArrowLeft size={24} strokeWidth={3} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{company.name}</h1>
                    <p className="text-slate-500 font-medium">{company.subdomain}.talentcio.in</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-10">
                        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            <Building2 className="text-indigo-500" size={24} strokeWidth={2.5} /> Company Profile
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Primary Contact</p><p className="text-sm font-bold text-slate-800">{company.contactPerson || 'N/A'}</p></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Direct Phone</p><p className="text-sm font-bold text-slate-800 flex items-center gap-2"><Phone size={14} className="text-indigo-400" />{company.contactPhone || 'N/A'}</p></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Official Email</p><p className="text-sm font-bold text-slate-800 flex items-center gap-2"><Mail size={14} className="text-indigo-400" />{company.email}</p></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Industry Segment</p><p className="text-sm font-bold text-slate-800">{company.industry || 'N/A'}</p></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Localization</p><p className="text-sm font-bold text-slate-800 flex items-center gap-2"><MapPin size={14} className="text-indigo-400" />{company.country || 'N/A'}</p></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Operating Timezone</p><p className="text-sm font-bold text-slate-800 flex items-center gap-2"><Globe size={14} className="text-indigo-400" />{company.timezone}</p></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Active Subscription</p><p className="text-sm font-black text-indigo-600">{company.planId?.name || 'No Plan Active'}</p></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Network Status</p>
                                <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mt-2 ${company.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${company.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                    {company.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-10">
                        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            <Activity className="text-indigo-500" size={24} strokeWidth={2.5} /> Real-time Analytics
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:bg-slate-900 transition-all duration-300">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-500">Workforce</p>
                                <p className="text-3xl font-black text-slate-800 mt-2 group-hover:text-white transition-colors">{analytics?.totalEmployees || 0}</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:bg-emerald-600 transition-all duration-300">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-100">Live Users</p>
                                <p className="text-3xl font-black text-slate-800 mt-2 group-hover:text-white transition-colors">{analytics?.activeUsers || 0}</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:bg-indigo-600 transition-all duration-300">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-100">Enabled Services</p>
                                <p className="text-3xl font-black text-slate-800 mt-2 group-hover:text-white transition-colors">{company.enabledModules?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-indigo-600 rounded-[32px] shadow-xl shadow-indigo-600/20 p-8 text-white">
                        <h3 className="text-xl font-black mb-6">Master Controls</h3>
                        <div className="space-y-4">
                            <button onClick={() => navigate(`/companies/${id}/settings`)} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all text-left group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white text-indigo-600 rounded-xl shadow-lg transition-transform group-hover:scale-110"><Settings size={20} strokeWidth={2.5} /></div>
                                    <span className="font-bold text-sm">System Settings</span>
                                </div>
                            </button>
                            <button onClick={() => navigate(`/companies/${id}/modules`)} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all text-left group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white text-slate-900 rounded-xl shadow-lg transition-transform group-hover:scale-110"><Component size={20} strokeWidth={2.5} /></div>
                                    <span className="font-bold text-sm">Service Modules</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;
