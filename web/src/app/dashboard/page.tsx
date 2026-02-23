'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminOverview from '@/components/dashboard/AdminOverview';
import CaregiverMarketplace from '@/components/dashboard/CaregiverMarketplace';
import CaregiverSchedule from '@/components/dashboard/CaregiverSchedule';
import PatientDashboard from '@/components/dashboard/PatientDashboard';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    if (!user) return null;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Command Center
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium italic">
                            {user.role === 'ADMIN'
                                ? "Here's the system's vital signs for today."
                                : `Welcome back, ${user.firstName}. Your shift schedule is active.`}
                        </p>
                    </motion.div>
                </div>

                <AnimatePresence mode="wait">
                    {user.role === 'ADMIN' ? (
                        <motion.div
                            key="admin"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
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
