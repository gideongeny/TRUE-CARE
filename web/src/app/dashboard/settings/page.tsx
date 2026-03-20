'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
    User,
    Bell,
    Shield,
    Lock,
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
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Security toggles state
    const [biometric, setBiometric] = useState(true);
    const [mfa, setMfa] = useState(false);

    // Notification toggles state
    const [notifications, setNotifications] = useState({
        criticalFailures: true,
        shiftUpdates: true,
        financialFlux: false,
        admittanceRequests: true,
        operationalDirectives: false,
        networkLatency: true,
    });

    useEffect(() => {
        const storedBio = localStorage.getItem('settings_bio');
        if (storedBio !== null) setBiometric(storedBio === 'true');

        const storedMfa = localStorage.getItem('settings_mfa');
        if (storedMfa !== null) setMfa(storedMfa === 'true');

        const storedNotif = localStorage.getItem('settings_notif');
        if (storedNotif !== null) setNotifications(JSON.parse(storedNotif));
    }, []);

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const tabs = [
        { id: 'profile', label: 'Identity Matrix', icon: User },
        { id: 'security', label: 'Safety Protocols', icon: Lock },
        { id: 'notifications', label: 'Alert Delta', icon: Bell },
        { id: 'compliance', label: 'Regulatory Flux', icon: Shield },
        { id: 'integrations', label: 'System Nexus', icon: Zap },
    ];

    const handleSave = () => {
        setIsSaving(true);
        setSaveSuccess(false);

        // Simulate save
        localStorage.setItem('settings_bio', String(biometric));
        localStorage.setItem('settings_mfa', String(mfa));
        localStorage.setItem('settings_notif', JSON.stringify(notifications));

        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 800);
    };

    return (
        <DashboardLayout>
            <div className="max-w-[1400px] mx-auto space-y-12 pb-20 animate-reveal">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 bg-teal-50 px-4 py-2 rounded-full inline-flex border border-teal-100 shadow-sm">
                            <Shield className="w-4 h-4" />
                            <span>Control Oversight</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">System Settings</h1>
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
                                className={`w-full flex items-center justify-between px-8 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border shadow-sm ${activeTab === tab.id
                                    ? 'bg-teal-600 border-teal-500 text-white shadow-teal-600/20 translate-x-1'
                                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-teal-200'
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
                    <div className="flex-1 bg-white border border-slate-200 rounded-[50px] p-12 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

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
                                        <div className="space-y-2 border-b border-slate-100 pb-6">
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Subject Identity</h3>
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
                                        <div className="space-y-2 border-b border-slate-100 pb-6">
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Safety Protocols</h3>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em]">Configure cryptographic access and bio-verification</p>
                                        </div>

                                        <div className="space-y-4">
                                            <SecurityToggle
                                                title="Biometric Authentication"
                                                desc="Extra layer of neural identity verification."
                                                icon={<Fingerprint className="w-5 h-5 text-teal-600" />}
                                                active={biometric}
                                                onToggle={() => setBiometric(v => !v)}
                                            />
                                            <SecurityToggle
                                                title="Multi-Factor Flux"
                                                desc="Temporary cryptographic token generation."
                                                icon={<Shield className="w-5 h-5 text-slate-500" />}
                                                active={mfa}
                                                onToggle={() => setMfa(v => !v)}
                                            />
                                            <SecurityToggle
                                                title="Global Session Flush"
                                                desc="Terminate all active deployment sessions. This will sign you out everywhere."
                                                icon={<Lock className="w-5 h-5 text-rose-500" />}
                                                active={false}
                                                isNegative
                                                onToggle={() => {
                                                    if (confirm('This will terminate all active sessions. Are you sure?')) {
                                                        localStorage.clear();
                                                        window.location.href = '/login';
                                                    }
                                                }}
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
                                        <div className="space-y-2 border-b border-slate-100 pb-6">
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Alert Delta</h3>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em]">Configure real-time system intelligence distribution</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <NotifySwitch label="Critical System Failures" active={notifications.criticalFailures} onToggle={() => toggleNotification('criticalFailures')} />
                                            <NotifySwitch label="Shift Temporal Updates" active={notifications.shiftUpdates} onToggle={() => toggleNotification('shiftUpdates')} />
                                            <NotifySwitch label="Financial Flux Detected" active={notifications.financialFlux} onToggle={() => toggleNotification('financialFlux')} />
                                            <NotifySwitch label="Subject Admittance Requests" active={notifications.admittanceRequests} onToggle={() => toggleNotification('admittanceRequests')} />
                                            <NotifySwitch label="Operational Directives" active={notifications.operationalDirectives} onToggle={() => toggleNotification('operationalDirectives')} />
                                            <NotifySwitch label="Network Latency Alerts" active={notifications.networkLatency} onToggle={() => toggleNotification('networkLatency')} />
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'compliance' && (
                                    <motion.div
                                        key="compliance"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="space-y-2 border-b border-slate-100 pb-6">
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Regulatory Flux</h3>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em]">Data governance and compliance configuration</p>
                                        </div>
                                        <div className="space-y-4">
                                            <ComplianceItem label="HIPAA Data Compliance" status="Active" color="emerald" />
                                            <ComplianceItem label="GDPR Patient Rights" status="Configured" color="emerald" />
                                            <ComplianceItem label="Audit Log Retention" status="90 Days" color="blue" />
                                            <ComplianceItem label="Data Encryption Standard" status="AES-256" color="slate" />
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'integrations' && (
                                    <motion.div
                                        key="integrations"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="space-y-2 border-b border-slate-100 pb-6">
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">System Nexus</h3>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em]">External integrations and platform connections</p>
                                        </div>
                                        <div className="space-y-4">
                                            <IntegrationItem label="M-Pesa Payment Gateway" status="Connected" color="emerald" />
                                            <IntegrationItem label="SMS Alert Provider" status="Connected" color="blue" />
                                            <IntegrationItem label="Email Dispatch Service" status="Connected" color="blue" />
                                            <IntegrationItem label="Real-Time Telemetry API" status="Pending" color="amber" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Actions */}
                        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                {saveSuccess ? <span className="text-emerald-500">✓ Changes Saved Successfully</span> : 'System Registered: 2024-01-12'}
                            </p>
                            <div className="flex gap-4 w-full md:w-auto">
                                <button className="flex-1 md:flex-none px-10 py-4 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 md:flex-none px-12 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 disabled:opacity-50 space-x-3 flex items-center justify-center"
                                >
                                    <Save className="w-4 h-4 text-teal-100" />
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/10 transition-all font-bold h-32 resize-none shadow-sm"
                    defaultValue={defaultValue}
                />
            ) : (
                <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/10 transition-all font-bold shadow-sm"
                    defaultValue={defaultValue}
                />
            )}
        </div>
    );
}

function SecurityToggle({ title, desc, icon, active = false, isNegative = false, onToggle }: any) {
    return (
        <button
            onClick={onToggle}
            className={`w-full flex items-center justify-between p-8 rounded-[32px] border transition-all duration-300 group ${isNegative
                ? 'bg-rose-50 border-rose-100 hover:border-rose-300'
                : active
                    ? 'bg-teal-50 border-teal-200 hover:border-teal-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
        >
            <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border ${isNegative ? 'bg-rose-100 border-rose-200' : 'bg-white border-slate-100'}`}>
                    {icon}
                </div>
                <div className="text-left">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{title}</p>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">{desc}</p>
                </div>
            </div>
            <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-all duration-300 ${active ? 'bg-teal-600 justify-end' : isNegative ? 'bg-rose-500 justify-start' : 'bg-slate-300 justify-start'}`}>
                <div className="w-4 h-4 bg-white rounded-full shadow-lg transition-all" />
            </div>
        </button>
    );
}

function NotifySwitch({ label, active = false, onToggle }: any) {
    return (
        <div
            onClick={onToggle}
            className={`flex items-center justify-between p-6 rounded-2xl border cursor-pointer transition-all group shadow-sm ${active ? 'bg-teal-50 border-teal-200 hover:border-teal-300' : 'bg-white border-slate-200 hover:border-teal-100'}`}
        >
            <span className={`text-[11px] font-black uppercase tracking-tight transition-colors ${active ? 'text-teal-900' : 'text-slate-500 group-hover:text-slate-900'}`}>{label}</span>
            <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-all duration-300 ${active ? 'bg-teal-600 justify-end' : 'bg-slate-300 justify-start'}`}>
                <div className="w-3.5 h-3.5 bg-white rounded-full shadow transition-all" />
            </div>
        </div>
    );
}

function ComplianceItem({ label, status, color = 'emerald' }: any) {
    const colorMap: Record<string, string> = {
        emerald: 'text-emerald-600 bg-emerald-50 border border-emerald-100',
        blue: 'text-blue-600 bg-blue-50 border border-blue-100',
        amber: 'text-amber-600 bg-amber-50 border border-amber-100',
        slate: 'text-slate-600 bg-slate-50 border border-slate-200',
    };
    return (
        <div className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-teal-200 transition-colors">
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{label}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${colorMap[color]}`}>{status}</span>
        </div>
    );
}

function IntegrationItem({ label, status, color }: any) {
    const colorMap: Record<string, string> = {
        emerald: 'text-emerald-600 bg-emerald-50 border border-emerald-100',
        blue: 'text-blue-600 bg-blue-50 border border-blue-100',
        amber: 'text-amber-600 bg-amber-50 border border-amber-100',
    };
    return (
        <div className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-teal-200 transition-colors">
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{label}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${colorMap[color]}`}>{status}</span>
        </div>
    );
}
