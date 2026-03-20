'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Logo from '@/components/ui/Logo';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    LogOut,
    ClipboardList,
    TrendingUp,
    FileText,
    ShieldCheck,
    Briefcase,
    Shield,
    Wallet,
    Stethoscope,
    Activity
} from 'lucide-react';
import { logout } from '@/lib/api';

type MenuItem = {
    icon: any;
    label: string;
    href: string;
    roles: string[];
};

const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', roles: ['ADMIN', 'CAREGIVER', 'PATIENT'] },
    { icon: Activity, label: 'Clinical Timeline', href: '/dashboard/clinical', roles: ['ADMIN', 'PATIENT', 'CAREGIVER'] },
    { icon: Wallet, label: 'Financials', href: '/dashboard/finance', roles: ['ADMIN', 'CAREGIVER'] },
    { icon: TrendingUp, label: 'Analytics', href: '/dashboard/analytics', roles: ['ADMIN'] },
    { icon: ClipboardList, label: 'Care Requests', href: '/dashboard/requests', roles: ['ADMIN', 'PATIENT'] },
    { icon: Briefcase, label: 'Marketplace', href: '/dashboard/marketplace', roles: ['CAREGIVER'] },
    { icon: Calendar, label: 'My Schedule', href: '/dashboard/schedule', roles: ['CAREGIVER', 'ADMIN'] },
    { icon: Users, label: 'Caregivers', href: '/dashboard/caregivers', roles: ['ADMIN'] },
    { icon: ShieldCheck, label: 'Verification', href: '/dashboard/verification', roles: ['ADMIN'] },
    { icon: FileText, label: 'Reports', href: '/dashboard/reports', roles: ['ADMIN'] },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings', roles: ['ADMIN', 'CAREGIVER', 'PATIENT'] },
];

type SidebarProps = {
    isOpen?: boolean;
    onClose?: () => void;
};

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [userRole, setUserRole] = useState<string>('PATIENT');
    const [userId, setUserId] = useState<string>('');

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const parsed = JSON.parse(user);
                setUserRole(parsed.role);
                setUserId(parsed.id);
            } catch (e) {
                console.error('Failed to parse user role');
            }
        }
    }, []);

    const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

    // Add "My Bio" if caregiver
    if (userRole === 'CAREGIVER' && userId) {
        filteredMenu.push({
            icon: Users,
            label: 'My Bio',
            href: `/dashboard/caregivers/${userId}`,
            roles: ['CAREGIVER']
        });
    }

    return (
        <aside
            className={`
                w-[var(--sidebar-width)] h-screen mesh-gradient border-r border-slate-100 flex flex-col shrink-0 z-50
                fixed inset-y-0 left-0 transition-transform duration-300 ease-out shadow-2xl shadow-slate-900/5
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:inset-auto
            `}
            aria-label="Sidebar"
        >
            <div className="h-24 flex items-center shrink-0 px-8 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
                <Link href="/dashboard" className="flex items-center gap-4" onClick={onClose}>
                    <img src="/logo.png" alt="TrueCare" className="h-10 w-auto" />
                    <span className="font-black text-slate-900 tracking-tighter text-xl">TRUE CARE</span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto py-8 px-5 space-y-1.5 scrollbar-hide">
                {filteredMenu.map((item, i) => {
                    const isActive = pathname === item.href;
                    return (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={item.href}
                                onClick={onClose}
                                className={`
                                    group flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300
                                    ${isActive
                                        ? 'bg-teal-600 text-white shadow-xl shadow-teal-600/30 translate-x-1'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-teal-700 hover:shadow-sm'}
                                `}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-600'}`} />
                                <span className="tracking-wide">{item.label}</span>
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            {/* Premium Clinical Card */}
            <div className="px-6 mb-4 mt-auto">
                <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-[32px] p-6 overflow-hidden relative group shadow-xl shadow-teal-600/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/30">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Medical Care</p>
                        <p className="text-sm font-extrabold text-white mt-1 leading-tight">Patient Safety & <br />Quality Assurance</p>

                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-teal-600 bg-slate-200 overflow-hidden">
                                        <img src={`/Raquel.png`} alt="Caregiver" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-[10px] font-black text-white px-2 py-0.5 bg-white/20 rounded-md">LIVE</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
                <button
                    onClick={logout}
                    className="flex items-center gap-3.5 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition-all text-xs font-black uppercase tracking-widest border border-transparent hover:border-rose-100 group"
                >
                    <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-transform group-hover:translate-x-1" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
