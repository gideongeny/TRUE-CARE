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

    const [selectedReport, setSelectedReport] = useState<any>(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await api.get('/admin/reports/system');
                setReports(res.data.reports || []);
                setStats(res.data.stats || { generated: 0, completionRate: 100 });
            } catch (error) {
                console.error('Failed to fetch reports', error);
                setReports([]);
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
            <div className="max-w-7xl mx-auto space-y-10 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
                            <Shield className="w-4 h-4" />
                            <span>Verified Audit Trail</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Executive Reports</h1>
                        <p className="text-slate-500 text-sm font-medium">High-fidelity intelligence for clinical oversight</p>
                    </div>
                    <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center gap-3 text-sm font-bold shadow-lg shadow-teal-600/20 active:scale-95 transition-all group">
                        <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                        Initiate Global Export
                    </button>
                </div>

                {/* Tactical Stats Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard label="Intelligence Generated" value={stats?.generated || 0} icon={<FileCheck className="w-5 h-5" />} />
                    <MetricCard label="Audit Compliance" value={`${stats?.completionRate || 0}%`} icon={<Shield className="w-5 h-5" />} color="text-emerald-600" />
                    <MetricCard label="Data Throughput" value="1.2 GB" icon={<BarChart3 className="w-5 h-5" />} />
                    <MetricCard label="System Integrity" value="OPTIMAL" icon={<Activity className="w-5 h-5" />} color="text-teal-600" />
                </div>

                {/* Main Archive Table */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/50">
                        <div className="relative group w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search tactical archives..."
                                className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-6 py-3 text-sm font-medium focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-widest hover:border-slate-300 transition-all shadow-sm">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                            <button className="p-3 bg-white border border-slate-200 shadow-sm rounded-xl text-slate-400 hover:text-teal-600 transition-all">
                                <Clock className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] border-b border-slate-200">
                                    <th className="px-8 py-5">Intelligence Specification</th>
                                    <th className="px-8 py-5">Domain</th>
                                    <th className="px-8 py-5">Timestamp</th>
                                    <th className="px-8 py-5 text-right">Operation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <AnimatePresence>
                                    {filteredReports.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center">
                                                <p className="text-slate-500 font-bold text-sm">No tactical archives found.</p>
                                            </td>
                                        </tr>
                                    ) : filteredReports.map((report, idx) => (
                                        <motion.tr
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={report.id}
                                            className="hover:bg-slate-50 transition-colors group cursor-pointer"
                                            onClick={() => setSelectedReport(report)}
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center text-teal-600 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-extrabold text-slate-900 group-hover:text-teal-600 transition-colors">{report.name}</p>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{report.size} &bull; ID: {report.id.slice(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-slate-900">{report.caregiver}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">For: {report.patient}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                                                    {report.date}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="px-5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all shadow-sm active:scale-95">
                                                    Inspect
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Report Detail Modal */}
                <AnimatePresence>
                    {selectedReport && (
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
                            >
                                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-teal-600 uppercase tracking-[0.2em]">Full Clinical Disclosure</p>
                                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{selectedReport.name}</h3>
                                    </div>
                                    <button
                                        onClick={() => setSelectedReport(null)}
                                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all shadow-sm"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Assigned Caregiver</p>
                                            <p className="text-sm font-extrabold text-slate-900">{selectedReport.caregiver}</p>
                                        </div>
                                        <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Target Patient</p>
                                            <p className="text-sm font-extrabold text-slate-900">{selectedReport.patient}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[11px] font-bold text-teal-600 uppercase tracking-widest flex items-center gap-2">
                                            <FileText className="w-3.5 h-3.5" />
                                            Observation Notes
                                        </p>
                                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 text-sm leading-relaxed italic">
                                            "{selectedReport.content}"
                                        </div>
                                    </div>

                                    {selectedReport.vitals && (
                                        <div className="space-y-3">
                                            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" />
                                                Vital Matrix Observations
                                            </p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {Object.entries(typeof selectedReport.vitals === 'string' ? JSON.parse(selectedReport.vitals) : selectedReport.vitals).map(([key, value]: any) => (
                                                    <div key={key} className="px-5 py-3 bg-white rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase">{key}</span>
                                                        <span className="text-xs font-extrabold text-slate-900">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 bg-slate-50 border-t border-slate-100">
                                    <button
                                        onClick={() => window.print()}
                                        className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-teal-600 transition-all shadow-md active:scale-95"
                                    >
                                        Generate Hard Copy Archive
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}

function MetricCard({ label, value, icon, color = "text-slate-900" }: any) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-teal-300 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 group-hover:text-teal-600 group-hover:bg-teal-50 group-hover:border-teal-100 transition-colors">
                    {icon}
                </div>
            </div>
            <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1">{label}</p>
            <h3 className={`text-2xl font-extrabold tracking-tight ${color}`}>{value}</h3>
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
