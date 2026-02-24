'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight, Loader2, ShieldCheck, Heart, Activity, Shield, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const [step, setStep] = useState<'login' | '2fa'>('login');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [tempUserId, setTempUserId] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.require2FA) {
                setTempUserId(response.data.userId);
                setStep('2fa');
                setLoading(false);
                return;
            }
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
            setLoading(false);
        }
    };

    const handleVerify2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', {
                userId: tempUserId,
                token: twoFactorCode,
                is2FAAction: true
            });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            router.push('/dashboard');
        } catch (err: any) {
            setError('Invalid verification code.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white selection:bg-blue-600/20">
            {/* Left Side: Visual Branding (Medical Hero) */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-[#0A0F1E]">
                {/* Refined Mesh Gradient for better depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-indigo-900/40" />
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                <div className="relative z-10 w-full flex flex-col p-16">
                    {/* Brand Section with Background Plate for contrast */}
                    <div className="flex items-center gap-4 mb-24">
                        <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                            <img src="/logo.png" alt="TrueCare" className="h-8 w-auto invert brightness-200" />
                        </div>
                        <span className="font-black text-white tracking-tighter text-2xl uppercase">TRUE CARE</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                <Activity className="w-3.5 h-3.5 text-blue-400" />
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Clinical Intelligence Unit</span>
                            </div>
                            <h1 className="text-6xl font-black text-white leading-tight tracking-tighter">
                                World Class <br />
                                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Health Systems</span>
                            </h1>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                                Secure access point for advanced patient monitoring, caregiver synchronization, and real-time clinical data analysis.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4 mt-20">
                            {[
                                { icon: Heart, label: 'Vital tracking', color: 'rose' },
                                { icon: ShieldCheck, label: 'Secure data', color: 'blue' },
                                { icon: Activity, label: 'Shift sync', color: 'emerald' },
                                { icon: Zap, label: 'Live telemetry', color: 'orange' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                                    <div className={`p-2 rounded-lg bg-${item.color}-500/10 border border-${item.color}-500/20`}>
                                        <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto flex items-center gap-4 pt-12 border-t border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                            System Status: Operational &bull; S-712
                        </p>
                    </div>
                </div>

                {/* Decorative Visuals */}
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
            </div>

            {/* Right Side: Login Form (Clean & High Contrast) */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/50 relative overflow-hidden">
                <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
                    <img src="/logo.png" alt="TrueCare" className="h-8 w-auto" />
                    <span className="font-black text-slate-900 tracking-tighter text-xl">TRUE CARE</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[460px] relative z-10"
                >
                    <div className="bg-white border border-slate-200/60 p-12 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] relative overflow-hidden">
                        {/* Status bar top */}
                        <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-blue-100 via-blue-600 to-blue-100" />

                        <AnimatePresence mode="wait">
                            {step === 'login' ? (
                                <motion.form
                                    key="login-form"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-10"
                                >
                                    <div className="text-center space-y-3">
                                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Sign In</h2>
                                        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60">Authentication Protocol</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 pl-1">Network Identity (Email)</label>
                                            <div className="relative group">
                                                <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors duration-300 ${focusedField === 'email' ? 'text-blue-600' : 'text-slate-400'}`} />
                                                <input
                                                    type="email"
                                                    placeholder="admin@truecare.com"
                                                    className={`w-full bg-slate-50/80 border border-slate-200 rounded-2xl py-5 pl-14 pr-6 text-slate-900 placeholder-slate-400 outline-none transition-all duration-300 font-bold text-[15px] focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    onFocus={() => setFocusedField('email')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 pl-1">Access Cipher (Password)</label>
                                            <div className="relative group">
                                                <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors duration-300 ${focusedField === 'password' ? 'text-blue-600' : 'text-slate-400'}`} />
                                                <input
                                                    type="password"
                                                    placeholder="••••••••••••"
                                                    className={`w-full bg-slate-50/80 border border-slate-200 rounded-2xl py-5 pl-14 pr-6 text-slate-900 placeholder-slate-400 outline-none transition-all duration-300 font-bold text-[15px] focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    onFocus={() => setFocusedField('password')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 transition-all duration-300 shadow-xl shadow-slate-900/10 hover:shadow-blue-600/30 active:scale-[0.98]"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Enter Terminal <ArrowRight className="w-4 h-4" /></>}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => router.push('/register')}
                                            className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors py-2"
                                        >
                                            Request Node Access (Register)
                                        </button>
                                    </div>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="2fa-form"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onSubmit={handleVerify2FA}
                                    className="space-y-10"
                                >
                                    <div className="text-center space-y-4">
                                        <div className="w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center mx-auto border border-blue-100 shadow-sm shadow-blue-500/10">
                                            <ShieldCheck className="w-10 h-10 text-blue-600" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Verification</h3>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest opacity-60">Enter the 6-digit access code</p>
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        maxLength={6}
                                        placeholder="000 000"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-3xl py-8 text-center text-5xl font-black tracking-[0.3em] text-slate-900 placeholder-slate-200 outline-none focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all font-mono shadow-inner"
                                        value={twoFactorCode}
                                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                                        required
                                        autoFocus
                                    />

                                    <div className="space-y-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm Protocol'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStep('login')}
                                            className="w-full text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-colors py-2"
                                        >
                                            Resync Connection
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-40">
                            AES-256 Encryption Secured &bull; Node: TRUE-CARE-PN-01
                        </p>
                    </div>
                </motion.div>

                {/* Subtle background graphics for right side */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[100px] -mr-80 -mt-80" />
            </div>
        </div>
    );
}
