import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

const getJwtSecret = () => process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role, firstName, lastName, phone, profile: profileData } = req.body;

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
                        // Expanded Fields
                        age: profileData?.age,
                        gender: profileData?.gender,
                        ailment: profileData?.ailment,
                        location: profileData?.location,
                        emergencyContact: profileData?.emergencyContact,
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
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

import { authenticator } from 'otplib';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password, userId, token: tfaToken, is2FAAction } = req.body;

        if (is2FAAction) {
            const user = await prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
            if (!user || !user.twoFactorSecret) {
                return res.status(400).json({ message: 'Invalid 2FA request' });
            }

            const isValid = authenticator.verify({ token: tfaToken, secret: user.twoFactorSecret });
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

        if (user.twoFactorEnabled) {
            return res.json({ require2FA: true, userId: user.id });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, getJwtSecret(), { expiresIn: '1d' });

        res.json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
