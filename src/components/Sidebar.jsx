import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Package, Users, Activity, Settings, LogOut, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Companies', icon: Building2, path: '/companies' },
    { label: 'Subscriptions', icon: Package, path: '/plans' },
    { label: 'Global Users', icon: Users, path: '/users' },
    { label: 'Analytics', icon: Activity, path: '/analytics' },
    { label: 'Activity Logs', icon: FileText, path: '/logs' },
    { label: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = () => {
    const { logout, admin } = useAuth();

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen font-sans text-slate-300">
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-primary-500/50 shadow-lg">
                        T
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">TalentCio<span className="text-primary-500">.</span></span>
                </div>
            </div>

            <div className="p-4">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Superspace</div>
                <nav className="space-y-1">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-primary-600/10 text-primary-400 font-medium'
                                    : 'hover:bg-slate-800/50 hover:text-white'
                                }`
                            }
                        >
                            <item.icon size={18} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                        {admin?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{admin?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{admin?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
