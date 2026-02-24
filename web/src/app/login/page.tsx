'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
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
            const response = await api.post('/auth/login', {
                email,
                password
            });

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
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden mesh-gradient selection:bg-blue-600/20">
            {/* Dynamic Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[440px] relative z-10 px-6"
            >
                <div className="flex flex-col items-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="flex items-center gap-3"
                    >
                        <img src="/logo.png" alt="TrueCare" className="h-12 w-auto" />
                        <span className="font-black text-slate-900 tracking-tighter text-2xl">TRUE CARE</span>
                    </motion.div>
                </div>

                <div className="glass-card p-10 rounded-[32px] overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />

                    <AnimatePresence mode="wait">
                        {step === 'login' ? (
                            <motion.form
                                key="login-form"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Authentication</h2>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-60 italic">Secure Protocol Layer</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">Network Identity</label>
                                        <div className="relative group">
                                            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'email' ? 'text-blue-600' : 'text-slate-400'}`} />
                                            <input
                                                type="email"
                                                placeholder="admin@truecare.com"
                                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-300 outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-sm"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">Access Cipher</label>
                                        <div className="relative group">
                                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'password' ? 'text-blue-600' : 'text-slate-400'}`} />
                                            <input
                                                type="password"
                                                placeholder="adminpassword123"
                                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-300 outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-sm"
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
                                    className="w-full btn-primary py-4 flex items-center justify-center gap-3 mt-4"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Initialize Dashboard</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="2fa-form"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onSubmit={handleVerify2FA}
                                className="space-y-8 py-4"
                            >
                                <div className="text-center space-y-2">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                                        <ShieldCheck className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Handshake Required</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-60">Enter the 6-digit sync code</p>
                                </div>

                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    className="w-full bg-slate-50/80 border-2 border-slate-100 rounded-2xl py-6 text-center text-4xl font-black tracking-[0.4em] text-slate-900 placeholder-slate-200 outline-none focus:border-blue-500/20 transition-all font-mono"
                                    value={twoFactorCode}
                                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                                    required
                                    autoFocus
                                />

                                <div className="space-y-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full btn-primary py-4"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm Identity'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep('login')}
                                        className="w-full text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] transition-colors py-2"
                                    >
                                        Resync Terminal
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            <p className="text-rose-600 text-xs font-bold italic tracking-tight">{error}</p>
                        </motion.div>
                    )}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-40 italic"
                >
                    Node: S-712 &bull; Secure Encrypted Session
                </motion.p>
            </motion.div>
        </div>
    );
}
