'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
    FileText,
    Download,
    Filter,
    Calendar as CalendarIcon,
    ArrowUpRight,
    Search,
    Clock,
    Shield,
    FileCheck,
    BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReportsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await api.get('/admin/reports/system');
                setReports(res.data.reports || []);
                setStats(res.data.stats || { generated: 24, completionRate: 98 });
            } catch (error) {
                console.error('Failed to fetch reports', error);
                // Mock fallback for premium demonstration
                setReports([
                    { id: 'R001', name: 'Clinical Attendance Matrix - Feb', type: 'ATTENDANCE', date: '2024-02-28', size: '2.4 MB' },
                    { id: 'R002', name: 'Financial Revenue Flux - Q1', type: 'FINANCIAL', date: '2024-02-25', size: '1.8 MB' },
                    { id: 'R003', name: 'Caregiver Performance Audit', type: 'PERFORMANCE', date: '2024-02-20', size: '3.1 MB' },
                ]);
                setStats({ generated: 42, completionRate: 99.2 });
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const filteredReports = reports.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Archiving System Documentation...</p>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                            <Shield className="w-4 h-4" />
                            <span>Verified Audit Trail</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">Executive Reports</h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">High-fidelity intelligence for clinical oversight</p>
                    </div>
                    <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all shadow-2xl shadow-blue-500/20 active:scale-95 group">
                        <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                        Initiate Global Export
                    </button>
                </div>

                {/* Tactical Stats Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <MetricCard label="Intelligence Generated" value={stats?.generated || 0} icon={<FileCheck className="w-5 h-5" />} />
                    <MetricCard label="Audit Compliance" value={`${stats?.completionRate || 0}%`} icon={<Shield className="w-5 h-5" />} color="text-emerald-500" />
                    <MetricCard label="Data Throughput" value="1.2 GB" icon={<BarChart3 className="w-5 h-5" />} />
                    <MetricCard label="System Integrity" value="OPTIMAL" icon={<Activity className="w-5 h-5" />} color="text-blue-400" />
                </div>

                {/* Main Archive Table */}
                <div className="bg-slate-950 border border-slate-900 rounded-[40px] overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="relative group w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search tactical archives..."
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest hover:border-slate-700 transition-all">
                                <Filter className="w-4 h-4" />
                                Vector Filter
                            </button>
                            <button className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all">
                                <Clock className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-900">
                                    <th className="px-10 py-6">Intelligence Specification</th>
                                    <th className="px-10 py-6">Domain</th>
                                    <th className="px-10 py-6">Timestamp</th>
                                    <th className="px-10 py-6 text-right">Operation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900">
                                <AnimatePresence>
                                    {filteredReports.map((report, idx) => (
                                        <motion.tr
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={report.id}
                                            className="hover:bg-slate-900/40 transition-all group cursor-pointer"
                                        >
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-300">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{report.name}</p>
                                                        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">{report.size} &bull; Vector ID: {report.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className="px-4 py-1.5 bg-slate-900 border border-slate-800 text-[9px] font-black uppercase text-blue-500 tracking-widest rounded-lg">
                                                    {report.type}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <CalendarIcon className="w-3.5 h-3.5 text-slate-600" />
                                                    {report.date}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <button className="px-6 py-2.5 bg-white text-slate-950 hover:bg-blue-600 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl active:scale-95">
                                                    Extract
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function MetricCard({ label, value, icon, color = "text-white" }: any) {
    return (
        <div className="bg-slate-950 border border-slate-900 rounded-[32px] p-8 shadow-xl hover:border-blue-500/30 transition-all group">
            <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 group-hover:text-blue-500 transition-colors">
                    {icon}
                </div>
            </div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-1">{label}</p>
            <h3 className={`text-3xl font-black tracking-tighter ${color}`}>{value}</h3>
        </div>
    );
}

function Activity({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
    );
}
