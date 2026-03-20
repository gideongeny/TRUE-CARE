'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    HeartPulse,
    CalendarCheck,
    Users,
    ArrowRight,
    Clock,
    ShieldCheck,
    Stethoscope,
    Activity
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
    const features = [
        {
            title: "Trusted Care Professionals",
            desc: "Highly vetted, compassionate caregivers ready to provide world-class support for your loved ones.",
            icon: Users,
            color: "text-teal-600",
            bg: "bg-teal-50"
        },
        {
            title: "Real-time Health Monitoring",
            desc: "Stay connected with live clinical logs, vital tracking, and daily caregiver reports straight to your phone.",
            icon: HeartPulse,
            color: "text-rose-500",
            bg: "bg-rose-50"
        },
        {
            title: "Seamless Shift Scheduling",
            desc: "Effortlessly coordinate care schedules, manage payments, and handle everything in one secure platform.",
            icon: CalendarCheck,
            color: "text-blue-600",
            bg: "bg-blue-50"
        }
    ];

    return (
        <div className="min-h-screen mesh-gradient selection:bg-teal-600/10">
            {/* Minimalist Navigation */}
            <nav className="h-24 flex items-center justify-between px-8 md:px-16 relative z-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                        <HeartPulse className="w-6 h-6 text-rose-500" />
                    </div>
                    <span className="font-extrabold text-slate-900 tracking-tight text-xl">TRUE CARE</span>
                </div>
                <div className="flex items-center gap-8">
                    <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-teal-600 transition-colors">
                        Sign In
                    </Link>
                    <Link href="/register" className="btn-primary">
                        Get Care Today
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
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-bold tracking-wide text-slate-700">Verified & Certified Providers</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 tracking-tight leading-[1]">
                            Compassionate care, <br />
                            <span className="text-teal-600 text-glow">Right at home.</span>
                        </h1>

                        <p className="text-lg text-slate-500 font-medium max-w-lg leading-relaxed">
                            Connecting families with dedicated, world-class caregivers. Experience peace of mind with real-time health updates, secure scheduling, and transparent communication.
                        </p>

                        <div className="flex items-center gap-6 pt-4">
                            <Link href="/login" className="btn-primary flex items-center gap-3 py-4 text-sm scale-110">
                                Access Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <div className="flex -space-x-3 pl-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                        <UserAvatar i={i} />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-4 border-white bg-rose-500 flex items-center justify-center text-xs font-bold text-white z-10 shadow-sm">
                                    4.9★
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Highly Designed Mock Dashboard Teaser */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    >
                        <div className="glass-card rounded-[32px] p-8 aspect-square relative overflow-hidden group">
                            <div className="absolute inset-0 bg-teal-600/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="space-y-6 relative h-full flex flex-col justify-between">
                                {/* Teaser Header */}
                                <div className="flex items-center justify-between bg-white/60 p-4 rounded-2xl border border-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                                            <Stethoscope className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Sarah Jenkins, RN</h4>
                                            <p className="text-xs text-slate-500">Active Shift • Caring for Eleanor</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                                </div>

                                {/* Vital Signs Mock */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/80 border border-slate-100 p-5 rounded-2xl shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Activity className="w-4 h-4 text-rose-500" />
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Heart Rate</p>
                                        </div>
                                        <p className="text-3xl font-extrabold text-slate-900">72 <span className="text-sm font-normal text-slate-500">bpm</span></p>
                                    </div>
                                    <div className="bg-white/80 border border-slate-100 p-5 rounded-2xl shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ShieldCheck className="w-4 h-4 text-teal-500" />
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blood Pres.</p>
                                        </div>
                                        <p className="text-3xl font-extrabold text-slate-900">120<span className="text-lg text-slate-400">/</span>80</p>
                                    </div>
                                </div>

                                {/* Activity Log Mock */}
                                <div className="flex-1 flex items-end">
                                    <div className="w-full bg-slate-900 rounded-2xl p-5 shadow-xl text-white">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-teal-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold tracking-wide">Medication Administered</p>
                                                <p className="text-xs text-slate-400 mt-1">Logged 5 minutes ago • All vitals stable.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badges */}
                        <div className="absolute -top-6 -right-6 glass-card p-4 rounded-2xl shadow-xl animate-bounce duration-[3000ms] border border-white">
                            <div className="flex items-center gap-2">
                                <HeartPulse className="w-5 h-5 text-rose-500" />
                                <span className="text-xs font-bold text-slate-900">Care connected.</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-8 py-32 border-t border-slate-200/60">
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
                            <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center shadow-sm`}>
                                <f.icon className={`w-7 h-7 ${f.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">{f.title}</h3>
                            <p className="text-base text-slate-500 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-2">
                        <HeartPulse className="w-5 h-5 text-slate-300" />
                        <span className="font-bold text-slate-400 tracking-tight text-sm">TRUE CARE INC.</span>
                    </div>
                    <div className="flex gap-8">
                        <span className="text-xs font-semibold text-slate-400 hover:text-teal-600 transition-colors cursor-pointer">Privacy Policy</span>
                        <span className="text-xs font-semibold text-slate-400 hover:text-teal-600 transition-colors cursor-pointer">Terms of Service</span>
                        <span className="text-xs font-semibold text-slate-400">&copy; 2026 True Care</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Simple avatar placeholder component
function UserAvatar({ i }: { i: number }) {
    const colors = ['bg-blue-100 text-blue-600', 'bg-emerald-100 text-emerald-600', 'bg-amber-100 text-amber-600', 'bg-purple-100 text-purple-600'];
    const letters = ['A', 'M', 'R', 'J'];
    return (
        <div className={`w-full h-full flex items-center justify-center text-sm font-black ${colors[i-1]}`}>
            {letters[i-1]}
        </div>
    );
}
