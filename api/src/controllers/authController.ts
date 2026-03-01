import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// @ts-ignore
const { authenticator } = require('otplib');
import prisma from '../utils/prisma';
import { AuthRequest } from '../types/AuthRequest';

const getJwtSecret = () => process.env.JWT_SECRET || 'secret';

export const register = async (req: AuthRequest, res: Response) => {
    try {
        const {
            email,
            password,
            role,
            firstName,
            lastName,
            phone,
            bio,
            ailment,
            medicalHistory,
            emergencyContact,
            profile: profileData
        } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || 'PATIENT',
                profile: {
                    create: {
                        firstName,
                        lastName,
                        phone,
                        bio: bio || profileData?.bio,
                        ailment: ailment || profileData?.ailment,
                        medicalHistory: medicalHistory || profileData?.medicalHistory,
                        emergencyContact: emergencyContact || profileData?.emergencyContact,
                        // Expanded Fields fallback to profileData if provided
                        age: profileData?.age,
                        gender: profileData?.gender,
                        location: profileData?.location,
                        preferredShift: profileData?.preferredShift,
                        idNumber: profileData?.idNumber,
                        experienceYears: profileData?.experienceYears,
                        availability: profileData?.availability,
                    },
                },
            },
            include: {
                profile: true,
            },
        });

        const token = jwt.sign({ userId: user.id, role: user.role }, getJwtSecret());

        res.status(201).json({ token, user });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};



export const login = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password, userId, token: tfaToken, is2FAAction } = req.body;

        if (is2FAAction) {
            const user = await prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
            if (!user || !(user as any).twoFactorSecret) {
                return res.status(400).json({ message: 'Invalid 2FA request' });
            }

            const isValid = authenticator.verify({ token: tfaToken, secret: (user as any).twoFactorSecret });
            if (!isValid) {
                return res.status(400).json({ message: 'Invalid verification code' });
            }

            const token = jwt.sign({ userId: user.id, role: user.role }, getJwtSecret());
            return res.json({ token, user });
        }

        const user = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if ((user as any).twoFactorEnabled) {
            return res.json({ require2FA: true, userId: user.id });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, getJwtSecret(), { expiresIn: '1d' });

        res.json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                notifications: { orderBy: { createdAt: 'desc' }, take: 5 }
            }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error('getMe error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
