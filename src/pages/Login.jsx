import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#eff6ff_0%,#f8fafc_45%,#eef2f7_100%)] font-sans">
            <div className="relative isolate flex h-screen items-center justify-center overflow-hidden px-4 py-4 sm:px-5 lg:px-6">
                <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:72px_72px]" />

                <div className="relative z-10 grid h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[1.08fr_0.92fr]">
                    <section className="relative overflow-hidden bg-slate-950 px-7 py-7 text-white sm:px-8 lg:px-10 lg:py-8">
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.22),transparent_45%,rgba(148,163,184,0.08)_100%)]" />
                        <div className="absolute inset-y-0 right-0 hidden w-px bg-white/10 lg:block" />

                        <div className="relative flex h-full flex-col justify-center gap-10">
                            <div className="mx-auto max-w-lg text-center">
                                <div className="mb-6 flex items-center justify-center gap-3">
                                    <img
                                        src="/dark-logo-compact.png"
                                        alt="TalentCio"
                                        className="h-14 w-auto object-contain sm:h-16"
                                    />
                                    <div>
                                        <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-white">
                                            Super Admin Console
                                        </h2>
                                    </div>
                                </div>
                                <h1 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[30px]">
                                    Professional oversight for every TalentCio workspace.
                                </h1>
                                <p className="mt-3 max-w-lg text-xs leading-6 text-slate-300 sm:text-sm">
                                    A cleaner control point for platform administrators managing companies, subscriptions,
                                    user operations, and account health across the system.
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                                <span>Authorized personnel only</span>
                                <span>Role-based access</span>
                            </div>
                        </div>
                    </section>

                    <section className="px-7 py-7 sm:px-8 lg:px-10 lg:py-8">
                        <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center">
                            <div>
                                <div className="mb-5 lg:hidden">
                                    <img
                                        src="/dark-logo-compact.png"
                                        alt="TalentCio"
                                        className="h-7 w-auto object-contain"
                                    />
                                </div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                                    Secure sign in
                                </p>
                                <h2 className="mt-2.5 text-2xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-[30px]">
                                    Access the admin workspace
                                </h2>
                                <p className="mt-2.5 text-xs leading-5 text-slate-600 sm:text-sm">
                                    Sign in with your TalentCio administrative credentials to continue.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-slate-700">Work Email</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                            <Mail className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="block h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                                            placeholder="admin@talentcio.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-slate-700">Password</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                            <Lock className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="block h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((value) => !value)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-slate-600"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex h-11 w-full items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign in to dashboard'}
                                </button>
                            </form>

                            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
                                This portal is reserved for TalentCio super administrators and support operations teams.
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Login;
