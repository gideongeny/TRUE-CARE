'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminOverview from '@/components/dashboard/AdminOverview';
import CaregiverMarketplace from '@/components/dashboard/CaregiverMarketplace';
import CaregiverSchedule from '@/components/dashboard/CaregiverSchedule';
import PatientDashboard from '@/components/dashboard/PatientDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, HeartPulse, Search, SearchIcon, Clock } from 'lucide-react';
import api from '@/lib/api';
import NotificationDropdown from '@/components/dashboard/NotificationDropdown';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
        else setUser({ role: 'ADMIN', firstName: 'System', lastName: 'Admin' }); 
    }, []);

    // Periodic Location Tracking for Caregivers
    useEffect(() => {
        if (user?.role !== 'CAREGIVER') return;

        const reportLocation = async () => {
            if (!navigator.geolocation) return;

            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    await api.post('/users/update-location', {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                } catch (error) {
                    console.error('Location sync heartbeat failed', error);
                }
            });
        };

        reportLocation();
        const interval = setInterval(reportLocation, 120000);

        return () => clearInterval(interval);
    }, [user?.role]);

    if (!user) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <DashboardLayout>
            <div className="max-w-[1600px] mx-auto space-y-10 pb-20">
                {/* Clean, Bright Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 pb-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verified Care Portal</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                            Care Dashboard
                        </h1>
                        <p className="text-slate-500 text-sm font-semibold flex items-center gap-2">
                            <HeartPulse className="w-4 h-4 text-rose-500" />
                            {user.role === 'ADMIN'
                                ? "Overviewing all active care networks."
                                : `Welcome back, ${user?.firstName ?? ''} ${user?.lastName ?? ''}. Ready for today?`}
                        </p>
                    </motion.div>

                    <div className="flex items-center gap-6">
                        <div className="relative group hidden lg:block">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search patients or care logs..."
                                className="bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all w-80 font-semibold shadow-sm"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <NotificationDropdown />
                            <div className="h-10 w-px bg-slate-200 mx-2" />
                            <div className="flex items-center gap-4 px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center font-bold text-teal-700 text-sm">
                                    {user?.firstName?.[0] ?? '?'}
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-bold text-slate-900 tracking-tight">{user.firstName}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Stream */}
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
                            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                        >
                            <div className="lg:col-span-2 space-y-10">
                                <CaregiverSchedule />
                            </div>
                            <div className="lg:col-span-1 border-l border-slate-100 pl-10">
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
