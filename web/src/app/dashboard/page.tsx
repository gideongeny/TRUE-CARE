'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminOverview from '@/components/dashboard/AdminOverview';
import CaregiverMarketplace from '@/components/dashboard/CaregiverMarketplace';
import CaregiverSchedule from '@/components/dashboard/CaregiverSchedule';
import PatientDashboard from '@/components/dashboard/PatientDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, Zap, Bell, Search, User } from 'lucide-react';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
        else setUser({ role: 'ADMIN', firstName: 'System', lastName: 'Admin' }); // Fallback for dev
    }, []);

    if (!user) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <DashboardLayout>
            <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-900 pb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
                            <Shield className="w-4 h-4" />
                            <span>Authorized Access Vector</span>
                        </div>
                        <h1 className="text-6xl font-black text-white tracking-tighter italic uppercase">
                            Command Center
                        </h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-4 h-4 text-slate-700" />
                            {user.role === 'ADMIN'
                                ? "Global operational status: OPTIMAL"
                                : `Subject: ${user.firstName} ${user.lastName} &bull; Deployment Status: ACTIVE`}
                        </p>
                    </motion.div>

                    <div className="flex items-center gap-6">
                        <div className="relative group hidden lg:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search system nodes..."
                                className="bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-xs text-white placeholder-slate-700 outline-none focus:border-blue-500/40 transition-all w-80 font-bold"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all relative">
                                <Bell className="w-5 h-5" />
                                <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                            </button>
                            <div className="h-10 w-px bg-slate-900 mx-2" />
                            <div className="flex items-center gap-4 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl">
                                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xs">
                                    {user.firstName[0]}
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className="text-[10px] font-black text-white uppercase tracking-tight">{user.firstName}</p>
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{user.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Regional Activity Stream */}
                <AnimatePresence mode="wait">
                    {user.role === 'ADMIN' ? (
                        <motion.div
                            key="admin"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            <AdminOverview />
                        </motion.div>
                    ) : user.role === 'CAREGIVER' ? (
                        <motion.div
                            key="caregiver"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
                        >
                            <div className="lg:col-span-2">
                                <CaregiverSchedule />
                            </div>
                            <div className="lg:col-span-1">
                                <CaregiverMarketplace />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="patient"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <PatientDashboard />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
