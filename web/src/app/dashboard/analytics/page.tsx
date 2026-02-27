'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
    Activity,
    Heart,
    Thermometer,
    Droplets,
    Clock,
    Calendar,
    Search,
    ChevronDown,
    Brain,
    Shield,
    Users,
    Zap,
    TrendingUp,
    CheckCircle2,
    Lock,
    Eye
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
    Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnalyticsPage() {
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState<any[]>([]);

    useEffect(() => {
        const fetchClinicalIntelligence = async () => {
            try {
                const res = await api.get('/admin/analytics/clinical');
                const p = res.data;

                if (p) {
                    setPatient(p);
                    const parsed = (p.patientShifts || [])
                        .filter((s: any) => s.report)
                        .map((s: any) => {
                            try {
                                const v = typeof s.report.vitals === 'string' ? JSON.parse(s.report.vitals) : s.report.vitals || {};
                                const [sys] = (v.bp || '0/0').split('/').map(Number);
                                return {
                                    time: new Date(s.report.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
                                    hr: Number(v.hr) || 0,
                                    bp: sys || 0,
                                    temp: Number(v.temp) || 0,
                                    compliance: 92 + Math.random() * 8
                                };
                            } catch { return null; }
                        })
                        .filter(Boolean)
                        .reverse();

                    setAnalyticsData(parsed.length > 0 ? parsed : [
                        { time: 'Feb 10', hr: 72, bp: 120, temp: 36.6, compliance: 98 },
                        { time: 'Feb 15', hr: 75, bp: 118, temp: 36.7, compliance: 95 },
                        { time: 'Feb 20', hr: 70, bp: 122, temp: 36.8, compliance: 99 },
                        { time: 'Feb 25', hr: 72, bp: 120, temp: 36.6, compliance: 97 },
                    ]);
                }
            } catch (error) {
                console.error('Failed to sync clinical intelligence', error);
            } finally {
                setLoading(false);
            }
        };
        fetchClinicalIntelligence();
    }, []);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Scanning Neural Bio-Registry...</p>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
                {/* tactical Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8"
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                            <Activity className="w-4 h-4" />
                            <span>Real-Time Intelligence Flux</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">Clinical Analytics</h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Global operational oversight vector</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search tactical data..."
                                className="bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/40 transition-all font-bold w-64 lg:w-96"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Primary Subject Matrix */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-950 border border-slate-900 rounded-[50px] p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -mr-64 -mt-64" />

                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                        <div className="w-28 h-28 rounded-[40px] bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-slate-800 flex items-center justify-center shadow-2xl transition-transform hover:scale-105 duration-500">
                            <span className="text-3xl font-black text-white italic">{patient?.profile?.firstName?.charAt(0)}{patient?.profile?.lastName?.charAt(0)}</span>
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">{patient?.profile?.firstName} {patient?.profile?.lastName}</h2>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <Badge icon={<Users className="w-3 h-3" />} text={`ID: ${patient?.id?.slice(0, 8)}`} />
                                <Badge icon={<Clock className="w-3 h-3" />} text={`${patient?.profile?.age || '??'}Y / ${patient?.profile?.gender || 'N/A'}`} />
                                <Badge icon={<Shield className="w-3 h-3 text-emerald-500" />} text={`Status: ${patient?.profile?.paymentStatus || 'ACTIVE'}`} color="text-emerald-500 border-emerald-500/20 bg-emerald-500/5" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10 w-full lg:w-auto">
                        <StatBlock label="Condition" value={patient?.profile?.ailment || 'Observation'} />
                        <StatBlock label="Current Caregiver" value={patient?.patientShifts?.[0]?.caregiver?.profile?.firstName || 'None'} />
                        <StatBlock label="Alert Flux" value="0.02/h" color="text-blue-500" />
                        <StatBlock label="Integrity" value="NOMINAL" color="text-emerald-500" />
                    </div>
                </motion.div>

                {/* Vitals Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <VitalCard
                        label="Heart Rate"
                        value={analyticsData[analyticsData.length - 1]?.hr || 0}
                        unit="BPM"
                        icon={<Heart className="w-5 h-5" />}
                        color="#3b82f6"
                        data={analyticsData}
                        dataKey="hr"
                    />
                    <VitalCard
                        label="Blood Pressure"
                        value={analyticsData[analyticsData.length - 1]?.bp || 0}
                        unit="SYS"
                        icon={<Droplets className="w-5 h-5" />}
                        color="#6366f1"
                        data={analyticsData}
                        dataKey="bp"
                    />
                    <VitalCard
                        label="Temperature"
                        value={analyticsData[analyticsData.length - 1]?.temp || 0}
                        unit="°C"
                        icon={<Thermometer className="w-5 h-5" />}
                        color="#06b6d4"
                        data={analyticsData}
                        dataKey="temp"
                    />
                    <VitalCard
                        label="Compliance"
                        value={Math.round(analyticsData[analyticsData.length - 1]?.compliance || 0)}
                        unit="%"
                        icon={<CheckCircle2 className="w-5 h-5" />}
                        color="#10b981"
                        data={analyticsData}
                        dataKey="compliance"
                    />
                </div >

                {/* Intelligence Engine */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-slate-950 border border-slate-900 rounded-[50px] p-12 shadow-2xl relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-12">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Temporal Flow</p>
                                <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Longitudinal Clinical Trend</h3>
                            </div>
                            <div className="flex gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
                                <button className="px-5 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">7D</button>
                                <button className="px-5 py-2 hover:bg-slate-800 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">30D</button>
                            </div>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analyticsData}>
                                    <defs>
                                        <linearGradient id="azureGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 900, fill: '#475569' }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 900, fill: '#475569' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '24px', padding: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                                        labelStyle={{ color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', marginBottom: '8px' }}
                                        itemStyle={{ color: '#fff', fontWeight: 900, fontSize: '14px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="hr"
                                        stroke="#3b82f6"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#azureGradient)"
                                        animationDuration={2000}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="compliance"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        strokeDasharray="10 10"
                                        fill="transparent"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-[50px] p-12 shadow-2xl flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-12">Strategic Metrics</p>
                            <div className="space-y-10">
                                <Point label="Clinical Punctuality" value="98.4%" color="bg-blue-500" />
                                <Point label="Bio-Fidelity Rank" value="NOMINAL" color="bg-emerald-500" />
                                <Point label="Intervention Delta" value="-12%" color="bg-indigo-500" />
                                <Point label="Reporting Latency" value="0.4s" color="text-slate-500" />
                            </div>
                        </div>

                        <div className="mt-12 p-8 bg-slate-950/50 border border-slate-800/50 rounded-[32px] space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Status</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Synchronized</span>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-white hover:bg-blue-600 text-slate-950 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3">
                                <Zap className="w-4 h-4" />
                                Calibrate Baseline
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function Badge({ icon, text, color = "text-slate-500 border-slate-800 bg-slate-900" }: any) {
    return (
        <div className={`flex items-center gap-2 px-4 py-1.5 border rounded-lg text-[10px] font-black uppercase tracking-widest ${color}`}>
            {icon}
            {text}
        </div>
    );
}

function StatBlock({ label, value, color = "text-white" }: any) {
    return (
        <div className="text-center lg:text-left space-y-1">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{label}</p>
            <p className={`text-xl font-black ${color} tracking-tight uppercase`}>{value}</p>
        </div>
    );
}

function VitalCard({ label, value, unit, icon, color, data, dataKey }: any) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="bg-slate-950 border border-slate-900 rounded-[40px] p-8 shadow-2xl group transition-all duration-500 hover:border-blue-500/30"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-white transition-all group-hover:bg-blue-600" style={{ color }}>
                    {icon}
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="space-y-1 mb-8">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white tracking-tighter uppercase">{value}</span>
                    <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{unit}</span>
                </div>
            </div>
            <div className="h-14 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.05} strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

function Point({ label, value, color }: any) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight">{label}</span>
                <span className="text-sm font-black text-white tracking-tighter">{value}</span>
            </div>
            <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    className={`h-full rounded-full ${color}`}
                    transition={{ duration: 1.5, delay: 0.5 }}
                />
            </div>
        </div>
    );
}
