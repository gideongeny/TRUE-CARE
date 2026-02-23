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
    Search
} from 'lucide-react';

export default function SchedulePage() {
    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Deployment Schedule</h1>
                        <p className="text-sm text-slate-500 font-medium italic">Synchronized weekly timeline for home care operations.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition-colors shadow-sm">
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg flex items-center gap-3 text-sm font-bold text-slate-700 shadow-sm">
                            <CalendarIcon className="w-4 h-4 text-blue-600" />
                            March 18 - March 24, 2024
                        </div>
                        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition-colors shadow-sm">
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Reuse the specialized schedule component */}
                <CaregiverSchedule />

                <div className="bg-slate-900 rounded-2xl p-8 text-white">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-xl font-bold">Smart Allocation Logic</h4>
                            <p className="text-slate-400 text-sm mt-1">AI-assisted shift distribution based on caregiver proximity and ratings.</p>
                        </div>
                        <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Optimization Active</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Conflict Detection</p>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[85%]" />
                            </div>
                            <p className="text-xs font-medium text-slate-400">85% efficiency across the active network.</p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Travel Overhead</p>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 w-[12%]" />
                            </div>
                            <p className="text-xs font-medium text-slate-400">Reduced by 12% in the last 72 hours.</p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Coverage Reliability</p>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[99.2%]" />
                            </div>
                            <p className="text-xs font-medium text-slate-400">Target reached: 99.2% shift fulfillment.</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
