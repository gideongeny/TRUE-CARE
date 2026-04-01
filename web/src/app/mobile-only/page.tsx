'use client';

import React from 'react';
import { Smartphone, Download, Home, MessageCircle, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MobileOnlyPage() {
    return (
        <div className="min-h-screen mesh-gradient flex items-center justify-center p-8">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full bg-white rounded-[40px] shadow-2xl p-12 text-center space-y-10 border border-slate-100"
            >
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-teal-50 rounded-[32px] flex items-center justify-center border-2 border-teal-100 relative group transition-all hover:scale-105 active:scale-95">
                        <Smartphone className="w-10 h-10 text-teal-600" />
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500 rounded-full border-4 border-white flex items-center justify-center animate-bounce">
                            <HeartPulse className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                        Experience TRUE CARE <br/> on your Mobile Device
                    </h1>
                    <p className="text-slate-500 font-bold leading-relaxed px-4">
                        The Patient & Caregiver portal is exclusively optimized for our specialized Android and iOS applications.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-900 rounded-3xl text-white group cursor-pointer hover:bg-slate-800 transition-all border border-white/5">
                        <Download className="w-6 h-6 text-teal-400 mb-3 group-hover:scale-125 transition-transform" />
                        <p className="text-xs font-black uppercase tracking-widest text-teal-400/60 mb-1">Android Application</p>
                        <p className="text-sm font-bold tracking-tight">Download APK</p>
                    </div>
                    <div className="p-6 bg-white border border-slate-200 rounded-3xl group cursor-pointer hover:border-teal-400 transition-all">
                        <MessageCircle className="w-6 h-6 text-slate-400 mb-3 group-hover:text-teal-600 group-hover:scale-125 transition-all text-slate-400" />
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Support Bot</p>
                        <p className="text-sm font-bold tracking-tight text-slate-900">App Help Guide</p>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex items-center justify-center gap-8">
                    <Link href="/" className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-teal-600 transition-all">
                        <Home className="w-4 h-4" />
                        Return Home
                    </Link>
                    <button 
                        onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }}
                        className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-all"
                    >
                        Switch Account
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
