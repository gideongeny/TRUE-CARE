'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    User,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    Plus,
    Activity
} from 'lucide-react';
import api from '@/lib/api';

export default function ShiftsPage() {
    const [shifts, setShifts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShifts();
    }, []);

    const fetchShifts = async () => {
        try {
            const response = await api.get('/shifts');
            setShifts(response.data);
        } catch (err) {
            console.error('Failed to fetch shifts', err);
            // Mock fallback
            setShifts([
                { id: 's1', caregiver: { profile: { firstName: 'Sarah', lastName: 'Wilson' } }, patient: { profile: { firstName: 'Alice', lastName: 'Johnson' } }, startTime: new Date().toISOString(), endTime: new Date(Date.now() + 28800000).toISOString(), status: 'IN_PROGRESS' },
                { id: 's2', caregiver: { profile: { firstName: 'Robert', lastName: 'Chen' } }, patient: { profile: { firstName: 'James', lastName: 'Miller' } }, startTime: new Date(Date.now() + 86400000).toISOString(), endTime: new Date(Date.now() + 115200000).toISOString(), status: 'SCHEDULED' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight italic">Shift Schedules</h1>
                        <p className="text-gray-500 text-xs mt-1 font-medium italic">Coordinate and track professional caregiver shifts</p>
                    </div>
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-3 text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40 group">
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Assign New Shift
                    </button>
                </div>

                <div className="glass-card overflow-hidden border-white/[0.03] !rounded-[32px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/[0.03] bg-white/[0.01]">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Caregiver</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Patient</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Date & Time</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {shifts.map((shift: any, idx: number) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={shift.id}
                                        className="hover:bg-white/[0.03] transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                                                    {shift.caregiver?.profile?.firstName[0]}{shift.caregiver?.profile?.lastName[0]}
                                                </div>
                                                <p className="font-semibold text-white whitespace-nowrap">{shift.caregiver?.profile?.firstName} {shift.caregiver?.profile?.lastName}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <User className="w-4 h-4" />
                                                <span className="text-sm">{shift.patient?.profile?.firstName} {shift.patient?.profile?.lastName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs space-y-1">
                                                <div className="flex items-center gap-2 text-gray-300 font-medium">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(shift.startTime).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    <span>-</span>
                                                    {new Date(shift.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${shift.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' :
                                                shift.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                                }`}>
                                                {shift.status === 'IN_PROGRESS' && <Activity className="w-3 h-3" />}
                                                {shift.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3" />}
                                                {shift.status === 'SCHEDULED' && <Clock className="w-3 h-3" />}
                                                {shift.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-colors">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
