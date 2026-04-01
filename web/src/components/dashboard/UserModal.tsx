'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Phone, MapPin, Briefcase, Activity, Plus, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    role: 'PATIENT' | 'CAREGIVER';
}

export default function UserModal({ isOpen, onClose, onSuccess, role }: UserModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        ailment: '',
        experienceYears: '',
        address: '',
        initialAmount: '1500' // Default initial fee
    });

    const handleShare = async (u: any, amount: string) => {
        const message = `Hello ${u.profile?.firstName}, welcome to TRUE-CARE. Your account has been initialized. Please complete your registration by paying the initial service fee of KSh ${amount} to I&M Paybill: 05508876433050, Account: 542 542. Once paid, please reply with your confirmation for instant activation. Thank you!`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'TRUE-CARE Payment Instructions',
                    text: message,
                });
            } catch (err) {
                console.log('Share failed, copying to clipboard');
                navigator.clipboard.writeText(message);
            }
        } else {
            const whatsappUrl = `https://wa.me/${u.profile?.phone?.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/admin/users', {
                ...formData,
                role,
                experienceYears: role === 'CAREGIVER' ? Number(formData.experienceYears) : undefined
            });

            if (role === 'PATIENT') {
                try {
                    // Record the manual payment request in the system
                    await api.post('/admin/payments/manual-request', {
                        userId: res.data.id,
                        amount: formData.initialAmount,
                        reference: `INIT-${res.data.id.slice(0, 5)}`
                    });
                } catch (paymentErr: any) {
                    console.error('User created, but payment request failed:', paymentErr);
                    // We don't throw here so the user creation is still considered a success in the UI
                }
                
                try {
                    await handleShare(res.data, formData.initialAmount);
                } catch (shareErr) {
                    console.error('WhatsApp triggering failed:', shareErr);
                }
            }

            onSuccess();
            onClose();
            setFormData({
                email: '', password: '', firstName: '', lastName: '',
                phone: '', ailment: '', experienceYears: '', address: '',
                initialAmount: '1500'
            });
        } catch (error: any) {
            console.error('Failed to create user', error);
            alert(error.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-slate-900/40">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-[40px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                >
                    {/* Header Banner */}
                    <div className={`p-8 pb-6 border-b border-slate-100 flex items-start justify-between relative overflow-hidden ${role === 'PATIENT' ? 'bg-teal-50' : 'bg-slate-50'}`}>
                        {/* Decorative background icon */}
                        <div className="absolute right-0 top-0 opacity-5 w-64 h-64 -mt-16 -mr-16 pointer-events-none">
                            {role === 'PATIENT' ? <Activity className="w-full h-full text-teal-900" /> : <ShieldCheck className="w-full h-full text-slate-900" />}
                        </div>
                        
                        <div className="relative z-10 flex gap-5 items-center">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${role === 'PATIENT' ? 'bg-white border-teal-100 text-teal-600' : 'bg-white border-slate-200 text-slate-700'}`}>
                                {role === 'PATIENT' ? <User className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
                            </div>
                            <div className="space-y-1 py-1">
                                {/* Removed problematic tracking-tighter/italic to prevent text clipping */}
                                <h2 className="text-3xl font-black tracking-tight uppercase text-slate-900">
                                    {role === 'PATIENT' ? 'New Patient' : 'Verify Professional'}
                                </h2>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                    System Node Onboarding
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-700 font-bold transition-colors flex items-center justify-center relative z-10 shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <form id="user-onboarding-form" onSubmit={handleSubmit} className="space-y-10 max-w-2xl mx-auto">
                            
                            {/* Section: Credentials */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <Lock className="w-4 h-4 text-slate-400" />
                                    <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Credentials Vector</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                            <input
                                                required type="email" placeholder="user@truecare.com"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/10 transition-all font-bold shadow-sm"
                                                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Initial Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                            <input
                                                required type="password" placeholder="••••••••"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/10 transition-all font-bold shadow-sm"
                                                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Biological Data */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Biological Data</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">First Name</label>
                                        <input
                                            required placeholder="Jane"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/10 transition-all font-bold shadow-sm"
                                            value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Last Name</label>
                                        <input
                                            required placeholder="Doe"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/10 transition-all font-bold shadow-sm"
                                            value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Contact Phone</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                            <input
                                                required placeholder="+254 700 000000"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/10 transition-all font-bold shadow-sm"
                                                value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Physical Address</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                            <input
                                                required placeholder="Nairobi Primary Vector"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/10 transition-all font-bold shadow-sm"
                                                value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Clinical/Professional Profile */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <Activity className="w-4 h-4 text-slate-400" />
                                    <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">{role === 'PATIENT' ? 'Clinical Profile' : 'Professional Profile'}</h4>
                                </div>
                                
                                {role === 'PATIENT' ? (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Primary Ailment / Condition</label>
                                            <div className="relative group">
                                                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                                <input
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/10 transition-all font-bold shadow-sm"
                                                    placeholder="Post-operative observation, Mobility Support..."
                                                    value={formData.ailment} onChange={(e) => setFormData({ ...formData, ailment: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Initial Registration Fee (KSh)</label>
                                            <div className="relative group">
                                                <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                                <input
                                                    type="number"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/10 transition-all font-bold shadow-sm"
                                                    placeholder="1500"
                                                    value={formData.initialAmount} onChange={(e) => setFormData({ ...formData, initialAmount: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Verified Practical Experience</label>
                                        <div className="relative group">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                            <input
                                                type="number"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/10 transition-all font-bold shadow-sm"
                                                placeholder="Years (e.g., 5)"
                                                value={formData.experienceYears} onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 pl-2">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Protocol Alpha-9 Secure
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="px-6 py-3 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="user-onboarding-form"
                                disabled={loading}
                                className={`px-8 py-3 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${role === 'PATIENT' ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20' : 'bg-slate-800 hover:bg-slate-900 shadow-slate-900/20'}`}
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Confirm System Entry
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
