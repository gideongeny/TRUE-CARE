'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Users,
    Calendar,
    Clock,
    TrendingUp,
    MoreVertical,
    Activity,
    CheckCircle2,
    ArrowUpRight,
    Search
} from 'lucide-react';
import api from '@/lib/api';

const StatCard = ({ title, value, change, icon: Icon, color, delay }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="group relative"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent rounded-[32px] pointer-events-none" />
            <div className="relative bg-zinc-900/40 backdrop-blur-md border border-white/[0.08] p-8 rounded-[32px] overflow-hidden hover:border-white/20 transition-colors duration-500">
                <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10">
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-xs font-bold">{change}</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-4xl font-light text-white mb-2 tracking-tight">{value}</h3>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{title}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default function OverviewPage() {
    const [user, setUser] = useState<any>(null);
    const [recentRequests, setRecentRequests] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalPatients: 0,
        activeCaregivers: 0,
        upcomingShifts: 0,
        pendingRequests: 0
    });

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
        const fetchStats = async () => {
            try {
                const [usersRes, shiftsRes, requestsRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/shifts'),
                    api.get('/requests')
                ]);

                const users = usersRes.data;
                const shifts = shiftsRes.data;
                const requests = requestsRes.data;

                setStats({
                    totalPatients: users.filter((u: any) => u.role === 'PATIENT').length,
                    activeCaregivers: users.filter((u: any) => u.role === 'CAREGIVER').length,
                    upcomingShifts: shifts.filter((s: any) => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS').length,
                    pendingRequests: requests.filter((r: any) => r.status === 'PENDING').length
                });

                setRecentRequests(requests.slice(0, 5));
            } catch (err) {
                console.error('Failed to fetch stats', err);
                // Fallback to mock data for layout demonstration
                setStats({
                    totalPatients: 128,
                    activeCaregivers: 45,
                    upcomingShifts: 12,
                    pendingRequests: 8
                });
            }
        };
        fetchStats();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-light tracking-tight text-white mb-4">
                            Hello, <span className="font-bold">{user?.firstName || 'Back'}</span>
                        </h1>
                        <p className="text-zinc-500 text-sm font-medium tracking-wide">
                            Here's what's happening with your platform today.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex items-center gap-4"
                    >
                        <button
                            onClick={() => window.location.href = '/dashboard/shifts'}
                            className="h-14 px-8 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-[0.15em] hover:bg-zinc-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3"
                        >
                            <Calendar className="w-4 h-4" />
                            <span>Schedule</span>
                        </button>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Patients"
                        value={stats.totalPatients}
                        change="+12%"
                        icon={Users}
                        delay={0.1}
                    />
                    <StatCard
                        title="Active Caregivers"
                        value={stats.activeCaregivers}
                        change="+5%"
                        icon={Activity}
                        delay={0.2}
                    />
                    <StatCard
                        title="Pending Requests"
                        value={stats.pendingRequests}
                        change="New"
                        icon={Clock}
                        delay={0.3}
                    />
                    <StatCard
                        title="Upcoming Shifts"
                        value={stats.upcomingShifts}
                        change="+8%"
                        icon={Calendar}
                        delay={0.4}
                    />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue/Main Chart Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-md border border-white/[0.08] p-8 md:p-10 rounded-[40px] relative overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6 relative z-10">
                            <div>
                                <h3 className="text-2xl font-light text-white tracking-tight">Analytics</h3>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Revenue vs Expenses</p>
                            </div>
                            <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5">
                                <button className="px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Weekly</button>
                                <button className="px-6 py-3 text-zinc-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Monthly</button>
                            </div>
                        </div>

                        <div className="h-64 flex items-end justify-between gap-4 relative z-10">
                            {[45, 78, 52, 90, 65, 85, 60].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                    <div className="w-full bg-white/[0.03] rounded-2xl relative overflow-hidden h-full flex items-end">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ duration: 1.5, delay: 0.6 + (i * 0.1), ease: [0.22, 1, 0.36, 1] }}
                                            className="w-full bg-white group-hover:bg-blue-400 transition-colors duration-300"
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Requests */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-zinc-900/40 backdrop-blur-md border border-white/[0.08] p-8 rounded-[40px] flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-light text-white tracking-tight">Recent</h3>
                            <button
                                onClick={() => window.location.href = '/dashboard/requests'}
                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                            >
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-6 flex-1 overflow-auto pr-2">
                            {recentRequests.length > 0 ? recentRequests.map((req, i) => (
                                <div key={req.id} className="flex gap-4 p-4 rounded-3xl hover:bg-white/[0.03] transition-colors cursor-pointer group">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/30 transition-colors">
                                        <Users className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white leading-tight mb-1">
                                            {req.patient?.profile?.firstName} {req.patient?.profile?.lastName}
                                        </p>
                                        <p className="text-xs text-zinc-500 font-medium">{req.careType}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${req.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="flex flex-col items-center justify-center h-48 opacity-30">
                                    <Activity className="w-8 h-8 mb-3" />
                                    <p className="text-xs font-bold uppercase tracking-widest">No activity</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
