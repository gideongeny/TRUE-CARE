import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getGlobalStats = async (req: Request, res: Response) => {
    try {
        const [patientCount, caregiverCount, pendingRequests, activeShifts] = await Promise.all([
            prisma.user.count({ where: { role: 'PATIENT' } }),
            prisma.user.count({ where: { role: 'CAREGIVER' } }),
            prisma.serviceRequest.count({ where: { status: 'PENDING' } }),
            prisma.shift.count({ where: { status: 'IN_PROGRESS' } }),
        ]);

        res.json({
            patientCount,
            caregiverCount,
            pendingRequests,
            activeShifts,
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
