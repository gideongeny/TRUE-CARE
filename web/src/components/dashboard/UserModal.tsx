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
        address: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/admin/users', {
                ...formData,
                role,
                experienceYears: role === 'CAREGIVER' ? Number(formData.experienceYears) : undefined
            });
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phone: '',
                ailment: '',
                experienceYears: '',
                address: ''
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
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
                >
                    {/* Sidebar / Visual Accents */}
                    <div className="w-full md:w-1/3 bg-gradient-to-b from-blue-600 to-indigo-700 p-10 flex flex-col justify-between text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            {role === 'PATIENT' ? <Activity className="w-32 h-32" /> : <ShieldCheck className="w-32 h-32" />}
                        </div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                {role === 'PATIENT' ? <User className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
                                {role === 'PATIENT' ? 'New Patient' : 'Verify Professional'}
                            </h2>
                            <p className="text-blue-100/60 text-[10px] font-black uppercase tracking-widest mt-4">
                                System Node Onboarding
                            </p>
                        </div>

                        <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                            Protocol Alpha-9 Secure
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="flex-1 p-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Credentials Vector</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                required
                                                type="email"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-xs text-white outline-none focus:border-blue-500/40 transition-all font-bold"
                                                placeholder="user@truecare.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Initial Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                required
                                                type="password"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-xs text-white outline-none focus:border-blue-500/40 transition-all font-bold"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Biological Data</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-xs text-white outline-none focus:border-blue-500/40 transition-all font-bold"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                    <input
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-xs text-white outline-none focus:border-blue-500/40 transition-all font-bold"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            required
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-xs text-white outline-none focus:border-blue-500/40 transition-all font-bold"
                                            placeholder="Contact Phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            required
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-xs text-white outline-none focus:border-blue-500/40 transition-all font-bold"
                                            placeholder="Physical Address"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{role === 'PATIENT' ? 'Clinical Profile' : 'Professional Profile'}</h4>
                                {role === 'PATIENT' ? (
                                    <div className="relative group">
                                        <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-xs text-white outline-none focus:border-blue-500/40 transition-all font-bold"
                                            placeholder="Primary Ailment / Condition"
                                            value={formData.ailment}
                                            onChange={(e) => setFormData({ ...formData, ailment: e.target.value })}
                                        />
                                    </div>
                                ) : (
                                    <div className="relative group">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="number"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-xs text-white outline-none focus:border-blue-500/40 transition-all font-bold"
                                            placeholder="Years of Practical Experience"
                                            value={formData.experienceYears}
                                            onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-xs"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Confirm System Entry
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
