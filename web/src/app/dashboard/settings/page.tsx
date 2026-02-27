'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
    User,
    Bell,
    Shield,
    Lock,
    CreditCard,
    Globe,
    Zap,
    Activity,
    ChevronRight,
    Save,
    Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);

    const tabs = [
        { id: 'profile', label: 'Identity Matrix', icon: User },
        { id: 'security', label: 'Safety Protocols', icon: Lock },
        { id: 'notifications', label: 'Alert Delta', icon: Bell },
        { id: 'compliance', label: 'Regulatory Flux', icon: Shield },
        { id: 'integrations', label: 'System Nexus', icon: Zap },
    ];

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            // alert('Settings updated successfully in real-time.');
        }, 1200);
    };

    return (
        <DashboardLayout>
            <div className="max-w-[1400px] mx-auto space-y-12 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                            <Shield className="w-4 h-4" />
                            <span>Control Oversight</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">System Settings</h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Configure your professional TrueCare environment vector</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Navigation Sidebar */}
                    <div className="w-full lg:w-80 space-y-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between px-8 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${activeTab === tab.id
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-2xl shadow-blue-600/20 translate-x-1'
                                        : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-white hover:border-slate-800'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform duration-500 ${activeTab === tab.id ? 'rotate-90 opacity-100' : 'opacity-0'}`} />
                            </button>
                        ))}
                    </div>

                    {/* Content Matrix */}
                    <div className="flex-1 bg-slate-950 border border-slate-900 rounded-[50px] p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -mr-48 -mt-48" />

                        <div className="relative z-10 min-h-[500px]">
                            <AnimatePresence mode="wait">
                                {activeTab === 'profile' && (
                                    <motion.div
                                        key="profile"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Subject Identity</h3>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em]">Manage your platform-wide professional profile</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <Field label="First Name" defaultValue="Admin" />
                                            <Field label="Last Name" defaultValue="Commander" />
                                            <div className="md:col-span-2">
                                                <Field label="Professional Directive" defaultValue="Directing operations for TrueCare Global Commercial Launch." isTextArea />
                                            </div>
                                            <Field label="Sector" defaultValue="Central Command" />
                                            <Field label="Temporal Zone" defaultValue="UTC +3 (Nairobi)" />
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'security' && (
                                    <motion.div
                                        key="security"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Safety Protocols</h3>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em]">Configure cryptographic access and bio-verification</p>
                                        </div>

                                        <div className="space-y-4">
                                            <SecurityToggle
                                                title="Biometric Authentication"
                                                desc="Extra layer of neural identity verification."
                                                icon={<Fingerprint className="w-5 h-5 text-blue-500" />}
                                                active
                                            />
                                            <SecurityToggle
                                                title="Multi-Factor Flux"
                                                desc="Temporary cryptographic token generation."
                                                icon={<Shield className="w-5 h-5 text-slate-500" />}
                                            />
                                            <SecurityToggle
                                                title="Global Session Flush"
                                                desc="Terminate all active deployment sessions."
                                                icon={<Lock className="w-5 h-5 text-rose-500" />}
                                                isNegative
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'notifications' && (
                                    <motion.div
                                        key="notifications"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Alert Delta</h3>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em]">Configure real-time system intelligence distribution</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <NotifySwitch label="Critical System Failures" active />
                                            <NotifySwitch label="Shift Temporal Updates" active />
                                            <NotifySwitch label="Financial Flux Detected" />
                                            <NotifySwitch label="Subject Admittance Requests" active />
                                            <NotifySwitch label="Operational Directives" />
                                            <NotifySwitch label="Network Latency Alerts" active />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Actions */}
                        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                System Registered: 2024-01-12
                            </p>
                            <div className="flex gap-4 w-full md:w-auto">
                                <button className="flex-1 md:flex-none px-10 py-4 bg-slate-900 border border-slate-800 text-slate-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 md:flex-none px-12 py-4 bg-white hover:bg-blue-600 text-slate-950 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 disabled:opacity-50 space-x-3 flex items-center justify-center"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{isSaving ? 'Synchronizing...' : 'Deploy Changes'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function Field({ label, defaultValue, isTextArea = false }: any) {
    return (
        <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</label>
            {isTextArea ? (
                <textarea
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm text-white placeholder-slate-700 outline-none focus:border-blue-500/40 transition-all font-bold h-32 resize-none"
                    defaultValue={defaultValue}
                />
            ) : (
                <input
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white placeholder-slate-700 outline-none focus:border-blue-500/40 transition-all font-bold"
                    defaultValue={defaultValue}
                />
            )}
        </div>
    );
}

function SecurityToggle({ title, desc, icon, active = false, isNegative = false }: any) {
    return (
        <button className={`w-full flex items-center justify-between p-8 rounded-[32px] border transition-all duration-300 group ${isNegative
                ? 'bg-rose-500/5 border-rose-500/10 hover:border-rose-500/30'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            }`}>
            <div className="flex items-center gap-6">
                <div className={`w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                    {icon}
                </div>
                <div className="text-left">
                    <p className="text-sm font-black text-white uppercase tracking-tight">{title}</p>
                    <p className="text-[10px] text-slate-600 font-bold tracking-widest uppercase mt-0.5">{desc}</p>
                </div>
            </div>
            <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${active ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'}`}>
                <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
            </div>
        </button>
    );
}

function NotifySwitch({ label, active = false }: any) {
    return (
        <div className="flex items-center justify-between p-6 bg-slate-900/30 border border-slate-800/30 rounded-2xl group hover:border-blue-500/20 transition-all">
            <span className="text-[11px] font-black text-slate-400 group-hover:text-white transition-colors uppercase tracking-tight">{label}</span>
            <button className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-all ${active ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'}`}>
                <div className="w-3.5 h-3.5 bg-white rounded-full" />
            </button>
        </div>
    );
}
