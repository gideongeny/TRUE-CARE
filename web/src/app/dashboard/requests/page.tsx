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
    User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRequests = async () => {
        try {
            const res = await api.get('/requests');
            setRequests(res.data || []);
        } catch (error) {
            console.error('Failed to fetch requests', error);
            // Mock fallback for premium demonstration
            setRequests([
                {
                    id: 'REQ-01',
                    patient: { profile: { firstName: 'Francis', lastName: 'K.', ailment: 'Post-Op' }, email: 'francis@example.com' },
                    careType: 'FULL_TIME',
                    description: 'Requires 24/7 post-operative monitoring and mobility assistance.',
                    location: 'Nairobi, Westlands',
                    status: 'PENDING',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'REQ-02',
                    patient: { profile: { firstName: 'Mary', lastName: 'W.', ailment: 'Elderly care' }, email: 'mary@example.com' },
                    careType: 'PART_TIME',
                    description: 'Daily medication management and light housework support.',
                    location: 'Mombasa, Nyali',
                    status: 'APPROVED',
                    createdAt: new Date(Date.now() - 86400000).toISOString()
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/requests/${id}`, { status });
            fetchRequests(); // Refresh
        } catch (error) {
            console.error('Failed to update status', error);
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
                        <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">Care Requests</h1>
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
                            {['ALL', 'PENDING', 'APPROVED'].map(f => (
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
                                    <th className="px-10 py-6">Deployment Data</th>
                                    <th className="px-10 py-6">Integrity Status</th>
                                    <th className="px-10 py-6 text-right">Logic Execute</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900">
                                <AnimatePresence>
                                    {filteredRequests.map((req, idx) => (
                                        <motion.tr
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={req.id}
                                            className="hover:bg-slate-900/40 transition-all group cursor-pointer"
                                        >
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-blue-500 font-black text-lg shadow-inner group-hover:scale-105 transition-transform">
                                                        {req.patient?.profile?.firstName[0]}{req.patient?.profile?.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{req.patient?.profile?.firstName} {req.patient?.profile?.lastName}</p>
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
                                                <div className="flex flex-col gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5 text-slate-700" />
                                                        {req.location}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-slate-700" />
                                                        {new Date(req.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className={`
                                                    inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border
                                                    ${req.status === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}
                                                `}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'APPROVED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                                                    {req.status}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                {req.status === 'PENDING' ? (
                                                    <div className="flex items-center justify-end gap-3 text-white">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateStatus(req.id, 'REJECTED'); }}
                                                            className="p-3 bg-slate-900 border border-slate-800 hover:border-rose-500/30 hover:text-rose-500 rounded-xl transition-all active:scale-95"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateStatus(req.id, 'APPROVED'); }}
                                                            className="px-6 py-3 bg-white hover:bg-blue-600 text-slate-950 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl active:scale-95"
                                                        >
                                                            Execute Approval
                                                        </button>
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
                    {filteredRequests.length === 0 && (
                        <div className="py-32 text-center">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.2 }}>
                                <ClipboardList className="w-16 h-16 mx-auto mb-6 text-slate-500" />
                                <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">No active demand in sector</p>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
