'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    ArrowUpRight
} from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';

export default function CaregiversPage() {
    const [caregivers, setCaregivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        fetchCaregivers();
    }, []);

    const fetchCaregivers = async () => {
        try {
            const response = await api.get('/users');
            const data = response.data.filter((u: any) => u.role === 'CAREGIVER');
            setCaregivers(data);
        } catch (err) {
            console.error('Failed to fetch caregivers', err);
            // Mock fallback
            setCaregivers([
                { id: '1', profile: { firstName: 'Sarah', lastName: 'Wilson', isVerified: true }, email: 'sarah@example.com', createdAt: '2024-01-15' },
                { id: '2', profile: { firstName: 'Robert', lastName: 'Chen', isVerified: false }, email: 'robert@example.com', createdAt: '2024-02-01' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const verifyCaregiver = async (id: string) => {
        try {
            await api.put(`/users/${id}/verify`, { isVerified: true });
            showToast('Caregiver verified successfully', 'success');
            fetchCaregivers();
        } catch (err) {
            console.error('Failed to verify', err);
            showToast('Failed to verify caregiver', 'error');
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-white tracking-tight italic">Caregiver Directory</h1>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500/30 w-64 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                            <Filter className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest bg-white/[0.02]">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {caregivers.map((caregiver: any, idx: number) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={caregiver.id}
                                        className="hover:bg-white/[0.03] transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                                                    {caregiver.profile?.firstName?.charAt(0) || 'C'}{caregiver.profile?.lastName?.charAt(0) || ''}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{caregiver.profile?.firstName} {caregiver.profile?.lastName}</p>
                                                    <p className="text-xs text-gray-500">ID: {caregiver.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <Mail className="w-3 h-3" />
                                                    {caregiver.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {caregiver.profile?.isVerified ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                                                    <CheckCircle className="w-3 h-3" /> Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                                                    <XCircle className="w-3 h-3" /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400">
                                            {new Date(caregiver.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!caregiver.profile?.isVerified && (
                                                    <button
                                                        onClick={() => verifyCaregiver(caregiver.id)}
                                                        className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-400 transition-colors"
                                                        title="Verify Caregiver"
                                                    >
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {caregivers.length === 0 && !loading && (
                        <div className="p-12 text-center text-gray-500">
                            No caregivers found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
