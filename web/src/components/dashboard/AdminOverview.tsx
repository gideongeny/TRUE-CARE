'use client';

import React, { useEffect, useState } from 'react';
import {
    Users,
    Calendar,
    Activity,
    Clock,
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import api from '@/lib/api';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

export default function AdminOverview() {
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, analyticsRes, logsRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/analytics/shifts'),
                    api.get('/admin/logs')
                ]);

                setStats(statsRes.data);
                setLogs(logsRes.data);

                // Format analytics data for Recharts
                const formattedChartData = Object.entries(analyticsRes.data).map(([date, count]) => ({
                    date: date.split('-').slice(1).join('/'), // Focus on MM/DD
                    shifts: count
                })).sort((a, b) => a.date.localeCompare(b.date));

                setChartData(formattedChartData);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl" />
            ))}
        </div>
    );

    const cards = [
        { label: 'Total Patients', value: stats?.patientCount || 0, icon: Users, trend: '+12%', up: true, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Verified Caregivers', value: stats?.caregiverCount || 0, icon: ShieldCheck, trend: '+5%', up: true, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Pending Requests', value: stats?.pendingRequests || 0, icon: AlertCircle, trend: '-2%', up: false, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Active Shifts', value: stats?.activeShifts || 0, icon: Activity, trend: '+18%', up: true, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    return (
        <div className="space-y-8">
            {/* Header with quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${card.bg}`}>
                                <card.icon className={`w-5 h-5 ${card.color}`} />
                            </div>
                            <div className={`flex items-center text-[11px] font-bold px-2 py-1 rounded-full ${card.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {card.up ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                                {card.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{card.label}</p>
                            <h3 className="text-2xl font-black text-slate-900">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shift Volume Chart */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-slate-900 font-bold text-lg">Shift Volume</h4>
                            <p className="text-slate-500 text-sm">Last 7 days performance metrics</p>
                        </div>
                        <select className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorShifts" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="shifts"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorShifts)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Real-time Ticker / Alerts */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-slate-900 font-bold text-lg">The Pulse</h4>
                        <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                    </div>
                    <div className="flex-1 space-y-4">
                        {logs.length > 0 ? logs.map((log) => (
                            <div key={log.id} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${log.type === 'REQUEST' ? 'bg-amber-50' : log.status === 'IN_PROGRESS' ? 'bg-indigo-50' : 'bg-emerald-50'
                                    }`}>
                                    {log.type === 'REQUEST' ? (
                                        <Clock className="w-5 h-5 text-amber-600" />
                                    ) : log.status === 'IN_PROGRESS' ? (
                                        <Activity className="w-5 h-5 text-indigo-600" />
                                    ) : (
                                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 leading-tight mb-1 group-hover:text-blue-600">{log.title}</p>
                                    <p className="text-xs text-slate-500">{log.description}</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                                        {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="py-10 text-center opacity-30">
                                <Activity className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-xs font-bold uppercase tracking-widest">No activity log found</p>
                            </div>
                        )}
                    </div>
                    <button className="mt-6 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition-colors border border-slate-200 uppercase tracking-widest">
                        View War Room Log
                    </button>
                </div>
            </div>
        </div>
    );
}

import { ShieldCheck } from 'lucide-react';
