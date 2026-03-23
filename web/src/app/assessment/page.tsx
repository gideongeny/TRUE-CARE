'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Activity, 
    HeartPulse, 
    Thermometer, 
    Navigation, 
    ShieldCheck, 
    ClipboardCheck,
    CheckCircle2,
    Loader2,
    ArrowLeft
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

export default function AssessmentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const shiftId = searchParams.get('shiftId');
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        services: [] as string[],
        pulse: '',
        temperature: '',
        respiration: '',
        bloodPressure: '',
        nutrition: '',
        elimination: '',
        safety: [] as string[],
        notes: ''
    });

    const servicesList = [
        'Bathing', 'Dressing', 'Meal Preparation', 
        'Laundry', 'Medication Reminder', 'Housekeeping',
        'Transferring', 'Toileting', 'Exercise'
    ];

    const safetyItems = [
        'Call Light in Reach', 'Bed Rails Secure', 
        'Floor Clutter-Free', 'Adequate Lighting',
        'Equipment Safety Check', 'Emergency Plan Reviewed'
    ];

    const toggleItem = (list: string[], item: string, key: 'services' | 'safety') => {
        if (list.includes(item)) {
            setFormData({ ...formData, [key]: list.filter(i => i !== item) });
        } else {
            setFormData({ ...formData, [key]: [...list, item] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shiftId) {
            setError('Missing shift ID. Please access this page from an active shift.');
            return;
        }
        
        setLoading(true);
        setError('');

        try {
            await api.post('/clinical', {
                shiftId,
                content: formData.notes || 'Home Health Assessment Update',
                servicesRendered: formData.services.join(', '),
                pulse: formData.pulse,
                temperature: formData.temperature,
                respiration: formData.respiration,
                bloodPressure: formData.bloodPressure,
                nutritionHydration: formData.nutrition,
                eliminationDetails: formData.elimination,
                safetyEnvironment: formData.safety.join(', ')
            });
            setSuccess(true);
            setTimeout(() => router.back(), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit assessment');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full"
                >
                    <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-teal-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Assessment Logged!</h2>
                    <p className="text-slate-600">The clinical record has been updated successfully. Returning you to the dashboard...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-teal-600 pt-12 pb-24 px-6 md:px-12">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <button 
                            onClick={() => router.back()}
                            className="flex items-center text-teal-100 hover:text-white transition-colors mb-4 group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold text-white mb-2">Home Health Assessment</h1>
                        <p className="text-teal-100 opacity-90">Detailed Clinical Record Update</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                            <ClipboardCheck className="w-10 h-10 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-6 -mt-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Services Rendered */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-teal-50 rounded-lg">
                                <Activity className="w-5 h-5 text-teal-600" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Services Rendered</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {servicesList.map(service => (
                                <label 
                                    key={service}
                                    className={`
                                        flex items-center p-4 rounded-2xl border cursor-pointer transition-all
                                        ${formData.services.includes(service) 
                                            ? 'bg-teal-600 border-teal-600 text-white shadow-md' 
                                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-teal-300'}
                                    `}
                                >
                                    <input 
                                        type="checkbox" 
                                        className="hidden"
                                        checked={formData.services.includes(service)}
                                        onChange={() => toggleItem(formData.services, service, 'services')}
                                    />
                                    <span className="text-sm font-medium">{service}</span>
                                    {formData.services.includes(service) && (
                                        <CheckCircle2 className="w-4 h-4 ml-auto" />
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Vitals Grid */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-rose-50 rounded-lg">
                                <HeartPulse className="w-5 h-5 text-rose-600" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Vital Signs</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Pulse (BPM)</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. 72"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                                    value={formData.pulse}
                                    onChange={e => setFormData({ ...formData, pulse: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Temperature (°C)</label>
                                <div className="relative">
                                    <input 
                                        type="text"
                                        placeholder="e.g. 36.8"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                                        value={formData.temperature}
                                        onChange={e => setFormData({ ...formData, temperature: e.target.value })}
                                    />
                                    <Thermometer className="absolute right-4 top-4 w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Respiration</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. 16"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                                    value={formData.respiration}
                                    onChange={e => setFormData({ ...formData, respiration: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Blood Pressure</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. 120/80"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                                    value={formData.bloodPressure}
                                    onChange={e => setFormData({ ...formData, bloodPressure: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nutrition & Elimination */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Navigation className="w-5 h-5 text-amber-600" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Nutrition & Monitoring</h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Nutrition & Hydration Notes</label>
                                <textarea 
                                    placeholder="Intake summary, hydration levels, appetite..."
                                    rows={3}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                                    value={formData.nutrition}
                                    onChange={e => setFormData({ ...formData, nutrition: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Elimination Details</label>
                                <textarea 
                                    placeholder="Bowel movements, bladder activity..."
                                    rows={3}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                                    value={formData.elimination}
                                    onChange={e => setFormData({ ...formData, elimination: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Safety and Notes */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Safety & Environment</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {safetyItems.map(item => (
                                <label 
                                    key={item}
                                    className={`
                                        flex items-center p-4 rounded-xl border cursor-pointer transition-all
                                        ${formData.safety.includes(item) 
                                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-200'}
                                    `}
                                >
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mr-3"
                                        checked={formData.safety.includes(item)}
                                        onChange={() => toggleItem(formData.safety, item, 'safety')}
                                    />
                                    <span className="text-sm font-medium">{item}</span>
                                </label>
                            ))}
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Observation Notes</h2>
                        <textarea 
                            placeholder="Final clinical observations, concerns, or recommendations..."
                            rows={4}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-center font-medium">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className={`
                            w-full py-5 rounded-2xl shadow-lg transition-all font-bold text-white flex items-center justify-center gap-3
                            ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 active:scale-[0.98] shadow-teal-200 hover:shadow-xl'}
                        `}
                    >
                        {loading && <Loader2 className="w-6 h-6 animate-spin" />}
                        {loading ? 'Submitting to Medical Record...' : 'Submit Assessment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
