'use client';

import React, { useEffect, useState, use } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
    ArrowLeft,
    DollarSign,
    Calendar,
    CreditCard,
    Receipt,
    TrendingUp,
    TrendingDown,
    Activity,
    User,
    Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PatientFinancialsPage({ params }: { params: Promise<{ patientId: string }> }) {
    const { patientId } = use(params);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`/admin/financials/patient/${patientId}`);
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch financial details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [patientId]);

    if (loading) return <div className="p-24 text-center text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Accessing Ledger...</div>;
    if (!data) return <div className="p-24 text-center text-rose-500 font-black uppercase tracking-[0.3em] text-[10px]">Registry Access Denied</div>;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Navigation & Header */}
                <div className="flex items-center justify-between">
                    <Link href="/dashboard/financials" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Finance Hub</span>
                    </Link>
                    <div className="text-right">
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">{data.profile?.firstName} {data.profile?.lastName}</h1>
                        <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em] mt-1">Status: {data.summary.balance > 0 ? 'Balance Arrears' : 'Cleared Vector'}</p>
                    </div>
                </div>

                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900/50 border border-slate-800 p-8 rounded-[32px] hover:border-blue-500/30 transition-all"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Clinical Billing</span>
                        </div>
                        <p className="text-3xl font-black text-white italic">KES {data.summary.totalBilled.toLocaleString()}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/50 border border-slate-800 p-8 rounded-[32px] hover:border-emerald-500/30 transition-all"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
                                <TrendingDown className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Transacted</span>
                        </div>
                        <p className="text-3xl font-black text-emerald-500 italic">KES {data.summary.totalPaid.toLocaleString()}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-950 border border-blue-600/30 p-8 rounded-[32px] shadow-2xl shadow-blue-500/10"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Outstanding Node Balance</span>
                        </div>
                        <p className={`text-3xl font-black italic ${data.summary.balance > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                            KES {data.summary.balance.toLocaleString()}
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Transaction History */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                            <Receipt className="w-5 h-5 text-blue-500" />
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Transaction Audit Trail</h3>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 rounded-[40px] overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-900/50 border-b border-slate-800">
                                    <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                        <th className="px-8 py-6">Timestamp</th>
                                        <th className="px-8 py-6">ID</th>
                                        <th className="px-8 py-6 text-right">Magnitude</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-900">
                                    {data.transactions.map((tx: any) => (
                                        <tr key={tx.id} className="hover:bg-slate-900/30">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3 h-3 text-slate-600" />
                                                    <span className="text-[10px] text-slate-400 font-bold">{new Date(tx.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">MP-{tx.mpesaReceipt?.slice(0, 10) || tx.id.slice(0, 8)}</span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <span className="text-xs font-black text-emerald-500 tracking-tight italic">+ {tx.amount}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {data.transactions.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-8 py-20 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest">No transactions detected.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Care Sessions Breakdown */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                            <Shield className="w-5 h-5 text-blue-500" />
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Clinical Session Log</h3>
                        </div>
                        <div className="space-y-4">
                            {data.sessions.map((session: any) => (
                                <div key={session.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex items-center justify-between hover:border-slate-700 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800/50">
                                            <Activity className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-white uppercase tracking-tighter">{session.careType}</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">{new Date(session.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-white italic">KES {session.price || 0}</p>
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${session.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            {session.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {data.sessions.length === 0 && (
                                <div className="p-20 text-center bg-slate-950 border border-slate-800 border-dashed rounded-[40px] text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                    No active or history care sessions.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
