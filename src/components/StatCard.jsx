import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, colorClass = 'text-primary-600', bgClass = 'bg-primary-50' }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
                {trend && (
                    <div className="mt-2 flex items-center gap-2">
                        <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend > 0 ? '+' : ''}{trend}%
                        </span>
                        <span className="text-xs text-slate-500">{trendLabel}</span>
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-lg ${bgClass}`}>
                <Icon className={`w-6 h-6 ${colorClass}`} />
            </div>
        </div>
    );
};

export default StatCard;
