'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Heart,
    Thermometer,
    Clipboard,
    CheckCircle2,
    X,
    Loader2
} from 'lucide-react';
import api from '@/lib/api';

interface ShiftReportFormProps {
    shiftId: string;
    patientName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ShiftReportForm({ shiftId, patientName, onClose, onSuccess }: ShiftReportFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [vitals, setVitals] = useState({
        systolic: '',
        diastolic: '',
        heartRate: '',
        temperature: '',
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Step 1: Submit Clinical Report
            await api.post(`/shifts/${shiftId}/report`, {
                content: vitals.notes,
                vitals: JSON.stringify({
                    bp: `${vitals.systolic}/${vitals.diastolic}`,
                    hr: vitals.heartRate,
                    temp: vitals.temperature
                })
            });

            // Step 2: Protocol Auto Clock-out
            await api.post(`/shifts/${shiftId}/clock-out`);

            onSuccess();
        } catch (err: any) {
            setError('Failed to transmit clinical report. Please verify connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-[48px] shadow-2xl w-full max-w-[560px] overflow-hidden"
            >
                <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full mb-2">
                            <Activity className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Shift Completion Protocol</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Clinical Report: {patientName}</h2>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
                                <Heart className="w-3 h-3 text-rose-500" /> Blood Pressure (Sys/Dia)
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="120"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-center"
                                    value={vitals.systolic}
                                    onChange={(e) => setVitals({ ...vitals, systolic: e.target.value })}
                                    required
                                />
                                <span className="text-slate-300 font-black">/</span>
                                <input
                                    type="text"
                                    placeholder="80"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-center"
                                    value={vitals.diastolic}
                                    onChange={(e) => setVitals({ ...vitals, diastolic: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
                                <Activity className="w-3 h-3 text-blue-500" /> Heart Rate (BPM)
                            </label>
                            <input
                                type="text"
                                placeholder="72"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                                value={vitals.heartRate}
                                onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
                                <Thermometer className="w-3 h-3 text-amber-500" /> Core Temperature (°C)
                            </label>
                            <input
                                type="text"
                                placeholder="36.6"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                                value={vitals.temperature}
                                onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
                            <Clipboard className="w-3 h-3 text-slate-400" /> Clinical Observation Notes
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Detailed shift notes and interventions..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-[24px] py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all resize-none italic"
                            value={vitals.notes}
                            onChange={(e) => setVitals({ ...vitals, notes: e.target.value })}
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <p className="text-rose-600 text-[10px] font-black uppercase tracking-tight">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] btn-primary py-4 flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Log Shift Report <CheckCircle2 className="w-4 h-4" /></>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
