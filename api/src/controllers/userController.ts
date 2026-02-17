import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found in request" });
        }

        const start = Date.now();
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });

        // Log query time for clear observability during dev
        console.log(`Query "findUnique User" took ${Date.now() - start}ms`);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Exclude password from response
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found in request" });
        }

        const { firstName, lastName, phone, address, bio, skills, hourlyRate } = req.body;

        const start = Date.now();
        const profile = await prisma.profile.upsert({
            where: { userId },
            update: {
                firstName,
                lastName,
                phone,
                address,
                bio,
                skills,
                hourlyRate,
            },
            create: {
                userId,
                firstName: firstName || '',
                lastName: lastName || '',
                phone,
                address,
                bio,
                skills,
                hourlyRate,
            },
        });
        console.log(`Query "upsert Profile" took ${Date.now() - start}ms`);

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            include: { profile: true },
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const verifyUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.body;

        const profile = await prisma.profile.update({
            where: { userId: id },
            data: { isVerified }
        });

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
