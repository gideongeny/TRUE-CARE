'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { isAuthenticated } from '@/lib/api';
import { User, Bell, Search, Menu, Settings } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = '/';
            return;
        }
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));

        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    if (!user) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
            {/* Sidebar is now a direct flex child */}
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto scroll-smooth">
                {/* Top Header */}
                <header className="h-20 shrink-0 flex items-center justify-between bg-white border-b border-slate-200 px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-6">
                        <button
                            className="lg:hidden p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu className="w-5 h-5 text-slate-600" />
                        </button>
                        <div className="relative hidden xl:flex items-center group">
                            <Search className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search command..."
                                className="bg-slate-50 border border-slate-200 rounded-lg pl-11 pr-4 py-2 w-64 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
                            />
                        </div>

                        {/* Real-time Temporal Awareness */}
                        <div className="hidden md:flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-lg shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 leading-none mb-1">System Time</span>
                                <span className="text-sm font-black text-slate-900 tabular-nums">
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="w-[1px] h-6 bg-slate-200" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Session Date</span>
                                <span className="text-xs font-bold text-slate-600">
                                    {currentTime.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
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

                {/* Main Content Area - Scrollable */}
                <main className="flex-1 p-8 min-h-0">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
