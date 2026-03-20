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
                <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Aggregating Global KPI Flux...</p>
            </div>
        </div>
    );

    const COLORS = ['#0d9488', '#10b981', '#6366f1', '#f59e0b']; // Teal, Emerald, Indigo, Amber
    const ratioData = [
        { name: 'Patients', value: data?.totals?.patients || 0 },
        { name: 'Caregivers', value: data?.totals?.caregivers || 0 }
    ];

    return (
        <DashboardLayout>
            <div className="max-w-[1600px] mx-auto space-y-12 pb-20 animate-reveal">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 bg-teal-50 px-4 py-2 rounded-full inline-flex border border-teal-100 shadow-sm">
                            <Activity className="w-4 h-4" />
                            <span>Platform Intelligence Hub</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">Global Analytics</h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Macro-operational oversight & revenue matrix</p>
                    </div>
                </motion.div>

                {/* Primary Stats Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-[40px] p-10 shadow-sm border border-slate-100 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center border border-teal-100 shadow-sm">
                                <Users className="w-7 h-7 text-teal-600" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Live</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Active Ecosystem</p>
                            <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{data?.totals?.users || 0}</h3>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[40px] p-10 shadow-sm border border-slate-100 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                                <DollarSign className="w-7 h-7 text-blue-600" />
                            </div>
                            <div className="flex items-center text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full text-[10px] font-black shadow-sm tracking-wide">
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                                14% GROWTH
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Rolling Treasury Flux</p>
                            <h3 className="text-5xl font-black text-slate-900 tracking-tighter">KSh {data?.revenueTrend?.[data.revenueTrend.length - 1]?.amount?.toLocaleString() || 0}</h3>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-[40px] p-10 shadow-xl space-y-6 relative overflow-hidden">
                        <Zap className="absolute -right-4 -bottom-4 w-40 h-40 text-white/10 rotate-12" />
                        <div className="flex items-center justify-between relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 shadow-sm">
                                <Calendar className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-[10px] font-black text-white bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 uppercase tracking-widest shadow-sm">Active Shifts</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-teal-100 uppercase tracking-widest mb-2">Real-time Deployment</p>
                            <h3 className="text-5xl font-black text-white tracking-tighter">{data?.shiftsTrend?.[data.shiftsTrend.length - 1]?.count || 0}</h3>
                        </div>
                    </motion.div>
                </div>

                {/* KPI Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Revenue Trend Chart */}
                    <div className="glass-card rounded-[40px] p-10 shadow-sm border border-slate-100 space-y-8">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center border border-teal-100">
                                    <BarChart3 className="w-4 h-4 text-teal-600" />
                                </div>
                                Revenue Trajectory
                            </h4>
                        </div>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.revenueTrend || []}>
                                    <defs>
                                        <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="amount" stroke="#0d9488" strokeWidth={4} fill="url(#revGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Shift Deployment Chart */}
                    <div className="glass-card rounded-[40px] p-10 shadow-sm border border-slate-100 space-y-8">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                    <Clock className="w-4 h-4 text-emerald-600" />
                                </div>
                                Deployment Velocity
                            </h4>
                        </div>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.shiftsTrend || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Ratio Chart */}
                    <div className="glass-card rounded-[40px] p-10 shadow-sm border border-slate-100 flex flex-col">
                        <div className="border-b border-slate-100 pb-6 mb-8">
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                                    <PieIcon className="w-4 h-4 text-blue-600" />
                                </div>
                                Demographic Distribution
                            </h4>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="h-[280px] w-full">
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
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,1)" />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex gap-10 mt-6">
                                {ratioData.map((entry, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl shadow-sm">
                                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i] }} />
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Transaction Ledger */}
                    <div className="glass-card rounded-[40px] p-10 shadow-sm border border-slate-100">
                        <div className="border-b border-slate-100 pb-6 mb-8">
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100">
                                    <DollarSign className="w-4 h-4 text-amber-600" />
                                </div>
                                Recent Payment Events
                            </h4>
                        </div>
                        <div className="space-y-4">
                            {(data?.recentPayments || []).slice(0, 5).map((pay: any) => (
                                <div key={pay.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl group hover:border-teal-200 hover:shadow-md transition-all">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 font-black shadow-sm group-hover:bg-teal-50 group-hover:text-teal-600 group-hover:border-teal-100 transition-colors">
                                            {pay.user?.profile?.firstName?.[0] || 'T'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{pay.user?.profile?.firstName} {pay.user?.profile?.lastName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded inline-block">{pay.transactionId || 'SYS-PAY'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-slate-900 tracking-tight">KSh {pay.amount.toLocaleString()}</p>
                                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full inline-block">{pay.status}</p>
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
