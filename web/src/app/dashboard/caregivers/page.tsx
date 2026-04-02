'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
    Search,
    ShieldCheck,
    Mail,
    Briefcase,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    UserPlus,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import UserModal from '@/components/dashboard/UserModal';

export default function CaregiversListPage() {
    const [caregivers, setCaregivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PENDING'>('ACTIVE');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCaregivers = async () => {
        setLoading(true);
        try {
            const listRes = await api.get('/admin/users');
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
            if (approve) {
                await api.post(`/admin/verification/approve/${id}`);
            } else {
                await api.post(`/admin/verification/reject/${id}`);
            }
            fetchCaregivers();
        } catch (error) {
            console.error('Action failed', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Permanently remove this professional from the registry?')) {
            try {
                await api.delete(`/admin/users/${id}`);
                setCaregivers(prev => prev.filter(c => c.id !== id));
            } catch (error) {
                console.error('Deletion failed', error);
            }
        }
    };

    const filteredCaregivers = caregivers.filter(cg => {
        const matchesTab = activeTab === 'ACTIVE' ? cg.profile?.isVerified : !cg.profile?.isVerified;
        const matchesSearch = `${cg.profile?.firstName} ${cg.profile?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cg.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    if (loading) return <div className="p-20 text-center text-slate-400 font-bold tracking-widest uppercase text-xs animate-pulse">Synchronizing Registry...</div>;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Professional Registry</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">Manage the verified clinical personnel network.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search personnel..."
                                className="bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none w-72 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-lg shadow-teal-600/20 rounded-xl transition-all active:scale-95"
                        >
                            <UserPlus className="w-4 h-4" />
                            Onboard
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('ACTIVE')}
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'ACTIVE' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Active Network
                    </button>
                    <button
                        onClick={() => setActiveTab('PENDING')}
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'PENDING' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Pending Approvals
                        {caregivers.filter(cg => !cg.profile?.isVerified).length > 0 && (
                            <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                {caregivers.filter(cg => !cg.profile?.isVerified).length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <th className="px-8 py-4">Professional Identity</th>
                                <th className="px-8 py-4">Credentials & Experience</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCaregivers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-24 text-center">
                                        <p className="text-slate-500 font-bold text-sm">No personnel records found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredCaregivers.map((cg) => (
                                    <tr key={cg.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="px-8 py-5">
                                            <Link href={`/dashboard/caregivers/${cg.id}`} className="group/card flex items-center gap-4 cursor-pointer">
                                                <div className="w-12 h-12 bg-teal-50 border border-teal-100 text-teal-600 rounded-2xl flex items-center justify-center font-bold text-base shadow-sm group-hover/card:bg-teal-600 group-hover/card:text-white transition-all">
                                                    {cg.profile?.firstName?.[0]}{cg.profile?.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-extrabold text-slate-900 group-hover/card:text-teal-600 transition-colors">{cg.profile?.firstName} {cg.profile?.lastName}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <Mail className="w-3 h-3 text-slate-400" />
                                                        <p className="text-[11px] text-slate-500 font-medium">{cg.email}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                                                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                                                    {cg.profile?.experienceYears || 0} Years Exp
                                                </div>
                                                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                                                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                                                    ID: {cg.profile?.idNumber || 'UNSET'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            {cg.profile?.isVerified ? (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                                    <ShieldCheck className="w-3.5 h-3.5" />
                                                    Verified
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-100 text-amber-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Pending
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {activeTab === 'ACTIVE' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleDelete(cg.id)}
                                                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                            title="Delete Personnel"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                        <Link
                                                            href={`/dashboard/caregivers/${cg.id}`}
                                                            className="inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95"
                                                        >
                                                            Inspect
                                                        </Link>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleApproval(cg.id, false)}
                                                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                            title="Reject Credentials"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleApproval(cg.id, true)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm shadow-teal-500/20 active:scale-95"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                            Verify
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchCaregivers}
                role="CAREGIVER"
            />
        </DashboardLayout>
    );
}

