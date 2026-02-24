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
    Zap,
    Moon
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar
} from 'recharts';

// Mock high-fidelity data for medical metrics
const heartRateData = [
    { time: 'Week 1', value: 72 },
    { time: 'Week 2', value: 68 },
    { time: 'Week 3', value: 75 },
    { time: 'Week 4', value: 71 },
];

const bpData = [
    { time: 'Week 1', sys: 120, dia: 80 },
    { time: 'Week 2', sys: 118, dia: 78 },
    { time: 'Week 3', sys: 125, dia: 82 },
    { time: 'Week 4', sys: 121, dia: 80 },
];

export default function AnalyticsPage() {
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                // Fetch the specific patient seeded for the demo
                const res = await api.get('/admin/users');
                const francis = res.data.find((u: any) => u.profile?.firstName === 'Francis');
                setPatient(francis);
            } catch (error) {
                console.error('Failed to fetch patient data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, []);

    if (loading) return <div className="p-20 text-center font-bold text-slate-400">Syncing Clinical Intelligence...</div>;

    return (
        <DashboardLayout>
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Header Navigation */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                        <span>Patient Profile</span>
                        <ChevronDown className="w-3 h-3" />
                        <span className="text-slate-900">Analytics</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search Patient..."
                                className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm font-bold w-64 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl">
                            <img src="/Raquel.png" alt="Dr. Raquel" className="w-6 h-6 rounded-full border border-slate-100" />
                            <span className="text-xs font-black text-slate-900">Dr. Raquel</span>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Patient Banner */}
                <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div>
                            <p className="text-blue-600 font-black text-lg tracking-tight">
                                {patient?.profile?.firstName} {patient?.profile?.lastName} <span className="text-slate-400 font-bold ml-1 text-sm">62Y 8M</span>
                            </p>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-100" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Internal ID</p>
                            <p className="text-sm font-black text-slate-900">PO987</p>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-100" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Condition</p>
                            <p className="text-sm font-black text-slate-900">{patient?.profile?.ailment || 'Post-Op Observation'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-12">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Admited Since</p>
                            <p className="text-sm font-black text-slate-900">20/01/2026</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Care Phase</p>
                            <p className="text-sm font-black text-slate-900">8 weeks monitoring</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4">
                    <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">Analytics</button>
                    <button className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">Compliance</button>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
                    <Card title="Activity" icon={<Activity className="w-4 h-4 text-emerald-500" />} data={heartRateData} color="#10b981" />
                    <Card title="Heart Rate" icon={<Heart className="w-4 h-4 text-rose-500" />} data={heartRateData} color="#f43f5e" />
                    <Card title="Blood Pressure" icon={<Droplets className="w-4 h-4 text-blue-500" />} data={heartRateData} color="#2563eb" />
                    <Card title="Body Temperature" icon={<Thermometer className="w-4 h-4 text-orange-500" />} data={heartRateData} color="#f59e0b" />
                    <Card title="Past Appointments" icon={<Clock className="w-4 h-4 text-indigo-500" />} data={heartRateData} color="#6366f1" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[32px] p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Health Condition Trend</h4>
                            <select className="bg-slate-50 border-none text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-lg px-3 py-1 outline-none">
                                <option>Week</option>
                            </select>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={heartRateData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-slate-100 rounded-[32px] p-6 h-full">
                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Lab Results</h4>
                            <div className="space-y-4">
                                {[
                                    { name: 'Sugar', value: '140 mg/dL', date: '15 Aug' },
                                    { name: 'Haemoglobin', value: '14.5 g/dL', date: '15 Aug' },
                                    { name: 'White Blood Cell', value: '4.8 million/mm3', date: '15 Aug' },
                                    { name: 'Lymphocyte', value: '3000', date: '15 Aug' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</p>
                                            <p className="text-xs font-black text-slate-900">{item.name}</p>
                                        </div>
                                        <p className="text-xs font-bold text-blue-600">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-100 rounded-[32px] p-6 flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calories Burned</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">230 <span className="text-xs text-slate-400">Kcal</span></p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-[32px] p-6 flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sleep Pattern</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">7.4 <span className="text-xs text-slate-400">Hours</span></p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                            <Moon className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-[32px] p-6 flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Psychological State</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">Stable</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                            <Brain className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function Card({ title, icon, data, color }: { title: string, icon: any, data: any[], color: string }) {
    return (
        <div className="bg-white border border-slate-100 rounded-[32px] p-5 space-y-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-slate-50/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white shadow-sm border border-slate-100 rounded-lg">{icon}</div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{title}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.05} strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
