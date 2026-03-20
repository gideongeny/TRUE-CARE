'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, HeartPulse, Stethoscope, CheckCircle2 } from 'lucide-react';
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
        if (loading) return;
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
        } finally {
            setLoading(false);
        }
    };

    const handleVerify2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 selection:bg-teal-600/20">
            {/* Left Side: Visual Branding (Compassionate Healthcare) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-teal-600">
                {/* Soft Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-800" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay" />

                <div className="relative z-10 w-full flex flex-col p-16">
                    {/* Brand Section */}
                    <div className="flex items-center gap-3 mb-20">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                            <HeartPulse className="w-6 h-6 text-rose-500" />
                        </div>
                        <span className="font-extrabold text-white tracking-tight text-xl">TRUE CARE</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                                <span className="text-xs font-bold text-white tracking-wide">Secure Health Portal</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                                Welcome to <br />
                                Your Care Network.
                            </h1>
                            <p className="text-teal-50 text-lg font-medium leading-relaxed max-w-md opacity-90">
                                Sign in to access real-time clinical logs, manage care schedules, and stay connected with your dedicated healthcare team.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4 mt-16 max-w-lg">
                            {[
                                { icon: Stethoscope, label: 'Clinical Excellence' },
                                { icon: ShieldCheck, label: 'HIPAA Compliant' },
                                { icon: HeartPulse, label: 'Compassionate Care' },
                                { icon: CheckCircle2, label: 'Verified Providers' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                                    <div className="p-2 rounded-lg bg-white/20">
                                        <item.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-sm font-semibold text-white">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decorative Visuals */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-400/30 rounded-full blur-[100px]" />
                <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[120px]" />
            </div>

            {/* Right Side: Login Form (Clean & Modern) */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
                <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-xl shadow-sm border border-teal-100">
                        <HeartPulse className="w-5 h-5 text-rose-500" />
                    </div>
                    <span className="font-extrabold text-slate-900 tracking-tight text-xl">TRUE CARE</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[420px] relative z-10"
                >
                    <div className="bg-white p-8 sm:p-12 rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                        {/* Status bar top */}
                        <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-teal-400 to-emerald-400" />

                        <AnimatePresence mode="wait">
                            {step === 'login' ? (
                                <motion.form
                                    key="login-form"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-8"
                                >
                                    <div className="text-center space-y-2">
                                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign In</h2>
                                        <p className="text-sm text-slate-500 font-medium">Please enter your details to continue.</p>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-semibold">
                                            <div className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                                            {error}
                                        </div>
                                    )}

                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Email Address</label>
                                            <div className="relative group">
                                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-teal-600' : 'text-slate-400'}`} />
                                                <input
                                                    type="email"
                                                    placeholder="hello@example.com"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none transition-all duration-300 font-semibold text-sm focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    onFocus={() => setFocusedField('email')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Password</label>
                                            <div className="relative group">
                                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-teal-600' : 'text-slate-400'}`} />
                                                <input
                                                    type="password"
                                                    placeholder="••••••••••••"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none transition-all duration-300 font-semibold text-sm focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    onFocus={() => setFocusedField('password')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-teal-600/20 active:scale-[0.98]"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                                        </button>

                                        <div className="text-center pt-4">
                                            <p className="text-sm text-slate-500 font-medium">
                                                New to True Care?{' '}
                                                <button
                                                    type="button"
                                                    onClick={() => router.push('/register')}
                                                    className="font-bold text-teal-600 hover:text-teal-700 transition-colors"
                                                >
                                                    Create an account
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="2fa-form"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onSubmit={handleVerify2FA}
                                    className="space-y-8"
                                >
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto border border-teal-100 shadow-sm">
                                            <ShieldCheck className="w-8 h-8 text-teal-600" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Two-Step Verification</h3>
                                            <p className="text-sm text-slate-500 font-medium px-4">Enter the 6-digit security code from your authenticator app.</p>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-center text-rose-600 text-sm font-semibold">
                                            {error}
                                        </div>
                                    )}

                                    <input
                                        type="text"
                                        maxLength={6}
                                        placeholder="000000"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-6 text-center text-4xl font-extrabold tracking-[0.5em] text-slate-900 placeholder-slate-300 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all shadow-inner"
                                        value={twoFactorCode}
                                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                                        required
                                        autoFocus
                                    />

                                    <div className="space-y-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-teal-600/20 active:scale-[0.98]"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Verify & Continue'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStep('login')}
                                            className="w-full text-slate-500 hover:text-slate-900 text-sm font-semibold transition-colors py-2"
                                        >
                                            Back to login
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs font-semibold text-slate-400 flex items-center justify-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> Secure & Encrypted Connection
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
