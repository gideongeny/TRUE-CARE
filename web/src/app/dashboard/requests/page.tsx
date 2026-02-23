'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
    ClipboardList,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    MapPin,
    Calendar,
    Filter
} from 'lucide-react';

export default function RequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    const fetchRequests = async () => {
        try {
            const res = await api.get('/requests');
            setRequests(res.data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/requests/${id}`, { status });
            fetchRequests(); // Refresh
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const filteredRequests = requests.filter(r => filter === 'ALL' || r.status === filter);

    if (loading) return <div className="p-20 text-center">Initalizing request registry...</div>;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Care Requests Flow</h1>
                        <p className="text-sm text-slate-500 font-medium italic">Monitor incoming demand from patients across all regions.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Filter requests..."
                                className="bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none w-64"
                            />
                        </div>
                        <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                            {['ALL', 'PENDING', 'APPROVED'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                                <th className="px-8 py-5">Patient Prototype</th>
                                <th className="px-8 py-5">Care Specification</th>
                                <th className="px-8 py-5">Deployment Log</th>
                                <th className="px-8 py-5">Status Node</th>
                                <th className="px-8 py-5 text-right">Operational Logic</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredRequests.map((req) => (
                                <tr key={req.id} className="group hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center font-black text-blue-600">
                                                {req.patient?.profile?.firstName[0]}{req.patient?.profile?.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{req.patient?.profile?.firstName} {req.patient?.profile?.lastName}</p>
                                                <p className="text-[11px] text-slate-500 font-medium">{req.patient?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">{req.careType}</p>
                                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 max-w-[200px]">{req.description || 'No description provided.'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col gap-1 text-[11px] font-medium text-slate-600">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                {req.location}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3 h-3 text-slate-400" />
                                                Expires: {new Date(req.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`
                                            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight
                                            ${req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}
                                        `}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            {req.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        {req.status === 'PENDING' ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => updateStatus(req.id, 'REJECTED')}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(req.id, 'APPROVED')}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                                                >
                                                    Approve & Open
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredRequests.length === 0 && (
                        <div className="py-20 text-center opacity-30">
                            <ClipboardList className="w-12 h-12 mx-auto mb-4" />
                            <p className="text-sm font-black uppercase tracking-widest">No requests found in this sector</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
