'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
    ShieldCheck,
    UserCheck,
    AlertTriangle,
    Lock,
    Search,
    ChevronRight,
    ExternalLink,
    ShieldAlert,
    Clock,
    UserCircle,
    CheckCircle2,
    XCircle,
    DollarSign,
    FileText,
    Stethoscope,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function VerificationPage() {
    const [userRole, setUserRole] = useState<string>('');
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [verificationDocs, setVerificationDocs] = useState<any[]>([]);

    const fetchData = async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role);
        try {
            if (user.role === 'ADMIN') {
                const res = await api.get('/admin/verification/queue');
                setQueue(res.data || []);
            } else if (user.role === 'CAREGIVER') {
                const res = await api.get('/auth/me'); // Get verification docs from profile
                setVerificationDocs(res.data?.profile?.verificationDocs || []);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await api.post(`/admin/verification/approve/${id}`);
            toast.success('Caregiver identity verified.');
            fetchData();
        } catch (error) {
            toast.error('Approval failed.');
        }
    };

    const handleUploadDoc = async (type: string) => {
        // Mock upload for now until we have a real storage bucket
        alert(`Uploading ${type}... In v2.0, this links to your cloud storage.`);
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-reveal">
                <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Identity & Trust</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Professional Onboarding</h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                    {userRole === 'ADMIN' ? 'Review personnel credentials' : 'Complete your professional profile verification'}
                </p>
            </div>

            {userRole === 'ADMIN' ? (
                <div className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <div className="relative w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search personnel files..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-black text-slate-900 placeholder-slate-400 outline-none focus:ring-4 focus:ring-blue-600/10 transition-all uppercase tracking-widest"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {queue.filter(c => `${c.profile?.firstName} ${c.profile?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                            <div key={item.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600 font-black">
                                        {item.profile?.firstName?.[0]}{item.profile?.lastName?.[0]}
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-slate-900 uppercase tracking-tight">
                                            {item.profile?.firstName} {item.profile?.lastName}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${item.profile?.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {item.profile?.isVerified ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>
                                    {(!item.profile?.isVerified) && (
                                        <button
                                            onClick={() => handleApprove(item.id)}
                                            className="btn-primary py-3 px-6 text-[10px]"
                                        >
                                            Verify Identity
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="glass-card rounded-[32px] p-8 space-y-6">
                            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                Required Documentation
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { id: 'NATIONAL_ID', label: 'Government Issued ID', icon: ShieldCheck },
                                    { id: 'MEDICAL_LICENSE', label: 'Clinical Practitioner License', icon: Stethoscope },
                                    { id: 'CERTIFICATION', label: 'Specialized Nursing Certificate', icon: CheckCircle2 },
                                    { id: 'BACKGROUND_CHECK', label: 'Police Clearance (Good Conduct)', icon: ShieldAlert }
                                ].map(doc => {
                                    const isUploaded = verificationDocs.some(d => d.type === doc.id);
                                    return (
                                        <div key={doc.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isUploaded ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                                    }`}>
                                                    <doc.icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-widest text-slate-700">{doc.label}</span>
                                            </div>
                                            {isUploaded ? (
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleUploadDoc(doc.id)}
                                                    className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest underline underline-offset-4"
                                                >
                                                    Upload
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="stats-card bg-emerald-600 text-white border-none p-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60">Verification Status</h3>
                                <p className="text-2xl font-black tracking-tight mt-1 uppercase">
                                    {verificationDocs.length === 4 ? 'Fully Verified' : 'In Progress'}
                                </p>
                            </div>
                            <CheckCircle2 className="w-10 h-10 opacity-40 shrink-0" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass-card rounded-[32px] p-8">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                                <Lock className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Why Verify?</h3>
                            <p className="text-slate-500 font-medium text-sm mt-4 leading-relaxed">
                                Professional verification is required to access the high-care marketplace and receive premium patient assignments.
                                Verified caregivers earn up to **40% more** on the TRUE-CARE network.
                            </p>
                        </div>

                        <div className="glass-card rounded-[32px] p-8 border-l-4 border-l-amber-500 bg-amber-50/30">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3" />
                                Processing Notice
                            </h4>
                            <p className="text-xs font-bold text-slate-700 mt-2 leading-relaxed">
                                Our trust team reviews all documents within 24-48 hours. Ensure all scans are clear and valid.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </DashboardLayout>
    );
}
