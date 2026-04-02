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
    Brain,
    Check,
    X as CloseIcon,
    Trash2
} from 'lucide-react';
import api from '@/lib/api';
import UserModal from './UserModal';
import ShiftManagementModal from './ShiftManagementModal';
import ClinicalLogModal from './ClinicalLogModal';
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
    const [isClinicalModalOpen, setIsClinicalModalOpen] = useState(false);
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
    const [pendingPayments, setPendingPayments] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const fetchStats = api.get('/admin/stats').catch(e => { console.error('Stats fetch failed', e); return { data: null }; });
                const fetchAnalytics = api.get('/admin/shifts/analytics').catch(e => { console.error('Analytics fetch failed', e); return { data: {} }; });
                const fetchLogs = api.get('/admin/activity/log').catch(e => { console.error('Logs fetch failed', e); return { data: [] }; });
                const fetchUsers = api.get('/admin/users').catch(e => { console.error('Users fetch failed', e); return { data: [] }; });
                const fetchOps = api.get('/admin/shifts/analytics').catch(e => { console.error('Live Ops fetch failed', e); return { data: [] }; });
                const fetchInsights = api.get('/admin/insights').catch(e => { console.error('Insights fetch failed', e); return { data: null }; });
                const fetchPayments = api.get('/admin/payments/pending').catch(e => { console.error('Pending Payments fetch failed', e); return { data: [] }; });

                const [statsRes, analyticsRes, logsRes, usersRes, liveOpsRes, insightsRes, paymentsRes] = await Promise.all([
                    fetchStats, fetchAnalytics, fetchLogs, fetchUsers, fetchOps, fetchInsights, fetchPayments
                ]);

                setStats(statsRes.data);
                setLogs(logsRes.data);
                setLiveOps(liveOpsRes.data || []);
                setInsights(insightsRes.data);
                setPendingPayments(paymentsRes.data || []);

                setPatients(usersRes.data.filter((u: any) => u.role === 'PATIENT'));
                setCaregivers(usersRes.data.filter((u: any) => u.role === 'CAREGIVER'));

                // Format analytics data
                const formattedChartData = Object.entries(analyticsRes.data || {}).map(([date, count]) => ({
                    date: date.split('-').slice(1).join('/'),
                    shifts: count
                })).sort((a: any, b: any) => a.date.localeCompare(b.date));

                setChartData(formattedChartData);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleRequestPayment = async (patient: any) => {
        const amount = prompt(`Enter amount for ${patient.profile?.firstName} ${patient.profile?.lastName} to pay:`, "1500");
        if (!amount || isNaN(Number(amount))) return;

        const method = confirm('Send I&M Bank payment instructions via Share?') ? 'IM' : 'STK';

        if (method === 'IM') {
            try {
                await api.post('/admin/payments/manual-request', {
                    userId: patient.id,
                    amount: Number(amount),
                    reference: `REQ-${Date.now().toString().slice(-5)}`
                });
                
                const message = `Hello ${patient.profile?.firstName}, please pay KSh ${Number(amount).toLocaleString()} to I&M Paybill: 05508876433050, Account: 542 542. Thank you!`;
                if (navigator.share) {
                    await navigator.share({ title: 'Payment Request', text: message });
                } else {
                    window.open(`https://wa.me/${patient.profile?.phone?.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
                }
            } catch (error) {
                alert('Failed to initiate I&M request');
            }
        } else {
            const phoneNumber = prompt(`Confirm M-Pesa Number for ${patient.profile?.firstName}: (format: 254...)`, patient.profile?.phone || "254");
            if (!phoneNumber) return;

            try {
                await api.post('/payments/admin/stk-push', {
                    userId: patient.id,
                    amount: Number(amount),
                    phoneNumber
                });
                alert('Administrative STK Push Command Transmitted. Payment prompt sent to patient.');
            } catch (error) {
                console.error('Payment request failed', error);
                alert('CRITICAL: Payment Command Failure');
            }
        }
    };

    const handleShareOnboarding = async (patient: any) => {
        const amount = Number(patient.profile?.balance || 0).toLocaleString();
        const message = `💰 *TRUE-CARE PAYMENT REQUIRED*\n\nTo proceed for ${patient.profile?.firstName}, please pay the Commitment Fee:\n\n🏦 Paybill: 05508876433050\n💼 Account No: 542 542\n💳 Amount: KSh ${amount}`;
        
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'TRUE-CARE ACCESS GRANTED',
                    text: message
                });
            } else {
                window.open(`https://wa.me/${patient.profile?.phone?.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
            }
        } catch (e) {
            console.error('Share failed', e);
            // Fallback for desktop: copy to clipboard
            navigator.clipboard.writeText(message);
            alert('Access credentials copied to clipboard.');
        }
    };

    const handleConfirmPayment = async (paymentId: string) => {
        if (!confirm('Confirm you have received these funds in the I&M Bank account? This action updates the patient balance instantly.')) return;
        try {
            await api.post(`/admin/payments/${paymentId}/confirm`);
            setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
            alert('Payment Verified Successfully.');
        } catch (error) {
            alert('Verification failed.');
        }
    };

    const handleRejectPayment = async (paymentId: string) => {
        if (!confirm('REJECT AND PURGE this payment entry? This should only be done if the receipt is invalid or mistakenly entered.')) return;
        try {
            await api.delete(`/admin/payments/${paymentId}`);
            setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
            alert('Payment Entry Purged.');
        } catch (error) {
            alert('Purge failed.');
        }
    };

    const handleCancelShift = async (shiftId: string) => {
        const reason = prompt('Reason for Termination?', 'Administrative Request');
        if (!reason) return;
        if (!confirm('TERMINATE THIS DEPLOYMENT? This action is recorded in the tactical logs.')) return;
        try {
            await api.post(`/admin/shifts/${shiftId}/cancel`, { reason });
            alert('Deployment Terminated Successfully.');
            window.location.reload();
        } catch (error) {
            alert('Termination failed. Command rejected by system.');
        }
    };

    const handleSystemReset = async () => {
        const secretCode = prompt('DANGER: This will delete ALL users (except admins), shifts, and records. Type "RESET ALL" to confirm.');
        if (secretCode !== 'RESET ALL') return;
        
        try {
            await api.post('/admin/system/reset');
            alert('SYSTEM REINITIALIZED. ALL NODES PURGED.');
            window.location.reload();
        } catch (error) {
            alert('Reset protocol failed. Safety lockout active.');
        }
    };

    const togglePremium = async (patient: any) => {
        const newStatus = !patient.profile?.isPremium;
        if (!confirm(`Switch ${patient.profile?.firstName} to ${newStatus ? 'PREMIUM' : 'BASIC'} mode?`)) return;

        try {
            await api.put(`/admin/users/${patient.id}/premium`, { isPremium: newStatus });
            alert(`User access vector reconfigured: ${newStatus ? 'PREMIUM' : 'BASIC'}`);
            window.location.reload();
        } catch (error) {
            console.error('Failed to toggle premium', error);
            alert('CRITICAL: Access Switch Failure');
        }
    };

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
                <div className="flex-1" />
                <button
                    onClick={handleSystemReset}
                    className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-50 transition-all active:scale-95 shadow-sm"
                >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Reset System
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
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Condition</p>
                                                <span className="text-xs font-bold text-slate-900">{patient.profile?.ailment || 'Observation'}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Balance Due</p>
                                                <span className="text-sm font-black text-slate-900">KSh {Number(patient.profile?.balance || 0).toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => togglePremium(patient)}
                                                        className={`px-4 py-2 ${patient.profile?.isPremium ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'} text-[10px] font-bold uppercase rounded-lg hover:shadow-md transition-all shadow-sm`}
                                                    >
                                                        {patient.profile?.isPremium ? 'Premium Active' : 'Set Premium'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestPayment(patient)}
                                                        className="px-4 py-2 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-lg hover:bg-emerald-200 transition-all shadow-sm"
                                                    >
                                                        Request Payment
                                                    </button>
                                                    <button
                                                        onClick={() => handleShareOnboarding(patient)}
                                                        className="px-4 py-2 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-lg hover:bg-blue-200 transition-all shadow-sm"
                                                        title="Share Access Details"
                                                    >
                                                        Share
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedPatient(patient); setIsAssigning(true); }}
                                                        className="px-4 py-2 bg-slate-800 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-teal-600 transition-all shadow-sm"
                                                    >
                                                        Smart Assign
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm('⚠️ PERMANENTLY PURGE this account? This action is irreversible and will erase all associated shifts and payments.')) {
                                                                await api.delete(`/admin/users/${patient.id}`);
                                                                setPatients(prev => prev.filter(p => p.id !== patient.id));
                                                            }
                                                        }}
                                                        className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                                                        title="Force Purge Account (Irreversible)"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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
                        <h4 className="font-bold text-teal-700 uppercase tracking-widest text-[10px] mb-8 pl-1">Live Personnel Oversight</h4>
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
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => { setSelectedShift(op); setIsClinicalModalOpen(true); }}
                                            className="p-2 text-slate-400 hover:text-amber-600 transition-colors bg-white border border-slate-200 rounded-lg hover:border-amber-100 shadow-sm"
                                            title="Document Clinicals"
                                        >
                                            <Stethoscope className="w-4 h-4" />
                                        </button>
                                        <div className="text-right ml-4">
                                            <p className="text-[10px] font-black text-slate-900 uppercase">
                                                {op.caregiver?.profile?.lastLatitude ? `${op.caregiver.profile.lastLatitude.toFixed(2)}, ${op.caregiver.profile.lastLongitude.toFixed(2)}` : 'Signal Lost'}
                                            </p>
                                            <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                                {op.caregiver?.profile?.locationUpdatedAt ? new Date(op.caregiver.profile.locationUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                            </p>
                                        </div>
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
                        {/* ... existing feed ... */}
                    </div>

                    {/* Bank Transfer Verification */}
                    <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl text-white">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h4 className="font-black text-teal-400 uppercase tracking-[0.2em] text-[10px] mb-1">Bank Receipt Center</h4>
                                <h3 className="text-xl font-bold">Pending I&M Verifications</h3>
                            </div>
                            <div className="bg-teal-500/10 text-teal-400 px-4 py-2 rounded-2xl text-[10px] font-black border border-teal-500/20">
                                {pendingPayments.length} ACTION REQUIRED
                            </div>
                        </div>
                        <div className="space-y-4">
                            {pendingPayments.length > 0 ? pendingPayments.map((p) => (
                                <div key={p.id} className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-3xl group hover:bg-white/10 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-black">
                                            {p.user?.profile?.lastName?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{p.user?.profile?.firstName} {p.user?.profile?.lastName}</p>
                                            <p className="text-[10px] font-black text-teal-500/60 uppercase tracking-widest">KSh {p.amount.toLocaleString()} • Ref: {p.transactionId}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleConfirmPayment(p.id)}
                                            className="w-10 h-10 rounded-xl bg-teal-500 text-slate-900 flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-teal-500/20"
                                            title="Confirm Manual Payment Receipt"
                                        >
                                            <Check className="w-5 h-5" strokeWidth={3} />
                                        </button>
                                        <button
                                            onClick={() => handleRejectPayment(p.id)}
                                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 hover:text-rose-500 transition-colors"
                                            title="Reject & Purge Payment Request"
                                        >
                                            <CloseIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-10 text-center opacity-30 text-xs font-bold uppercase tracking-widest">No Pending Bank Transfers</div>
                            )}
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

            {/* Admin Clinical Entry Modal */}
            {selectedShift && (
                <ClinicalLogModal
                    isOpen={isClinicalModalOpen}
                    onClose={() => { setIsClinicalModalOpen(false); setSelectedShift(null); }}
                    shift={selectedShift}
                    onSuccess={() => window.location.reload()}
                />
            )}
            {/* Status Footer */}
            <div className="pt-10 flex items-center justify-between opacity-30">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">TRUE CARE Tactical Command • Node.Admin</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">System Ver: 1.0.7-Alpha</p>
            </div>
        </div>
    );
}
