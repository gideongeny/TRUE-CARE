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
    Search
} from 'lucide-react';

export default function FinancialsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Placeholder: Replace with actual endpoints
            // const [payRes, withRes] = await Promise.all([
            //     api.get('/admin/payments'),
            //     api.get('/admin/withdrawals')
            // ]);
            // setPayments(payRes.data);
            // setWithdrawals(withRes.data);

            // Mock Data for demonstration
            setPayments([
                { id: 'TXN_001', amount: 2500, status: 'PAID', type: 'DEPOSIT', patient: 'Alice Johnson', date: '2024-03-20' },
                { id: 'TXN_002', amount: 5000, status: 'PAID', type: 'DEPOSIT', patient: 'James Miller', date: '2024-03-19' },
            ]);
            setWithdrawals([
                { id: 'WITH_001', amount: 3500, status: 'PENDING', caregiver: 'John Githinji', date: '2024-03-20', mpesa: '+254712345678' }
            ]);
        } catch (error) {
            console.error('Failed to fetch financials', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="p-24 text-center text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Calculating Ledger...</div>;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="col-span-2">
                        <h1 className="text-5xl font-black text-white tracking-tighter">Clinical Treasury</h1>
                        <p className="text-slate-500 text-xs mt-3 font-bold uppercase tracking-widest">Revenue & Payout Vector Visualization</p>
                    </div>
                    <div className="bg-blue-600 rounded-[40px] p-8 flex flex-col justify-between shadow-2xl shadow-blue-500/20">
                        <DollarSign className="w-8 h-8 text-white/50" />
                        <div>
                            <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Total Revenue</p>
                            <p className="text-4xl font-black text-white leading-none mt-1">KSh 7,500</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* M-Pesa Transactions */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Revenue Flux</h2>
                            <Search className="w-4 h-4 text-slate-700 hover:text-blue-500 transition-colors cursor-pointer" />
                        </div>
                        <div className="bg-slate-950 border border-slate-900 rounded-[40px] overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900/50 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                        <th className="px-8 py-5">Origin</th>
                                        <th className="px-8 py-5">Quantum</th>
                                        <th className="px-8 py-5 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-900">
                                    {payments.map(px => (
                                        <tr key={px.id} className="group hover:bg-slate-900/20 transition-all">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-white uppercase tracking-tight">{px.patient}</p>
                                                <p className="text-[9px] text-slate-600 font-bold">{px.id}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-emerald-500 font-black uppercase">
                                                    <ArrowDownLeft className="w-4 h-4" />
                                                    KSh {px.amount}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="inline-flex px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[8px] font-black uppercase tracking-widest">
                                                    Settled
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Withdrawal Requests */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Payout Requests</h2>
                            <Clock className="w-4 h-4 text-slate-700" />
                        </div>
                        <div className="space-y-4">
                            {withdrawals.length === 0 ? (
                                <div className="p-12 text-center bg-slate-950 border border-slate-900 border-dashed rounded-[40px] text-slate-700 text-[10px] font-black uppercase tracking-widest">
                                    No pending payout requests
                                </div>
                            ) : (
                                withdrawals.map(wx => (
                                    <div key={wx.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] hover:border-blue-500/30 transition-all group">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-blue-500 shadow-xl">
                                                    <CreditCard className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Caregiver Node</p>
                                                    <p className="text-lg font-black text-white leading-tight uppercase tracking-tight">{wx.caregiver}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-white leading-none">KSh {wx.amount}</p>
                                                <p className="text-[9px] text-slate-600 font-bold mt-1 uppercase tracking-widest">{wx.mpesa}</p>
                                            </div>
                                        </div>
                                        <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-slate-800/50">
                                            <button className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                            <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-emerald-500 hover:text-white text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl active:scale-95">
                                                <CheckCircle className="w-4 h-4" />
                                                Approve Disbursement
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
