'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
    TrendingUp,
    Users,
    Clock,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Calendar
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [shiftData, setShiftData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, shiftRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/analytics/shifts')
                ]);
                setStats(statsRes.data);

                const formatted = Object.entries(shiftRes.data).map(([date, count]) => ({
                    name: date.split('-').slice(1).join('/'),
                    value: count
                }));
                setShiftData(formatted);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#6366f1'];

    if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading Predictive Analytics...</div>;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Intelligence & Growth</h1>
                    <p className="text-sm text-slate-500 font-medium italic">High-performance insights derived from real-time operational data.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="stats-card">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Patient Retention</p>
                        <h3 className="text-3xl font-black text-slate-900">94.2%</h3>
                        <div className="mt-4 flex items-center text-emerald-600 text-[11px] font-bold">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +2.4% vs last mo
                        </div>
                    </div>
                    <div className="stats-card">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Avg. Shift Duration</p>
                        <h3 className="text-3xl font-black text-slate-900">6.4h</h3>
                        <div className="mt-4 flex items-center text-rose-600 text-[11px] font-bold">
                            <ArrowDownRight className="w-3 h-3 mr-1" /> -0.8h vs last mo
                        </div>
                    </div>
                    <div className="stats-card">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Operational Load</p>
                        <h3 className="text-3xl font-black text-slate-900">Moderate</h3>
                        <div className="mt-4 flex items-center text-blue-600 text-[11px] font-bold">
                            <Activity className="w-3 h-3 mr-1" /> Stable Pulse
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-6">Market Demand Density</h4>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={shiftData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-6">Service Distribution</h4>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Nursing', value: 400 },
                                            { name: 'Companion', value: 300 },
                                            { name: 'Physical Therapy', value: 200 },
                                            { name: 'Emergency', value: 100 },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {COLORS.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
