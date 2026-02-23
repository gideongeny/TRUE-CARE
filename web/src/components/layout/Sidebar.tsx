'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

export default function Sidebar() {
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
        <aside className="w-[var(--sidebar-width)] h-screen bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] flex flex-col shrink-0 sticky top-0 z-40">
            <div className="h-20 flex items-center shrink-0 px-6 border-b border-[var(--sidebar-border)]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <span className="text-white font-black text-xs">TC</span>
                    </div>
                    <span className="font-extrabold text-slate-900 tracking-tight text-lg">TRUE CARE</span>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
                {filteredMenu.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                            `}>
                                <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                {item.label}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[var(--sidebar-border)] shrink-0">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-all text-sm font-medium group"
                >
                    <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
