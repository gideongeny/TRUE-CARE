'use client';

import React, { useEffect, useState } from 'react';
import {
    ShoppingBag,
    Calendar,
    MapPin,
    Clock,
    CheckCircle,
    Navigation,
    Info
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
                                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 transition-colors">
                                        <ShoppingBag className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Duration</p>
                                        <p className="text-sm font-black text-slate-900">4 Hours</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        Personal Care - {shift.patient?.profile?.lastName || 'Open Request'}
                                    </h3>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs font-medium">
                                            {new Date(shift.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs font-medium">
                                            {new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-xs font-medium truncate">Long Island, NY</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleClaim(shift.id)}
                                    disabled={claiming === shift.id}
                                    className={`
                                        w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                                        ${claiming === shift.id
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-slate-900 text-white hover:bg-blue-600 shadow-lg shadow-slate-200'}
                                    `}
                                >
                                    {claiming === shift.id ? 'Securing...' : 'Claim Shift'}
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
