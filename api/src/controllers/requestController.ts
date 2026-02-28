import { Response } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import prisma from '../utils/prisma';

export const createRequest = async (req: AuthRequest, res: Response) => {
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

export const adminCreateRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { patientId, careType, duration, location, description } = req.body;

        if (!patientId) {
            return res.status(400).json({ message: "patientId is required" });
        }

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

export const getRequests = async (req: AuthRequest, res: Response) => {
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

export const adminSetPrice = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { price } = req.body;

        const request = await prisma.serviceRequest.update({
            where: { id },
            data: {
                price: Number(price),
                remainingBalance: Number(price),
                status: 'PRICED'
            }
        });

        // Notify patient here

        res.json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const request = await prisma.serviceRequest.update({
            where: { id },
            data: { status }
        });

        // If approved by admin, create an assigned/open shift
        if (status === 'APPROVED') {
            const currentRequest = await prisma.serviceRequest.findUnique({ where: { id } });
            if (!currentRequest || currentRequest.status !== 'PAID') {
                return res.status(400).json({ message: "Request must be PAID before approval and caregiver assignment" });
            }

            await prisma.shift.create({
                data: {
                    patientId: request.patientId,
                    requestId: request.id,
                    caregiverId: null,
                    startTime: new Date(),
                    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // Default 8h
                    notes: `Session for ${request.careType}. Description: ${request.description || 'N/A'}`,
                    status: 'ASSIGNED',
                    earnings: Number(request.price) * 0.7 // Default 70% to caregiver
                }
            });
        }

        res.json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
