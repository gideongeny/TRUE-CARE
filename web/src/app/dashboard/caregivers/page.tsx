'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
    Search,
    ShieldCheck,
    Mail,
    Phone,
    Briefcase,
    FileText,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import Link from 'next/link';

export default function CaregiversListPage() {
    const [caregivers, setCaregivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PENDING'>('ACTIVE');

    const fetchCaregivers = async () => {
        setLoading(true);
        try {
            const listRes = await api.get('/users');
            const filtered = listRes.data.filter((u: any) => u.role === 'CAREGIVER');
            setCaregivers(filtered);
        } catch (error) {
            console.error('Failed to fetch caregivers', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCaregivers();
    }, []);

    const handleApproval = async (id: string, approve: boolean) => {
        try {
            // Placeholder for approval logic
            // await api.put(`/admin/caregivers/${id}/approve`, { approved: approve });
            alert(approve ? 'Caregiver Approved' : 'Caregiver Rejected');
            fetchCaregivers();
        } catch (error) {
            console.error('Action failed', error);
        }
    };

    const displayedCaregivers = caregivers.filter(cg =>
        activeTab === 'ACTIVE' ? cg.profile?.isVerified : !cg.profile?.isVerified
    );

    if (loading) return <div className="p-20 text-center text-slate-400 font-bold tracking-widest uppercase text-xs animate-pulse">Synchronizing Registry...</div>;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">Professional Registry</h1>
                        <p className="text-sm text-slate-500 font-medium mt-2">Manage the clinical verified personnel network.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search personnel..."
                                className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500/20 outline-none w-64 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800">
                    <button
                        onClick={() => setActiveTab('ACTIVE')}
                        className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ACTIVE' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Active Network
                    </button>
                    <button
                        onClick={() => setActiveTab('PENDING')}
                        className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'PENDING' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Pending Approvals
                        {caregivers.filter(cg => !cg.profile?.isVerified).length > 0 && (
                            <span className="ml-2 bg-blue-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">
                                {caregivers.filter(cg => !cg.profile?.isVerified).length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                                <th className="px-8 py-6">Clinical Prototype</th>
                                <th className="px-8 py-6">Credentials & Experience</th>
                                <th className="px-8 py-6">Verification Node</th>
                                <th className="px-8 py-6 text-right">Dispatch Logic</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900">
                            {displayedCaregivers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">No personnel records found in this vector.</p>
                                    </td>
                                </tr>
                            ) : (
                                displayedCaregivers.map((cg) => (
                                    <tr key={cg.id} className="group hover:bg-slate-900/30 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-xl">
                                                    {cg.profile?.firstName?.[0]}{cg.profile?.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{cg.profile?.firstName} {cg.profile?.lastName}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Mail className="w-3 h-3 text-slate-600" />
                                                        <p className="text-[10px] text-slate-500 font-bold lowercase">{cg.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                    <Briefcase className="w-3 h-3 text-blue-500" />
                                                    {cg.profile?.experienceYears || 0} Years Exp
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                    <FileText className="w-3 h-3 text-slate-600" />
                                                    ID: {cg.profile?.idNumber || 'UNSET'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {activeTab === 'ACTIVE' ? (
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                    <ShieldCheck className="w-3 h-3" />
                                                    Verified Clinical
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                    <Clock className="w-3 h-3" />
                                                    Compliance Review
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {activeTab === 'ACTIVE' ? (
                                                <Link
                                                    href={`/dashboard/caregivers/${cg.id}`}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-blue-500 hover:text-white text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl active:scale-95"
                                                >
                                                    Inspect Node
                                                </Link>
                                            ) : (
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => handleApproval(cg.id, false)}
                                                        className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                        title="Reject Credentials"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleApproval(cg.id, true)}
                                                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        Approve Professional
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
