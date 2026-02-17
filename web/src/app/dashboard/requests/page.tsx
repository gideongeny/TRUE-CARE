'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
    ClipboardList,
    Clock,
    MapPin,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Activity
} from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';

export default function RequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await api.get('/requests');
            setRequests(response.data);
        } catch (err) {
            console.error('Failed to fetch requests', err);
            // Mock fallback
            setRequests([
                { id: 'r1', patient: { profile: { firstName: 'Alice', lastName: 'Johnson' } }, careType: 'Nursing Care', duration: '8 hours', location: 'New York, NY', status: 'PENDING', createdAt: '2024-02-13' },
                { id: 'r2', patient: { profile: { firstName: 'James', lastName: 'Miller' } }, careType: 'Daily Assistance', duration: 'Full-time', location: 'Los Angeles, CA', status: 'PENDING', createdAt: '2024-02-12' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.put(`/requests/${id}/status`, { status });
            showToast(`Request successfully ${status.toLowerCase()}`, 'success');
            fetchRequests();
        } catch (err) {
            console.error('Failed to update status', err);
            showToast('Failed to update request status', 'error');
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white tracking-tight italic">Service Requests</h1>
                    <p className="text-gray-500 text-xs mt-1 font-medium italic">Review and approve new care requirements</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {requests.map((req: any, idx: number) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            key={req.id}
                            className="glass-card p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-blue-500/30 border-white/[0.03] !rounded-[32px]"
                        >
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-600/20 to-blue-900/40 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shadow-lg shadow-blue-900/10 group-hover:scale-105 transition-transform duration-300">
                                    <ClipboardList className="w-10 h-10" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-white">{req.careType}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${req.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                            req.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Requested by <span className="text-white font-semibold">{req.patient?.profile?.firstName} {req.patient?.profile?.lastName}</span>
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 mt-4">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                            <Clock className="w-3.5 h-3.5" />
                                            {req.duration}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {req.location}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                            <Activity className="w-3.5 h-3.5" />
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 md:border-l border-white/5 md:pl-6">
                                <button
                                    onClick={() => updateStatus(req.id, 'APPROVED')}
                                    className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-xl text-sm font-bold transition-all"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => updateStatus(req.id, 'REJECTED')}
                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-sm font-bold transition-all"
                                >
                                    Reject
                                </button>
                                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {requests.length === 0 && !loading && (
                    <div className="p-24 text-center glass-card border-dashed">
                        <ClipboardList className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 font-medium">No pending service requests.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
