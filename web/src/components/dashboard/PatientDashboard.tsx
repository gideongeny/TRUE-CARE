'use client';

import React, { useEffect, useState } from 'react';
import {
    Clock,
    Calendar,
    Activity,
    CheckCircle2,
    Plus,
    Navigation,
    Shield
} from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';

export default function PatientDashboard() {
    const [requests, setRequests] = useState<any[]>([]);
    const [clinicalHistory, setClinicalHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reqRes, clinRes] = await Promise.all([
                    api.get('/requests'),
                    api.get('/clinical/my-history')
                ]);
                setRequests(reqRes.data);
                setClinicalHistory(clinRes.data);
            } catch (error) {
                console.error('Failed to fetch patient data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="h-40 bg-slate-100 animate-pulse rounded-2xl" />;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Care Status</h2>
                    <p className="text-sm text-slate-500 font-medium italic">Track your requests and scheduled care in real-time.</p>
                </div>
                <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-teal-500/20 transition-all active:scale-95">
                    <Plus className="w-4 h-4" />
                    New Request
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Requests Timeline */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Request Timeline</h3>
                    {requests.length > 0 ? requests.map((req, i) => (
                        <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between group hover:border-teal-200 transition-colors shadow-sm">
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${req.status === 'APPROVED' ? 'bg-teal-50 border-teal-100 text-teal-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                                    }`}>
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{req.careType} Assistance</p>
                                    <div className="flex items-center gap-3 mt-1 text-slate-500">
                                        <div className="flex items-center gap-1.5 font-medium text-[11px]">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5 font-medium text-[11px]">
                                            <Navigation className="w-3.5 h-3.5" />
                                            {req.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-400'
                                    }`}>
                                    {req.status}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-3xl opacity-50">
                            <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No active requests</p>
                        </div>
                    )}

                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 pt-8">Clinical History</h3>
                    <div className="space-y-6">
                        {clinicalHistory.length > 0 ? clinicalHistory.map((log, i) => (
                            <div key={log.id} className="relative pl-8 border-l-2 border-slate-100 pb-8 last:pb-0">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-teal-500 shadow-sm" />
                                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3 text-slate-400">
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(log.loggedAt).toLocaleString()}
                                        </div>
                                        <div className="px-2 py-0.5 bg-teal-50 text-teal-600 rounded text-[9px] font-black uppercase">
                                            {log.shift?.caregiver?.profile?.firstName} (Caregiver)
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-900 font-bold mb-3">{log.content}</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {log.pulse && (
                                            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Pulse</p>
                                                <p className="text-xs font-black text-rose-500 underline decoration-rose-200">{log.pulse} bpm</p>
                                            </div>
                                        )}
                                        {log.temperature && (
                                            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Temp</p>
                                                <p className="text-xs font-black text-amber-500">{log.temperature}°C</p>
                                            </div>
                                        )}
                                        {log.bloodPressure && (
                                            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">BP</p>
                                                <p className="text-xs font-black text-slate-700">{log.bloodPressure}</p>
                                            </div>
                                        )}
                                        {log.servicesRendered && (
                                            <div className="p-2 bg-teal-50/50 rounded-xl border border-teal-100 col-span-1">
                                                <p className="text-[10px] font-bold text-teal-600 uppercase">Services</p>
                                                <p className="text-[10px] font-bold text-slate-600 truncate">{log.servicesRendered}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-10 text-center text-slate-300 italic text-xs border border-dashed border-slate-200 rounded-3xl">
                                Clinical logs will be available once your care shifts begin.
                            </div>
                        )}
                    </div>
                </div>

                {/* Secure Care Note */}
                <div className="bg-gradient-to-br from-teal-800 to-emerald-900 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl">
                    <div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                            <Shield className="w-6 h-6 text-teal-300" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">TrueCare Security</h3>
                        <p className="text-teal-100/80 text-sm leading-relaxed font-medium">
                            Every caregiver in our network is fully verified and trained to provide the highest standard of care at home.
                        </p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-teal-200/60 mb-2">Emergency Service</p>
                        <p className="text-sm font-bold text-white">Available 24/7 at 1-800-TRUE-CARE</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
