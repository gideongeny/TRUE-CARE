'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
    Activity,
    Users,
    TrendingUp,
    Zap,
    DollarSign,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    PieChart as PieIcon,
    BarChart3,
    Clock
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/admin/analytics/overview');
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch platform analytics', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Aggregating Global KPI Flux...</p>
            </div>
        </div>
    );

    const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b'];
    const ratioData = [
        { name: 'Patients', value: data?.totals?.patients || 0 },
        { name: 'Caregivers', value: data?.totals?.caregivers || 0 }
    ];

    return (
        <DashboardLayout>
            <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8"
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                            <Activity className="w-4 h-4" />
                            <span>Platform Intelligence Hub</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">Global Analytics</h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Macro-operational oversight & revenue matrix</p>
                    </div>
                </motion.div>

                {/* Primary Stats Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-950 border border-slate-900 rounded-[40px] p-10 shadow-2xl space-y-6">
                        <div className="flex items-center justify-between">
                            <Users className="w-8 h-8 text-blue-500" />
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Live</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Active Ecosystem</p>
                            <h3 className="text-5xl font-black text-white tracking-tighter">{data?.totals?.users || 0}</h3>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-950 border border-slate-900 rounded-[40px] p-10 shadow-2xl space-y-6">
                        <div className="flex items-center justify-between">
                            <DollarSign className="w-8 h-8 text-indigo-500" />
                            <div className="flex items-center text-emerald-500 text-[10px] font-black">
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                                14% GROWTH
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Rolling Treasury Flux</p>
                            <h3 className="text-5xl font-black text-white tracking-tighter">KSh {data?.revenueTrend?.[data.revenueTrend.length - 1]?.amount?.toLocaleString() || 0}</h3>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-2xl space-y-6 relative overflow-hidden">
                        <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-blue-500/5 rotate-12" />
                        <div className="flex items-center justify-between relative z-10">
                            <Calendar className="w-8 h-8 text-emerald-500" />
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Shifts</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Real-time Deployment</p>
                            <h3 className="text-5xl font-black text-white tracking-tighter">{data?.shiftsTrend?.[data.shiftsTrend.length - 1]?.count || 0}</h3>
                        </div>
                    </motion.div>
                </div>

                {/* KPI Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Revenue Trend Chart */}
                    <div className="bg-slate-950 border border-slate-900 rounded-[50px] p-12 shadow-2xl space-y-8">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Revenue Trajectory</h4>
                            <BarChart3 className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.revenueTrend || []}>
                                    <defs>
                                        <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#475569' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#475569' }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px' }} />
                                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fill="url(#revGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Shift Deployment Chart */}
                    <div className="bg-slate-950 border border-slate-900 rounded-[50px] p-12 shadow-2xl space-y-8">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Deployment Velocity</h4>
                            <Clock className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.shiftsTrend || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#475569' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#475569' }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px' }} />
                                    <Bar dataKey="count" fill="#10b981" radius={[10, 10, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Ratio Chart */}
                    <div className="bg-slate-950 border border-slate-900 rounded-[50px] p-12 shadow-2xl flex flex-col items-center justify-center">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest italic mb-8 w-full">Demographic Distribution</h4>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={ratioData}
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={10}
                                        dataKey="value"
                                    >
                                        {ratioData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.05)" />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex gap-10 mt-4">
                            {ratioData.map((entry, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Transaction Ledger */}
                    <div className="bg-slate-950 border border-slate-900 rounded-[50px] p-12 shadow-2xl">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest italic mb-8">Recent Payment Events</h4>
                        <div className="space-y-6">
                            {(data?.recentPayments || []).map((pay: any) => (
                                <div key={pay.id} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-3xl group hover:border-blue-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-blue-500 font-black">
                                            {pay.user?.profile?.firstName?.[0] || 'T'}
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-white uppercase">{pay.user?.profile?.firstName} {pay.user?.profile?.lastName}</p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{pay.transactionId}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-white tracking-tighter">KSh {pay.amount.toLocaleString()}</p>
                                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">{pay.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
