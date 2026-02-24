import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createShift = async (req: Request, res: Response) => {
    try {
        const { caregiverId, patientId, startTime, endTime, notes } = req.body;

        // patientId, startTime, endTime are mandatory for any shift
        if (!patientId || !startTime || !endTime) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const shift = await prisma.shift.create({
            data: {
                caregiverId: caregiverId || null,
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
export const getAvailableShifts = async (req: Request, res: Response) => {
    try {
        const shifts = await prisma.shift.findMany({
            where: { caregiverId: null, status: 'SCHEDULED' },
            include: {
                patient: { include: { profile: true } },
            },
            orderBy: { startTime: 'asc' },
        });
        res.json(shifts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const claimShift = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const caregiverId = req.user?.userId;

        if (!caregiverId) return res.status(401).json({ message: "Unauthorized" });

        // Atomic check to see if shift is still available
        const shift = await prisma.shift.findUnique({ where: { id } });
        if (!shift) return res.status(404).json({ message: "Shift not found" });
        if (shift.caregiverId) return res.status(400).json({ message: "Shift already claimed" });

        const updatedShift = await prisma.shift.update({
            where: { id },
            data: { caregiverId, status: 'SCHEDULED' },
        });

        res.json(updatedShift);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const clockIn = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const clockInTime = new Date();

        const updatedShift = await prisma.shift.update({
            where: { id },
            data: { clockInTime, status: 'IN_PROGRESS' },
        });

        res.json(updatedShift);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const clockOut = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const clockOutTime = new Date();

        const shift = await prisma.shift.findUnique({ where: { id } });
        if (!shift || !shift.clockInTime) {
            return res.status(400).json({ message: "Cannot clock out without clocking in" });
        }

        // Calculate duration in hours
        const diffMs = clockOutTime.getTime() - shift.clockInTime.getTime();
        const actualDuration = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

        const updatedShift = await prisma.shift.update({
            where: { id },
            data: {
                clockOutTime,
                status: 'COMPLETED',
                actualDuration
            },
        });

        res.json(updatedShift);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const createReport = async (req: Request, res: Response) => {
    try {
        const { id: shiftId } = req.params;
        const { content, vitals } = req.body;

        const shift = await prisma.shift.findUnique({ where: { id: shiftId } });
        if (!shift) return res.status(404).json({ message: "Shift not found" });

        const report = await prisma.report.upsert({
            where: { shiftId },
            update: { content, vitals },
            create: { shiftId, content, vitals },
        });

        res.status(201).json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
