'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
    FileText,
    Download,
    Filter,
    Calendar,
    ArrowUpRight,
    Search,
    Clock
} from 'lucide-react';

export default function ReportsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await api.get('/admin/reports/system');
                setReports(res.data.reports);
                setStats(res.data.stats);
            } catch (error) {
                console.error('Failed to fetch reports', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) return <div className="p-20 text-center font-bold text-slate-400">Archiving System Documentation...</div>;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Reports</h1>
                        <p className="text-sm text-slate-500 font-medium italic">High-fidelity documentation for operational oversight.</p>
                    </div>
                    <button className="btn-primary flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Generate New Report
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="stats-card">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Reports Generated</p>
                        <h3 className="text-2xl font-black text-slate-900 underline decoration-blue-500/30">{stats?.generated || 0}</h3>
                    </div>
                    <div className="stats-card">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Avg Completion</p>
                        <h3 className="text-2xl font-black text-slate-900 underline decoration-emerald-500/30">{stats?.completionRate || 0}%</h3>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Search archives..." className="input-field pl-10 w-64" />
                        </div>
                        <button className="text-slate-500 text-sm font-bold flex items-center gap-2 hover:text-blue-600 transition-colors">
                            <Filter className="w-4 h-4" />
                            Filter by Department
                        </button>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                                <th className="px-8 py-4">Document Specification</th>
                                <th className="px-8 py-4">Category</th>
                                <th className="px-8 py-4">Archived Date</th>
                                <th className="px-8 py-4">Sizing</th>
                                <th className="px-8 py-4 text-right">Logic</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">{report.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="px-2 py-1 bg-slate-100 text-[10px] font-black uppercase text-slate-500 rounded-md">
                                            {report.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-xs font-medium text-slate-500">
                                        {report.date}
                                    </td>
                                    <td className="px-8 py-4 text-xs font-medium text-slate-500">
                                        {report.size}
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase tracking-widest active:scale-95 transition-all">
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
