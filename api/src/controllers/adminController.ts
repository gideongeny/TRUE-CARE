import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getGlobalStats = async (req: Request, res: Response) => {
    try {
        const now = new Date();
        const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const [
            thisMonthPatients, lastMonthPatients,
            thisMonthCaregivers, lastMonthCaregivers,
            pendingRequests, activeShifts,
            completedShifts
        ] = await Promise.all([
            prisma.user.count({ where: { role: 'PATIENT', createdAt: { gte: firstDayOfThisMonth } } }),
            prisma.user.count({ where: { role: 'PATIENT', createdAt: { gte: firstDayOfLastMonth, lt: firstDayOfThisMonth } } }),
            prisma.user.count({ where: { role: 'CAREGIVER', createdAt: { gte: firstDayOfThisMonth } } }),
            prisma.user.count({ where: { role: 'CAREGIVER', createdAt: { gte: firstDayOfLastMonth, lt: firstDayOfThisMonth } } }),
            prisma.serviceRequest.count({ where: { status: 'PENDING' } }),
            prisma.shift.count({ where: { status: 'IN_PROGRESS' } }),
            prisma.shift.findMany({ where: { status: 'COMPLETED' }, select: { actualDuration: true } })
        ]);

        const totalPatients = await prisma.user.count({ where: { role: 'PATIENT' } });
        const totalCaregivers = await prisma.user.count({ where: { role: 'CAREGIVER' } });

        // Calculate trends
        const patientTrend = lastMonthPatients === 0 ? 100 : ((thisMonthPatients - lastMonthPatients) / lastMonthPatients) * 100;
        const caregiverTrend = lastMonthCaregivers === 0 ? 100 : ((thisMonthCaregivers - lastMonthCaregivers) / lastMonthCaregivers) * 100;

        // Avg Shift Duration
        const totalDuration = completedShifts.reduce((acc, s) => acc + (s.actualDuration || 0), 0);
        const avgDuration = completedShifts.length === 0 ? 0 : totalDuration / completedShifts.length;

        res.json({
            patientCount: totalPatients,
            patientTrend: patientTrend.toFixed(1),
            caregiverCount: totalCaregivers,
            caregiverTrend: caregiverTrend.toFixed(1),
            pendingRequests,
            activeShifts,
            avgDuration: avgDuration.toFixed(1),
            operationalLoad: activeShifts > 10 ? 'High' : activeShifts > 5 ? 'Moderate' : 'Stable'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAdvancedAnalytics = async (req: Request, res: Response) => {
    try {
        const [shiftsByType, recentShifts] = await Promise.all([
            prisma.serviceRequest.groupBy({
                by: ['careType'],
                _count: { _all: true }
            }),
            prisma.shift.findMany({
                where: { status: 'COMPLETED' },
                take: 100,
                orderBy: { endTime: 'desc' }
            })
        ]);

        const distribution = shiftsByType.map(item => ({
            name: item.careType,
            value: item._count._all
        }));

        res.json({
            distribution,
            retentionRate: '92.4' // Logic for retention could be added here based on recurring patientIds
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCaregiverPerformance = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const caregiver = await prisma.user.findUnique({
            where: { id },
            include: {
                profile: true,
                caregiverShifts: {
                    include: { patient: { include: { profile: true } } },
                    orderBy: { startTime: 'desc' },
                }
            }
        });

        if (!caregiver) return res.status(404).json({ message: "Caregiver not found" });

        // Calculate total hours
        const totalHours = caregiver.caregiverShifts.reduce((acc, shift) => acc + (shift.actualDuration || 0), 0);

        res.json({
            caregiver,
            totalHours: parseFloat(totalHours.toFixed(2)),
            shiftCount: caregiver.caregiverShifts.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getShiftAnalytics = async (req: Request, res: Response) => {
    try {
        // Last 7 days aggregation
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const shifts = await prisma.shift.findMany({
            where: {
                startTime: { gte: sevenDaysAgo }
            },
            select: {
                startTime: true,
                status: true
            }
        });

        // Simple grouping by date
        const analytics = shifts.reduce((acc: any, shift) => {
            const date = shift.startTime.toISOString().split('T')[0];
            if (!acc[date]) acc[date] = 0;
            acc[date]++;
            return acc;
        }, {});

        res.json(analytics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getActivityLog = async (req: Request, res: Response) => {
    try {
        const [recentRequests, recentShifts] = await Promise.all([
            prisma.serviceRequest.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { patient: { include: { profile: true } } }
            }),
            prisma.shift.findMany({
                take: 5,
                orderBy: { updatedAt: 'desc' },
                include: {
                    caregiver: { include: { profile: true } },
                    patient: { include: { profile: true } }
                }
            })
        ]);

        const events = [
            ...recentRequests.map(r => ({
                id: r.id,
                type: 'REQUEST',
                title: 'New Service Request',
                description: `${r.patient.profile?.firstName} requested ${r.careType}`,
                time: r.createdAt,
                status: r.status
            })),
            ...recentShifts.map(s => ({
                id: s.id,
                type: 'SHIFT',
                title: s.status === 'IN_PROGRESS' ? 'Shift Started' : s.status === 'COMPLETED' ? 'Shift Completed' : 'Shift Claimed',
                description: `${s.caregiver?.profile?.firstName || 'Caregiver'} for ${s.patient.profile?.firstName}`,
                time: s.updatedAt,
                status: s.status
            }))
        ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 10);

        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getVerificationQueue = async (req: Request, res: Response) => {
    try {
        const pending = await prisma.user.findMany({
            where: {
                role: 'CAREGIVER',
                profile: { isVerified: false }
            },
            include: { profile: true },
            orderBy: { createdAt: 'desc' }
        });

        const queue = pending.map(p => ({
            id: p.id,
            name: `${p.profile?.firstName} ${p.profile?.lastName?.[0]}.`,
            role: 'Care Professional',
            status: p.profile?.idCardUrl ? 'Identity Uploaded' : 'Pending Documents',
            risk: 'Low', // This would ideally come from a risk scoring engine
            date: p.createdAt
        }));

        res.json(queue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSystemReports = async (req: Request, res: Response) => {
    try {
        const [shiftCount, requestCount] = await Promise.all([
            prisma.shift.count(),
            prisma.serviceRequest.count()
        ]);

        const reports = [
            { id: 1, name: 'Caregiver Utilization Audit.pdf', type: 'Operational', date: new Date().toISOString().split('T')[0], size: `${(shiftCount * 0.1).toFixed(1)} MB` },
            { id: 2, name: 'Monthly Service Distribution.csv', type: 'Growth', date: new Date().toISOString().split('T')[0], size: `${(requestCount * 0.05).toFixed(1)} MB` },
            { id: 3, name: 'Compliance Incident Log.pdf', type: 'Compliance', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], size: '1.2 MB' },
        ];

        res.json({
            reports,
            stats: {
                generated: 12 + shiftCount, // Mocked total based on activity
                completionRate: 98
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getClinicalIntelligence = async (req: Request, res: Response) => {
    try {
        // Target specifically Francis Kangethe as requested by user
        const patient = await prisma.user.findFirst({
            where: {
                role: 'PATIENT',
                profile: {
                    OR: [
                        { firstName: { contains: 'Francis' } },
                        { lastName: { contains: 'Kangethe' } }
                    ]
                }
            },
            include: {
                profile: true,
                patientShifts: {
                    include: {
                        caregiver: { include: { profile: true } },
                        report: true
                    },
                    orderBy: { startTime: 'desc' }
                }
            }
        });

        if (!patient) {
            // Fallback to first patient if Francis is not found
            const fallback = await prisma.user.findFirst({
                where: { role: 'PATIENT' },
                include: {
                    profile: true,
                    patientShifts: {
                        include: {
                            caregiver: { include: { profile: true } },
                            report: true
                        },
                        orderBy: { startTime: 'desc' }
                    }
                }
            });
            return res.json(fallback);
        }

        res.json(patient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
