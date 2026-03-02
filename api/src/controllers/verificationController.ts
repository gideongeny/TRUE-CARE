import { Response } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import prisma from '../utils/prisma';

export const uploadVerificationDoc = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { title, docUrl } = req.body;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const doc = await prisma.verificationDoc.create({
            data: {
                userId,
                title,
                docUrl,
                status: 'PENDING'
            }
        });

        res.status(201).json(doc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getVerificationStatus = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const docs = await prisma.verificationDoc.findMany({
            where: { userId }
        });

        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        res.json({
            isVerified: profile?.isVerified || false,
            documents: docs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
