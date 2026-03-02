import { Response } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import prisma from '../utils/prisma';
import { createNotification } from '../utils/notifications';

export const getWalletBalance = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        const withdrawalHistory = await prisma.withdrawalRequest.findMany({
            where: { caregiverId: userId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        res.json({
            balance: profile?.balance || 0,
            history: withdrawalHistory
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const requestWithdrawal = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { amount, mpesaNumber } = req.body;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        if (!amount || !mpesaNumber) return res.status(400).json({ message: "Missing amount or mpesaNumber" });

        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile || Number(profile.balance) < Number(amount)) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const request = await prisma.withdrawalRequest.create({
            data: {
                caregiverId: userId,
                amount: Number(amount),
                mpesaNumber,
                status: 'PENDING'
            }
        });

        // Notify Admins
        const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
        for (const admin of admins) {
            await createNotification(admin.id, 'New Payout Request', `Caregiver has requested a withdrawal of KSh ${amount}`, 'FINANCE');
        }

        res.status(201).json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAdminPayoutQueue = async (req: AuthRequest, res: Response) => {
    try {
        const requests = await prisma.withdrawalRequest.findMany({
            where: { status: 'PENDING' },
            include: {
                caregiver: {
                    include: { profile: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        });
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const approvePayout = async (req: AuthRequest, res: Response) => {
    try {
        const { requestId } = req.params;
        const { transactionId } = req.body; // M-Pesa transaction ID after manual payout

        const request = await prisma.withdrawalRequest.findUnique({
            where: { id: requestId },
            include: { caregiver: { include: { profile: true } } }
        });

        if (!request) return res.status(404).json({ message: "Request not found" });
        if (request.status !== 'PENDING') return res.status(400).json({ message: "Request already processed" });

        // Atomic update: Deduct balance and mark completed
        await prisma.$transaction([
            prisma.profile.update({
                where: { userId: request.caregiverId },
                data: {
                    balance: { decrement: request.amount },
                    totalPaid: { increment: request.amount }
                }
            }),
            prisma.withdrawalRequest.update({
                where: { id: requestId },
                data: {
                    status: 'COMPLETED',
                    payoutId: transactionId
                }
            }),
            prisma.payment.create({
                data: {
                    userId: request.caregiverId,
                    amount: request.amount,
                    transactionId,
                    phoneNumber: request.mpesaNumber,
                    status: 'SUCCESS',
                    type: 'ADMIN_PAYOUT'
                }
            })
        ]);

        // Notify Caregiver
        await createNotification(request.caregiverId, 'Payout Approved!', `Your withdrawal of KSh ${request.amount} has been processed: ${transactionId}`, 'FINANCE');

        res.json({ message: "Payout approved and recorded" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
