'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Settings,
    Shield,
    Database,
    Globe,
    Palette,
    HardDrive,
    Lock,
    Zap,
    Save,
    RotateCcw
} from 'lucide-react';
import api from '@/lib/api';

const SettingSection = ({ title, description, icon: Icon, children }: any) => (
    <div className="glass-card p-10 border-white/5">
        <div className="flex items-start gap-6 mb-8">
            <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-blue-400">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
                <p className="text-sm text-gray-500 mt-1.5 font-medium">{description}</p>
            </div>
        </div>
        {children}
    </div>
);

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        bio: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile');
                if (res.data.profile) {
                    setFormData({
                        firstName: res.data.profile.firstName || '',
                        lastName: res.data.profile.lastName || '',
                        phone: res.data.profile.phone || '',
                        address: res.data.profile.address || '',
                        bio: res.data.profile.bio || ''
                    });
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setSuccess(false);
        try {
            await api.put('/users/profile', formData);
            setSuccess(true);
            // Update local storage user if needed
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const user = JSON.parse(savedUser);
                user.firstName = formData.firstName;
                user.lastName = formData.lastName;
                localStorage.setItem('user', JSON.stringify(user));
            }
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Failed to update profile:", err);
            alert("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl space-y-12">
                <div className="flex flex-col gap-3">
                    <h1 className="text-5xl font-extrabold text-white tracking-tight flex items-center gap-4">
                        <Settings className="w-10 h-10 text-blue-500" />
                        System <span className="text-gray-500 font-normal">Settings</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Manage your TRUE CARE platform configurations and security.</p>
                </div>

                <div className="grid grid-cols-1 gap-10">
                    <SettingSection
                        title="Administrator Profile"
                        description="Update your personal information shown on the dashboard."
                        icon={Shield}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">First Name</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="input-field w-full"
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">Last Name</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="input-field w-full"
                                    placeholder="Enter last name"
                                />
                            </div>
                            <div className="space-y-3 md:col-span-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="input-field w-full"
                                    placeholder="Operational headquarters address"
                                />
                            </div>
                        </div>
                    </SettingSection>

                    <SettingSection
                        title="Security & Access"
                        description="Configure login security and session durations."
                        icon={Lock}
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                                <div>
                                    <p className="font-bold text-white tracking-tight">Two-Factor Authentication</p>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">Add an extra layer of security to your account.</p>
                                </div>
                                <div className="w-14 h-7 bg-blue-600/20 border border-blue-500/30 rounded-full relative cursor-pointer group">
                                    <div className="absolute right-1 top-1 w-5 h-5 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover:scale-110 transition-transform" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                                <div>
                                    <p className="font-bold text-white tracking-tight">Advanced Encryption (AES-256)</p>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">All data is encrypted with military-grade protocols.</p>
                                </div>
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 rounded-lg">Enabled</span>
                            </div>
                        </div>
                    </SettingSection>

                    <SettingSection
                        title="Database Status"
                        description="Monitor server health and response latency."
                        icon={Database}
                    >
                        <div className="grid grid-cols-2 gap-8">
                            <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/5 text-center group hover:bg-white/[0.04] transition-all">
                                <p className="text-4xl font-bold text-white tracking-tighter">0.05<span className="text-blue-500 text-xl font-normal ml-1">ms</span></p>
                                <p className="text-[10px] text-gray-600 font-extrabold tracking-[0.2em] uppercase mt-3">API Latency</p>
                            </div>
                            <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/5 text-center group hover:bg-white/[0.04] transition-all">
                                <p className="text-4xl font-bold text-white tracking-tighter">99.9<span className="text-emerald-500 text-xl font-normal ml-1">%</span></p>
                                <p className="text-[10px] text-gray-600 font-extrabold tracking-[0.2em] uppercase mt-3">Server Uptime</p>
                            </div>
                        </div>
                    </SettingSection>
                </div>

                <div className="pt-10 border-t border-white/5 flex justify-end gap-6">
                    <button className="px-8 py-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3">
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`btn-primary flex items-center gap-3 shrink-0 ${success ? '!bg-emerald-600' : ''}`}
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : success ? (
                            <Zap className="w-4 h-4 fill-current" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {loading ? 'Saving...' : success ? 'Applied' : 'Apply Changes'}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
