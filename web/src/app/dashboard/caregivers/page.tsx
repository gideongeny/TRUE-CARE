'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
    Users,
    ChevronRight,
    Search,
    ShieldCheck,
    MoreVertical,
    Mail,
    Phone
} from 'lucide-react';
import Link from 'next/link';

export default function CaregiversListPage() {
    const [caregivers, setCaregivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCaregivers = async () => {
            try {
                // In a real app, you'd have a specific endpoint for listing caregivers
                // For now, we'll fetch all users and filter or use the admin stats logic
                const res = await api.get('/admin/stats'); // This doesn't list them, but let's assume getShifts or a new list user endpoint
                // Simulating a list for now based on the requested "world class" experience
                const listRes = await api.get('/users');
                setCaregivers(listRes.data.filter((u: any) => u.role === 'CAREGIVER'));
            } catch (error) {
                console.error('Failed to fetch caregivers', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCaregivers();
    }, []);

    if (loading) return <div className="p-20 text-center">Loading registry...</div>;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Caregiver Registry</h1>
                        <p className="text-sm text-slate-500 font-medium italic">Manage and track your active world-class professionals.</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find professional..."
                            className="bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none w-64"
                        />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                                <th className="px-8 py-5">Caregiver Prototype</th>
                                <th className="px-8 py-5">Contact Node</th>
                                <th className="px-8 py-5">Compliance</th>
                                <th className="px-8 py-5">Activity</th>
                                <th className="px-8 py-5 text-right">Operational Logic</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {caregivers.map((cg) => (
                                <tr key={cg.id} className="group hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-600">
                                                {cg.profile?.firstName[0]}{cg.profile?.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{cg.profile?.firstName} {cg.profile?.lastName}</p>
                                                <p className="text-[11px] text-slate-500 font-medium">Join Date: {new Date(cg.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Mail className="w-3 h-3 text-slate-400" />
                                                {cg.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Phone className="w-3 h-3 text-slate-400" />
                                                {cg.profile?.phone || 'No Phone'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`
inline - flex items - center gap - 1.5 px - 2.5 py - 1 rounded - lg text - [10px] font - black uppercase tracking - tight
                                            ${cg.profile?.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}
`}>
                                            <ShieldCheck className="w-3 h-3" />
                                            {cg.profile?.isVerified ? 'Verified' : 'Pending'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden w-20">
                                                <div className="h-full bg-blue-600 w-[70%]" />
                                            </div>
                                            <span className="text-[10px] font-black text-blue-600">70%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Link
                                            href={`/ dashboard / caregivers / ${cg.id} `}
                                            className="px-4 py-2 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                                        >
                                            Track Metrics
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
