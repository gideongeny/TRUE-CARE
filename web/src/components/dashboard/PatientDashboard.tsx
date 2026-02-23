'use client';

import React, { useEffect, useState } from 'react';
import {
    Clock,
    Calendar,
    Activity,
    CheckCircle2,
    Plus,
    Navigation,
    Shield
} from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';

export default function PatientDashboard() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await api.get('/requests');
                setRequests(res.data);
            } catch (error) {
                console.error('Failed to fetch requests', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    if (loading) return <div className="h-40 bg-slate-100 animate-pulse rounded-2xl" />;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Care Status</h2>
                    <p className="text-sm text-slate-500 font-medium italic">Track your requests and scheduled care in real-time.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                    <Plus className="w-4 h-4" />
                    New Request
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Requests Timeline */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Request Timeline</h3>
                    {requests.length > 0 ? requests.map((req, i) => (
                        <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between group hover:border-blue-200 transition-colors">
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${req.status === 'APPROVED' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                                    }`}>
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{req.careType} Assistance</p>
                                    <div className="flex items-center gap-3 mt-1 text-slate-500">
                                        <div className="flex items-center gap-1.5 font-medium text-[11px]">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5 font-medium text-[11px]">
                                            <Navigation className="w-3.5 h-3.5" />
                                            {req.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-400'
                                    }`}>
                                    {req.status}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-3xl opacity-50">
                            <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No active requests</p>
                        </div>
                    )}
                </div>

                {/* Secure Care Note */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                            <Shield className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">TrueCare Security</h3>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                            Every caregiver in our network is fully verified and trained to provide the highest standard of care at home.
                        </p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Emergency Service</p>
                        <p className="text-sm font-bold text-blue-400">Available 24/7 at 1-800-TRUE-CARE</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
