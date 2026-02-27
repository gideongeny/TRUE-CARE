'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    User,
    Mail,
    MapPin,
    MoreVertical,
    ChevronRight,
    Lock,
    Unlock,
    Activity,
    Clock
} from 'lucide-react';
import api from '@/lib/api';

export default function PatientsPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/users');
            const data = response.data.filter((u: any) => u.role === 'PATIENT');
            setPatients(data);
        } catch (err) {
            console.error('Failed to fetch patients', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(p =>
        `${p.profile?.firstName} ${p.profile?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-24 text-center text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Scanning Bio-Registry...</div>;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter italic">Patient Network</h1>
                        <p className="text-slate-500 text-xs mt-3 font-bold uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-500" />
                            Operational Oversight Vector
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search clinical records..."
                                className="bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 w-96 outline-none focus:border-blue-500/40 focus:bg-slate-900 transition-all text-sm text-white placeholder-slate-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredPatients.map((patient: any, idx: number) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05, duration: 0.4 }}
                                key={patient.id}
                                className="bg-slate-950 border border-slate-900 p-8 flex flex-col group cursor-pointer rounded-[40px] hover:border-blue-500/30 hover:shadow-[0_0_50px_-12px_rgba(59,130,246,0.15)] transition-all duration-500"
                                onClick={() => window.location.href = `/dashboard/patients/${patient.id}`}
                            >
                                <div className="flex justify-between items-start mb-10">
                                    <div className="w-20 h-20 bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-800 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500">
                                        <User className="w-8 h-8 opacity-50" />
                                    </div>

                                    {/* Payment Status Badge */}
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${patient.profile?.paymentStatus === 'PAID'
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                            : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                        }`}>
                                        {patient.profile?.paymentStatus === 'PAID' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                        {patient.profile?.paymentStatus === 'PAID' ? 'Unlocked' : 'Locked'}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors tracking-tight uppercase leading-none">
                                        {patient.profile?.firstName} {patient.profile?.lastName}
                                    </h3>
                                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">Vector: {patient.id.slice(0, 8)}</p>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                                        <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800/50">
                                            <Mail className="w-3 h-3 text-slate-500" />
                                        </div>
                                        {patient.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium leading-relaxed">
                                        <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800/50">
                                            <MapPin className="w-3 h-3 text-blue-500" />
                                        </div>
                                        {patient.profile?.address || 'Deployment Node Unknown'}
                                    </div>
                                </div>

                                <div className="mt-10 pt-8 border-t border-slate-900 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-slate-700" />
                                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{new Date(patient.createdAt).getFullYear()}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-white text-[11px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-500">
                                        Inspect Data <ChevronRight className="w-4 h-4 text-blue-500" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredPatients.length === 0 && !loading && (
                    <div className="py-40 text-center bg-slate-950/50 border border-slate-900 border-dashed rounded-[60px]">
                        <User className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                        <p className="text-slate-600 font-black uppercase tracking-widest text-sm">Synchronized search yielded zero clinical matches.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
