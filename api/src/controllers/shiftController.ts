import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createShift = async (req: Request, res: Response) => {
    try {
        const { caregiverId, patientId, startTime, endTime, notes } = req.body;

        // Simple validation (in real app, use Zod)
        if (!caregiverId || !patientId || !startTime || !endTime) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const shift = await prisma.shift.create({
            data: {
                caregiverId,
                patientId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                notes,
            },
            include: {
                caregiver: { include: { profile: true } },
                patient: { include: { profile: true } },
            },
        });

        res.status(201).json(shift);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getShifts = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;

        if (!userId) { return res.status(401).json({ message: "Unauthorized" }); }

        let whereClause = {};
        if (role === 'CAREGIVER') {
            whereClause = { caregiverId: userId };
        } else if (role === 'PATIENT') {
            whereClause = { patientId: userId };
        }
        // ADMIN sees all

        const shifts = await prisma.shift.findMany({
            where: whereClause,
            include: {
                caregiver: { include: { profile: true } },
                patient: { include: { profile: true } },
            },
            orderBy: { startTime: 'desc' },
        });

        res.json(shifts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
