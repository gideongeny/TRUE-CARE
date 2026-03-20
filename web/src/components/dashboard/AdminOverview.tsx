'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Users,
    Calendar,
    Activity,
    Clock,
    TrendingUp,
    ShieldCheck,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    UserPlus,
    Stethoscope,
    MoreVertical,
    Zap,
    Sparkles,
    Brain
} from 'lucide-react';
import api from '@/lib/api';
import UserModal from './UserModal';
import ShiftManagementModal from './ShiftManagementModal';
import AIPredictiveInsights from './AIPredictiveInsights';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function AdminOverview() {
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [caregivers, setCaregivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [isAssigning, setIsAssigning] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [modalRole, setModalRole] = useState<'PATIENT' | 'CAREGIVER'>('PATIENT');
    const [liveOps, setLiveOps] = useState<any[]>([]);
    const [selectedShift, setSelectedShift] = useState<any>(null);
    const [insights, setInsights] = useState<any>(null);
    const [isInsightsOpen, setIsInsightsOpen] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, analyticsRes, logsRes, usersRes, liveOpsRes, insightsRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/analytics/shifts'),
                    api.get('/admin/logs'),
                    api.get('/admin/users'),
                    api.get('/admin/operations/live'),
                    api.get('/admin/insights')
                ]);

                setStats(statsRes.data);
                setLogs(logsRes.data);
                setLiveOps(liveOpsRes.data || []);
                setInsights(insightsRes.data);

                setPatients(usersRes.data.filter((u: any) => u.role === 'PATIENT'));
                setCaregivers(usersRes.data.filter((u: any) => u.role === 'CAREGIVER'));

                // Format analytics data for Recharts
                const formattedChartData = Object.entries(analyticsRes.data).map(([date, count]) => ({
                    date: date.split('-').slice(1).join('/'),
                    shifts: count
                })).sort((a, b) => a.date.localeCompare(b.date));

                setChartData(formattedChartData);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleAssign = async (caregiverId: string) => {
        try {
            await api.post('/shifts', {
                caregiverId,
                patientId: selectedPatient.id,
                startTime: new Date(),
                endTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hour shift
                notes: 'Tactical deployment via Admin Command Center'
            });
            setIsAssigning(false);
            setSelectedPatient(null);
            // Refresh logic
            window.location.reload();
        } catch (error) {
            console.error('Failed to assign caregiver', error);
        }
    };

    const handleImpersonate = async (userId: string) => {
        if (!confirm('Switch to this personnel Access Vector? System will re-authorize as the target subject.')) return;
        try {
            const res = await api.post(`/admin/impersonate/${userId}`);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Impersonation failed', error);
            alert('CRITICAL: Access Vector Switch Failed');
        }
    };

    const cards = [
        { label: 'Total Patients', value: stats?.patientCount || 0, icon: Users, trend: (stats?.patientTrend || 0) >= 0 ? `+${stats?.patientTrend || 0}%` : `${stats?.patientTrend || 0}%`, up: (stats?.patientTrend || 0) >= 0, color: 'text-teal-600', bg: 'bg-teal-50' },
        { label: 'Pending Payouts', value: insights?.pendingPayouts?.amount || 0, icon: TrendingUp, trend: `${insights?.pendingPayouts?.count || 0} Req`, up: true, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Clinical Intensity', value: insights?.clinicalActivity?.last24hLogs || 0, icon: Stethoscope, trend: '24HR', up: true, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Verification Queue', value: insights?.operational?.verificationQueue || 0, icon: ShieldCheck, trend: 'ACTION', up: false, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    if (loading) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">Waking Up Neural Engine...</div>;

    return (
        <div className="space-y-10">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="stats-card group hover:shadow-2xl transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2.5 rounded-xl ${card.bg} border-2 border-white shadow-inner group-hover:scale-110 transition-transform`}>
                                <card.icon className={`w-5 h-5 ${card.color}`} />
                            </div>
                            <div className={`flex items-center text-[10px] font-black px-2.5 py-1 rounded-full ${card.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} border-2 border-white shadow-sm`}>
                                {card.up ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                                {card.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{card.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                                {card.label === 'Pending Payouts' ? `KSh ${card.value.toLocaleString()}` : card.value}
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Admin Controls */}
            <div className="flex flex-wrap items-center gap-4">
                <button
                    onClick={() => setIsInsightsOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-xl shadow-teal-500/20 hover:from-teal-500 hover:to-emerald-500 transition-all active:scale-95 group border border-teal-400/50"
                >
                    <Sparkles className="w-4 h-4 text-emerald-100 group-hover:animate-pulse" />
                    AI Predictive Synthesis
                </button>
                <button
                    onClick={() => { setModalRole('PATIENT'); setIsUserModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg hover:bg-slate-700 transition-all active:scale-95"
                >
                    <UserPlus className="w-4 h-4" />
                    New Patient Entry
                </button>
                <button
                    onClick={() => { setModalRole('CAREGIVER'); setIsUserModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                >
                    <ShieldCheck className="w-4 h-4" />
                    Onboard Professional
                </button>
            </div>

            {/* Clinical Command & Patient Registry */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Clinical Intelligence Image 2 Integration */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Hero Illustration */}
                    <div className="relative h-[280px] w-full rounded-[40px] overflow-hidden group border border-teal-100 shadow-sm bg-teal-50">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-100/50 to-transparent" />
                        <div className="relative z-10 p-12 h-full flex flex-col justify-center">
                            <h4 className="text-teal-900 text-3xl font-extrabold tracking-tight leading-tight max-w-md uppercase">
                                Clinical Deployment <br />
                                <span className="text-teal-600">Care Operations</span>
                            </h4>
                            <p className="text-teal-700/80 text-sm font-bold mt-4 max-w-sm leading-relaxed">
                                Orchestrating {stats?.activeShifts || 0} active deployments across the care network with zero-latency synchronization.
                            </p>
                        </div>
                    </div>

                    {/* Patients Table */}
                    <div className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-sm">
                        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <h4 className="font-black text-slate-900 uppercase tracking-[0.3em] text-xs">Verified Patient Registry</h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <tbody className="divide-y divide-slate-50">
                                    {patients.map((patient) => (
                                        <tr key={patient.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <Link href={`/dashboard/patients/${patient.id}`} className="flex items-center gap-4 group/item">
                                                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold transition-transform group-hover/item:scale-110">
                                                        {patient.profile?.firstName?.[0] ?? '?'}{patient.profile?.lastName?.[0] ?? ''}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 group-hover/item:text-teal-600 transition-colors">{patient.profile?.firstName} {patient.profile?.lastName}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">ID: {patient.id.slice(0, 8)}</p>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{patient.profile?.ailment || 'Observation'}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => { setSelectedPatient(patient); setIsAssigning(true); }}
                                                        className="px-4 py-2 bg-slate-800 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-teal-600 transition-all shadow-sm"
                                                    >
                                                        Smart Assign
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm('Soft-delete this patient record?')) {
                                                                await api.delete(`/admin/users/${patient.id}`);
                                                                setPatients(prev => prev.filter(p => p.id !== patient.id));
                                                            }
                                                        }}
                                                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Activity className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Performance Feed & Personnel Status */}
                <div className="space-y-8">
                    {/* Live Personnel Oversight */}
                    <div className="glass-card border border-teal-100 bg-teal-50/50 rounded-[40px] p-8 text-slate-900 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ShieldCheck className="w-16 h-16 text-teal-600" />
                        </div>
                        <h4 className="font-bold text-teal-700 uppercase tracking-[0.2em] text-[10px] mb-8">Live Personnel Oversight</h4>
                        <div className="space-y-6 relative z-10">
                            {caregivers.slice(0, 3).map((cg) => (
                                <div key={cg.id} className="flex items-center justify-between group">
                                    <Link href={`/dashboard/caregivers/${cg.id}`} className="flex items-center gap-3 group/item">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-[10px] border border-teal-100 text-teal-600 group-hover/item:bg-teal-600 group-hover/item:text-white transition-colors shadow-sm">
                                            {cg.profile?.firstName?.[0]}{cg.profile?.lastName?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold tracking-tight text-slate-900 group-hover/item:text-teal-600 transition-colors">{cg.profile?.firstName} {cg.profile?.lastName}</p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase">Registered Personnel</p>
                                        </div>
                                    </Link>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${cg.profile?.firstName?.includes('Melsa') || cg.profile?.firstName?.includes('John') ? 'bg-teal-500 animate-pulse' : 'bg-slate-300'}`} />
                                            <span className={`text-[9px] font-bold uppercase tracking-widest ${cg.profile?.firstName?.includes('Melsa') || cg.profile?.firstName?.includes('John') ? 'text-teal-600' : 'text-slate-500'}`}>
                                                {cg.profile?.firstName?.includes('Melsa') || cg.profile?.firstName?.includes('John') ? 'Live' : 'Ready'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleImpersonate(cg.id)}
                                            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-teal-600 hover:border-teal-200 hover:shadow-sm transition-all shadow-sm group/btn"
                                            title="Login As Caregiver"
                                        >
                                            <Zap className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Live Operations Tracking */}
                    <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Live Operations Tracking</h4>
                            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase border border-emerald-100 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Real-time Sync
                            </div>
                        </div>
                        <div className="space-y-6">
                            {liveOps.length > 0 ? liveOps.map((op) => (
                                <div key={op.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-teal-200 hover:shadow-sm transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-teal-600 shadow-sm">
                                            {op.caregiver?.profile?.firstName?.[0]}{op.caregiver?.profile?.lastName?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">{op.caregiver?.profile?.firstName} (Caregiver)</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                                <Activity className="w-3 h-3 text-slate-400" /> W: {op.patient?.profile?.lastName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-900 uppercase">
                                            {op.caregiver?.profile?.lastLatitude ? `${op.caregiver.profile.lastLatitude.toFixed(2)}, ${op.caregiver.profile.lastLongitude.toFixed(2)}` : 'Signal Lost'}
                                        </p>
                                        <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                            {op.caregiver?.profile?.locationUpdatedAt ? new Date(op.caregiver.profile.locationUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-10 text-center opacity-20 italic font-medium text-xs">No Active Operational Signals</div>
                            )}
                        </div>
                    </div>

                    {/* Recent Deployment Feed */}
                    <div className="bg-white border border-slate-200 rounded-[40px] p-8">
                        <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Active Deployment Feed</h4>
                        <div className="space-y-6">
                            {liveOps.slice(0, 5).map((shift) => (
                                <div key={shift.id} className="flex items-center justify-between group border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                                    <div className="flex gap-4">
                                        <div className="w-2 h-2 bg-teal-500 rounded-full mt-1 shrink-0" />
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-900 uppercase leading-tight">Patient: {shift.patient?.profile?.lastName}</p>
                                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-widest">Personnel: {shift.caregiver?.profile?.firstName} {shift.caregiver?.profile?.lastName}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedShift(shift)}
                                        className="p-2 text-slate-400 hover:text-teal-600 transition-colors bg-slate-50 rounded-lg hover:bg-teal-50"
                                        title="Manage Shift"
                                    >
                                        <Calendar className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignment Modal */}
            {isAssigning && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Assign Caregiver: {selectedPatient?.profile?.lastName}</h3>
                            <button onClick={() => setIsAssigning(false)} className="text-slate-400 hover:text-slate-900 font-bold">CLOSE</button>
                        </div>
                        <div className="p-8 space-y-4 max-h-[400px] overflow-y-auto">
                            {caregivers.map(cg => (
                                <div
                                    key={cg.id}
                                    onClick={() => handleAssign(cg.id)}
                                    className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-teal-50 hover:border-teal-200 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                            {cg.profile?.firstName?.[0] ?? '?'}{cg.profile?.lastName?.[0] ?? ''}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 uppercase">{cg.profile?.firstName} {cg.profile?.lastName}</p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase">Verified Personnel</p>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Global User Onboarding Modal */}
            <UserModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                onSuccess={() => window.location.reload()}
                role={modalRole}
            />

            {/* Shift Management / Reassignment Modal */}
            {selectedShift && (
                <ShiftManagementModal
                    shift={selectedShift}
                    onClose={() => setSelectedShift(null)}
                    onSuccess={() => {
                        setSelectedShift(null);
                        window.location.reload();
                    }}
                />
            )}

            {/* AI Insights Modal */}
            <AIPredictiveInsights 
                isOpen={isInsightsOpen}
                onClose={() => setIsInsightsOpen(false)}
            />
        </div>
    );
}
