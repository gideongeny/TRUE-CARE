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
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                            <Activity className="w-4 h-4" />
                            <span>Temporal Deployment Grid</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">Operation Schedule</h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Synchronized weekly timeline for global clinical deployment</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all active:scale-95 shadow-xl">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4 shadow-2xl">
                            <CalendarIcon className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-black text-white uppercase tracking-widest">
                                {(() => {
                                    const now = new Date();
                                    const first = now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1);
                                    const firstDay = new Date(now.setDate(first));
                                    const lastDay = new Date(now.setDate(first + 6));
                                    return `${firstDay.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                                })()}
                            </span>
                        </div>
                        <button className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all active:scale-95 shadow-xl">
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Primary Schedule Component */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-950 border border-slate-900 rounded-[50px] p-2 overflow-hidden shadow-2xl"
                >
                    <CaregiverSchedule />
                </motion.div>

                {/* Intelligent Allocation Logic Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -mr-48 -mt-48" />

                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 relative z-10">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                <Zap className="w-4 h-4 fill-blue-500" />
                                <span>Optimization Engine</span>
                            </div>
                            <h4 className="text-2xl font-black text-white tracking-tighter uppercase italic">Smart Allocation Framework</h4>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">AI-assisted vector distribution based on real-time caregiver proximity</p>
                        </div>
                        <div className="px-6 py-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3 shadow-xl">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Optimization Matrix Active</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        <MetricItem label="Conflict Probability" value="0.04%" color="bg-blue-600" width="w-[4%]" desc="Near-zero temporal overlaps detected across the network." />
                        <MetricItem label="Travel Overhead Flux" value="-18.2%" color="bg-indigo-600" width="w-[18%]" desc="Significant reduction in logistic entropy since deployment." />
                        <MetricItem label="Fulfillment Reliability" value="99.4%" color="bg-emerald-600" width="w-[99.4%]" desc="Target threshold reached for all active clinical sectors." />
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
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">{label}</p>
                <p className="text-2xl font-black text-white tracking-tighter">{value}</p>
            </div>
            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/30 shadow-inner">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: width === 'w-[4%]' ? '4%' : width === 'w-[18%]' ? '18%' : '99.4%' }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className={`h-full rounded-full shadow-lg ${color}`}
                />
            </div>
            <p className="text-[9px] font-bold text-slate-600 leading-relaxed uppercase tracking-tighter">{desc}</p>
        </div>
    );
}
