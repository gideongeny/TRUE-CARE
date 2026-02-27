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
    XCircle,
    DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function VerificationPage() {
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchQueue = async () => {
        try {
            const res = await api.get('/admin/caregivers'); // Fetch all caregivers for management
            setQueue(res.data || []);
        } catch (error) {
            console.error('Failed to fetch verification queue', error);
            toast.error('Sector sync failed.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await api.post(`/admin/approve-caregiver/${id}`);
            toast.success('Caregiver identity verified and node activated.');
            fetchQueue();
        } catch (error) {
            toast.error('Cryptographic approval failed.');
        }
    };

    const handlePayout = async (caregiverId: string, amount: number) => {
        if (amount <= 0) {
            toast.error('No liquid earnings available for disbursement.');
            return;
        }
        try {
            await api.post('/admin/pay-caregiver', { caregiverId, amount });
            toast.success('M-Pesa disbursement vector successfully initiated.');
            fetchQueue();
        } catch (error) {
            toast.error('Payout failed. Verify treasury reserves.');
        }
    };

    const filteredQueue = queue.filter(item =>
        `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Synchronizing Integrity Vectors...</p>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12 pb-20">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Trust Infrastructure</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">Network Verification</h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Admin command center for caregiver lifecycle and payouts</p>
                </div>

                <div className="bg-slate-950 border border-slate-900 rounded-[40px] overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="relative group w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search personnel files..."
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/40 transition-all font-bold"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-slate-900">
                        <AnimatePresence>
                            {filteredQueue.map((item, idx) => (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={item.id}
                                    className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-900/40 transition-all group"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 bg-slate-900 border-slate-800 text-slate-500 group-hover:border-blue-500/50 group-hover:text-blue-500">
                                            <UserCheck className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <Link href={`/dashboard/caregivers/${item.id}`} className="text-base font-black text-white uppercase tracking-tight hover:text-blue-400">
                                                {item.firstName} {item.lastName}
                                            </Link>
                                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{item.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-700 mb-1">Accumulated Balance</p>
                                            <p className="text-lg font-black text-emerald-500 leading-none">KSh {item.profile?.balance?.toLocaleString() || 0}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {item.role === 'CAREGIVER' && item.isVerified === false && (
                                                <button
                                                    onClick={() => handleApprove(item.id)}
                                                    className="px-6 py-3 bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-xl"
                                                >
                                                    Verify Node
                                                </button>
                                            )}
                                            {item.profile?.balance > 0 && (
                                                <button
                                                    onClick={() => handlePayout(item.id, item.profile.balance)}
                                                    className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all shadow-xl"
                                                >
                                                    Settle Earnings
                                                </button>
                                            )}
                                            <Link href={`/dashboard/caregivers/${item.id}`} className="p-3 bg-slate-900 border border-slate-800 text-slate-500 hover:text-white rounded-xl">
                                                <ChevronRight className="w-5 h-5" />
                                            </Link>
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
