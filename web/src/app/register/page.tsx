'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Stethoscope,
    ArrowRight,
    ArrowLeft,
    ShieldCheck,
    Upload,
    HeartPulse,
    Activity,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

type Role = 'PATIENT' | 'CAREGIVER';
type Step = 'role' | 'basic' | 'professional' | 'health' | 'success';

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState<Role | null>(null);
    const [step, setStep] = useState<Step>('role');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        idNumber: '', // Image 1 & 5
        address: '', // Image 1 & 5
        dob: '', // Image 2 & 5
        gender: '', // Image 2 & 5
        // Patient specifics (Image 1 & 2)
        departments: [] as string[],
        serviceType: 'Full Time',
        serviceTime: '',
        careLocation: 'My Own Home',
        insuranceNumber: '',
        height: '',
        weight: '',
        ailment: '',
        medicalHistory: '',
        emergencyContact: '',
        // Caregiver specifics (Image 5)
        desiredSalary: '',
        availabilityDetails: { daytime: true, evenings: false, weekends: false },
        carePreference: 'In Home of Client',
        certifications: '',
        bio: '',
        cvUrl: '',
    });

    const handleNext = () => {
        if (step === 'role') setStep('basic');
        else if (step === 'basic') {
            if (role === 'CAREGIVER') setStep('professional');
            else setStep('health');
        }
    };

    const handleBack = () => {
        if (step === 'basic') setStep('role');
        else if (step === 'professional' || step === 'health') setStep('basic');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return; 
        setLoading(true);
        setError('');

        try {
            const signupData = {
                email: formData.email,
                password: formData.password,
                role: role,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                profile: {
                    idNumber: formData.idNumber,
                    address: formData.address,
                    gender: formData.gender,
                    age: formData.dob ? Math.floor((new Date().getTime() - new Date(formData.dob).getTime()) / 31557600000) : undefined,
                    ailment: formData.ailment,
                    medicalHistory: formData.medicalHistory,
                    emergencyContact: formData.emergencyContact,
                    // New healthcare fields
                    insuranceNumber: formData.insuranceNumber,
                    height: formData.height ? parseFloat(formData.height) : undefined,
                    weight: formData.weight ? parseFloat(formData.weight) : undefined,
                    targetDepartments: formData.departments.join(', '),
                    serviceLocation: formData.careLocation,
                    servicePreference: `${formData.serviceType} (${formData.serviceTime})`,
                    desiredSalary: formData.desiredSalary ? parseFloat(formData.desiredSalary) : undefined,
                    availabilityDetails: JSON.stringify(formData.availabilityDetails),
                    certifications: formData.certifications,
                    bio: formData.bio,
                    cvUrl: formData.cvUrl,
                }
            };

            await api.post('/auth/register', signupData);
            setStep('success');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderRoleSelection = () => (
        <div className="space-y-10 py-4">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Join True Care</h2>
                <p className="text-sm text-slate-500 font-medium mt-2">How would you like to use our platform?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    onClick={() => { setRole('PATIENT'); setStep('basic'); }}
                    className={`bg-white p-8 text-left group transition-all rounded-[32px] border-2 shadow-sm ${role === 'PATIENT' ? 'border-teal-500 bg-teal-50/50' : 'border-slate-100 hover:border-teal-200 hover:shadow-md'}`}
                >
                    <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform">
                        <User className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Seeking Care</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2">I am looking for professional, compassionate care for myself or a loved one.</p>
                </button>

                <button
                    onClick={() => { setRole('CAREGIVER'); setStep('basic'); }}
                    className={`bg-white p-8 text-left group transition-all rounded-[32px] border-2 shadow-sm ${role === 'CAREGIVER' ? 'border-teal-500 bg-teal-50/50' : 'border-slate-100 hover:border-teal-200 hover:shadow-md'}`}
                >
                    <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6 group-hover:scale-110 transition-transform">
                        <Stethoscope className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Providing Care</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2">I am a certified medical professional ready to provide world-class care.</p>
                </button>
            </div>
        </div>
    );

    const renderBasicInfo = () => (
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full mb-4 border border-teal-100">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-wide">Secure Setup</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Basic Information</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">First Name</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Last Name</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Email Address</label>
                    <input
                        type="email"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Password</label>
                    <input
                        type="password"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Phone Number</label>
                    <input
                        type="tel"
                        required
                        placeholder="(000) 000-0000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Identification Number</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                        value={formData.idNumber}
                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Date of Birth</label>
                    <input
                        type="date"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Gender</label>
                    <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                        <option value="">Please Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Home Address</label>
                <input
                    type="text"
                    required
                    placeholder="Street, City, Zip Code"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
            </div>

            <div className="flex items-center gap-4 pt-4">
                <button type="button" onClick={handleBack} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button type="submit" className="flex-1 btn-primary py-4 flex items-center justify-center gap-3">
                    Continue <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </form>
    );

    const renderHealthInfo = () => (
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full mb-4 border border-rose-100">
                    <HeartPulse className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-wide">Medical Assessment</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Requirements</h2>
            </div>

            {/* Department Selection (Image 1) */}
            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Select Department(s) for Service</label>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        'Nursing', 'Personal Care', 'Occupational Therapy', 'Speech-Language Pathology',
                        'Home Health Aide', 'Physical Therapy', 'Respiratory Therapy', 'Audiology'
                    ].map((dept) => (
                        <label key={dept} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-white hover:border-teal-500 transition-all select-none">
                            <input
                                type="checkbox"
                                className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                checked={formData.departments.includes(dept)}
                                onChange={(e) => {
                                    const newDepts = e.target.checked
                                        ? [...formData.departments, dept]
                                        : formData.departments.filter(d => d !== dept);
                                    setFormData({ ...formData, departments: newDepts });
                                }}
                            />
                            <span className="text-sm font-semibold text-slate-700">{dept}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Service Time & Location (Image 1) */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Service Type</label>
                    <div className="flex gap-2">
                        {['Full Time', 'Part Time'].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setFormData({ ...formData, serviceType: type })}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all border ${formData.serviceType === type ? 'bg-teal-500 text-white border-teal-500 shadow-lg shadow-teal-500/20' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-teal-200'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Preferred Time Details</label>
                    <input
                        type="text"
                        placeholder="e.g. Weekdays 7 to 4"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 transition-all"
                        value={formData.serviceTime}
                        onChange={(e) => setFormData({ ...formData, serviceTime: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Where would you like to receive care?</label>
                <div className="flex flex-wrap gap-3">
                    {['My Own Home', "Caregiver's Home", "Agency's House"].map((loc) => (
                        <button
                            key={loc}
                            type="button"
                            onClick={() => setFormData({ ...formData, careLocation: loc })}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border ${formData.careLocation === loc ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-200'}`}
                        >
                            {loc}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clinical Details (Image 2) */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Insurance Number</label>
                    <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 transition-all"
                        value={formData.insuranceNumber}
                        onChange={(e) => setFormData({ ...formData, insuranceNumber: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Height (cm)</label>
                        <input
                            type="number"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 transition-all"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Weight (kg)</label>
                        <input
                            type="number"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 transition-all"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Primary Health Concerns</label>
                <input
                    type="text"
                    required
                    placeholder="e.g. Hypertension, Senior Mobility"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 transition-all"
                    value={formData.ailment}
                    onChange={(e) => setFormData({ ...formData, ailment: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Emergency Contact Information</label>
                <input
                    type="text"
                    required
                    placeholder="Name, Relationship, and Phone"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 transition-all"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
            </div>

            <div className="flex items-center gap-4 pt-4 sticky bottom-0 bg-white py-4 border-t border-slate-100 mt-auto">
                <button type="button" onClick={handleBack} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button type="submit" disabled={loading} className="flex-1 btn-primary py-4 flex items-center justify-center gap-3 shadow-xl shadow-teal-500/20">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Finalize Application <CheckCircle2 className="w-4 h-4" /></>}
                </button>
            </div>
        </form>
    );

    const renderProfessionalInfo = () => (
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full mb-4 border border-teal-100">
                    <Stethoscope className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-wide">Professional Profile</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Caregiver Onboarding</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Desired Salary (KSh/Month)</label>
                    <input
                        type="number"
                        placeholder="e.g. 45000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 transition-all"
                        value={formData.desiredSalary}
                        onChange={(e) => setFormData({ ...formData, desiredSalary: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Availability</label>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(formData.availabilityDetails).map(([key, val]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setFormData({
                                    ...formData,
                                    availabilityDetails: { ...formData.availabilityDetails, [key]: !val }
                                })}
                                className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-tight transition-all border ${val ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/10' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-teal-200'}`}
                            >
                                {key}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Where would you like to provide care?</label>
                <div className="flex flex-wrap gap-3">
                    {['In Home of Client', 'In My Own Home', 'No Preference'].map((pref) => (
                        <button
                            key={pref}
                            type="button"
                            onClick={() => setFormData({ ...formData, carePreference: pref })}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border ${formData.carePreference === pref ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-rose-200'}`}
                        >
                            {pref}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Certifications or License</label>
                <textarea
                    rows={2}
                    placeholder="Caregiver, CNA, NAR, etc."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 transition-all resize-none"
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Professional Biography</label>
                <textarea
                    rows={3}
                    required
                    placeholder="Brief overview of your clinical experience..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:bg-white focus:border-teal-500 transition-all resize-none"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Resume Upload (Image 5)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-[24px] p-6 flex flex-col items-center justify-center group hover:border-teal-400 hover:bg-teal-50/50 transition-all cursor-pointer bg-slate-50">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-teal-500 transition-colors mb-2" />
                    <p className="text-sm font-bold text-slate-600">Browse Files</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">pdf, doc, docx, jpg, jpeg, png</p>
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4 sticky bottom-0 bg-white py-4 border-t border-slate-100 mt-auto">
                <button type="button" onClick={handleBack} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button type="submit" disabled={loading} className="flex-1 btn-primary py-4 flex items-center justify-center gap-3 shadow-xl shadow-teal-500/20">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Application <CheckCircle2 className="w-4 h-4" /></>}
                </button>
            </div>
        </form>
    );

    const renderSuccess = () => (
        <div className="text-center py-10 space-y-8">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100 mb-6 relative overflow-hidden">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                >
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </motion.div>
                <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
            </div>

            <div className="space-y-3">
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome to True Care!</h2>
                <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto">Your account has been successfully created. You can now securely manage your healthcare journey.</p>
            </div>

            <div className="pt-4">
                <button
                    onClick={() => router.push('/login')}
                    className="w-full btn-primary py-5 flex items-center justify-center gap-3 scale-105"
                >
                    Sign in to your account
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen mesh-gradient flex items-center justify-center p-6 selection:bg-teal-600/10">
            <div className="max-w-[800px] w-full relative z-10">
                {/* Brand Indicator */}
                <div className="flex items-center gap-3 justify-center mb-10">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                        <HeartPulse className="w-5 h-5 text-rose-500" />
                    </div>
                    <span className="font-extrabold text-slate-900 tracking-tight text-xl">TRUE CARE</span>
                </div>

                <div className="bg-white/80 p-8 sm:p-12 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 min-h-[500px] relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {step === 'role' && renderRoleSelection()}
                            {step === 'basic' && renderBasicInfo()}
                            {step === 'professional' && renderProfessionalInfo()}
                            {step === 'health' && renderHealthInfo()}
                            {step === 'success' && renderSuccess()}
                        </motion.div>
                    </AnimatePresence>

                    {error && (
                        <div className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <p className="text-rose-600 text-xs font-bold uppercase tracking-wide">{error}</p>
                        </div>
                    )}
                </div>

                <p className="text-center mt-8 text-xs font-semibold text-slate-400 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Secure Health Data Protection
                </p>
            </div>
        </div>
    );
}

