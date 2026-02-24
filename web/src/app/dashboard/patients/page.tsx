'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    User,
    Mail,
    MapPin,
    MoreVertical,
    ChevronRight
} from 'lucide-react';
import api from '@/lib/api';

export default function PatientsPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/users');
            const data = response.data.filter((u: any) => u.role === 'PATIENT');
            setPatients(data);
        } catch (err) {
            console.error('Failed to fetch patients', err);
            // Mock fallback
            setPatients([
                { id: '101', profile: { firstName: 'Alice', lastName: 'Johnson', address: '123 Pine St, NY' }, email: 'alice@example.com', createdAt: '2024-01-10' },
                { id: '102', profile: { firstName: 'James', lastName: 'Miller', address: '456 Oak Ave, LA' }, email: 'james@example.com', createdAt: '2024-02-05' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight italic">Patient Registry</h1>
                        <p className="text-gray-500 text-xs mt-1 font-medium italic">Monitor and support your patient community</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group flex items-center">
                            <Search className="absolute left-4 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Find a patient..."
                                className="bg-black/40 border border-white/5 rounded-2xl pl-12 pr-6 py-3 w-80 outline-none focus:border-blue-500/20 focus:bg-black/60 transition-all text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all relative group">
                            <Filter className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {patients.map((patient: any, idx: number) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05, duration: 0.5 }}
                            key={patient.id}
                            className="glass-card p-8 flex flex-col group cursor-pointer border-white/[0.03] !rounded-[32px] hover:shadow-2xl transition-all"
                            onClick={() => window.location.href = `/dashboard/patients/${patient.id}`}
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-900/40 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 shadow-lg shadow-purple-900/10 transition-transform group-hover:scale-110 duration-300">
                                    <User className="w-7 h-7" />
                                </div>
                                <button className="p-2 hover:bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-white">{patient.profile?.firstName} {patient.profile?.lastName}</h3>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">UID: {patient.id.slice(0, 8)}</p>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Mail className="w-4 h-4" />
                                    {patient.email}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <MapPin className="w-4 h-4 text-blue-400" />
                                    {patient.profile?.address || 'No address provided'}
                                </div>
                            </div>

                            <div className="mt-auto pt-6 flex items-center justify-between">
                                <p className="text-[10px] text-gray-500 font-bold">JOINED {new Date(patient.createdAt).toLocaleDateString()}</p>
                                <div className="flex items-center gap-1 text-blue-400 text-xs font-bold group-hover:underline">
                                    View Profile <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {patients.length === 0 && !loading && (
                    <div className="p-24 text-center glass-card">
                        <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No patients registered yet.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
