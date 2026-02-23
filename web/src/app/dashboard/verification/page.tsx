'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
    ShieldCheck,
    UserCheck,
    AlertTriangle,
    Lock,
    Search,
    ChevronRight,
    ExternalLink
} from 'lucide-react';

export default function VerificationPage() {
    const queue = [
        { id: 1, name: 'Alexander G.', role: 'Senior Nurse', status: 'Pending Background', risk: 'Low', date: '2h ago' },
        { id: 2, name: 'Sarah Miller', role: 'Companion Care', status: 'Identity Verified', risk: 'Low', date: '5h ago' },
        { id: 3, name: 'Robert Chen', role: 'Physical Therapist', status: 'Credentials Check', risk: 'Medium', date: '1d ago' },
        { id: 4, name: 'Emily Davis', role: 'Home Health Aide', status: 'Review Required', risk: 'High', date: '2d ago' },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Trust & Verification Center</h1>
                    <p className="text-sm text-slate-500 font-medium italic">Autonomous integrity screening for all network professionals.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="stats-card border-emerald-100 bg-emerald-50/20">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Network Integrity</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">99.8%</h3>
                        <p className="text-[11px] text-slate-500 mt-1">Verified compliance across nodes.</p>
                    </div>
                    <div className="stats-card">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-5 h-5 text-blue-600" />
                            <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Pending Checks</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">14</h3>
                        <p className="text-[11px] text-slate-500 mt-1">Active background screenings.</p>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="font-bold text-slate-900">Verification Queue</h4>
                        <div className="flex gap-2">
                            <button className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Active Batch</button>
                            <button className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">Archives</button>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {queue.map((item) => (
                            <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.risk === 'High' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                                        }`}>
                                        <UserCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">{item.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                                        <p className="text-[11px] font-bold text-blue-600">{item.status}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Risk Node</p>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${item.risk === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                                            }`}>{item.risk}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Entry</p>
                                        <p className="text-[11px] font-medium text-slate-500">{item.date}</p>
                                    </div>
                                    <button className="p-2 hover:bg-white hover:border-slate-200 border border-transparent rounded-lg transition-all">
                                        <ChevronRight className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
