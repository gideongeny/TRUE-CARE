'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    LogOut,
    ClipboardList,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { logout } from '@/lib/api';
import Logo from '../ui/Logo';

const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: Calendar, label: 'Shifts', href: '/dashboard/shifts' },
    { icon: ClipboardList, label: 'Requests', href: '/dashboard/requests' },
    { icon: Users, label: 'Caregivers', href: '/dashboard/caregivers' },
    { icon: Users, label: 'Patients', href: '/dashboard/patients' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-[280px] h-screen p-6 hidden lg:flex flex-col relative z-50"
        >
            <div className="flex-1 flex flex-col bg-zinc-900/40 backdrop-blur-xl border border-white/[0.05] rounded-[32px] p-6 shadow-2xl overflow-hidden relative">
                {/* Ambient Glow */}
                <div className="absolute top-0 left-0 w-full h-32 bg-blue-500/10 blur-[60px] pointer-events-none" />

                <div className="mb-10 pl-2 relative z-10">
                    <Logo className="w-20" />
                </div>

                <nav className="flex-1 space-y-2 relative z-10">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className="relative group">
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <div className={`relative px-4 py-3.5 flex items-center justify-between rounded-xl transition-all duration-200 ${isActive ? 'text-black' : 'text-zinc-500 hover:text-white hover:bg-white/[0.05]'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                            <span className={`text-sm font-bold tracking-wide ${isActive ? 'font-extrabold' : ''}`}>
                                                {item.label}
                                            </span>
                                        </div>
                                        {isActive && <ChevronRight className="w-4 h-4 text-black/50" />}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-white/[0.05] relative z-10">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm tracking-wide">Sign Out</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
