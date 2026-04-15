import React, { useState, useEffect } from 'react';
import api from '../api';
import DataTable from '../components/DataTable';
import { Search, History, Calendar, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Filters
    const [companies, setCompanies] = useState([]);
    const [filterCompany, setFilterCompany] = useState('');
    const [filterAction, setActionSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page,
                limit: 15,
                companyId: filterCompany,
                action: filterAction,
                startDate,
                endDate
            }).toString();
            
            const res = await api.get(`/logs?${query}`);
            setLogs(res.data.logs);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            toast.error('Failed to load activity logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        api.get('/companies?limit=100').then(res => setCompanies(res.data.companies)).catch(console.error);
    }, []);

    useEffect(() => {
        const timer = setTimeout(fetchLogs, filterAction ? 500 : 0);
        return () => clearTimeout(timer);
    }, [page, filterCompany, filterAction, startDate, endDate]);

    const ActionIcon = ({ action }) => {
        if (action.includes('CREATED')) return <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />;
        if (action.includes('DELETED') || action.includes('SUSPENDED')) return <span className="w-2 h-2 rounded-full bg-red-500 mr-2" />;
        if (action.includes('UPDATED') || action.includes('TOGGLED')) return <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />;
        return <span className="w-2 h-2 rounded-full bg-slate-400 mr-2" />;
    };
    
    const PayloadDetail = ({ details }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        if (!details || Object.keys(details).length === 0) return <span className="text-slate-300">-</span>;
        
        const fullText = Object.entries(details).map(([key, val]) => {
            const valStr = typeof val === 'object' ? JSON.stringify(val).replace(/["{}]/g, '') : String(val);
            return `${key.toUpperCase()}: ${valStr}`;
        }).join(' | ');

        if (fullText.length <= 30) {
            return <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{fullText}</div>;
        }

        return (
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter max-w-[250px]">
                {isExpanded ? fullText : `${fullText.substring(0, 30)}...`}
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-1 text-indigo-600 hover:text-indigo-800 font-black cursor-pointer lowercase"
                >
                    {isExpanded ? ' show less' : ' read more'}
                </button>
            </div>
        );
    };

    const columns = [
        {
            header: 'Timestamp',
            accessor: 'createdAt',
            render: (row) => (
                <div className="text-slate-400 font-bold text-[11px] uppercase tracking-tighter whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleString()}
                </div>
            )
        },
        {
            header: 'Action / Event',
            accessor: 'action',
            render: (row) => (
                <div className="flex flex-col">
                    <div className="flex items-center text-slate-800 font-black tracking-tight text-xs uppercase">
                        <ActionIcon action={row.action} />
                        {row.action.replace(/_/g, ' ')}
                    </div>
                    {row.entity && <div className="text-[10px] font-bold text-slate-400 mt-0.5 ml-4 uppercase tracking-widest">{row.entity}</div>}
                </div>
            )
        },
        {
            header: 'Network Context',
            accessor: 'companyId',
            render: (row) => row.companyId ? (
                <div className="flex items-center gap-1.5 font-bold text-indigo-600 text-xs">
                    <Building2 size={12} />
                    <span>{row.companyId.name}</span>
                </div>
            ) : (
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Global Core</div>
            )
        },
        {
            header: 'Executor',
            accessor: 'performedBy',
            render: (row) => (
                <div className="flex items-center gap-2">
                    {row.performedBy ? (
                        <>
                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                                {row.performedBy.name.charAt(0)}
                            </div>
                            <span className="text-xs font-bold text-slate-700">{row.performedBy.name}</span>
                        </>
                    ) : (
                        <span className="text-[10px] font-black text-slate-300 uppercase italic">System Engine</span>
                    )}
                </div>
            )
        },
        {
            header: 'Audit Payload',
            accessor: 'details',
            render: (row) => <PayloadDetail details={row.details} />
        }
    ];

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <History className="text-primary-600" /> Audit Log
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Review system-wide super administrator actions</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap lg:flex-nowrap items-center gap-6 shrink-0">
                <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search specific activity type..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                        value={filterAction}
                        onChange={(e) => { setActionSearch(e.target.value); setPage(1); }}
                    />
                </div>
                
                <div className="w-full lg:w-56">
                    <select
                        className="w-full py-3 px-4 bg-slate-50 border-transparent rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white cursor-pointer transition-all"
                        value={filterCompany}
                        onChange={(e) => { setFilterCompany(e.target.value); setPage(1); }}
                    >
                        <option value="">Global Filter</option>
                        {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative w-full lg:w-44">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="date" 
                            className="w-full pl-10 pr-3 py-3 bg-slate-50 border-transparent rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 cursor-pointer transition-all"
                            value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }}
                        />
                    </div>
                    <span className="text-slate-300 font-bold">to</span>
                    <div className="relative w-full lg:w-44">
                         <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="date" 
                            className="w-full pl-10 pr-3 py-3 bg-slate-50 border-transparent rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 cursor-pointer transition-all"
                            value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>
                {(filterAction || filterCompany || startDate || endDate) && (
                     <button 
                        onClick={() => {
                            setActionSearch(''); setFilterCompany(''); setStartDate(''); setEndDate(''); setPage(1);
                        }}
                        className="px-4 py-2 text-xs font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                     >
                         Reset
                     </button>
                )}
            </div>

             <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <DataTable
                    columns={columns}
                    data={logs}
                    loading={loading}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
};

export default Logs;
