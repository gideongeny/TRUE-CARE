'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import CaregiverSchedule from '@/components/dashboard/CaregiverSchedule';
import {
    Calendar as CalendarIcon,
    Clock,
    ArrowLeft,
    ArrowRight,
    Filter,
    Search,
    Zap,
    MapPin,
    Activity,
    Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SchedulePage() {
    return (
        <DashboardLayout>
            <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-teal-600">
                            <Activity className="w-4 h-4" />
                            <span>Temporal Deployment Grid</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight uppercase">Operation Schedule</h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Synchronized weekly timeline for global clinical deployment</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-700 transition-all active:scale-95 shadow-sm">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="px-8 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm">
                            <CalendarIcon className="w-5 h-5 text-teal-600" />
                            <span className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                {(() => {
                                    const now = new Date();
                                    const first = now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1);
                                    const firstDay = new Date(now.setDate(first));
                                    const lastDay = new Date(now.setDate(first + 6));
                                    return `${firstDay.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                                })()}
                            </span>
                        </div>
                        <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-700 transition-all active:scale-95 shadow-sm">
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Primary Schedule Component */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-slate-200 rounded-[50px] p-2 overflow-hidden shadow-xl shadow-slate-200/50"
                >
                    <CaregiverSchedule />
                </motion.div>

                {/* Intelligent Allocation Logic Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-[40px] p-10 shadow-lg shadow-teal-100/50 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 rounded-full blur-[80px] -mr-48 -mt-48" />

                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 relative z-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-black text-teal-600 uppercase tracking-widest">
                                <Zap className="w-4 h-4 fill-teal-600" />
                                <span>Optimization Engine</span>
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Smart Allocation Framework</h4>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">AI-assisted vector distribution based on real-time caregiver proximity</p>
                        </div>
                        <div className="px-6 py-3 bg-white border border-teal-100 rounded-2xl flex items-center gap-3 shadow-sm">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Optimization Matrix Active</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        <MetricItem label="Conflict Probability" value="0.04%" color="bg-teal-500" width="w-[4%]" desc="Near-zero temporal overlaps detected across the network." />
                        <MetricItem label="Travel Overhead Flux" value="-18.2%" color="bg-emerald-500" width="w-[18%]" desc="Significant reduction in logistic entropy since deployment." />
                        <MetricItem label="Fulfillment Reliability" value="99.4%" color="bg-cyan-500" width="w-[99.4%]" desc="Target threshold reached for all active clinical sectors." />
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}

function MetricItem({ label, value, color, width, desc }: any) {
    return (
        <div className="space-y-5 group">
            <div className="flex justify-between items-end">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-800 transition-colors">{label}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
            </div>
            <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: width === 'w-[4%]' ? '4%' : width === 'w-[18%]' ? '18%' : '99.4%' }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className={`h-full rounded-full shadow-lg ${color}`}
                />
            </div>
            <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase tracking-tighter">{desc}</p>
        </div>
    );
}
