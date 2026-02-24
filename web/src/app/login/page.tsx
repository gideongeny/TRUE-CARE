'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight, Loader2, ShieldCheck, Heart, Activity, Thermometer, Droplets, Zap, Shield } from 'lucide-react';
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
        <div className="min-h-screen flex bg-slate-50 selection:bg-blue-600/20">
            {/* Left Side: Visual Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 mesh-gradient opacity-40" />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                <div className="relative z-10 w-full flex flex-col p-16">
                    <div className="flex items-center gap-4 mb-20">
                        <img src="/logo.png" alt="TrueCare" className="h-10 w-auto invert brightness-0" />
                        <span className="font-black text-white tracking-tighter text-2xl">TRUE CARE</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center max-w-lg">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                <Shield className="w-3 h-3 text-blue-400" />
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Medical Care Intelligence</span>
                            </div>
                            <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                                Advanced Clinical <br />
                                <span className="text-blue-500 text-6xl">Command System</span>
                            </h1>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                Accessing the node for real-time patient monitoring, caregiver synchronization, and clinical intelligence.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-6 mt-16">
                            {[
                                { icon: Heart, label: 'Vital Tracking', color: 'rose' },
                                { icon: Activity, label: 'Shift Sync', color: 'emerald' },
                                { icon: ShieldCheck, label: 'Secure Protocol', color: 'blue' },
                                { icon: Zap, label: 'Live Analytics', color: 'orange' }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className="p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-md"
                                >
                                    <item.icon className={`w-6 h-6 text-${item.color}-500 mb-4`} />
                                    <p className="text-white text-sm font-black uppercase tracking-widest opacity-80">{item.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">
                            Terminal Encryption: AES-256-GCM &bull; Node ID: TC-CORE-01
                        </p>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -mr-96 -mt-96" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] -ml-40 -mb-40" />
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
                <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
                    <img src="/logo.png" alt="TrueCare" className="h-8 w-auto" />
                    <span className="font-black text-slate-900 tracking-tighter text-xl">TRUE CARE</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[440px]"
                >
                    <div className="bg-white border border-slate-100 p-12 rounded-[48px] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />

                        <AnimatePresence mode="wait">
                            {step === 'login' ? (
                                <motion.form
                                    key="login-form"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-8"
                                >
                                    <div className="text-center">
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Authentication</h2>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 opacity-60">System Personnel Entry</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Network Identity</label>
                                            <div className="relative group">
                                                <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'email' ? 'text-blue-600' : 'text-slate-300'}`} />
                                                <input
                                                    type="email"
                                                    placeholder="admin@truecare.com"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-slate-900 placeholder-slate-300 outline-none focus:bg-white focus:border-blue-500/20 focus:ring-8 focus:ring-blue-500/5 transition-all font-bold"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    onFocus={() => setFocusedField('email')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Access Cipher</label>
                                            <div className="relative group">
                                                <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'password' ? 'text-blue-600' : 'text-slate-300'}`} />
                                                <input
                                                    type="password"
                                                    placeholder="••••••••••••"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-slate-900 placeholder-slate-300 outline-none focus:bg-white focus:border-blue-500/20 focus:ring-8 focus:ring-blue-500/5 transition-all font-bold"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    onFocus={() => setFocusedField('password')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 transition-all shadow-xl shadow-slate-900/10 hover:shadow-blue-600/30"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Access Dashboard <ArrowRight className="w-4 h-4" /></>}
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="2fa-form"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onSubmit={handleVerify2FA}
                                    className="space-y-8"
                                >
                                    <div className="text-center space-y-3">
                                        <div className="w-16 h-16 bg-blue-50 rounded-[28px] flex items-center justify-center mx-auto border border-blue-100">
                                            <ShieldCheck className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Protocol Handshake</h3>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-60">Enter the 6-digit verification code</p>
                                    </div>

                                    <input
                                        type="text"
                                        maxLength={6}
                                        placeholder="000 000"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-6 text-center text-4xl font-black tracking-[0.2em] text-slate-900 placeholder-slate-200 outline-none focus:border-blue-500/20 transition-all font-mono"
                                        value={twoFactorCode}
                                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                                        required
                                        autoFocus
                                    />

                                    <div className="space-y-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-600/20"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm Identity'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStep('login')}
                                            className="w-full text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-colors py-2"
                                        >
                                            Return to Primary AUTH
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    <p className="mt-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic opacity-40">
                        Secure Environment &bull; Node: S-712 &bull; SSL/TLS Active
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
