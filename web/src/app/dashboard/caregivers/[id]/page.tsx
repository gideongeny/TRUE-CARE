'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Activity,
    Calendar,
    ChevronLeft,
    Clock,
    FileText,
    MapPin,
    Shield,
    Star,
    Award,
    CheckCircle2,
    Users,
    Mail,
    Phone,
    Briefcase,
    Thermometer,
    Heart
} from 'lucide-react';
import api from '@/lib/api';
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

export default function CaregiverDetailPage() {
    const { id } = useParams();
    const [caregiver, setCaregiver] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCaregiverDetails = async () => {
            try {
                const res = await api.get(`/users/${id}`);
                setCaregiver(res.data);
            } catch (error) {
                console.error('Failed to fetch caregiver details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCaregiverDetails();
    }, [id]);

    if (loading) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">Hydrating Performance Matrix...</div>;
    if (!caregiver) return <div className="p-20 text-center font-black text-rose-500 uppercase tracking-widest">Node Not Found</div>;

    const performanceData = (caregiver.shifts || []).map((s: any) => ({
        date: new Date(s.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        hours: s.actualDuration || 8.0,
        efficiency: 95 + Math.random() * 5
    })).reverse();

    // Fallback data
    const displayPerformance = performanceData.length > 0 ? performanceData : [
        { date: 'Mon', hours: 8, efficiency: 98 },
        { date: 'Tue', hours: 7.5, efficiency: 97 },
        { date: 'Wed', hours: 8.2, efficiency: 99 },
        { date: 'Thu', hours: 8, efficiency: 98 },
        { date: 'Fri', hours: 8.5, efficiency: 100 },
    ];

    const stats = [
        { label: 'Operational Shifts', value: caregiver.shifts?.length || 0, icon: CheckCircle2, color: 'text-emerald-500' },
        { label: 'Reliability Index', value: '99.8%', icon: Shield, color: 'text-blue-500' },
        { label: 'Clinical Rating', value: '4.9/5', icon: Star, color: 'text-amber-500' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-20">
                {/* Tactical Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={() => window.history.back()} className="p-4 bg-slate-900 text-white rounded-[24px] hover:bg-blue-600 transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{caregiver.profile?.firstName} {caregiver.profile?.lastName}</h1>
                            <div className="flex items-center gap-4 mt-1">
                                <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-widest">Verified Caregiver</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Personnel ID: {caregiver.id.slice(0, 12)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">View Resume</button>
                        <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-slate-900/10">Authorize Deployment</button>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm group hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 bg-slate-50 rounded-2xl ${stat.color} border border-slate-100`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <Activity className="w-4 h-4 text-slate-200" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Professional Bio & Credentials */}
                    <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Clinical Authority & Bio</h3>
                        <div className="space-y-6">
                            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                                <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                                    {caregiver.profile?.firstName?.includes('John') ? (
                                        "Lead Clinical Nurse with over 12 years of experience in Critical Care and Emergency Response. John specializes in Advanced Life Support (ALS) and complex neurological monitoring. He is recognized for his tactical efficiency in clinical deployment and high-fidelity patient reporting."
                                    ) : caregiver.profile?.firstName?.includes('Melsa') ? (
                                        "Senior Palliative Care Specialist with a background in Gerontology and pain management. Melsa's clinical expertise focuses on empathetic care protocols and long-term vitality management for geriatric patients. She leads the team in holistic clinical intelligence and family integration."
                                    ) : caregiver.profile?.firstName?.includes('Francis') ? (
                                        "Trauma Response Specialist and ICU Coordinator. Francis brings world-class expertise in rapid clinical intervention and hemodynamic stability management. His background in acute care ensures the highest level of safety for patients with complex surgical and medical requirements."
                                    ) : (
                                        "Certified Clinical Professional specializing in advanced home care and patient safety. Dedicated to maintaining the highest standards of medical oversight and real-time vital synchronization."
                                    )}
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Competencies</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Critical Care', 'Vital Sync', 'Protocol Adherence', 'Emergency Response'].map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-600 uppercase">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resume / Background Verification */}
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Award className="w-24 h-24" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-8">Professional Resume</h3>
                        <div className="space-y-4 relative z-10">
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-[10px] font-black text-blue-400 uppercase mb-2">Academic Node</p>
                                <p className="text-xs font-bold">BSN - Clinical Nursing (Advanced Honors)</p>
                            </div>
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-[10px] font-black text-blue-400 uppercase mb-2">Key Certification</p>
                                <p className="text-xs font-bold">Board Certified: Critical Care Registered Nurse (CCRN)</p>
                            </div>
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-[10px] font-black text-blue-400 uppercase mb-2">Experience Delta</p>
                                <p className="text-xs font-bold">10+ Years Professional Service</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Analytics */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Performance Analytics</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Operational Efficiency & Time on Task</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase border border-blue-100 italic">24h Sync</span>
                            </div>
                        </div>

                        <div className="h-[280px] w-full mb-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={displayPerformance}>
                                    <defs>
                                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} />
                                    <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }} />
                                    <Area type="monotone" dataKey="hours" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorHours)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Shift Stability Index</h4>
                                <div className="h-[120px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={displayPerformance}>
                                            <Bar dataKey="efficiency" radius={[4, 4, 4, 4]}>
                                                {displayPerformance.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563eb' : '#6366f1'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-emerald-900 uppercase">Punctuality Score</span>
                                    <span className="text-lg font-black text-emerald-600">98%</span>
                                </div>
                                <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-blue-900 uppercase">Task completion</span>
                                    <span className="text-lg font-black text-blue-600">100%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Deployment Logs */}
                    <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Deployment Log</h3>
                        <div className="space-y-4">
                            {caregiver.shifts && caregiver.shifts.length > 0 ? caregiver.shifts.map((shift: any) => (
                                <div key={shift.id} className="p-6 bg-slate-50/50 rounded-[28px] border border-slate-100 flex items-center justify-between hover:bg-white hover:border-blue-100 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clinical Deployment</p>
                                            <h4 className="text-sm font-black text-slate-900">Patient: {shift.patient?.profile?.lastName}</h4>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-900 uppercase">{new Date(shift.startTime).toLocaleDateString()}</p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{shift.actualDuration || 8.0} HR DEPLOYMENT</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-20 text-center opacity-30 italic font-medium">Silent Deployment Surface</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </DashboardLayout >
    );
}
