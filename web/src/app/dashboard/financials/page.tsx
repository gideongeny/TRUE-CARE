'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
    DollarSign,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    CheckCircle,
    XCircle,
    Clock,
    Search,
    RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function FinancialsPage() {
    const [stats, setStats] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/financial-dashboard');
            setStats(response.data.summary);
            setTransactions(response.data.recentTransactions);
        } catch (error) {
            console.error('Failed to fetch financials', error);
            toast.error('Could not sync local ledger with central treasury.');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveDisbursement = async (caregiverId: string, amount: number) => {
        try {
            await api.post('/admin/shifts/payout', { caregiverId, amount });
            toast.success('Disbursement vector initiated via M-Pesa!');
            fetchData();
        } catch (error) {
            toast.error('Payout failed. Check treasury balance.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredTransactions = transactions.filter(tx =>
        tx.user?.profile?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        tx.user?.profile?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        tx.id.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center space-y-4">
                <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Synchronizing Financial Vectors...</p>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12 pb-24">
                {/* Header & Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                    <div className="col-span-2">
                        <h1 className="text-6xl font-black text-white tracking-tight leading-none">Clinical Treasury</h1>
                        <p className="text-slate-500 text-xs mt-4 font-bold uppercase tracking-[0.3em]">Real-time Revenue & Payout Matrix</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 space-y-8 shadow-2xl shadow-blue-500/20 group hover:scale-[1.02] transition-transform">
                        <DollarSign className="w-10 h-10 text-white/40 group-hover:rotate-12 transition-transform" />
                        <div>
                            <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em]">Liquid Assets</p>
                            <p className="text-5xl font-black text-white leading-none mt-2 tracking-tight">KSh {stats?.totalRevenue?.toLocaleString() || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="bg-slate-950 border border-slate-900 rounded-[32px] p-8 hover:border-emerald-500/30 transition-colors">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Active Receivables</p>
                        <p className="text-3xl font-black text-white mt-2">KSh {stats?.outstandingInvoices?.toLocaleString() || 0}</p>
                    </div>
                    <div className="bg-slate-950 border border-slate-900 rounded-[32px] p-8 hover:border-red-500/30 transition-colors">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Obligations (Caregivers)</p>
                        <p className="text-3xl font-black text-white mt-2">KSh {stats?.caregiverPayoutsDue?.toLocaleString() || 0}</p>
                    </div>
                    <div className="col-span-2 bg-slate-900/40 border border-slate-800 rounded-[32px] px-8 py-5 flex items-center gap-4">
                        <Search className="w-5 h-5 text-slate-600" />
                        <input
                            type="text"
                            placeholder="SEARCH TRANSACTION LEDGER..."
                            className="bg-transparent border-none text-white text-[10px] font-black uppercase tracking-widest w-full focus:ring-0 placeholder:text-slate-700"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {/* Revenue Ledger */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-6">
                            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Transactional Event Log</h2>
                            <div className="flex gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Live Stream</span>
                            </div>
                        </div>
                        <div className="bg-slate-950 border border-slate-900 rounded-[48px] overflow-hidden shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900/50 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                                        <th className="px-10 py-8">Subject/ID</th>
                                        <th className="px-10 py-8">Type</th>
                                        <th className="px-10 py-8">Quantum</th>
                                        <th className="px-10 py-8 text-right">Verification</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-900/50">
                                    {filteredTransactions.map(tx => (
                                        <tr key={tx.id} className="group hover:bg-slate-900/30 transition-all">
                                            <td className="px-10 py-8">
                                                <p className="text-sm font-black text-white uppercase tracking-tight">{tx.user?.profile?.firstName} {tx.user?.profile?.lastName}</p>
                                                <p className="text-[9px] text-slate-600 font-bold mt-1 uppercase tracking-widest">{tx.id}</p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-900 w-fit px-3 py-1 rounded-full border border-slate-800">
                                                    {tx.method || 'MPESA'}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2 text-emerald-400 font-black text-lg tracking-tight">
                                                    <ArrowDownLeft className="w-5 h-5 text-emerald-500" />
                                                    KSh {tx.amount.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className={`inline-flex px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg ${tx.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                                    'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                    }`}>
                                                    {tx.status}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredTransactions.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-32 text-center text-slate-700 text-[10px] font-black uppercase tracking-[0.5em]">
                                                No matches in the financial subspace
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
