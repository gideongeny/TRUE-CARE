'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, X, CheckCircle2, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface ReviewSystemProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReviewSystem({ isOpen, onClose }: ReviewSystemProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/reviews', { rating, comment });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setComment('');
                setRating(5);
            }, 2000);
        } catch (error) {
            console.error('Failed to submit review', error);
            alert('Failed to submit review. Access Neural Feedback Loop Failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden relative"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-10 text-center">
                            {success ? (
                                <div className="py-10 space-y-4">
                                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase">Feedback Received</h3>
                                    <p className="text-slate-500 font-bold text-sm tracking-tight">Your neural input has been integrated into our quality matrix.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <div className="p-2 bg-teal-50 rounded-xl">
                                            <Star className="w-5 h-5 text-teal-600 fill-teal-600" />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Rate TrueCare</h3>
                                    </div>
                                    <p className="text-slate-500 text-sm font-bold mb-8 tracking-tight">Help us evolve the standard of compassionate home care.</p>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="flex justify-center gap-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className={`p-1.5 transition-all transform active:scale-90 ${star <= rating ? 'scale-110' : 'grayscale opacity-30 scale-90'}`}
                                                >
                                                    <Star className={`w-8 h-8 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                                                </button>
                                            ))}
                                        </div>

                                        <div className="relative">
                                            <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Briefly describe your experience..."
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold outline-none focus:bg-white focus:border-teal-500 transition-all resize-none h-32"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-teal-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4" />}
                                            Transmit Feedback
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
