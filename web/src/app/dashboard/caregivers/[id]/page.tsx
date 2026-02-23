'use client';

import React, { useEffect, useState, use } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
    Clock,
    Calendar,
    Activity,
    ArrowLeft,
    TrendingUp,
    Briefcase
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
    Area
} from 'recharts';
import Link from 'next/link';

export default function CaregiverPerformancePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const res = await api.get(`/admin/caregivers/${id}/performance`);
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch performance data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPerformance();
    }, [id]);

    if (loading) return <div className="p-20 text-center">Analysing data...</div>;
    if (!data) return <div className="p-20 text-center">Caregiver not found.</div>;

    const { caregiver, totalHours, shiftCount } = data;

    // Prepare chart data from recent shifts
    const chartData = caregiver.caregiverShifts.slice(0, 7).reverse().map((s: any) => ({
        date: new Date(s.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        hours: s.actualDuration || 0
    }));

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/caregivers" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                {caregiver.profile?.firstName} {caregiver.profile?.lastName}
                            </h1>
                            <p className="text-sm text-slate-500 font-medium">Performance Profile & Shift History</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${caregiver.profile?.isVerified ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                            {caregiver.profile?.isVerified ? 'Fully Verified' : 'Compliance Pending'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="stats-card">
                        <Briefcase className="w-5 h-5 text-blue-600 mb-2" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Shifts</p>
                        <h4 className="text-2xl font-black text-slate-900 mt-1">{shiftCount}</h4>
                    </div>
                    <div className="stats-card">
                        <Clock className="w-5 h-5 text-indigo-600 mb-2" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logged Hours</p>
                        <h4 className="text-2xl font-black text-slate-900 mt-1">{totalHours} hrs</h4>
                    </div>
                    <div className="stats-card">
                        <TrendingUp className="w-5 h-5 text-emerald-600 mb-2" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Efficiency</p>
                        <h4 className="text-2xl font-black text-slate-900 mt-1">98.2%</h4>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Individual performance graph */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <h4 className="text-slate-900 font-bold mb-8">Work Hours Optimization</h4>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="hours" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Personal Stats / Info */}
                    <div className="bg-slate-900 rounded-2xl p-8 text-white">
                        <h4 className="font-bold mb-6">Caregiver Vitals</h4>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Location</p>
                                <p className="text-sm font-medium">{caregiver.profile?.address || 'New York, NY'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Primary Phone</p>
                                <p className="text-sm font-medium">{caregiver.profile?.phone || '+1 (555) 000-0000'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Skills Performance</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {(caregiver.profile?.skills || 'Nursing, Elderly Care, CPR').split(',').map((skill: string) => (
                                        <span key={skill} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold border border-white/10 uppercase tracking-tighter hover:bg-white/10 transition-colors cursor-default">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Individual Shift Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                        <h4 className="text-slate-900 font-bold">Comprehensive Shift Log</h4>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Patient</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Clock In</th>
                                <th className="px-6 py-4">Clock Out</th>
                                <th className="px-6 py-4">Actual Hrs</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {caregiver.caregiverShifts.map((shift: any) => (
                                <tr key={shift.id} className="text-sm hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        {new Date(shift.startTime).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">
                                        {shift.patient?.profile?.firstName} {shift.patient?.profile?.lastName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${shift.status === 'COMPLETED' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {shift.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                        {shift.clockInTime ? new Date(shift.clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                        {shift.clockOutTime ? new Date(shift.clockOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                    </td>
                                    <td className="px-6 py-4 font-black text-blue-600">
                                        {shift.actualDuration || '0.00'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
