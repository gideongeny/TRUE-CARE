import React, { useState, useEffect } from 'react';
import ShiftReportForm from './ShiftReportForm';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import {
    ChevronLeft,
    ChevronRight,
    Activity,
    Shield,
    MapPin
} from 'lucide-react';

export default function CaregiverSchedule() {
    const [myShifts, setMyShifts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedShift, setSelectedShift] = useState<any | null>(null);

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

    useEffect(() => {
        fetchMyShifts();
    }, []);

    const handleClockIn = async (id: string) => {
        try {
            await api.post(`/shifts/${id}/clock-in`);
            fetchMyShifts();
        } catch (error) {
            console.error('Failed to clock in', error);
        }
    };

    if (loading) return (
        <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            Syncing Schedule...
        </div>
    );

    const hours = Array.from({ length: 24 }, (_, i) => i);
    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">Care Schedule</h2>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Weekly availability timeline</p>
                </div>
                <div className="flex gap-3">
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                        <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                </div>
            </div>

            {/* Gantt Chart Container */}
            <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex gap-10">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-teal-600 shadow-[0_0_10px_rgba(13,148,136,0.4)]" />
                            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Active Shift</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Live Care Active</span>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-x-auto pb-6 scrollbar-hide">
                    <div className="min-w-[1200px]">
                        <div className="flex border-b border-slate-100 pb-4 mb-8">
                            {hours.map(h => (
                                <div key={h} className="flex-1 text-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase font-mono">
                                        {h % 4 === 0 ? `${h}h` : ''}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-8">
                            {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'].map((day, dayIdx) => (
                                <div key={day} className="relative h-20 group">
                                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[9px] font-black text-slate-300 tracking-[0.3em] uppercase">
                                        {day}
                                    </div>
                                    <div className="h-20 w-full bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex items-center relative px-2">
                                        <div className="absolute inset-0 flex">
                                            {hours.map(h => (
                                                <div key={h} className="flex-1 border-r border-slate-100 last:border-0" />
                                            ))}
                                        </div>

                                        {myShifts.length > 0 && myShifts.filter(s => new Date(s.startTime).getDay() === (dayIdx + 1) % 7).map((shift) => {
                                            const startHour = new Date(shift.startTime).getHours();
                                            const duration = shift.status === 'COMPLETED' ? (shift.actualDuration || 8) : 8;
                                            const startPct = (startHour / 24) * 100;
                                            const widthPct = (duration / 24) * 100;

                                            return (
                                                <motion.div
                                                    key={shift.id}
                                                    className={`absolute h-14 ${shift.status === 'IN_PROGRESS' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-200/50' : 'bg-gradient-to-r from-teal-500 to-emerald-600 shadow-teal-200/50'} rounded-2xl shadow-xl flex items-center px-6 z-10 border-2 border-white/20`}
                                                    style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                                                >
                                                    <div className="flex items-center gap-3 w-full overflow-hidden text-white font-black text-[10px] uppercase">
                                                        {shift.patient?.profile?.lastName}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myShifts.map((shift) => (
                    <div key={shift.id} className="bg-white border border-slate-200 rounded-[32px] p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-teal-600 uppercase mb-1">Assigned Patient</p>
                                <h4 className="text-xl font-extrabold text-slate-900">{shift.patient?.profile?.firstName} {shift.patient?.profile?.lastName}</h4>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase ${shift.status === 'IN_PROGRESS' ? 'bg-emerald-50 text-emerald-600' :
                                    shift.status === 'COMPLETED' ? 'bg-teal-50 text-teal-600' : 'bg-slate-50 text-slate-500'
                                }`}>
                                {shift.status}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {shift.status === 'ACCEPTED' && (
                                <button
                                    onClick={() => handleClockIn(shift.id)}
                                    className="flex-1 py-4 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
                                >
                                    Clock In Now
                                </button>
                            )}

                            {(shift.status === 'IN_PROGRESS' || shift.status === 'COMPLETED') && (
                                <button
                                    onClick={() => setSelectedShift(shift)}
                                    className="flex-1 py-4 bg-teal-700 text-white text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-teal-600 transition-all shadow-xl shadow-teal-900/10"
                                >
                                    {shift.status === 'COMPLETED' ? 'Review Report' : 'End Shift & Report'}
                                </button>
                            )}

                            {shift.status === 'IN_PROGRESS' && (
                                <button
                                    onClick={() => window.location.href = `/assessment?shiftId=${shift.id}`}
                                    className="flex-1 py-4 bg-white border-2 border-teal-600 text-teal-700 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-teal-50 transition-all"
                                >
                                    Record Clinical Assessment
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {selectedShift && (
                    <ShiftReportForm
                        shiftId={selectedShift.id}
                        patientName={`${selectedShift.patient?.profile?.firstName} ${selectedShift.patient?.profile?.lastName}`}
                        onClose={() => setSelectedShift(null)}
                        onSuccess={() => {
                            setSelectedShift(null);
                            fetchMyShifts();
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
