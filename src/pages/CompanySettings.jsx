import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Save, ArrowLeft, Loader2, Clock, Calendar, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CompanySettings = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Initial state matching the new Company model settings
    const [settings, setSettings] = useState({
        themeColor: '#6366f1',
        leavePolicy: '',
        attendanceRules: '',
        overtimeRules: '',
        careers: {
            enableResourceGatewayPublishing: false,
        },
        attendance: {
            weeklyOff: ['Saturday', 'Sunday'],
            workingHours: 8,
            exportFormat: 'Standard',
            halfDayAllowed: true,
            requireLocationCheckIn: false,
            requireLocationCheckOut: false,
            locationCheck: false,
            ipCheck: false,
            allowedRadius: 200,
            coordinates: { lat: 0, lng: 0 },
            allowedIps: [],
        },
        timesheet: {
            approvalCycle: 'Monthly',
            exportFormat: 'Standard',
            allowPastEntries: true,
            requireAttachment: false,
        },
        excelImportFormat: 'default',
    });

    useEffect(() => {
        api.get(`/companies/${id}`).then(res => {
            setCompany(res.data);
            if (res.data.settings) {
                // Merge loaded settings with default structure to avoid undefined errors
                const loadedSettings = res.data.settings;
                setSettings(prev => ({
                    ...prev,
                    ...loadedSettings,
                    careers: { ...prev.careers, ...(loadedSettings.careers || {}) },
                    attendance: { ...prev.attendance, ...(loadedSettings.attendance || {}) },
                    timesheet: { ...prev.timesheet, ...(loadedSettings.timesheet || {}) },
                }));
            }
            setLoading(false);
        }).catch(() => {
            toast.error('Failed to load company');
            navigate('/companies');
        });
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await api.put(`/companies/${id}`, { settings });
            console.log('[handleSave] Server Response:', res.data);
            toast.success('Settings saved successfully');
        } catch (err) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(`/companies/${id}`)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Configuration - {company.name}</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage module-specific rules and workspace preferences</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-70 active:scale-95"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Apply Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Section: Attendance */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                            <Clock className="text-indigo-600" size={20} />
                            <h3 className="font-bold text-slate-800">Attendance Configuration</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wider">Weekly Off Days</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {days.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => {
                                                const current = settings.attendance.weeklyOff;
                                                const next = current.includes(day)
                                                    ? current.filter(d => d !== day)
                                                    : [...current, day];
                                                setSettings({ ...settings, attendance: { ...settings.attendance, weeklyOff: next } });
                                            }}
                                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${settings.attendance.weeklyOff.includes(day)
                                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Daily Working Hours</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="w-full pl-4 pr-12 py-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                                            value={settings.attendance.workingHours}
                                            onChange={e => setSettings({ ...settings, attendance: { ...settings.attendance, workingHours: Number(e.target.value) } })}
                                        />
                                        <span className="absolute right-4 top-2 text-slate-400 text-sm">hrs</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Excel Export Format</label>
                                    <select
                                        className="w-full px-4 py-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                                        value={settings.attendance.exportFormat}
                                        onChange={e => setSettings({ ...settings, attendance: { ...settings.attendance, exportFormat: e.target.value } })}
                                    >
                                        <option value="Standard">Standard (Check-in/Out)</option>
                                        <option value="Monthly Timesheet">Only Absent and Present</option>
                                        <option value="Detailed">Detailed (With Location & IPs)</option>
                                        <option value="Compact">Compact (Summary only)</option>
                                    </select>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Restrictions & Validation</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={settings.attendance.requireLocationCheckIn}
                                                    onChange={e => setSettings({ ...settings, attendance: { ...settings.attendance, requireLocationCheckIn: e.target.checked } })}
                                                />
                                                <div className={`w-10 h-6 rounded-full transition-colors ${settings.attendance.requireLocationCheckIn ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.attendance.requireLocationCheckIn ? 'translate-x-4' : ''}`}></div>
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">Require Location for Check-in</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={settings.attendance.requireLocationCheckOut}
                                                    onChange={e => setSettings({ ...settings, attendance: { ...settings.attendance, requireLocationCheckOut: e.target.checked } })}
                                                />
                                                <div className={`w-10 h-6 rounded-full transition-colors ${settings.attendance.requireLocationCheckOut ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.attendance.requireLocationCheckOut ? 'translate-x-4' : ''}`}></div>
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">Require Location for Check-out</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={settings.attendance.locationCheck}
                                                    onChange={e => setSettings({ ...settings, attendance: { ...settings.attendance, locationCheck: e.target.checked } })}
                                                />
                                                <div className={`w-10 h-6 rounded-full transition-colors ${settings.attendance.locationCheck ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.attendance.locationCheck ? 'translate-x-4' : ''}`}></div>
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">Enable Geo-fencing (Radius Search)</span>
                                        </label>

                                        {settings.attendance.locationCheck && (
                                            <div className="pl-4 space-y-4 border-l-2 border-indigo-100 mt-2 animate-in slide-in-from-left duration-300">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Latitude</label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.0000"
                                                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                            value={settings.attendance.coordinates?.lat || ''}
                                                            onChange={e => setSettings({
                                                                ...settings,
                                                                attendance: {
                                                                    ...settings.attendance,
                                                                    coordinates: { ...settings.attendance.coordinates, lat: e.target.value }
                                                                }
                                                            })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Longitude</label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            placeholder="0.0000"
                                                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                            value={settings.attendance.coordinates?.lng || ''}
                                                            onChange={e => setSettings({
                                                                ...settings,
                                                                attendance: {
                                                                    ...settings.attendance,
                                                                    coordinates: { ...settings.attendance.coordinates, lng: e.target.value }
                                                                }
                                                            })}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Allowed Radius (Meters)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="200"
                                                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                        value={settings.attendance.allowedRadius}
                                                        onChange={e => setSettings({ ...settings, attendance: { ...settings.attendance, allowedRadius: Number(e.target.value) } })}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-slate-400 italic">User must be within this radius of the coordinates to check-in/out.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={settings.attendance.ipCheck}
                                                    onChange={e => setSettings({ ...settings, attendance: { ...settings.attendance, ipCheck: e.target.checked } })}
                                                />
                                                <div className={`w-10 h-6 rounded-full transition-colors ${settings.attendance.ipCheck ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.attendance.ipCheck ? 'translate-x-4' : ''}`}></div>
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">IP-based Restrictions</span>
                                        </label>

                                        {settings.attendance.ipCheck && (
                                            <div className="pl-4 space-y-2 border-l-2 border-indigo-100 mt-2 animate-in slide-in-from-left duration-300">
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Allowed IPs (Comma separated)</label>
                                                <textarea
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                                                    placeholder="e.g. 192.168.1.1, 203.0.113.5"
                                                    value={Array.isArray(settings.attendance.allowedIps) ? settings.attendance.allowedIps.join(', ') : settings.attendance.allowedIps || ''}
                                                    onChange={e => setSettings({
                                                        ...settings,
                                                        attendance: {
                                                            ...settings.attendance,
                                                            allowedIps: e.target.value.split(',').map(ip => ip.trim()).filter(ip => ip !== '')
                                                        }
                                                    })}
                                                />
                                                <p className="text-[10px] text-slate-400 italic font-medium">Add multiple IPs separated by commas. Only these IPs will be allowed to mark attendance.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Timesheet */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                            <Calendar className="text-indigo-600" size={20} />
                            <h3 className="font-bold text-slate-800">Timesheet Management</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Approval Cycle</label>
                                    <select
                                        className="w-full px-4 py-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                                        value={settings.timesheet.approvalCycle}
                                        onChange={e => setSettings({ ...settings, timesheet: { ...settings.timesheet, approvalCycle: e.target.value } })}
                                    >
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Bi-Weekly">Bi-Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Report Layout</label>
                                    <select
                                        className="w-full px-4 py-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                                        value={settings.timesheet.exportFormat}
                                        onChange={e => setSettings({ ...settings, timesheet: { ...settings.timesheet, exportFormat: e.target.value } })}
                                    >
                                        <option value="Standard">By Project</option>
                                        <option value="Combined">By User & Date</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={settings.timesheet.requireAttachment}
                                            onChange={e => setSettings({ 
                                                ...settings, 
                                                timesheet: { ...settings.timesheet, requireAttachment: e.target.checked } 
                                            })}
                                        />
                                        <div className={`w-10 h-6 rounded-full transition-colors ${settings.timesheet.requireAttachment ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.timesheet.requireAttachment ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-slate-700 block">Enable Attendance Documents</span>
                                        <span className="text-[10px] text-slate-400 italic">Allow users to upload supporting documents in the Attendance calendar</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 size={24} />
                            <h3 className="font-bold text-lg">Branding</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase opacity-80 mb-2">Primary Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        className="h-10 w-full p-1 rounded bg-white/20 border-0 cursor-pointer"
                                        value={settings.themeColor}
                                        onChange={e => setSettings({ ...settings, themeColor: e.target.value })}
                                    />
                                    <span className="font-mono text-sm">{settings.themeColor}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
                            <FileSpreadsheet size={18} />
                            <h3>Global Settings</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Careers Distribution</p>
                                        <h4 className="mt-1 text-sm font-semibold text-slate-800">Allow this company to publish jobs on Resource Gateway</h4>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            When enabled, approved jobs from this company can also be pushed to `resourcegateway.in`
                                            from the hiring request screen.
                                        </p>
                                    </div>
                                    <label className="flex items-center gap-3 cursor-pointer group shrink-0">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={settings.careers.enableResourceGatewayPublishing}
                                                onChange={e => setSettings({
                                                    ...settings,
                                                    careers: {
                                                        ...settings.careers,
                                                        enableResourceGatewayPublishing: e.target.checked
                                                    }
                                                })}
                                            />
                                            <div className={`w-10 h-6 rounded-full transition-colors ${settings.careers.enableResourceGatewayPublishing ? 'bg-emerald-600' : 'bg-slate-300'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.careers.enableResourceGatewayPublishing ? 'translate-x-4' : ''}`}></div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Import Format</label>
                                <select
                                    className="w-full px-3 py-2 border-slate-200 rounded-lg text-sm font-medium"
                                    value={settings.excelImportFormat}
                                    onChange={e => setSettings({ ...settings, excelImportFormat: e.target.value })}
                                >
                                    <option value="default">Default Template</option>
                                    <option value="minimal">Minimal (JSON)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanySettings;
