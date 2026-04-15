import React, { useState, useEffect } from 'react';
import api from '../api';
import DataTable from '../components/DataTable';
import { Search, Users as UsersIcon, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [filterCompany, setFilterCompany] = useState('');
    const [companies, setCompanies] = useState([]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/users?page=${page}&limit=10&search=${search}&companyId=${filterCompany}`);
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch simple company list for the dropdown filter
        api.get('/companies?limit=100').then(res => setCompanies(res.data.companies)).catch(console.error);
    }, []);

    useEffect(() => {
        const timer = setTimeout(fetchUsers, search ? 500 : 0);
        return () => clearTimeout(timer);
    }, [page, search, filterCompany]);

    const handleDeactivate = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
            await api.patch(`/users/${id}/deactivate`, { status: newStatus });
            toast.success(`User marked as ${newStatus}`);
            fetchUsers();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const columns = [
        {
            header: 'User',
            accessor: 'name',
            render: (row) => {
                const displayName = row.name || (row.firstName ? `${row.firstName} ${row.lastName || ''}`.trim() : null) || 'Unnamed User';
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase overflow-hidden border border-slate-200 shadow-sm">
                            {row.profilePicture ? (
                                <img src={row.profilePicture} alt="" className="w-full h-full object-cover" />
                            ) : (
                                displayName.charAt(0)
                            )}
                        </div>
                        <div>
                            <div className="font-bold text-slate-800">{displayName}</div>
                            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-tight">{row.email}</div>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Company / Workspace',
            accessor: 'companyId',
            render: (row) => row.companyId ? (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        <Building2 size={13} className="text-indigo-500" />
                        <span>{row.companyId.name}</span>
                    </div>
                    {row.companyId.domain && <div className="text-[10px] text-slate-400 ml-5">{row.companyId.domain}</div>}
                </div>
            ) : (
                <div className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase border border-slate-200">
                    System Admin
                </div>
            )
        },
        { 
            header: 'Role', 
            accessor: 'role',
            render: (row) => (
                <span className="text-sm font-semibold text-slate-600">{row.role || 'User'}</span>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${row.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: '_id',
            render: (row) => (
                <div className="flex items-center gap-2">
                     <button
                        onClick={() => handleDeactivate(row._id, row.status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            row.status === 'Active' 
                            ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                            : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                    >
                        {row.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Search size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <UsersIcon className="text-primary-600" /> All Users
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage users across all tenant networks globally</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4 shrink-0">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <div className="w-full md:w-64">
                    <select
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
                        value={filterCompany}
                        onChange={(e) => { setFilterCompany(e.target.value); setPage(1); }}
                    >
                        <option value="">All Companies / Workspaces</option>
                        {companies.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

             <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <DataTable
                    columns={columns}
                    data={users}
                    loading={loading}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
};

export default Users;
