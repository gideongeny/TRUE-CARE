'use client';

import ShiftReportForm from './ShiftReportForm';
import { AnimatePresence } from 'framer-motion';

export default function CaregiverSchedule() {
    const [myShifts, setMyShifts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedShift, setSelectedShift] = useState<any | null>(null);

    const fetchMyShifts = async () => {
        try {
            const res = await api.get('/shifts');
            setMyShifts(res.data);
        } catch (error) {
            console.error('Failed to fetch schedule', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyShifts();
    }, []);

    const hours = Array.from({ length: 24 }, (_, i) => i);

    if (loading) return (
        <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest animate-pulse">
            Loading Chronos Engine...
        </div>
    );

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Mission Timeline</h2>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Gantt-style deployment visualizer</p>
                </div>
                <div className="flex gap-3">
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                        <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                </div>
            </div>

            {/* Gantt Chart Container */}
            <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex gap-10">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Active Shift</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Deployment</span>
                        </div>
                    </div>
                    <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">System Synchronized</span>
                    </div>
                </div>

                <div className="relative overflow-x-auto pb-6 scrollbar-hide">
                    <div className="min-w-[1200px]">
                        {/* Time Markers */}
                        <div className="flex border-b border-slate-100 pb-4 mb-8">
                            {hours.map(h => (
                                <div key={h} className="flex-1 text-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase font-mono">
                                        {h % 4 === 0 ? `${h}h` : ''}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Timeline Grid */}
                        <div className="space-y-8">
                            {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'].map((day, dayIdx) => (
                                <div key={day} className="relative h-20 group">
                                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[9px] font-black text-slate-300 tracking-[0.3em] uppercase">
                                        {day}
                                    </div>
                                    <div className="h-20 w-full bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex items-center relative px-2">
                                        <div className="absolute inset-0 flex">
                                            {hours.map(h => (
                                                <div key={h} className="flex-1 border-r border-slate-100 last:border-0" />
                                            ))}
                                        </div>

                                        {myShifts.length > 0 && myShifts.filter(s => new Date(s.startTime).getDay() === (dayIdx + 1) % 7).map((shift, idx) => {
                                            const startHour = new Date(shift.startTime).getHours();
                                            const duration = shift.status === 'COMPLETED' ? shift.actualDuration : 8;
                                            const startPct = (startHour / 24) * 100;
                                            const widthPct = (duration / 24) * 100;

                                            return (
                                                <motion.div
                                                    key={shift.id}
                                                    initial={{ opacity: 0, scaleX: 0 }}
                                                    animate={{ opacity: 1, scaleX: 1 }}
                                                    className={`absolute h-14 ${shift.status === 'IN_PROGRESS' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-200/50' : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-200/50'} rounded-2xl shadow-xl flex items-center px-6 z-10 border-2 border-white/20`}
                                                    style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                                                >
                                                    <div className="flex items-center gap-3 w-full overflow-hidden">
                                                        <div className={`w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 ${shift.status === 'IN_PROGRESS' ? 'animate-pulse' : ''}`}>
                                                            {shift.status === 'IN_PROGRESS' ? <Activity className="w-4 h-4 text-white" /> : <Shield className="w-4 h-4 text-white" />}
                                                        </div>
                                                        <div className="truncate">
                                                            <p className="text-[10px] font-black text-white uppercase tracking-tight truncate">
                                                                {shift.status === 'IN_PROGRESS' ? 'LIVE: ' : ''}{shift.patient?.profile?.lastName}
                                                            </p>
                                                            <p className="text-[8px] font-bold text-blue-100 uppercase tracking-widest">
                                                                {new Date(shift.startTime).getHours()}:00 - {new Date(shift.endTime).getHours()}:00
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tactical Shift List */}
            <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center gap-3">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Deployment Registry</h3>
                    <div className="h-[1px] flex-1 bg-slate-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myShifts.length > 0 ? myShifts.map((shift) => (
                        <div key={shift.id} className="bg-white border border-slate-200 rounded-[32px] p-8 group hover:border-blue-500 transition-all hover:shadow-2xl hover:shadow-blue-500/5 relative overflow-hidden">
                            {shift.status === 'IN_PROGRESS' && (
                                <div className="absolute top-0 right-0 px-6 py-2 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-bl-2xl flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                    Live Deployment
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center font-black group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                                        <span className="text-[10px] text-slate-400 group-hover:text-blue-100 uppercase leading-none mb-1">
                                            {new Date(shift.startTime).toLocaleString('default', { month: 'short' })}
                                        </span>
                                        <span className="text-2xl text-slate-800 group-hover:text-white leading-none">
                                            {new Date(shift.startTime).getDate()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Assigned Patient</p>
                                        <h4 className="text-lg font-black text-slate-900">{shift.patient?.profile?.firstName} {shift.patient?.profile?.lastName}</h4>
                                    </div>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-xl">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500">
                                    <span>Deployment Interval</span>
                                    <span className="text-slate-900">{shift.status === 'COMPLETED' ? shift.actualDuration : 8.0} Hours</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${shift.status === 'IN_PROGRESS' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-600'} w-full`} />
                                </div>
                                <div className="flex justify-between text-[10px] font-black text-slate-400 font-mono">
                                    <span>{new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span>{new Date(shift.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedShift(shift)}
                                className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-slate-900/10 hover:shadow-blue-600/30"
                            >
                                {shift.status === 'COMPLETED' ? 'Review Clinical Data' : 'Submit End of Shift Report'}
                            </button>
                        </div>
                    )) : (
                        <div className="col-span-2 py-20 text-center border-2 border-dashed border-slate-100 rounded-[40px] opacity-30">
                            <Activity className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 italic">No Active Deployments in Registry</p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedShift && (
                    <ShiftReportForm
                        shiftId={selectedShift.id}
                        patientName={`${selectedShift.patient?.profile?.firstName} ${selectedShift.patient?.profile?.lastName}`}
                        onClose={() => setSelectedShift(null)}
                        onSuccess={() => {
                            setSelectedShift(null);
                            fetchMyShifts();
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
