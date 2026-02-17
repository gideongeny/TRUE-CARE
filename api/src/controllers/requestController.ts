import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createRequest = async (req: Request, res: Response) => {
    try {
        const patientId = req.user?.userId;
        if (!patientId) { return res.status(401).json({ message: "Unauthorized" }); }

        const { careType, duration, location, description } = req.body;

        const request = await prisma.serviceRequest.create({
            data: {
                patientId,
                careType,
                duration,
                location,
                description,
                status: 'PENDING'
            },
        });

        res.status(201).json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getRequests = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;

        if (!userId) { return res.status(401).json({ message: "Unauthorized" }); }

        let whereClause = {};
        if (role === 'PATIENT') {
            whereClause = { patientId: userId };
        }
        // Admin sees all, Caregiver might see pending requests (future feature)

        const requests = await prisma.serviceRequest.findMany({
            where: whereClause,
            include: {
                patient: { include: { profile: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const request = await prisma.serviceRequest.update({
            where: { id },
            data: { status }
        });

        res.json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
