'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
    Activity,
    Thermometer,
    Heart,
    Calendar,
    User,
    ChevronRight,
    Search,
    Stethoscope,
    Plus,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClinicalTimelinePage() {
    const [userRole, setUserRole] = useState<string>('');
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role);
        fetchLogs(user.role, user.id);
    }, []);

    const fetchLogs = async (role: string, userId: string) => {
        setLoading(true);
        try {
            let res;
            if (role === 'PATIENT') {
                res = await api.get(`/clinical/patient/${userId}`);
            } else {
                // Admin or Caregiver sees all related logs
                res = await api.get('/clinical/history');
            }
            setLogs(res.data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log =>
        log.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.shift?.patient?.profile?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-reveal">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">CLINICAL TIMELINE</h1>
                    <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[11px]">
                        Continuous Patient Monitoring & Care Logs
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search patient or notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-6 text-sm font-black text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all outline-none w-full md:w-64 uppercase tracking-widest shadow-sm shadow-slate-200"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card rounded-[32px] p-6 text-center border-t-4 border-t-blue-600">
                        <div className="w-16 h-16 bg-blue-50 rounded-[28px] flex items-center justify-center mx-auto mb-4 border border-blue-100">
                            <Stethoscope className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-2">Health Index</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stability Status</p>
                        <div className="mt-4 py-3 px-6 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest inline-block border border-emerald-100">
                            Stable
                        </div>
                    </div>

                    <div className="glass-card rounded-[32px] p-6 space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vital Summary</h4>
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <Heart className="w-4 h-4 text-rose-500" />
                                <span className="text-xs font-black uppercase tracking-[0.1em]">Avg BP</span>
                            </div>
                            <span className="text-xs font-black text-slate-900">120/80</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <Thermometer className="w-4 h-4 text-amber-500" />
                                <span className="text-xs font-black uppercase tracking-[0.1em]">Avg Temp</span>
                            </div>
                            <span className="text-xs font-black text-slate-900">36.8°C</span>
                        </div>
                    </div>
                </div>

                {/* Timeline Panel */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="relative pl-8 space-y-8">
                        {/* Timeline Line */}
                        <div className="absolute left-4 top-4 bottom-4 w-1 bg-gradient-to-b from-blue-600 via-blue-200 to-transparent rounded-full" />

                        {filteredLogs.map((log, i) => {
                            const vitals = log.vitals ? (typeof log.vitals === 'string' ? JSON.parse(log.vitals) : log.vitals) : null;
                            return (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative group"
                                >
                                    {/* Timeline Node */}
                                    <div className="absolute -left-[28px] top-4 w-4 h-4 bg-white border-4 border-blue-600 rounded-full z-10 group-hover:scale-125 transition-transform shadow-lg shadow-blue-600/30" />

                                    <div className="glass-card rounded-[32px] p-8 transition-hover hover:translate-x-2">
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="space-y-4 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="px-4 py-2 bg-blue-600 rounded-xl text-white text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-blue-600/20">
                                                        DAILY LOG
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        {new Date(log.loggedAt).toLocaleDateString()} • {new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg font-black text-slate-900 leading-tight">
                                                    Patient Care Session #{log.shiftId.slice(-4)}
                                                </h3>

                                                <p className="text-slate-500 font-medium text-sm leading-relaxed whitespace-pre-line">
                                                    {log.content}
                                                </p>

                                                {vitals && (
                                                    <div className="flex flex-wrap gap-4 mt-6">
                                                        {vitals.bp && (
                                                            <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl">
                                                                <Heart className="w-3.5 h-3.5 text-rose-500" />
                                                                <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">{vitals.bp} mmHg</span>
                                                            </div>
                                                        )}
                                                        {vitals.temp && (
                                                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl">
                                                                <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                                                                <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">{vitals.temp} °C</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="md:w-48 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-200">
                                                        <User className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Caregiver</p>
                                                        <p className="text-xs font-black text-slate-900 leading-none mt-0.5">
                                                            ID: {log.shift?.caregiverId?.slice(-6)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-200">
                                                        <Calendar className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Patient</p>
                                                        <p className="text-xs font-black text-slate-900 leading-none mt-0.5">
                                                            {log.shift?.patient?.profile?.firstName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {filteredLogs.length === 0 && (
                            <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
                                <FileText className="w-16 h-16" />
                                <p className="text-sm font-black uppercase tracking-[0.2em]">No clinical logs found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>
        </DashboardLayout>
    );
}
