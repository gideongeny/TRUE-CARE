'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import api from '../lib/api';
import Logo from '../components/ui/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [tempUserId, setTempUserId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      if (response.data.require2FA) {
        setTempUserId(response.data.userId);
        setStep('2fa');
        setLoading(false);
        return;
      }

      const { token, user } = response.data;

      if (user.role !== 'ADMIN') {
        setError('Access denied. Administrator privileges required.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real implementation, you'd have a specific 2fa verification login endpoint
      // For this demo, let's assume we can pass the userId and code to a verify endpoint
      const response = await api.post('/auth/login', {
        userId: tempUserId,
        token: twoFactorCode,
        is2FAAction: true // Small flag for backend to distinguish
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError('Invalid verification code.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black selection:bg-white/20 selection:text-white">
      {/* Sophisticated Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[15000ms]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10 px-6"
      >
        <div className="flex flex-col items-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            <Logo className="w-28 h-28 flex-col gap-6" />
          </motion.div>
        </div>

        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] p-8 md:p-10 rounded-[32px] shadow-2xl ring-1 ring-white/[0.05]">
          <AnimatePresence mode="wait">
            {step === 'login' ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="space-y-5">
                  <motion.div
                    className="group relative"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className={`block text-xs font-bold uppercase tracking-[0.2em] mb-2 transition-colors duration-300 ${focusedField === 'email' ? 'text-white' : 'text-zinc-500'}`}>
                      Email Address
                    </label>
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${focusedField === 'email' ? 'bg-white/[0.05]' : 'bg-transparent'}`} />
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 pointer-events-none ${focusedField === 'email' ? 'text-white' : 'text-zinc-600'}`} />
                      <input
                        type="email"
                        placeholder="admin@truecare.com"
                        className="w-full bg-black/20 border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-white placeholder-zinc-700 outline-none focus:border-white/20 transition-all duration-300 font-medium"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="group relative"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className={`block text-xs font-bold uppercase tracking-[0.2em] mb-2 transition-colors duration-300 ${focusedField === 'password' ? 'text-white' : 'text-zinc-500'}`}>
                      Password
                    </label>
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${focusedField === 'password' ? 'bg-white/[0.05]' : 'bg-transparent'}`} />
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 pointer-events-none ${focusedField === 'password' ? 'text-white' : 'text-zinc-600'}`} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-black/20 border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-white placeholder-zinc-700 outline-none focus:border-white/20 transition-all duration-300 font-medium"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        required
                      />
                    </div>
                  </motion.div>
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white hover:bg-zinc-200 text-black font-black py-4 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-[0.15em] text-xs relative overflow-hidden group"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span className="relative z-10">Access Dashboard</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="2fa-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerify2FA}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight italic">Verify Identity</h3>
                  <p className="text-zinc-500 text-sm italic">Enter the 6-digit code from your app</p>
                </div>

                <div className="relative group">
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${focusedField === '2fa' ? 'bg-white/[0.05]' : 'bg-transparent'}`} />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    className="w-full bg-black/40 border border-white/[0.08] rounded-2xl py-6 text-center text-3xl font-black tracking-[0.5em] text-white placeholder-zinc-800 outline-none focus:border-white/20 transition-all duration-300"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    onFocus={() => setFocusedField('2fa')}
                    onBlur={() => setFocusedField(null)}
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white hover:bg-zinc-200 text-black font-black py-4 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 uppercase tracking-widest text-xs"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm Verification'}
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => setStep('login')}
                    className="w-full text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors py-2"
                  >
                    Back to Login
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl flex items-center gap-3 overflow-hidden"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-zinc-600 text-xs font-medium tracking-wide">
              PROTECTED SYSTEM &bull; AUTHORIZED ACCESS ONLY
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
