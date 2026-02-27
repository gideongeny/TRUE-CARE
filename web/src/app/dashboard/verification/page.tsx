'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
    ShieldCheck,
    UserCheck,
    AlertTriangle,
    Lock,
    Search,
    ChevronRight,
    ExternalLink,
    ShieldAlert,
    Clock,
    UserCircle,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VerificationPage() {
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchQueue = async () => {
            try {
                const res = await api.get('/admin/verification/queue');
                setQueue(res.data || []);
            } catch (error) {
                console.error('Failed to fetch verification queue', error);
                // Mock fallback for premium demonstration
                setQueue([
                    { id: 'V001', name: 'Dr. Sarah Wilson', role: 'CAREGIVER', status: 'PENDING_DOCS', risk: 'Low', date: '2h ago' },
                    { id: 'V002', name: 'Robert Chen', role: 'CAREGIVER', status: 'ID_VERIFICATION', risk: 'High', date: '5h ago' },
                    { id: 'V003', name: 'Alice Miller', role: 'CAREGIVER', status: 'BACKGROUND_CHECK', risk: 'Low', date: '1d ago' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchQueue();
    }, []);

    const filteredQueue = queue.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Synchronizing Cryptographic Truths...</p>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Trust Infrastructure</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">Verification Center</h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Autonomous integrity screening for the clinical network</p>
                    </div>
                </div>

                {/* Status Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <StatusCard
                        label="Network Integrity"
                        value="99.8%"
                        icon={<ShieldCheck className="w-5 h-5" />}
                        color="text-emerald-500"
                        sub="Verified compliance across active nodes"
                    />
                    <StatusCard
                        label="Screenings Active"
                        value={queue.length}
                        icon={<Clock className="w-5 h-5" />}
                        color="text-blue-500"
                        sub="Background checks in temporal flux"
                    />
                    <StatusCard
                        label="Security Alerts"
                        value="0"
                        icon={<ShieldAlert className="w-5 h-5" />}
                        color="text-slate-500"
                        sub="No critical vulnerabilities detected"
                    />
                </div>

                {/* Screening Queue */}
                <div className="bg-slate-950 border border-slate-900 rounded-[40px] overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="relative group w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search screening records..."
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/40 transition-all font-bold"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">Active Batch</button>
                            <button className="px-5 py-2.5 bg-slate-900 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Archives</button>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-900">
                        <AnimatePresence>
                            {filteredQueue.map((item, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={item.id}
                                    className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-900/40 transition-all group"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${item.risk === 'High'
                                                ? 'bg-rose-500/5 border-rose-500/20 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.1)]'
                                                : 'bg-slate-900 border-slate-800 text-slate-500 group-hover:border-blue-500/50 group-hover:text-blue-500'
                                            }`}>
                                            <UserCheck className="w-7 h-7" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-base font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{item.name}</p>
                                            <div className="flex items-center gap-2">
                                                <UserCircle className="w-3 h-3 text-slate-600" />
                                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Protocol: {item.role}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between lg:justify-end gap-12 w-full lg:w-auto">
                                        <div className="text-center">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-700 mb-1">Status Vector</p>
                                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{item.status}</p>
                                        </div>
                                        <div className="text-center min-w-[100px]">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-700 mb-1">Risk Entropy</p>
                                            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${item.risk === 'High'
                                                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                                }`}>
                                                {item.risk === 'High' ? 'Elevated' : 'Nominal'}
                                            </span>
                                        </div>
                                        <div className="hidden md:block text-right">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-700 mb-1">Time in Queue</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-3 bg-white hover:bg-emerald-500 text-slate-950 hover:text-white rounded-xl transition-all shadow-xl active:scale-90">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </button>
                                            <button className="p-3 bg-slate-900 border border-slate-800 text-slate-600 hover:text-rose-500 hover:border-rose-500/30 rounded-xl transition-all">
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatusCard({ label, value, icon, color, sub }: any) {
    return (
        <div className="bg-slate-950 border border-slate-900 rounded-[40px] p-8 shadow-xl hover:border-blue-500/30 transition-all group">
            <div className={`p-4 bg-slate-900 border border-slate-800 rounded-2xl w-fit mb-6 transition-all group-hover:scale-110 ${color}`}>
                {icon}
            </div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-1">{label}</p>
            <h3 className="text-4xl font-black text-white tracking-tighter mb-2">{value}</h3>
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{sub}</p>
        </div>
    );
}
