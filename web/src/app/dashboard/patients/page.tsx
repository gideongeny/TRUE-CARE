'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    User,
    Mail,
    MapPin,
    ChevronRight,
    Lock,
    Unlock,
    Activity,
    Clock,
    Trash2,
    PlusCircle
} from 'lucide-react';
import api from '@/lib/api';
import UserModal from '@/components/dashboard/UserModal';
import CreateRequestModal from '@/components/dashboard/CreateRequestModal';

export default function PatientsPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users');
            const data = response.data.filter((u: any) => u.role === 'PATIENT');
            setPatients(data);
        } catch (err) {
            console.error('Failed to fetch patients', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to permanently delete this clinical record?')) {
            try {
                await api.delete(`/admin/users/${id}`);
                setPatients(prev => prev.filter(p => p.id !== id));
            } catch (err) {
                console.error('Deletion failed', err);
            }
        }
    };

    const filteredPatients = patients.filter(p =>
        `${p.profile?.firstName} ${p.profile?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-24 text-center text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Scanning Bio-Registry...</div>;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Patient Network</h1>
                        <p className="text-slate-500 text-sm mt-2 font-bold flex items-center gap-2">
                            <Activity className="w-4 h-4 text-teal-600" />
                            Active Care Oversight
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search clinical records..."
                                className="bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-3 w-80 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all text-sm font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-2xl shadow-lg shadow-teal-500/20 transition-all active:scale-95 flex items-center gap-2 px-6"
                        >
                            <User className="w-5 h-5" />
                            <span className="text-sm font-bold hidden md:block">Add Patient</span>
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredPatients.map((patient: any, idx: number) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05, duration: 0.4 }}
                                key={patient.id}
                                className="bg-white border border-slate-200 p-8 flex flex-col group cursor-pointer rounded-[40px] hover:border-teal-300 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-500"
                                onClick={() => window.location.href = `/dashboard/patients/${patient.id}`}
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 duration-500 border border-teal-100">
                                        <User className="w-7 h-7" />
                                    </div>

                                    {/* Actions & Status */}
                                    <div className="flex items-start gap-2">
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${patient.profile?.paymentStatus === 'PAID'
                                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                            : 'bg-amber-50 border-amber-100 text-amber-600'
                                            }`}>
                                            {patient.profile?.paymentStatus === 'PAID' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                            {patient.profile?.paymentStatus === 'PAID' ? 'Unlocked' : 'Locked'}
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(patient.id, e)}
                                            className="p-2 bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-200 rounded-xl text-slate-400 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"
                                            title="Delete Record"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedPatient(patient);
                                                setIsRequestModalOpen(true);
                                            }}
                                            className="p-2 bg-teal-600 hover:bg-teal-500 border border-teal-500 rounded-xl text-white transition-all opacity-0 group-hover:opacity-100 shadow-md shadow-teal-500/20"
                                            title="Initiate Care"
                                        >
                                            <PlusCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors tracking-tight">
                                        {patient.profile?.firstName} {patient.profile?.lastName}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {patient.id.slice(0, 8)}</p>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                        <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                                        </div>
                                        {patient.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium leading-relaxed">
                                        <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center border border-teal-100">
                                            <MapPin className="w-3.5 h-3.5 text-teal-600" />
                                        </div>
                                        {patient.profile?.address || 'Location Unknown'}
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Clock className="w-4 h-4" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Added {new Date(patient.createdAt).getFullYear()}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-teal-600 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-500">
                                        View Data <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredPatients.length === 0 && (
                    <div className="py-32 text-center bg-slate-50 border border-slate-200 border-dashed rounded-[40px]">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                            <User className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-bold text-sm">No clinical matches found.</p>
                    </div>
                )}
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchPatients}
                role="PATIENT"
            />

            {selectedPatient && (
                <CreateRequestModal
                    isOpen={isRequestModalOpen}
                    onClose={() => setIsRequestModalOpen(false)}
                    onSuccess={() => alert('Care request initiated successfully')}
                    patientId={selectedPatient.id}
                    patientName={`${selectedPatient.profile?.firstName} ${selectedPatient.profile?.lastName}`}
                />
            )}
        </DashboardLayout>
    );
}
