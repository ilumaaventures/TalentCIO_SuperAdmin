import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DataTable from '../components/DataTable';
import CompanyForm from '../components/CompanyForm';
import { Plus, Search, Building2, MoreVertical, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);

    const navigate = useNavigate();

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/companies?page=${page}&limit=10&search=${search}`);
            setCompanies(res.data.companies);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            toast.error('Failed to load companies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(fetchCompanies, search ? 500 : 0);
        return () => clearTimeout(timer);
    }, [page, search]);

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
            await api.patch(`/companies/${id}/status`, { status: newStatus });
            toast.success(`Company ${newStatus.toLowerCase()} successfully`);
            fetchCompanies();
        } catch (err) {
            toast.error('Failed to change status');
        }
    };

    const columns = [
        {
            header: 'Company Name',
            accessor: 'name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <div className="font-semibold text-slate-900">{row.name}</div>
                        <div className="text-xs text-slate-500">{row.subdomain}{import.meta.env.VITE_MAIN_DOMAIN || '.talentcio.in'}</div>
                    </div>
                </div>
            )
        },
        { header: 'Contact Email', accessor: 'email' },
        { header: 'Industry', accessor: 'industry' },
        {
            header: 'Plan',
            accessor: 'planId',
            render: (row) => row.planId ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {row.planId.name}
                </span>
            ) : <span className="text-slate-400 text-xs">No Plan</span>
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'Active' ? 'bg-green-100 text-green-800' :
                    row.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: '_id',
            render: (row) => (
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => navigate(`/companies/${row._id}`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all"
                    >
                        Review
                    </button>
                    <button
                        onClick={() => { setEditingCompany(row); setIsFormOpen(true); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleToggleStatus(row._id, row.status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${row.status === 'Active'
                                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                            }`}
                    >
                        {row.status === 'Active' ? 'Suspend' : 'Resume'}
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Companies</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage tenant workspaces and subscriptions</p>
                </div>
                <button
                    onClick={() => { setEditingCompany(null); setIsFormOpen(true); }}
                    className="bg-indigo-600 hover:bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                >
                    <Plus size={20} strokeWidth={3} />
                    Register Company
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 shrink-0">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search company by name, subdomain, or email..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <DataTable
                    columns={columns}
                    data={companies}
                    loading={loading}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    onRowClick={(row) => navigate(`/companies/${row._id}`)}
                />
            </div>

            <CompanyForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                company={editingCompany}
                onSuccess={fetchCompanies}
            />
        </div>
    );
};

export default Companies;
