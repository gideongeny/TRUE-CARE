'use client';

import React, { useEffect, useState } from 'react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Navigation
} from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';

export default function CaregiverSchedule() {
    const [myShifts, setMyShifts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyShifts = async () => {
            try {
                const res = await api.get('/shifts');
                setMyShifts(res.data);
            } catch (error) {
                console.error('Failed to fetch schedule', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyShifts();
    }, []);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    if (loading) return <div className="h-40 bg-slate-100 animate-pulse rounded-2xl" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Work Progress</h2>
                    <p className="text-sm text-slate-500 font-medium">Your week at a glance (Mon-Sun)</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                </div>
            </div>

            {/* Weekly Strip */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between gap-4">
                    {days.map((day, i) => {
                        const isToday = new Date().getDay() === (i + 1) % 7;
                        return (
                            <div key={day} className="flex-1 flex flex-col items-center gap-4">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>
                                    {day}
                                </span>
                                <div className={`
                                    w-full h-24 rounded-xl border-2 transition-all relative overflow-hidden
                                    ${isToday ? 'border-blue-200 bg-blue-50/30' : 'border-slate-50 bg-slate-50/50'}
                                `}>
                                    {/* Mock indicators for shifts */}
                                    {i % 2 === 0 && (
                                        <div className="absolute inset-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-200 flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Shift List */}
            <div className="grid grid-cols-1 gap-4">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Upcoming Committed Shifts</h3>
                {myShifts.length > 0 ? myShifts.map((shift) => (
                    <div key={shift.id} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between group hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-colors">
                                <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-600 leading-none mb-1">
                                    {new Date(shift.startTime).toLocaleString('default', { month: 'short' })}
                                </span>
                                <span className="text-sm font-bold text-slate-800 group-hover:text-blue-700">
                                    {new Date(shift.startTime).getDate()}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Patient: {shift.patient?.profile?.firstName} {shift.patient?.profile?.lastName}</p>
                                <div className="flex items-center gap-3 mt-1 text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-medium">9:00 AM - 1:00 PM</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-medium truncate max-w-[120px]">Long Island</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-md">
                            Clock In
                        </button>
                    </div>
                )) : (
                    <p className="text-sm text-slate-500 italic">No shifts assigned yet.</p>
                )}
            </div>
        </div>
    );
}
