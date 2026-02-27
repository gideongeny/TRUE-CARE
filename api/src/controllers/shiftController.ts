import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createShift = async (req: Request, res: Response) => {
    try {
        const { caregiverId, patientId, requestId, startTime, endTime, notes, earnings } = req.body;

        if (!patientId || !startTime || !endTime) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const shift = await prisma.shift.create({
            data: {
                caregiverId: caregiverId || null,
                patientId,
                requestId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                notes,
                status: caregiverId ? 'ASSIGNED' : 'ASSIGNED', // Start as ASSIGNED even if caregiverId is present
                earnings: earnings ? Number(earnings) : 0,
            },
            include: {
                caregiver: { include: { profile: true } },
                patient: { include: { profile: true } },
            },
        });

        // Trigger notification logic here if needed

        res.status(201).json(shift);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const acceptShift = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const caregiverId = req.user?.userId;

        const shift = await prisma.shift.findUnique({ where: { id } });
        if (!shift) return res.status(404).json({ message: "Shift not found" });
        if (shift.caregiverId !== caregiverId) return res.status(403).json({ message: "Unassigned shift" });

        const updatedShift = await prisma.shift.update({
            where: { id },
            data: { status: 'ACCEPTED' },
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

        // Notify Admin logic here

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
