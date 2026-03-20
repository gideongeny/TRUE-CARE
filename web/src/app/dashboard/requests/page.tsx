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
            <div className="max-w-7xl mx-auto space-y-10 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
                            <Activity className="w-4 h-4" />
                            <span>System Demand Node</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Care Requests</h1>
                        <p className="text-slate-500 text-sm font-medium">Global operational oversight of incoming care demand</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search demand flux..."
                                className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-6 py-3 text-sm font-medium focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-white border border-slate-200 rounded-xl p-1.5 w-full md:w-auto shadow-sm">
                            {['ALL', 'PENDING', 'PRICED', 'APPROVED'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Registry Table */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] border-b border-slate-200">
                                    <th className="px-8 py-5">Subject Profile</th>
                                    <th className="px-8 py-5">Care Vector</th>
                                    <th className="px-8 py-5">Status / Price</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <AnimatePresence mode="popLayout">
                                    {filteredRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center text-slate-500 font-bold text-sm">
                                                No care requests in the registry.
                                            </td>
                                        </tr>
                                    ) : filteredRequests.map((req, idx) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={req.id}
                                            className="hover:bg-slate-50 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center text-teal-600 font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
                                                        {req.patient?.profile?.firstName?.[0] ?? '?'}{req.patient?.profile?.lastName?.[0] ?? ''}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-extrabold text-slate-900 group-hover:text-teal-600 transition-colors">
                                                            {req.patient?.profile?.firstName} {req.patient?.profile?.lastName}
                                                        </p>
                                                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">{req.patient?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">{req.careType}</p>
                                                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1 max-w-[250px] italic">"{req.description || 'Global care protocol.'}"</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className={`
                                                        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border w-fit
                                                        ${req.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                                            req.status === 'PRICED' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                                                'bg-amber-50 border-amber-100 text-amber-600'}
                                                    `}>
                                                        {req.status}
                                                    </div>
                                                    {req.price && (
                                                        <p className="text-sm font-extrabold text-slate-900">KSh {req.price.toLocaleString()}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                {req.status === 'PENDING' ? (
                                                    assigningPrice === req.id ? (
                                                        <div className="flex items-center justify-end gap-2 animate-in slide-in-from-right-4">
                                                            <input
                                                                type="number"
                                                                placeholder="UNIT PRICE..."
                                                                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 w-28 focus:border-teal-400 focus:ring-1 focus:ring-teal-100 outline-none"
                                                                value={priceValue}
                                                                onChange={(e) => setPriceValue(e.target.value)}
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => handleSetPrice(req.id)}
                                                                className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                                                            >
                                                                <CheckCircle2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setAssigningPrice(null)}
                                                                className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setAssigningPrice(req.id); }}
                                                            className="px-4 py-2 text-teal-600 bg-teal-50 border border-teal-100 hover:bg-teal-600 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95"
                                                        >
                                                            Assign Price
                                                        </button>
                                                    )
                                                ) : req.status === 'PRICED' ? (
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                                                        Awaiting Patient Payment
                                                    </div>
                                                ) : (
                                                    <button className="p-2 text-slate-400 hover:text-teal-600 transition-colors">
                                                        <ChevronRight className="w-5 h-5" />
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
