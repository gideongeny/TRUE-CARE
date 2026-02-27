'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
    ClipboardList,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    MapPin,
    Calendar,
    Filter,
    Shield,
    Activity,
    ChevronRight,
    User,
    DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function RequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [assigningPrice, setAssigningPrice] = useState<string | null>(null);
    const [priceValue, setPriceValue] = useState<string>('');

    const fetchRequests = async () => {
        try {
            const res = await api.get('/admin/requests'); // Use admin endpoint
            setRequests(res.data || []);
        } catch (error) {
            console.error('Failed to fetch requests', error);
            toast.error('Sector sync failed. Using local cache.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/admin/requests/${id}/status`, { status });
            toast.success(`Demand status updated to ${status}`);
            fetchRequests();
        } catch (error) {
            toast.error('Logic execution failed.');
        }
    };

    const handleSetPrice = async (requestId: string) => {
        const price = parseFloat(priceValue);
        if (isNaN(price) || price <= 0) {
            toast.error('Invalid price quantum.');
            return;
        }

        try {
            await api.post('/admin/set-price', { requestId, price });
            toast.success('Price vector assigned. Synchronizing with patient node.');
            setAssigningPrice(null);
            setPriceValue('');
            fetchRequests();
        } catch (error) {
            toast.error('Pricing failed to propagate.');
        }
    };

    const filteredRequests = requests.filter(r => {
        const matchesFilter = filter === 'ALL' || r.status === filter;
        const matchesSearch = `${r.patient?.profile?.firstName} ${r.patient?.profile?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.careType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Initializing Request Registry...</p>
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
                            <Activity className="w-4 h-4" />
                            <span>System Demand Node</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter italic uppercaseLeading">Care Requests</h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Global operational oversight of incoming care demand</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search demand flux..."
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/40 transition-all font-bold"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1.5 w-full md:w-auto">
                            {['ALL', 'PENDING', 'PRICED', 'APPROVED'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Registry Table */}
                <div className="bg-slate-950 border border-slate-900 rounded-[40px] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-900">
                                    <th className="px-10 py-6">Subject Profile</th>
                                    <th className="px-10 py-6">Care Vector</th>
                                    <th className="px-10 py-6">Status / Price</th>
                                    <th className="px-10 py-6 text-right">Logic Execute</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900">
                                <AnimatePresence mode="popLayout">
                                    {filteredRequests.map((req, idx) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={req.id}
                                            className="hover:bg-slate-900/40 transition-all group cursor-pointer"
                                        >
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-blue-500 font-black text-lg shadow-inner group-hover:scale-105 transition-transform">
                                                        {req.patient?.profile?.firstName?.[0] ?? '?'}{req.patient?.profile?.lastName?.[0] ?? ''}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                                                            {req.patient?.profile?.firstName} {req.patient?.profile?.lastName}
                                                        </p>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{req.patient?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{req.careType}</p>
                                                    <p className="text-xs text-slate-400 font-bold line-clamp-1 max-w-[250px] italic">"{req.description || 'Global care protocol.'}"</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex flex-col gap-2">
                                                    <div className={`
                                                        inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.1em] border w-fit
                                                        ${req.status === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                                            req.status === 'PRICED' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                                                                'bg-amber-500/10 border-amber-500/20 text-amber-500'}
                                                    `}>
                                                        {req.status}
                                                    </div>
                                                    {req.price && (
                                                        <p className="text-lg font-black text-white leading-none">KSh {req.price.toLocaleString()}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                {req.status === 'PENDING' ? (
                                                    assigningPrice === req.id ? (
                                                        <div className="flex items-center justify-end gap-2 animate-in slide-in-from-right-4">
                                                            <input
                                                                type="number"
                                                                placeholder="UNIT PRICE..."
                                                                className="bg-slate-900 border border-blue-500/50 rounded-xl px-4 py-2 text-[10px] font-black text-white w-32 focus:ring-0 outline-none"
                                                                value={priceValue}
                                                                onChange={(e) => setPriceValue(e.target.value)}
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => handleSetPrice(req.id)}
                                                                className="p-2 bg-emerald-500 text-slate-950 rounded-xl hover:scale-105 transition-transform"
                                                            >
                                                                <CheckCircle2 className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => setAssigningPrice(null)}
                                                                className="p-2 bg-slate-800 text-slate-400 rounded-xl hover:text-white"
                                                            >
                                                                <XCircle className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setAssigningPrice(req.id); }}
                                                            className="px-6 py-3 bg-white hover:bg-blue-600 text-slate-950 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl active:scale-95"
                                                        >
                                                            Assign Price
                                                        </button>
                                                    )
                                                ) : req.status === 'PRICED' ? (
                                                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">
                                                        Awaiting Patient Payment
                                                    </div>
                                                ) : (
                                                    <button className="p-3 text-slate-700 hover:text-white transition-colors">
                                                        <ChevronRight className="w-6 h-6" />
                                                    </button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
