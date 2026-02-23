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
    Zap
} from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);

    const tabs = [
        { id: 'profile', label: 'Profile Management', icon: User },
        { id: 'security', label: 'Security & Access', icon: Lock },
        { id: 'notifications', label: 'Alert Preferences', icon: Bell },
        { id: 'compliance', label: 'Regulatory & KYC', icon: Shield },
        { id: 'integrations', label: 'External Systems', icon: Zap },
    ];

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Settings updated successfully in real-time.');
        }, 800);
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Settings</h1>
                    <p className="text-sm text-slate-500 font-medium italic">Configure your professional TrueCare environment.</p>
                </div>

                <div className="flex bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    {/* Tabs Sidebar */}
                    <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8 space-y-8">
                        {activeTab === 'profile' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                                    <p className="text-xs text-slate-500 mt-1">Manage your identity across the platform.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">First Name</label>
                                        <input type="text" className="input-field w-full" defaultValue="Admin" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Name</label>
                                        <input type="text" className="input-field w-full" defaultValue="User" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Professional Bio</label>
                                        <textarea className="input-field w-full h-24 resize-none" defaultValue="Directing operations for TrueCare Commercial Launch." />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Safety Controls</h3>
                                    <p className="text-xs text-slate-500 mt-1">Adjust password and authentication methods.</p>
                                </div>
                                <div className="space-y-4">
                                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-slate-900">Multi-Factor Authentication</p>
                                                <p className="text-[10px] text-slate-500 font-medium">Extra layer of biometric security.</p>
                                            </div>
                                        </div>
                                        <div className="w-10 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1">
                                            <div className="w-4 h-4 bg-white rounded-full" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-lg font-bold text-slate-900">Alert Matrix</h3>
                                <div className="space-y-4">
                                    {['System Alerts', 'Shift Real-time Updates', 'Security Breaches', 'Marketing'].map((item) => (
                                        <div key={item} className="flex items-center justify-between py-2">
                                            <span className="text-sm font-medium text-slate-600">{item}</span>
                                            <div className="w-10 h-6 bg-slate-200 rounded-full flex items-center px-1">
                                                <div className="w-4 h-4 bg-white rounded-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-8 border-t border-slate-100 flex justify-end gap-3">
                            <button className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg text-sm">Cancel</button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 transition-all"
                            >
                                {isSaving ? 'Processing...' : 'Deploy Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
