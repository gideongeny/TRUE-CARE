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
    Briefcase
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

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                setUserRole(JSON.parse(user).role);
            } catch (e) {
                console.error('Failed to parse user role');
            }
        }
    }, []);

    const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

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
            <div className="h-20 flex items-center shrink-0 px-8 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
                <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
                    <img src="/logo.png" alt="TrueCare" className="h-7 w-auto" />
                    <span className="font-black text-slate-900 tracking-tighter text-lg">TRUE CARE</span>
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
                                    group flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13px] font-black transition-all duration-300
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 translate-x-1'
                                        : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'}
                                `}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <item.icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                                <span className="uppercase tracking-widest">{item.label}</span>
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

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
