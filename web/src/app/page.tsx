'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    Activity,
    Calendar,
    ArrowRight,
    Clock,
    Zap,
    CheckCircle2,
    Lock
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
    const features = [
        {
            title: "Autonomous Integrity",
            desc: "Self-healing verification queues with 99.8% node reliability.",
            icon: Shield,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Predictive Analytics",
            desc: "Real-time system vitals and growth trajectories powered by live data.",
            icon: Activity,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            title: "Precision Scheduling",
            desc: "Dynamic temporal synchronization for seamless deployment intervals.",
            icon: Calendar,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        }
    ];

    return (
        <div className="min-h-screen mesh-gradient selection:bg-blue-600/10">
            {/* Minimalist Navigation */}
            <nav className="h-24 flex items-center justify-between px-8 md:px-16 relative z-50">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="TrueCare Logo" className="h-8 w-auto" />
                    <span className="font-black text-slate-900 tracking-tighter text-xl">TRUE CARE</span>
                </div>
                <div className="flex items-center gap-8">
                    <Link href="/login" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
                        Network Access
                    </Link>
                    <Link href="/login" className="btn-primary">
                        Initialize
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-8 py-20 md:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full">
                            <Zap className="w-3 h-3 text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Enterprise Protocol v2.4</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                            Home Care <br />
                            <span className="text-blue-600 text-glow italic">Redefined.</span>
                        </h1>

                        <p className="text-lg text-slate-500 font-medium max-w-lg leading-relaxed">
                            The world&apos;s most advanced caregiver management ecosystem. Secure, real-time, and built for unprecedented operational efficiency.
                        </p>

                        <div className="flex items-center gap-6 pt-4">
                            <Link href="/login" className="btn-primary flex items-center gap-3 py-4 text-sm scale-110">
                                Enter Command Center
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">
                                    +5k
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Animated Dashboard Teaser */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    >
                        <div className="glass-card rounded-[40px] p-8 aspect-square relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Mock Vitals */}
                            <div className="space-y-6 relative h-full flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">System Pulse</h4>
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/50 border border-white p-4 rounded-2xl shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Network Load</p>
                                        <p className="text-2xl font-black text-slate-900">92.4%</p>
                                    </div>
                                    <div className="bg-slate-900 border border-slate-900 p-4 rounded-2xl shadow-xl">
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-2">Active Nodes</p>
                                        <p className="text-2xl font-black text-white">1,208</p>
                                    </div>
                                </div>

                                <div className="flex-1 flex items-end">
                                    <div className="w-full bg-white/60 backdrop-blur rounded-2xl p-4 border border-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-900 tracking-tight">Deployment Window</p>
                                                <p className="text-[11px] font-bold text-slate-500">Scheduled for 09:30 AM</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badges */}
                        <div className="absolute -top-10 -right-10 glass-card p-4 rounded-2xl shadow-2xl animate-bounce duration-[3000ms]">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="text-xs font-black text-slate-900">SOC2 COMPLIANT</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-8 py-32 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            className="space-y-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className={`w-12 h-12 ${f.bg} rounded-2xl flex items-center justify-center`}>
                                <f.icon className={`w-6 h-6 ${f.color}`} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">{f.title}</h3>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed italic">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="TrueCare Logo" className="h-6 w-auto grayscale" />
                        <span className="font-black text-slate-400 tracking-tighter text-sm uppercase">Secure Infrastructure</span>
                    </div>
                    <div className="flex gap-10">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Privacy Protocol</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Terminal Docs</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">&copy; 2026 TC.AI</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
