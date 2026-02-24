'use client';

import React, { useEffect, useState } from 'react';
import {
    ShoppingBag,
    Calendar,
    MapPin,
    Clock,
    CheckCircle,
    Navigation,
    Info,
    Activity
} from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function CaregiverMarketplace() {
    const [openShifts, setOpenShifts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState<string | null>(null);

    const fetchOpenShifts = async () => {
        try {
            const res = await api.get('/shifts/open');
            setOpenShifts(res.data);
        } catch (error) {
            console.error('Failed to fetch marketplace shifts', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpenShifts();
    }, []);

    const handleClaim = async (id: string) => {
        setClaiming(id);
        try {
            await api.post(`/shifts/${id}/claim`);
            // Show success and remove from list
            setOpenShifts(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error('Failed to claim shift', error);
            alert('This shift was just claimed by another caregiver.');
            fetchOpenShifts();
        } finally {
            setClaiming(null);
        }
    };

    if (loading) return (
        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-2xl" />
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Shift Marketplace</h2>
                    <p className="text-sm text-slate-500 font-medium">Claim available shifts instantly</p>
                </div>
                <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                    {openShifts.length} Shifts Available
                </div>
            </div>

            <AnimatePresence>
                {openShifts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {openShifts.map((shift) => (
                            <motion.div
                                key={shift.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                        Open Request
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-600 transition-colors">
                                        <ShoppingBag className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Type</p>
                                        <h3 className="font-black text-slate-900 text-lg leading-tight uppercase tracking-tight">
                                            {shift.patient?.profile?.lastName || 'General Care'}
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Patient Intelligence</p>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2">
                                                <Activity className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                                                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
                                                    {shift.patient?.profile?.ailment || 'No ailment specified'}
                                                </p>
                                            </div>
                                            <p className="text-[11px] text-slate-500 font-bold leading-relaxed italic">
                                                "{shift.patient?.profile?.bio || 'Waiting for medical history update...'}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2.5 text-slate-600">
                                            <div className="p-2 bg-white border border-slate-100 rounded-lg shadow-sm">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-widest">
                                                {new Date(shift.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-slate-600">
                                            <div className="p-2 bg-white border border-slate-100 rounded-lg shadow-sm">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-widest">
                                                {new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleClaim(shift.id)}
                                    disabled={claiming === shift.id}
                                    className={`
                                        w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all
                                        ${claiming === shift.id
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-900/10 hover:shadow-blue-600/30'}
                                    `}
                                >
                                    {claiming === shift.id ? 'Securing Data...' : 'Claim This Shift'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Info className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-slate-900 font-bold">No shifts right now</h3>
                        <p className="text-slate-500 text-sm mt-1">We&apos;ll notify you when new requests arrive.</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
