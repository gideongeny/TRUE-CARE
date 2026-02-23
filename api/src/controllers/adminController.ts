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
