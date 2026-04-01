import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { DarajaService } from '../utils/daraja';
import { AuthRequest } from '../types/AuthRequest';

export const initiateStkPush = async (req: Request, res: Response) => {
    const { amount, phoneNumber, userId, requestId, shiftId } = req.body;

    try {
        const payment = await prisma.payment.create({
            data: {
                userId,
                requestId,
                shiftId,
                amount,
                phoneNumber,
                status: 'PENDING',
                type: 'STK_PUSH'
            }
        });

        const darajaResponse = await DarajaService.initiateStkPush(
            phoneNumber,
            amount,
            `TC-${payment.id.slice(0, 8)}`
        );

        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                transactionId: (darajaResponse as any).CheckoutRequestID
            }
        });

        res.status(200).json({
            message: 'STK Push initiated successfully',
            checkoutRequestId: (darajaResponse as any).CheckoutRequestID,
            paymentId: payment.id
        });
    } catch (error: any) {
        console.error('STK Push initiation failed', error);
        res.status(500).json({ error: error.message || 'Failed to initiate payment' });
    }
};

export const adminInitiateStkPushForUser = async (req: Request, res: Response) => {
    const { userId, amount, phoneNumber, requestId } = req.body;

    try {
        const payment = await prisma.payment.create({
            data: {
                userId,
                requestId,
                amount,
                phoneNumber,
                status: 'PENDING',
                type: 'STK_PUSH' // Still an STK push, but initiated by admin
            }
        });

        const darajaResponse = await DarajaService.initiateStkPush(
            phoneNumber,
            amount,
            `ADM-${payment.id.slice(0, 8)}`
        );

        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                transactionId: (darajaResponse as any).CheckoutRequestID
            }
        });

        res.status(200).json({
            message: 'Administrative STK Push initiated',
            checkoutRequestId: (darajaResponse as any).CheckoutRequestID,
            paymentId: payment.id
        });
    } catch (error: any) {
        console.error('Admin STK Push failed', error);
        res.status(500).json({ error: error.message || 'Failed to initiate admin payment' });
    }
};

export const adminPayCaregiver = async (req: Request, res: Response) => {
    const { shiftId, amount, caregiverId } = req.body;
    // User requested Admin phones: 0119585623, 0708332911
    // For sandbox, we use a test number or the one provided
    const adminPhone = "0119585623";

    try {
        const payment = await prisma.payment.create({
            data: {
                userId: caregiverId,
                shiftId,
                amount,
                phoneNumber: adminPhone, // Prompt goes to Admin to authorize
                status: 'PENDING',
                type: 'ADMIN_PAYOUT'
            }
        });

        const darajaResponse = await DarajaService.initiateStkPush(
            adminPhone,
            amount,
            `PAY-${shiftId.slice(0, 8)}`
        );

        await prisma.payment.update({
            where: { id: payment.id },
            data: { transactionId: (darajaResponse as any).CheckoutRequestID }
        });

        res.json({ message: "Payout initiated. Admin, please confirm on your phone.", checkoutRequestId: (darajaResponse as any).CheckoutRequestID });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const mpesaCallback = async (req: Request, res: Response) => {
    const { Body } = req.body;

    try {
        if (!Body.stkCallback) {
            return res.status(400).json({ error: 'Invalid callback data' });
        }

        const { ResultCode, ResultDesc, CallbackMetadata, CheckoutRequestID } = Body.stkCallback;

        const payment = await prisma.payment.findFirst({
            where: { transactionId: CheckoutRequestID }
        });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not identified' });
        }

        if (ResultCode === 0) {
            const mpesaReceipt = CallbackMetadata.Item.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;

            const updates: any[] = [
                prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: 'SUCCESS', mpesaReceipt, updatedAt: new Date() }
                })
            ];

            if (payment.type === 'STK_PUSH') {
                // Patient paying for service
                updates.push(prisma.profile.update({
                    where: { userId: payment.userId },
                    data: {
                        totalPaid: { increment: payment.amount },
                        balance: { decrement: payment.amount }
                    }
                }));

                if (payment.requestId) {
                    const request = await prisma.serviceRequest.findUnique({ where: { id: payment.requestId } });
                    if (request) {
                        const newAmountPaid = Number(request.amountPaid || 0) + Number(payment.amount);
                        const newRemainingBalance = Math.max(0, Number(request.price || 0) - newAmountPaid);

                        updates.push(prisma.serviceRequest.update({
                            where: { id: payment.requestId },
                            data: {
                                amountPaid: newAmountPaid,
                                remainingBalance: newRemainingBalance,
                                status: newRemainingBalance <= 0 ? 'PAID' : 'PRICED'
                            }
                        }));
                    }
                }
            } else if (payment.type === 'ADMIN_PAYOUT') {
                // Admin paid caregiver
                updates.push(prisma.profile.update({
                    where: { userId: payment.userId }, // Caregiver
                    data: { balance: { increment: payment.amount } }
                }));

                if (payment.shiftId) {
                    updates.push(prisma.shift.update({
                        where: { id: payment.shiftId },
                        data: { status: 'PAID' }
                    }));
                }
            }

            await prisma.$transaction(updates);
            console.log(`Payment successful: ${CheckoutRequestID}`);
        } else {
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'FAILED' }
            });
        }

        res.status(200).json({ message: 'OK' });
    } catch (error) {
        console.error('Callback error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const payment = await prisma.payment.findUnique({
            where: { id }
        });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payment status' });
    }
};

export const getPaymentHistory = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    try {
        const payments = await prisma.payment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payment history' });
    }
};

export const adminRequestManualPayment = async (req: Request, res: Response) => {
    const { userId, amount, requestId, reference } = req.body;
    try {
        const payment = await prisma.payment.create({
            data: {
                userId,
                requestId,
                amount: Number(amount),
                phoneNumber: 'N/A', // Bank transfer doesn't require phone verification
                status: 'PENDING',
                type: 'IM_BANK_TRANSFER',
                transactionId: reference || `IM-${Date.now()}`
            }
        });

        // Track as debt in profile balance
        await prisma.profile.update({
            where: { userId },
            data: { balance: { increment: Number(amount) } }
        });

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: "Failed to record payment request" });
    }
};

export const adminConfirmManualPayment = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const payment = await prisma.payment.findUnique({ where: { id } });
        if (!payment) return res.status(404).json({ message: "Payment not found" });

        const updates: any[] = [
            prisma.payment.update({
                where: { id },
                data: { status: 'SUCCESS', updatedAt: new Date() }
            }),
            prisma.profile.update({
                where: { userId: payment.userId },
                data: {
                    totalPaid: { increment: payment.amount },
                    balance: { decrement: payment.amount }
                }
            })
        ];

        if (payment.requestId) {
            const request = await prisma.serviceRequest.findUnique({ where: { id: payment.requestId } });
            if (request) {
                const newAmountPaid = Number(request.amountPaid || 0) + Number(payment.amount);
                const newRemainingBalance = Math.max(0, Number(request.price || 0) - newAmountPaid);

                updates.push(prisma.serviceRequest.update({
                    where: { id: payment.requestId },
                    data: {
                        amountPaid: newAmountPaid,
                        remainingBalance: newRemainingBalance,
                        status: newRemainingBalance <= 0 ? 'PAID' : 'PRICED'
                    }
                }));
            }
        }

        await prisma.$transaction(updates);
        res.json({ message: "Payment confirmed and accounts updated" });
    } catch (error) {
        res.status(500).json({ message: "Confirmation failed" });
    }
};

export const getPendingManualPayments = async (req: Request, res: Response) => {
    try {
        const payments = await prisma.payment.findMany({
            where: { type: 'IM_BANK_TRANSFER', status: 'PENDING' },
            include: { user: { include: { profile: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch pending payments" });
    }
};
