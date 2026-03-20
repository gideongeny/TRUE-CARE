import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, Brain, AlertTriangle, ShieldCheck, UserCheck, X } from 'lucide-react';

interface AIInsightsProps {
    isOpen: boolean;
    onClose: () => void;
    patientId?: string;
    patientName?: string;
}

export default function AIPredictiveInsights({ isOpen, onClose, patientId, patientName = "System-Wide" }: AIInsightsProps) {
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setIsScanning(true);
            const timer = setTimeout(() => {
                setIsScanning(false);
            }, 2500); // 2.5s mock scan
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[120] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden border border-teal-100 flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-8 pb-6 border-b border-slate-100 flex items-start justify-between bg-teal-50/50 relative overflow-hidden">
                        <div className="absolute right-0 top-0 opacity-5 w-64 h-64 -mt-20 -mr-20">
                            <Brain className="w-full h-full text-teal-900" />
                        </div>
                        <div className="relative z-10 space-y-2 max-w-[80%]">
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-teal-200">
                                    <Sparkles className="w-3 h-3" />
                                    TrueCare AI Engine v2.4
                                </span>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Predictive Synthesis</h2>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest border-l-2 border-teal-500 pl-3">Target: {patientName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-700 font-bold transition-colors flex items-center justify-center relative z-10 shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 overflow-y-auto space-y-8 flex-1">
                        {isScanning ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-6">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="w-20 h-20 border-4 border-teal-100 border-t-teal-600 rounded-full"
                                />
                                <div className="text-center space-y-2">
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest animate-pulse">Running Neural Diagnostics</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Cross-Referencing 1.4M Clinical Nodes</p>
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ staggerChildren: 0.1 }}
                                className="space-y-6"
                            >
                                {/* Insight Card 1 */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-orange-50 border border-orange-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-orange-300 transition-colors"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors" />
                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-orange-200 flex items-center justify-center text-orange-500 shadow-sm shrink-0">
                                            <AlertTriangle className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-sm font-black text-orange-900 uppercase tracking-tight">Elevated Risk Probability</h4>
                                                <span className="text-[10px] font-black px-2 py-0.5 bg-orange-200 text-orange-800 rounded uppercase tracking-widest">78% Match</span>
                                            </div>
                                            <p className="text-orange-800/80 text-xs font-medium leading-relaxed">
                                                Based on the last 48 hours of vitals, the model predicts a high likelihood of restless sleep tonight due to an upward trajectory in resting heart rate.
                                            </p>
                                            <div className="pt-2">
                                                <span className="text-[10px] font-bold border-b border-orange-300 text-orange-700 uppercase cursor-pointer hover:text-orange-900 transition-colors">Apply Recommended Medication Adjustment</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Insight Card 2 */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-colors"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                                            <Activity className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-sm font-black text-emerald-900 uppercase tracking-tight">Positive Recovery Trajectory</h4>
                                            </div>
                                            <p className="text-emerald-800/80 text-xs font-medium leading-relaxed">
                                                Mobility index shows a 14% improvement over the 7-day moving average. The current physical therapy regimen is highly effective.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Insight Card 3 */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-blue-50 border border-blue-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors"
                                >
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-blue-200 flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                                            <UserCheck className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">Personnel Optimization</h4>
                                            </div>
                                            <p className="text-blue-800/80 text-xs font-medium leading-relaxed">
                                                Assigning Caregiver [Melsa] reduces anticipated incident rate by 22% due to historical synergy and specialized neurological training.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4" />
                            HIPAA Compliant AI Engine
                        </div>
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-teal-700 transition-colors shadow-lg active:scale-95"
                        >
                            Acknowledge
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
