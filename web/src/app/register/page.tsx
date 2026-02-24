'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Stethoscope,
    ArrowRight,
    ArrowLeft,
    Shield,
    Upload,
    Heart,
    Activity,
    Mail,
    Lock,
    Phone,
    FileText,
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

    // Form States
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
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register', {
                ...formData,
                role: role
            });
            setStep('success');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Synchronization failed. Please verify your connection.');
        } finally {
            setLoading(false);
        }
    };

    const renderRoleSelection = () => (
        <div className="space-y-10 py-4">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Access Protocol</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 opacity-60">Select your functional node</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    onClick={() => { setRole('PATIENT'); setStep('basic'); }}
                    className={`glass-card p-8 text-left group transition-all border-2 ${role === 'PATIENT' ? 'border-blue-600 bg-blue-50/50' : 'border-transparent hover:border-slate-200'}`}
                >
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                        <User className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">Seeking Care</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2 italic">I require professional clinical monitoring and support.</p>
                </button>

                <button
                    onClick={() => { setRole('CAREGIVER'); setStep('basic'); }}
                    className={`glass-card p-8 text-left group transition-all border-2 ${role === 'CAREGIVER' ? 'border-blue-600 bg-blue-50/50' : 'border-transparent hover:border-slate-200'}`}
                >
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm group-hover:scale-110 transition-transform">
                        <Stethoscope className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">Providing Care</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2 italic">I am a certified medical professional ready for deployment.</p>
                </button>
            </div>
        </div>
    );

    const renderBasicInfo = () => (
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full mb-6">
                    <Shield className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Identity Sync</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Basic Credentials</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">First Name</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Last Name</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Email Node</label>
                <input
                    type="email"
                    required
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Access Cipher</label>
                <input
                    type="password"
                    required
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
            </div>

            <div className="flex items-center gap-4 pt-4">
                <button type="button" onClick={handleBack} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button type="submit" className="flex-1 btn-primary py-4 flex items-center justify-center gap-3">
                    Continue Protocol <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </form>
    );

    const renderHealthInfo = () => (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full mb-6 border border-blue-100">
                    <Activity className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Medical Profile</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Health Intake</h2>
            </div>

            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Primary Ailment</label>
                <input
                    type="text"
                    required
                    placeholder="e.g. Chronic Hypertension, Post-Op Recovery"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                    value={formData.ailment}
                    onChange={(e) => setFormData({ ...formData, ailment: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Medical History Summary</label>
                <textarea
                    rows={4}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all resize-none"
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Emergency Signal (Contact)</label>
                <input
                    type="text"
                    required
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
            </div>

            <div className="flex items-center gap-4 pt-4">
                <button type="button" onClick={handleBack} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button type="submit" disabled={loading} className="flex-1 btn-primary py-4 flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Initialize Record <ArrowRight className="w-4 h-4" /></>}
                </button>
            </div>
        </form>
    );

    const renderProfessionalInfo = () => (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full mb-6">
                    <FileText className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Professional Dossier</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Asset Metadata</h2>
            </div>

            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Professional Biography</label>
                <textarea
                    rows={4}
                    required
                    placeholder="Brief overview of clinical experience..."
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all resize-none"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Verification Documents (CV/Resume)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-[32px] p-10 flex flex-col items-center justify-center group hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer">
                    <Upload className="w-10 h-10 text-slate-300 group-hover:text-blue-500 transition-colors mb-4" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Upload PDF / DOCX</p>
                    <p className="text-[10px] font-medium text-slate-300 mt-1 italic">Maximum payload: 5MB</p>
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
                <button type="button" onClick={handleBack} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button type="submit" disabled={loading} className="flex-1 btn-primary py-4 flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Register Personnel <CheckCircle2 className="w-4 h-4" /></>}
                </button>
            </div>
        </form>
    );

    const renderSuccess = () => (
        <div className="text-center py-10 space-y-8">
            <div className="w-24 h-24 bg-emerald-50 rounded-[40px] flex items-center justify-center mx-auto border border-emerald-100 mb-8 overflow-hidden relative">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                >
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </motion.div>
                <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
            </div>

            <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Regstritation Authorized</h2>
                <p className="text-sm font-medium text-slate-500 italic max-w-sm mx-auto">Your node has been successfully integrated into the TRUE CARE ecosystem. Please authenticate to begin operations.</p>
            </div>

            <button
                onClick={() => router.push('/login')}
                className="w-full btn-primary py-6 flex items-center justify-center gap-4 scale-105"
            >
                Enter Command Center
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen mesh-gradient flex items-center justify-center p-6 selection:bg-blue-600/10">
            <div className="max-w-[800px] w-full relative">
                {/* Brand Indicator */}
                <div className="flex items-center gap-3 justify-center mb-12">
                    <img src="/logo.png" alt="TrueCare" className="h-8 w-auto" />
                    <span className="font-black text-slate-900 tracking-tighter text-xl">TRUE CARE</span>
                </div>

                <div className="glass-card p-12 rounded-[48px] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
                            <p className="text-rose-600 text-[11px] font-black uppercase tracking-tight">{error}</p>
                        </div>
                    )}
                </div>

                <p className="text-center mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] opacity-40">
                    Terminal Encryption: RSA-4096 &bull; Secure Protocol Enabled
                </p>
            </div>
        </div>
    );
}
