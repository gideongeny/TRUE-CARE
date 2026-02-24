'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
    Search,
    ShieldCheck,
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
                const listRes = await api.get('/users');
                const coreTeamNames = ['John Githinji', 'Melsa Wanjiru', 'Francis Kangethe'];
                const filtered = listRes.data.filter((u: any) =>
                    u.role === 'CAREGIVER' &&
                    coreTeamNames.some(name => `${u.profile?.firstName} ${u.profile?.lastName}`.toLowerCase().includes(name.toLowerCase()))
                );
                setCaregivers(filtered);
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
                                            <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xs">
                                                {cg.profile?.firstName?.[0]}{cg.profile?.lastName?.[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{cg.profile?.firstName} {cg.profile?.lastName}</p>
                                                <p className="text-[11px] text-slate-500 font-medium">Verified Personnel</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
                                                <Mail className="w-3 h-3 text-slate-400" />
                                                {cg.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                <Briefcase className="w-3 h-3" />
                                                {cg.profile?.firstName?.includes('John') ? 'Night Shift (8P-8A)' : 'Day Shift (8A-8P)'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${cg.profile?.isVerified ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                }`}
                                        >
                                            <ShieldCheck className="w-3 h-3" />
                                            {cg.profile?.isVerified ? 'Verified' : 'Screening'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${cg.profile?.firstName?.includes('Melsa') || cg.profile?.firstName?.includes('John') ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${cg.profile?.firstName?.includes('Melsa') || cg.profile?.firstName?.includes('John') ? 'text-blue-600' : 'text-slate-400'}`}>
                                                {cg.profile?.firstName?.includes('Melsa') || cg.profile?.firstName?.includes('John') ? 'On Shift' : 'Available'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Link
                                            href={`/dashboard/caregivers/${cg.id}`}
                                            className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-slate-900/10"
                                        >
                                            View Performance
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
