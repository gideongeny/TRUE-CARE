'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, Clock, Shield, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/users/meta/notifications');
            setNotifications(res.data);
            setUnreadCount(res.data.filter((n: any) => !n.isRead).length);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/users/meta/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all relative"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)] animate-pulse" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[60]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-80 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl z-[70] overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">System Alerts</h4>
                                <span className="text-[10px] font-black text-blue-500 uppercase">{unreadCount} New</span>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        onClick={() => markAsRead(n.id)}
                                        className={`p-6 border-b border-slate-800/50 flex gap-4 hover:bg-white/5 transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-500/5' : ''}`}
                                    >
                                        <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${n.type === 'FINANCE' ? 'bg-emerald-500/10 text-emerald-500' :
                                                n.type === 'SHIFT' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-slate-500/10 text-slate-400'
                                            }`}>
                                            {n.type === 'FINANCE' ? <Clock className="w-4 h-4" /> :
                                                n.type === 'SHIFT' ? <Shield className="w-4 h-4" /> :
                                                    <AlertCircle className="w-4 h-4" />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-black text-white leading-tight uppercase tracking-tight">{n.title}</p>
                                            <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">{n.message}</p>
                                            <p className="text-[8px] font-black text-slate-700 uppercase">{new Date(n.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-12 text-center">
                                        <Bell className="w-8 h-8 text-slate-800 mx-auto mb-4 opacity-20" />
                                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">No Alerts Detected</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-slate-950/50 text-center">
                                <button className="text-[9px] font-black text-slate-500 uppercase hover:text-white transition-colors tracking-widest">
                                    Clear All Buffers
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
