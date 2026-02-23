'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { isAuthenticated } from '@/lib/api';
import { User, Bell, Search, Menu, Settings } from 'lucide-react';

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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="h-screen w-screen bg-slate-50 text-slate-900 flex overflow-hidden font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10 w-full ml-[var(--sidebar-width)]">
                <div className="w-full">
                    {/* Top Header */}
                    <header className="h-20 flex items-center justify-between bg-white border-b border-slate-200 px-8 sticky top-0 z-30">
                        <div className="flex items-center gap-6">
                            <button
                                className="lg:hidden p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                                onClick={() => setSidebarOpen(!isSidebarOpen)}
                            >
                                <Menu className="w-5 h-5 text-slate-600" />
                            </button>
                            <div className="relative hidden md:flex items-center group">
                                <Search className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search command..."
                                    className="bg-slate-50 border border-slate-200 rounded-lg pl-11 pr-4 py-2 w-80 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-all text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-200">
                                <Bell className="w-5 h-5" />
                            </button>

                            <div className="h-8 w-[1px] bg-slate-200 mx-2" />

                            <button className="flex items-center gap-3 pl-2 group">
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-semibold text-slate-900 leading-none">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-tight">
                                        {user.role}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            </button>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <main className="p-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
