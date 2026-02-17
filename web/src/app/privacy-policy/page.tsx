'use client';

import React from 'react';
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-24 selection:bg-blue-500/30">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-16"
            >
                <div className="space-y-6 text-center md:text-left">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Platform
                    </button>
                    <h1 className="text-6xl font-black tracking-tighter italic">Privacy <span className="text-zinc-600">Policy</span></h1>
                    <p className="text-xl text-zinc-400 font-medium italic">Last updated: February 17, 2026</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="glass-card p-8 border-white/5 space-y-4">
                        <Shield className="w-10 h-10 text-blue-500 mb-2" />
                        <h3 className="text-xl font-bold italic">Data Protection</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">We employ military-grade AES-256 encryption to ensure your personal and medical data remains strictly confidential and inaccessible to unauthorized parties.</p>
                    </div>
                    <div className="glass-card p-8 border-white/5 space-y-4">
                        <Lock className="w-10 h-10 text-emerald-500 mb-2" />
                        <h3 className="text-xl font-bold italic">HIPAA Compliance</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">Our platform is designed to meet strict healthcare data regulations, ensuring that all patient-caregiver interactions are handled with the highest level of security.</p>
                    </div>
                </div>

                <div className="space-y-12 text-zinc-300 leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold italic border-l-4 border-blue-500 pl-4">1. Information We Collect</h2>
                        <p>We collect information necessary to provide specialized care services, including:</p>
                        <ul className="list-disc list-inside space-y-2 text-zinc-500 ml-4">
                            <li>Personal identification (Name, Email, Phone)</li>
                            <li>Professional certifications for Caregivers</li>
                            <li>Basic health requirements for Patients</li>
                            <li>Location data for service matching</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold italic border-l-4 border-blue-500 pl-4">2. How We Use Data</h2>
                        <p>Your data is used exclusively to facilitate caregiving services. We DO NOT sell your data to third parties. Data is utilized for:</p>
                        <ul className="list-disc list-inside space-y-2 text-zinc-500 ml-4">
                            <li>Account authentication and security</li>
                            <li>Matching patients with qualified caregivers</li>
                            <li>Processing service requests and scheduling</li>
                            <li>Platform improvement and analytics</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold italic border-l-4 border-blue-500 pl-4">3. Your Rights</h2>
                        <p>Under GDPR and other privacy laws, you have the right to access, rectify, or request the deletion of your data at any time. To exercise these rights, contact our privacy officer at <span className="text-blue-400 underline cursor-pointer">privacy@truecare.com</span></p>
                    </section>
                </div>

                <div className="pt-16 border-t border-white/10 text-center text-zinc-600 text-xs font-bold tracking-widest uppercase">
                    &copy; 2026 TRUE CARE PLATFORM &bull; WORLD-CLASS PRIVACY STANDARDS
                </div>
            </motion.div>
        </div>
    );
}
