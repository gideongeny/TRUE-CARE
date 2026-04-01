'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Thermometer, Heart, FileText, ClipboardList, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

interface ClinicalLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    shift: any;
    onSuccess: () => void;
}

export default function ClinicalLogModal({ isOpen, onClose, shift, onSuccess }: ClinicalLogModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        content: '',
        pulse: '',
        temperature: '',
        bloodPressure: '',
        servicesRendered: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/admin/clinical/log', {
                shiftId: shift.id,
                ...formData
            });
            onSuccess();
            onClose();
            setFormData({ content: '', pulse: '', temperature: '', bloodPressure: '', servicesRendered: '' });
        } catch (error: any) {
            console.error('Failed to document clinicals', error);
            alert(error.response?.data?.message || 'Documentation failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-slate-900/40">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[40px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-8 pb-6 border-b border-slate-100 flex items-start justify-between bg-amber-50 relative overflow-hidden">
                        <div className="absolute right-0 top-0 opacity-5 w-64 h-64 -mt-16 -mr-16 pointer-events-none text-amber-900">
                            <Activity className="w-full h-full" />
                        </div>
                        
                        <div className="relative z-10 flex gap-5 items-center">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                                <Heart className="w-7 h-7" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black tracking-tight uppercase text-slate-900">
                                    Administrative Clinical Sync
                                </h2>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                    Documenting for: {shift.patient?.profile?.firstName} {shift.patient?.profile?.lastName}
                                </p>
                            </div>
                        </div>

                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center transition-colors shadow-sm">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <form id="clinicalLogForm" onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* Vitals Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                        <Heart className="w-3 h-3 text-rose-500" /> Pulse (BPM)
                                    </label>
                                    <input 
                                        type="text" placeholder="72"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:border-amber-500/40 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                                        value={formData.pulse} onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                        <Thermometer className="w-3 h-3 text-amber-500" /> Temp (°C)
                                    </label>
                                    <input 
                                        type="text" placeholder="36.8"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:border-amber-500/40 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                                        value={formData.temperature} onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                        <Activity className="w-3 h-3 text-teal-500" /> BP (e.g. 120/80)
                                    </label>
                                    <input 
                                        type="text" placeholder="120/80"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:border-amber-500/40 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                                        value={formData.bloodPressure} onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Services Rendered */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <ClipboardList className="w-3 h-3 text-indigo-500" /> Services Rendered
                                </label>
                                <input 
                                    type="text" placeholder="Wound dressing, Mobility support, Medication..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:border-amber-500/40 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none shadow-sm"
                                    value={formData.servicesRendered} onChange={(e) => setFormData({ ...formData, servicesRendered: e.target.value })}
                                />
                            </div>

                            {/* Detailed Notes */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <FileText className="w-3 h-3 text-slate-400" /> Observation Notes
                                </label>
                                <textarea 
                                    rows={4} placeholder="Enter clinical observations or session summary..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-6 py-4 text-sm font-bold text-slate-900 focus:border-amber-500/40 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none resize-none shadow-sm"
                                    value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 pl-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Admin Command Mode
                        </div>
                        <div className="flex gap-3">
                            <button onClick={onClose} className="px-6 py-3 text-slate-500 font-bold uppercase text-[10px] hover:text-slate-800 transition-colors">Cancel</button>
                            <button 
                                form="clinicalLogForm"
                                disabled={loading}
                                className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {loading ? 'Transmitting Data...' : 'Submit Documentation'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
