'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Stethoscope,
    ArrowRight,
    ArrowLeft,
    ShieldCheck,
    Upload,
    HeartPulse,
    Activity,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

type Role = 'PATIENT' | 'CAREGIVER';
type Step = 'role' | 'basic' | 'professional' | 'health' | 'success';

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState<Role | null>(null);
    const [step, setStep] = useState<Step>('role');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        bio: '',
        ailment: '',
        medicalHistory: '',
        emergencyContact: '',
    });

    const handleNext = () => {
        if (step === 'role') setStep('basic');
        else if (step === 'basic') {
            if (role === 'CAREGIVER') setStep('professional');
            else setStep('health');
        }
    };

    const handleBack = () => {
        if (step === 'basic') setStep('role');
        else if (step === 'professional' || step === 'health') setStep('basic');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return; 
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register', {
                ...formData,
                role: role
            });
            setStep('success');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderRoleSelection = () => (
        <div className="space-y-10 py-4">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Join True Care</h2>
                <p className="text-sm text-slate-500 font-medium mt-2">How would you like to use our platform?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    onClick={() => { setRole('PATIENT'); setStep('basic'); }}
                    className={`bg-white p-8 text-left group transition-all rounded-[32px] border-2 shadow-sm ${role === 'PATIENT' ? 'border-teal-500 bg-teal-50/50' : 'border-slate-100 hover:border-teal-200 hover:shadow-md'}`}
                >
                    <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform">
                        <User className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Seeking Care</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2">I am looking for professional, compassionate care for myself or a loved one.</p>
                </button>

                <button
                    onClick={() => { setRole('CAREGIVER'); setStep('basic'); }}
                    className={`bg-white p-8 text-left group transition-all rounded-[32px] border-2 shadow-sm ${role === 'CAREGIVER' ? 'border-teal-500 bg-teal-50/50' : 'border-slate-100 hover:border-teal-200 hover:shadow-md'}`}
                >
                    <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6 group-hover:scale-110 transition-transform">
                        <Stethoscope className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Providing Care</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2">I am a certified medical professional ready to provide world-class care.</p>
                </button>
            </div>
        </div>
    );

    const renderBasicInfo = () => (
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full mb-4 border border-teal-100">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-wide">Secure Setup</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Basic Information</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">First Name</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Last Name</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Email Address</label>
                <input
                    type="email"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Password</label>
                <input
                    type="password"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
            </div>

            <div className="flex items-center gap-4 pt-4">
                <button type="button" onClick={handleBack} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button type="submit" className="flex-1 btn-primary py-4 flex items-center justify-center gap-3">
                    Continue <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </form>
    );

    const renderHealthInfo = () => (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full mb-4 border border-rose-100">
                    <HeartPulse className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-wide">Medical Profile</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Health Intake</h2>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Primary Condition</label>
                <input
                    type="text"
                    required
                    placeholder="e.g. Hypertension, Post-Op Recovery"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                    value={formData.ailment}
                    onChange={(e) => setFormData({ ...formData, ailment: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Medical History Summary</label>
                <textarea
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all resize-none"
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Emergency Contact</label>
                <input
                    type="text"
                    required
                    placeholder="Name and Phone Number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
            </div>

            <div className="flex items-center gap-4 pt-4">
                <button type="button" onClick={handleBack} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button type="submit" disabled={loading} className="flex-1 btn-primary py-4 flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Setup <CheckCircle2 className="w-4 h-4" /></>}
                </button>
            </div>
        </form>
    );

    const renderProfessionalInfo = () => (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full mb-4 border border-teal-100">
                    <Stethoscope className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-wide">Professional Profile</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Caregiver Details</h2>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Professional Biography</label>
                <textarea
                    rows={4}
                    required
                    placeholder="Brief overview of your clinical experience and specialties..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all resize-none"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Verification Documents (CV/Resume)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-[24px] p-8 flex flex-col items-center justify-center group hover:border-teal-400 hover:bg-teal-50/50 transition-all cursor-pointer bg-slate-50">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-teal-500 transition-colors mb-3" />
                    <p className="text-sm font-bold text-slate-600">Upload PDF or DOCX</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">Maximum size: 5MB</p>
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
                <button type="button" onClick={handleBack} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button type="submit" disabled={loading} className="flex-1 btn-primary py-4 flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Application <CheckCircle2 className="w-4 h-4" /></>}
                </button>
            </div>
        </form>
    );

    const renderSuccess = () => (
        <div className="text-center py-10 space-y-8">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100 mb-6 relative overflow-hidden">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                >
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </motion.div>
                <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
            </div>

            <div className="space-y-3">
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome to True Care!</h2>
                <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto">Your account has been successfully created. You can now securely manage your healthcare journey.</p>
            </div>

            <div className="pt-4">
                <button
                    onClick={() => router.push('/login')}
                    className="w-full btn-primary py-5 flex items-center justify-center gap-3 scale-105"
                >
                    Sign in to your account
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen mesh-gradient flex items-center justify-center p-6 selection:bg-teal-600/10">
            <div className="max-w-[800px] w-full relative z-10">
                {/* Brand Indicator */}
                <div className="flex items-center gap-3 justify-center mb-10">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                        <HeartPulse className="w-5 h-5 text-rose-500" />
                    </div>
                    <span className="font-extrabold text-slate-900 tracking-tight text-xl">TRUE CARE</span>
                </div>

                <div className="bg-white/80 p-8 sm:p-12 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 min-h-[500px] relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {step === 'role' && renderRoleSelection()}
                            {step === 'basic' && renderBasicInfo()}
                            {step === 'professional' && renderProfessionalInfo()}
                            {step === 'health' && renderHealthInfo()}
                            {step === 'success' && renderSuccess()}
                        </motion.div>
                    </AnimatePresence>

                    {error && (
                        <div className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <p className="text-rose-600 text-xs font-bold uppercase tracking-wide">{error}</p>
                        </div>
                    )}
                </div>

                <p className="text-center mt-8 text-xs font-semibold text-slate-400 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Secure Health Data Protection
                </p>
            </div>
        </div>
    );
}

