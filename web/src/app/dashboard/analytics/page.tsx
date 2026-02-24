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
    CheckCircle2
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
                // Fetch primary patient (Francis) for contextual relevance
                const res = await api.get('/admin/users');
                const francis = res.data.find((u: any) => u.profile?.firstName === 'Francis');

                if (francis) {
                    setPatient(francis);

                    // Parse vitals from shift reports
                    const parsed = (francis.shifts || [])
                        .filter((s: any) => s.report)
                        .map((s: any) => {
                            try {
                                const v = JSON.parse(s.report.vitals || '{}');
                                const [sys] = (v.bp || '0/0').split('/').map(Number);
                                return {
                                    time: new Date(s.report.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
                                    hr: Number(v.hr) || 0,
                                    bp: sys || 0,
                                    temp: Number(v.temp) || 0,
                                    intervention: s.report.content.length > 50 ? 'Complex' : 'Routine'
                                };
                            } catch { return null; }
                        })
                        .filter(Boolean)
                        .reverse();

                    setAnalyticsData(parsed.length > 0 ? parsed : [
                        { time: 'Feb 10', hr: 72, bp: 120, temp: 36.6, intervention: 'Routine' },
                        { time: 'Feb 15', hr: 75, bp: 118, temp: 36.7, intervention: 'Routine' },
                        { time: 'Feb 20', hr: 70, bp: 122, temp: 36.8, intervention: 'Routine' },
                        { time: 'Feb 25', hr: 72, bp: 120, temp: 36.6, intervention: 'Routine' },
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing Clinical Intelligence...</p>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="max-w-[1600px] mx-auto space-y-10 pb-20">
                {/* Tactical Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                            <Shield className="w-3 h-3" />
                            <span>System Registered Node</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Clinical Intelligence <span className="text-blue-600">Dashboard</span></h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search clinical nodes..."
                                className="bg-white border border-slate-200 rounded-[24px] pl-12 pr-6 py-4 text-sm font-bold w-64 md:w-80 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all shadow-sm"
                            />
                        </div>
                        <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-[24px] shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Admin Control</span>
                        </div>
                    </div>
                </motion.div>

                {/* Patient Matrix Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />

                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 w-full lg:w-auto">
                        <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-blue-600 to-indigo-700 p-1">
                            <div className="w-full h-full bg-white rounded-[28px] flex items-center justify-center">
                                <span className="text-2xl font-black text-blue-600">FK</span>
                            </div>
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{patient?.profile?.firstName} {patient?.profile?.lastName}</h2>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Age: 62Y</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Fiscal: PAID</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full lg:w-auto relative z-10">
                        <StatItem label="Internal ID" value="PO-987-X" />
                        <StatItem label="Condition" value={patient?.profile?.ailment || 'Post-Op'} />
                        <StatItem label="Admitted" value="Jan 20, 26" />
                        <StatItem label="Loyalty" value="Phase 8" />
                    </div>
                </motion.div>

                {/* Primary Vitals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <VitalCard
                        title="Heart Rate"
                        value={`${analyticsData[analyticsData.length - 1]?.hr || 0}`}
                        unit="BPM"
                        icon={<Heart className="w-5 h-5" />}
                        color="#f43f5e"
                        data={analyticsData}
                        dataKey="hr"
                    />
                    <VitalCard
                        title="Blood Pressure"
                        value={`${analyticsData[analyticsData.length - 1]?.bp || 0}/80`}
                        unit="mmHg"
                        icon={<Droplets className="w-5 h-5" />}
                        color="#2563eb"
                        data={analyticsData}
                        dataKey="bp"
                    />
                    <VitalCard
                        title="Body Temperature"
                        value={`${analyticsData[analyticsData.length - 1]?.temp || 0}`}
                        unit="°C"
                        icon={<Thermometer className="w-5 h-5" />}
                        color="#f59e0b"
                        data={analyticsData}
                        dataKey="temp"
                    />
                    <VitalCard
                        title="Shift Compliance"
                        value="98.4"
                        unit="%"
                        icon={<Shield className="w-5 h-5" />}
                        color="#10b981"
                        data={analyticsData.map(d => ({ ...d, compliance: 95 + Math.random() * 5 }))}
                        dataKey="compliance"
                    />
                </div>

                {/* Graphical Insight Engine */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[40px] p-10 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h4 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px] mb-1 text-blue-600">Clinical Narrative</h4>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Longitudinal Health Condition Trend</h3>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">7D</button>
                                <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">30D</button>
                            </div>
                        </div>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analyticsData}>
                                    <defs>
                                        <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 900, fill: '#babbbd' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)', padding: '16px' }}
                                        labelStyle={{ fontWeight: 900, fontSize: '12px', color: '#1e293b', marginBottom: '8px' }}
                                    />
                                    <Area type="monotone" dataKey="hr" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorMain)" />
                                    <Area type="monotone" dataKey="bp" stroke="#indigo-500" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
                        <h4 className="font-black text-blue-400 uppercase tracking-[0.2em] text-[10px] mb-8">Operational Performance</h4>
                        <div className="space-y-8">
                            <PerformanceMetric label="Caregiver Punctuality" value="98.2%" color="#3b82f6" />
                            <PerformanceMetric label="Clinical Report Fidelity" value="100%" color="#10b981" />
                            <PerformanceMetric label="Patient Satisfaction" value="4.9/5" color="#f59e0b" />
                            <PerformanceMetric label="Avg Emergency Res" value="4.2m" color="#f43f5e" />
                        </div>

                        <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-3xl">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Live Deployment Stream</p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-bold text-white/90">Francis K. &bull; Night Shift Active</span>
                                </div>
                                <div className="flex items-center gap-3 opacity-50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                                    <span className="text-xs font-bold text-white/60">System Baseline Sync Complete</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-black text-slate-900 truncate">{value}</p>
        </div>
    );
}

function VitalCard({ title, value, unit, icon, color, data, dataKey }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all group"
        >
            <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl bg-slate-50 group-hover:bg-[${color}] group-hover:text-white transition-colors`} style={{ color }}>
                    {icon}
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
                    <span className="text-xs font-black text-slate-400">{unit}</span>
                </div>
            </div>
            <div className="h-12 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.05} strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

function PerformanceMetric({ label, value, color }: any) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-xs font-black text-white/70 uppercase tracking-tight">{label}</span>
                <span className="text-sm font-black text-white">{value}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '90%' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                />
            </div>
        </div>
    );
}
