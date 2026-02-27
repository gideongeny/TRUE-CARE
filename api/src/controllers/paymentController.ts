import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import axios from 'axios';

// Placeholder for Daraja API logic
// In production, these should be in .env
const consumerKey = process.env.MPESA_CONSUMER_KEY || 'placeholder_key';
const consumerSecret = process.env.MPESA_CONSUMER_SECRET || 'placeholder_secret';
const shortCode = process.env.MPESA_SHORTCODE || '174379';
const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://your-api.com/api/payments/callback';

export const initiateStkPush = async (req: Request, res: Response) => {
    const { amount, phoneNumber, userId } = req.body;

    try {
        // 1. Create a pending payment record
        const payment = await prisma.payment.create({
            data: {
                userId,
                amount,
                phoneNumber,
                status: 'PENDING',
                type: 'STK_PUSH'
            }
        });

        // 2. Daraja STK Push Logic (Simplified for now)
        // In reality, you'd get an auth token first, then call the process request endpoint
        console.log(`Initiating STK Push for ${phoneNumber} of amount ${amount}`);

        // Mocking a successful initiation
        res.status(200).json({
            message: 'STK Push initiated successfully',
            paymentId: payment.id,
            MerchantRequestID: 'mock_merchant_id',
            CheckoutRequestID: 'mock_checkout_id'
        });
    } catch (error) {
        console.error('STK Push initiation failed', error);
        res.status(500).json({ error: 'Failed to initiate payment' });
    }
};

export const mpesaCallback = async (req: Request, res: Response) => {
    const { Body } = req.body;

    try {
        if (!Body.stkCallback) {
            return res.status(400).json({ error: 'Invalid callback data' });
        }

        const { ResultCode, ResultDesc, CallbackMetadata, CheckoutRequestID } = Body.stkCallback;

        if (ResultCode === 0) {
            // Success
            const mpesaReceipt = CallbackMetadata.Item.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
            const amount = CallbackMetadata.Item.find((item: any) => item.Name === 'Amount')?.Value;

            // In reality, match CheckoutRequestID to find our Payment record
            // Update payment record to SUCCESS
            console.log(`Payment successful: ${mpesaReceipt} for amount ${amount}`);

            // Logic to find patient and update their paymentStatus to PAID
        } else {
            // Failed
            console.log(`Payment failed: ${ResultDesc}`);
        }

        res.status(200).json({ message: 'Callback received' });
    } catch (error) {
        console.error('M-Pesa callback processing failed', error);
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
