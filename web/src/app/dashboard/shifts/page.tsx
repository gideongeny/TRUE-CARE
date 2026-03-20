'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    User,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    Plus,
    Activity,
    X,
    ChevronRight,
    Briefcase,
    DollarSign
} from 'lucide-react';
import api from '@/lib/api';

export default function ShiftsPage() {
    const [shifts, setShifts] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [caregivers, setCaregivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        patientId: '',
        caregiverId: '',
        startTime: '',
        endTime: '',
        notes: '',
        earnings: '0'
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [shiftsRes, usersRes] = await Promise.all([
                api.get('/shifts'),
                api.get('/admin/users')
            ]);
            setShifts(shiftsRes.data);
            setPatients(usersRes.data.filter((u: any) => u.role === 'PATIENT'));
            setCaregivers(usersRes.data.filter((u: any) => u.role === 'CAREGIVER'));
        } catch (err) {
            console.error('Failed to fetch initial data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateShift = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/shifts', formData);
            setIsCreateModalOpen(false);
            fetchInitialData();
            setFormData({
                patientId: '',
                caregiverId: '',
                startTime: '',
                endTime: '',
                notes: '',
                earnings: '0'
            });
        } catch (err) {
            console.error('Failed to create shift', err);
            alert('Allocation Failure: Check parameters');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteShift = async (id: string) => {
        if (!confirm('Are you sure you want to terminate this shift vector?')) return;
        try {
            await api.delete(`/shifts/${id}`);
            fetchInitialData();
        } catch (err) {
            console.error('Failed to delete shift', err);
        }
    };

    const handleUpdatePayment = async (id: string) => {
        const amount = prompt('Enter payment magnitude (KES):');
        if (!amount) return;
        try {
            await api.patch(`/shifts/${id}/payment`, { earnings: amount });
            fetchInitialData();
        } catch (err) {
            console.error('Failed to update payment', err);
        }
    };

    if (loading) return <div className="p-24 text-center text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Accessing Shift Temporal Matrix...</div>;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tight">Shift Vector Control</h1>
                        <p className="text-slate-500 text-xs mt-3 font-bold uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            Clinical Resource Deployment
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-8 py-4 bg-white hover:bg-blue-600 text-slate-950 hover:text-white rounded-2xl flex items-center gap-4 text-xs font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Assign Clinical Task
                    </button>
                </div>

                {/* Shifts Table */}
                <div className="bg-slate-950 border border-slate-900 rounded-[40px] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-900">
                                    <th className="px-8 py-6">Clinical Personnel</th>
                                    <th className="px-8 py-6">Patient Vector</th>
                                    <th className="px-8 py-6">Temporal Window</th>
                                    <th className="px-8 py-6">Operational Status</th>
                                    <th className="px-8 py-6 text-right">Logic</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900">
                                {shifts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-32 text-center">
                                            <p className="text-slate-700 font-black uppercase tracking-widest text-xs">No active shift vectors detected.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    shifts.map((shift: any, idx: number) => (
                                        <motion.tr
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={shift.id}
                                            className="hover:bg-slate-900/30 transition-all group cursor-pointer"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-black text-xs shadow-xl">
                                                        {shift.caregiver?.profile?.firstName?.charAt(0)}{shift.caregiver?.profile?.lastName?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white uppercase tracking-tight text-sm group-hover:text-blue-500 transition-colors">
                                                            {shift.caregiver?.profile?.firstName} {shift.caregiver?.profile?.lastName}
                                                        </p>
                                                        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Caregiver Node</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <User className="w-4 h-4 text-slate-700" />
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">{shift.patient?.profile?.firstName} {shift.patient?.profile?.lastName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-[10px] font-black uppercase tracking-widest space-y-1">
                                                    <div className="flex items-center gap-2 text-slate-300">
                                                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                                        {new Date(shift.startTime).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        <span>/</span>
                                                        {new Date(shift.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border ${shift.status === 'IN_PROGRESS' ? 'bg-blue-600/10 text-blue-500 border-blue-500/20 animate-pulse' :
                                                    shift.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                        'bg-slate-800/20 text-slate-600 border-slate-800'
                                                    }`}>
                                                    {shift.status === 'IN_PROGRESS' && <Activity className="w-3 h-3" />}
                                                    {shift.status}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => handleUpdatePayment(shift.id)}
                                                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-emerald-500 transition-all"
                                                        title="Set Payment"
                                                    >
                                                        <DollarSign className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteShift(shift.id)}
                                                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-rose-500 transition-all"
                                                        title="Terminate Shift"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Create Shift Modal Backdrop */}
                <AnimatePresence>
                    {isCreateModalOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsCreateModalOpen(false)}
                                className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100]"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-slate-950 border border-slate-900 rounded-[60px] p-12 z-[101] shadow-[0_0_100px_-20px_rgba(59,130,246,0.3)] shadow-blue-500/20"
                            >
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Assign Deployment</h2>
                                        <p className="text-slate-500 text-[10px] font-black tracking-widest mt-2 uppercase">Input clinical task parameters</p>
                                    </div>
                                    <button onClick={() => setIsCreateModalOpen(false)} className="p-4 hover:bg-slate-900 rounded-full text-slate-500 transition-all">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleCreateShift} className="space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4">Patient Target</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                                                <select
                                                    required
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-blue-500/50 outline-none appearance-none font-bold"
                                                    value={formData.patientId}
                                                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                                >
                                                    <option value="">Select Patient Node</option>
                                                    {patients.map(p => (
                                                        <option key={p.id} value={p.id}>{p.profile?.firstName} {p.profile?.lastName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4">Caregiver Asset</label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                                                <select
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-blue-500/50 outline-none appearance-none font-bold"
                                                    value={formData.caregiverId}
                                                    onChange={(e) => setFormData({ ...formData, caregiverId: e.target.value })}
                                                >
                                                    <option value="">Open Listing (Unassigned)</option>
                                                    {caregivers.map(c => (
                                                        <option key={c.id} value={c.id}>{c.profile?.firstName} {c.profile?.lastName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4">Temporal Start</label>
                                            <input
                                                required
                                                type="datetime-local"
                                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-sm text-white focus:border-blue-500/50 outline-none font-bold [color-scheme:dark]"
                                                value={formData.startTime}
                                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4">Temporal End</label>
                                            <input
                                                required
                                                type="datetime-local"
                                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-sm text-white focus:border-blue-500/50 outline-none font-bold [color-scheme:dark]"
                                                value={formData.endTime}
                                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4">Financial Magnitude (KES)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                                            <input
                                                type="number"
                                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-blue-500/50 outline-none font-bold"
                                                placeholder="Earnings for this shift..."
                                                value={formData.earnings}
                                                onChange={(e) => setFormData({ ...formData, earnings: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-3xl text-white text-xs font-black uppercase tracking-[0.3em] transition-all shadow-2xl shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50"
                                    >
                                        {loading ? 'Processing Node...' : <>Submit Vector Assignment <ChevronRight className="w-5 h-5" /></>}
                                    </button>
                                </form>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
