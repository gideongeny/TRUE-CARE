'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    UserPlus,
    Clock,
    DollarSign,
    Clipboard,
    CheckCircle2,
    Loader2,
    ShieldAlert
} from 'lucide-react';
import api from '@/lib/api';

interface ShiftManagementModalProps {
    shift: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ShiftManagementModal({ shift, onClose, onSuccess }: ShiftManagementModalProps) {
    const [loading, setLoading] = useState(false);
    const [caregivers, setCaregivers] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        caregiverId: shift.caregiverId || '',
        endTime: new Date(shift.endTime).toISOString().slice(0, 16),
        earnings: shift.earnings || '',
        notes: shift.notes || ''
    });

    useEffect(() => {
        const fetchCaregivers = async () => {
            try {
                const res = await api.get('/users?role=CAREGIVER');
                setCaregivers(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error('Failed to fetch caregivers', error);
            }
        };
        fetchCaregivers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Update Shift Details
            await api.patch(`/admin/shifts/${shift.id}/details`, {
                endTime: formData.endTime,
                earnings: formData.earnings,
                notes: formData.notes
            });

            // Reassign if changed
            if (formData.caregiverId !== shift.caregiverId) {
                await api.post(`/admin/shifts/${shift.id}/reassign`, {
                    caregiverId: formData.caregiverId
                });
            }

            onSuccess();
        } catch (error) {
            console.error('Shift update failed', error);
            alert('CRITICAL: Shift authorization update failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl z-[150] flex items-center justify-center p-6"
        >
            <motion.div
                initial={{ scale: 0.95, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-[48px] shadow-2xl w-full max-w-[600px] overflow-hidden border border-white/20"
            >
                {/* Tactical Header */}
                <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Shift Override</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Operational ID: {shift.id.slice(0, 8)}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    {/* Personnel Assignment */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
                            <UserPlus className="w-3 h-3 text-blue-500" /> Assigned Personnel
                        </label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 appearance-none"
                            value={formData.caregiverId}
                            onChange={(e) => setFormData({ ...formData, caregiverId: e.target.value })}
                            required
                        >
                            <option value="">Select Caregiver</option>
                            {caregivers.map((cg) => (
                                <option key={cg.id} value={cg.id}>
                                    {cg.profile?.firstName} {cg.profile?.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Deployment End Time */}
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
                                <Clock className="w-3 h-3 text-emerald-500" /> Target End Time
                            </label>
                            <input
                                type="datetime-local"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                required
                            />
                        </div>

                        {/* Financial Delta */}
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
                                <DollarSign className="w-3 h-3 text-amber-500" /> Caregiver Earnings (KES)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 placeholder-slate-300"
                                value={formData.earnings}
                                onChange={(e) => setFormData({ ...formData, earnings: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Operational Notes */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
                            <Clipboard className="w-3 h-3 text-slate-400" /> Override Justification / Notes
                        </label>
                        <textarea
                            rows={3}
                            className="w-full bg-slate-50 border border-slate-200 rounded-[28px] py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 resize-none italic"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Reason for reassignment or detail update..."
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Execute Override <CheckCircle2 className="w-4 h-4 ml-1" /></>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
