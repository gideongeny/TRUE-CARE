'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { isAuthenticated } from '@/lib/api';
import { User, Bell, Search, Menu, Settings, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = '/';
            return;
        }
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    if (!user) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="h-screen w-screen bg-black text-white flex overflow-hidden font-sans selection:bg-white/20 selection:text-white">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[15000ms]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10 w-full">
                <div className="p-6 md:p-8 lg:p-10 w-full max-w-[1600px] mx-auto">
                    {/* Top Header */}
                    <header className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-6">
                            <button
                                className="lg:hidden p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
                                onClick={() => setSidebarOpen(!isSidebarOpen)}
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div className="relative hidden md:flex items-center group">
                                <Search className="absolute left-4 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    className="bg-zinc-900/50 border border-white/[0.05] rounded-2xl pl-12 pr-6 py-4 w-96 outline-none focus:border-white/10 focus:bg-zinc-900 transition-all text-sm font-medium placeholder-zinc-700"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-6 md:gap-8">
                            <div className="flex items-center gap-4">
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-all text-zinc-500 hover:text-white">
                                    <Bell className="w-5 h-5" />
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-all text-zinc-500 hover:text-white">
                                    <Settings className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="h-8 w-[1px] bg-white/[0.1] hidden sm:block" />

                            <button className="flex items-center gap-4 pl-2 group">
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                                        {user.role} Account
                                    </p>
                                </div>
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all shadow-lg overflow-hidden relative">
                                    <User className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors relative z-10" />
                                </div>
                            </button>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pb-12"
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
