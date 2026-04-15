import React, { useState, useEffect } from 'react';
import api from '../api';
import StatCard from '../components/StatCard';
import { Building2, Users, Briefcase, MessageSquare, Activity, Loader2, BadgeCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#3b82f6', '#10b981'];

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/analytics');
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return (
        <div className="flex h-full items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
    );

    if (!data) return null;

    const { cards, companyGrowth, employeesByCompany, moduleUsageData } = data;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Global Overview</h1>
                <p className="text-slate-500 text-sm mt-1">Platform-wide statistics across all tenants</p>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                <StatCard title="Total Companies" value={cards.totalCompanies} icon={Building2} trend={12} trendLabel="vs last month" />
                <StatCard title="Active Companies" value={cards.activeCompanies} icon={BadgeCheck} colorClass="text-green-600" bgClass="bg-green-50" />
                <StatCard title="Total Employees" value={cards.totalEmployees} icon={Users} colorClass="text-blue-600" bgClass="bg-blue-50" trend={5} trendLabel="vs last month" />
                <StatCard title="Active Users" value={cards.activeUsers} icon={Activity} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
                <StatCard title="Open Positions" value={cards.totalHiring} icon={Briefcase} colorClass="text-orange-600" bgClass="bg-orange-50" />
                <StatCard title="Helpdesk Tickets" value={cards.totalTickets} icon={MessageSquare} colorClass="text-pink-600" bgClass="bg-pink-50" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6">Company Growth (Last 12 Months)</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={companyGrowth}>
                                <defs>
                                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="companies" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6">Top Companies by Employee Count</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={employeesByCompany} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="company" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="employees" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6">Global Module Usage</h3>
                    <div className="h-64 flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={moduleUsageData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="module"
                                >
                                    {moduleUsageData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-3">
                        {moduleUsageData.map((entry, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                                <span className="truncate" title={entry.module}>{entry.module} ({entry.count})</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-indigo-600 rounded-xl shadow-sm lg:col-span-2 p-8 flex items-center overflow-hidden relative">
                    <div className="absolute top-0 right-0 -tr_translate-y-12 translate-x-12 opacity-10">
                        <Briefcase className="w-64 h-64" />
                    </div>
                    <div className="relative z-10 text-white max-w-xl space-y-4">
                        <h2 className="text-3xl font-bold">TalentCio Network is Growing</h2>
                        <p className="text-indigo-100 text-lg">
                            Over <span className="font-bold text-white">{cards.totalCompanies}</span> companies currently trust TalentCio to manage their workforce. Support your customers and manage tenant isolation securely from here.
                        </p>
                        <button className="mt-4 bg-white text-indigo-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                            View All Companies
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
