'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Activity,
    Calendar,
    ChevronLeft,
    Clipboard,
    Heart,
    MapPin,
    Shield,
    Star,
    Stethoscope,
    Thermometer,
    User,
    Clock,
    FileText,
    TrendingUp
} from 'lucide-react';
import api from '@/lib/api';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function PatientDetailPage() {
    const { id } = useParams();
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const res = await api.get(`/users/${id}`);
                setPatient(res.data);
            } catch (error) {
                console.error('Failed to fetch patient details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatientDetails();
    }, [id]);

    if (loading) return <div className="p-20 text-center font-black text-slate-400">LOADING CLINICAL RECORDS...</div>;
    if (!patient) return <div className="p-20 text-center font-black text-rose-500">RECORDS NOT FOUND</div>;

    const parseVitals = (report: any) => {
        try {
            const vitals = JSON.parse(report.vitals || '{}');
            const [sys, dia] = (vitals.bp || '0/0').split('/').map(Number);
            return {
                time: new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                hr: Number(vitals.hr) || 0,
                bp: sys,
                temp: Number(vitals.temp) || 0,
                date: new Date(report.createdAt).toLocaleDateString()
            };
        } catch {
            return null;
        }
    };

    const vitalsData = (patient?.shifts || [])
        .filter((s: any) => s.report)
        .map((s: any) => parseVitals(s.report))
        .filter(Boolean)
        .reverse();

    // Fallback if no real data exists yet
    const displayVitals = vitalsData.length > 0 ? vitalsData : [
        { time: '08:00', hr: 72, bp: 120, temp: 36.6, date: 'Baseline' },
        { time: '12:00', hr: 75, bp: 125, temp: 36.8, date: 'Baseline' },
        { time: '16:00', hr: 78, bp: 122, temp: 36.9, date: 'Baseline' },
        { time: '20:00', hr: 74, bp: 121, temp: 36.7, date: 'Baseline' },
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
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{patient.profile?.firstName} {patient.profile?.lastName}</h1>
                            <div className="flex items-center gap-4 mt-1">
                                <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-widest">{patient.profile?.ailment || 'Observation'}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Clinical Node: {patient.id.slice(0, 12)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Generate Report</button>
                        <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-slate-900/10">Modify Care Plan</button>
                    </div>
                </div>

                {/* Primary Intelligence Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Medical Profile Card */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                    <Clipboard className="w-8 h-8" />
                                </div>
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Medical Summary</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Primary Ailment</label>
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{patient.profile?.ailment || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Clinical History</label>
                                    <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">
                                        "{patient.profile?.medicalHistory || 'No detailed medical history recorded in system nodes.'}"
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Blood Type</label>
                                        <p className="text-xs font-black text-slate-900">O+ Positive</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Risk Factor</label>
                                        <p className="text-xs font-black text-rose-600 uppercase">High Intensity</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Deployments */}
                        <div className="bg-slate-900 rounded-[40px] p-8 text-white">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-8 text-center">Assigned Care Team</h3>
                            <div className="space-y-4">
                                {patient.shifts && patient.shifts.length > 0 ? patient.shifts.slice(0, 3).map((s: any) => (
                                    <div key={s.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xs">
                                            {s.caregiver?.profile?.firstName?.[0] ?? '?'}{s.caregiver?.profile?.lastName?.[0] ?? ''}
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black group-hover:text-blue-400 transition-colors uppercase">{s.caregiver?.profile?.firstName} {s.caregiver?.profile?.lastName}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.shiftType || 'GENERAL'}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-center py-4 text-[10px] uppercase font-black text-slate-600 tracking-widest">No active assignments</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Vital Analytics & Trends */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Biometric Streams</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">24 Hour Operational Overview</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" /> Live Stream
                                    </div>
                                </div>
                            </div>

                            <div className="h-[300px] w-full mb-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={displayVitals}>
                                        <defs>
                                            <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="time"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="hr"
                                            stroke="#2563eb"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorHR)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100">
                                        <Heart className="w-5 h-5 text-rose-600" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg HR</p>
                                        <p className="text-xl font-black text-slate-900 tracking-tight">72 BPM</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                                        <Stethoscope className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Sys Pressure</p>
                                        <p className="text-xl font-black text-slate-900 tracking-tight">120 mmHg</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                                        <Thermometer className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Core Temp</p>
                                        <p className="text-xl font-black text-slate-900 tracking-tight">36.7 °C</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Log */}
                        <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Clinical Activity Registry</h3>
                                <div className="h-1 flex-1 bg-slate-50 mx-8" />
                                <TrendingUp className="w-4 h-4 text-slate-400" />
                            </div>

                            <div className="space-y-6">
                                {patient.shifts && patient.shifts.filter((s: any) => s.report).length > 0 ?
                                    patient.shifts.filter((s: any) => s.report).map((shift: any) => {
                                        const report = shift.report;
                                        const vitals = JSON.parse(report.vitals || '{}');
                                        return (
                                            <div key={report.id} className="flex gap-6 pb-6 border-b border-slate-50 last:border-0 last:pb-0 group cursor-pointer">
                                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                                                    <FileText className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">REPORT ID: {report.id.slice(0, 8)}</p>
                                                        <p className="text-[10px] font-black text-slate-900 uppercase">{new Date(report.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">Clinical Observation & Vital Sync</h4>
                                                    <p className="text-[11px] font-bold text-slate-500 mt-2 italic leading-relaxed">
                                                        "{report.content}"
                                                    </p>
                                                    <div className="mt-4 flex gap-6">
                                                        <div className="flex items-center gap-2">
                                                            <Heart className="w-3.5 h-3.5 text-rose-500" />
                                                            <span className="text-[10px] font-black text-slate-900">{vitals.bp || 'N/A'} mmHg</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Activity className="w-3.5 h-3.5 text-blue-500" />
                                                            <span className="text-[10px] font-black text-slate-900">{vitals.hr || 'N/A'} BPM</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                                                            <span className="text-[10px] font-black text-slate-900">{vitals.temp || 'N/A'} °C</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Provider</p>
                                                    <p className="text-[10px] font-black text-blue-600 uppercase">{shift.caregiver?.profile?.lastName}</p>
                                                    <Shield className="w-3.5 h-3.5 text-emerald-500 ml-auto mt-2" />
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div className="py-12 text-center opacity-30">
                                            <FileText className="w-10 h-10 mx-auto mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">No Clinical Interventions Recorded</p>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
