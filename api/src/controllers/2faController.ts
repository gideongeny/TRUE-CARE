import { Response } from 'express';
// @ts-ignore
const { authenticator } = require('otplib');
import qrcode from 'qrcode';
import prisma from '../utils/prisma';
import { AuthRequest } from '../types/AuthRequest';

export const setup2FA = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const secret = authenticator.generateSecret();
        const otpauth = authenticator.keyuri(user.email, 'TRUE-CARE', secret);
        const qrCodeUrl = await qrcode.toDataURL(otpauth);

        // Store secret temporarily or expect verification before saving
        res.json({ secret, qrCodeUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error setting up 2FA' });
    }
};

export const verifyAndEnable2FA = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { secret, token } = req.body;

        if (!userId || !secret || !token) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const isValid = authenticator.verify({ token, secret });
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid verification token' });
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorSecret: secret,
                twoFactorEnabled: true,
            } as any,
        });

        res.json({ message: '2FA enabled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error enabling 2FA' });
    }
};

export const disable2FA = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        await prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorSecret: null,
                twoFactorEnabled: false,
            } as any,
        });

        res.json({ message: '2FA disabled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error disabling 2FA' });
    }
};
