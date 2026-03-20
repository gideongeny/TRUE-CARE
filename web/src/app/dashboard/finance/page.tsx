'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
    Wallet,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowDownRight,
    Send,
    DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function FinancePage() {
    const [userRole, setUserRole] = useState<string>('');
    const [wallet, setWallet] = useState<any>(null);
    const [payoutQueue, setPayoutQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [mpesaNumber, setMpesaNumber] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role);
        fetchData(user.role);
    }, []);

    const fetchData = async (role: string) => {
        setLoading(true);
        try {
            if (role === 'CAREGIVER') {
                const res = await api.get('/finance/wallet');
                setWallet(res.data);
            } else if (role === 'ADMIN') {
                const res = await api.get('/finance/payout-queue');
                setPayoutQueue(res.data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/finance/withdraw', {
                amount: parseFloat(withdrawAmount),
                mpesaNumber
            });
            setShowWithdrawModal(false);
            fetchData('CAREGIVER');
            alert('Withdrawal request submitted!');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Withdrawal failed');
        }
    };

    const handleApprove = async (requestId: string) => {
        const transactionId = prompt('Enter M-Pesa Transaction ID:');
        if (!transactionId) return;

        try {
            await api.post(`/finance/approve-payout/${requestId}`, { transactionId });
            fetchData('ADMIN');
            alert('Payout approved!');
        } catch (error) {
            alert('Approval failed');
        }
    };

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
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">FINANCIAL HUB</h1>
                    <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[11px]">
                        {userRole === 'ADMIN' ? 'Manage global payouts' : 'Your Professional Wallet'}
                    </p>
                </div>
                {userRole === 'CAREGIVER' && (
                    <button
                        onClick={() => setShowWithdrawModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Request Payout
                    </button>
                )}
            </header>

            {userRole === 'CAREGIVER' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        {/* Wallet Card */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                            <div className="relative z-10">
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-60">Available Balance</span>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-5xl font-black tracking-tighter">KSh {parseFloat(wallet?.balance || 0).toLocaleString()}</span>
                                </div>

                                <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Total Earned</p>
                                        <p className="text-xl font-bold mt-1 text-blue-400">KSh {parseFloat(wallet?.totalEarned || 0).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Last Payout</p>
                                        <p className="text-xl font-bold mt-1 text-emerald-400">KSh {parseFloat(wallet?.history?.[0]?.amount || 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="glass-card rounded-[32px] p-8">
                            <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                                Withdrawal History
                            </h2>
                            <div className="space-y-4">
                                {wallet?.history?.length > 0 ? (
                                    wallet.history.map((t: any) => (
                                        <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-hover hover:bg-white hover:shadow-lg">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                                    }`}>
                                                    {t.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">KSh {t.amount}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                        {new Date(t.createdAt).toLocaleDateString()} • {t.mpesaNumber}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {t.status}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 text-sm font-medium italic">No withdrawals yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="stats-card">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                                <ArrowUpRight className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Fast Payouts</h3>
                            <p className="text-sm font-medium text-slate-700 mt-2">Withdrawals are processed within 24 hours via M-Pesa Express.</p>
                        </div>
                        <div className="stats-card bg-slate-900 border-none">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-white/50">Fee Structure</h3>
                            <p className="text-sm font-medium text-white/90 mt-2">TRUE-CARE charges zero withdrawal fees. You keep every shilling you earn.</p>
                        </div>
                    </div>
                </div>
            )}

            {userRole === 'ADMIN' && (
                <div className="glass-card rounded-[40px] p-8 overflow-hidden">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        Pending Payout Requests
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Caregiver</th>
                                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">M-Pesa Number</th>
                                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {payoutQueue.map((req) => (
                                    <tr key={req.id} className="group hover:bg-slate-50/5 transition-colors">
                                        <td className="py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500 text-xs">
                                                    {req.caregiver?.profile?.firstName?.[0]}{req.caregiver?.profile?.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">
                                                        {req.caregiver?.profile?.firstName} {req.caregiver?.profile?.lastName}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                                                        {req.caregiver?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <span className="text-sm font-black text-blue-600 tracking-tight">KSh {parseFloat(req.amount).toLocaleString()}</span>
                                        </td>
                                        <td className="py-5">
                                            <span className="text-xs font-bold text-slate-600">{req.mpesaNumber}</span>
                                        </td>
                                        <td className="py-5">
                                            <span className="text-xs text-slate-500 font-medium">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="py-5 text-right">
                                            <button
                                                onClick={() => handleApprove(req.id)}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                                            >
                                                Approve Payout
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {payoutQueue.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-30">
                                                <CheckCircle2 className="w-12 h-12" />
                                                <p className="text-sm font-black uppercase tracking-widest">No pending payouts</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl relative"
                    >
                        <button
                            onClick={() => setShowWithdrawModal(false)}
                            className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 font-black text-xl"
                        >✕</button>

                        <div className="w-20 h-20 bg-blue-50 rounded-[30px] flex items-center justify-center mb-8">
                            <ArrowDownRight className="w-10 h-10 text-blue-600" />
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Withdraw Funds</h2>
                        <p className="text-slate-500 font-medium mt-2 text-sm leading-relaxed">Enter the amount you wish to withdraw to your registered M-Pesa number.</p>

                        <form onSubmit={handleWithdraw} className="mt-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Withdrawal Amount (KSh)</label>
                                <input
                                    type="number"
                                    required
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder="e.g. 1500"
                                    className="input-field w-full py-4"
                                />
                                <p className="text-[10px] text-slate-400 font-bold mt-1 ml-1 opacity-60 italic">Available: KSh {wallet?.balance}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">M-Pesa Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={mpesaNumber}
                                    onChange={(e) => setMpesaNumber(e.target.value)}
                                    placeholder="2547XXXXXXXX"
                                    className="input-field w-full py-4 text-center tracking-[0.2em] font-black"
                                />
                            </div>

                            <button type="submit" className="btn-primary w-full py-5 text-sm">
                                Submit Request
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
            </div>
        </DashboardLayout>
    );
}
