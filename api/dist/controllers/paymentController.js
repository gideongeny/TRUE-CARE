"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentHistory = exports.getPaymentStatus = exports.mpesaCallback = exports.adminPayCaregiver = exports.initiateStkPush = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const daraja_1 = require("../utils/daraja");
const initiateStkPush = async (req, res) => {
    const { amount, phoneNumber, userId, requestId, shiftId } = req.body;
    try {
        const payment = await prisma_1.default.payment.create({
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
        const darajaResponse = await daraja_1.DarajaService.initiateStkPush(phoneNumber, amount, `TC-${payment.id.slice(0, 8)}`);
        await prisma_1.default.payment.update({
            where: { id: payment.id },
            data: {
                transactionId: darajaResponse.CheckoutRequestID
            }
        });
        res.status(200).json({
            message: 'STK Push initiated successfully',
            checkoutRequestId: darajaResponse.CheckoutRequestID,
            paymentId: payment.id
        });
    }
    catch (error) {
        console.error('STK Push initiation failed', error);
        res.status(500).json({ error: error.message || 'Failed to initiate payment' });
    }
};
exports.initiateStkPush = initiateStkPush;
const adminPayCaregiver = async (req, res) => {
    const { shiftId, amount, caregiverId } = req.body;
    // User requested Admin phones: 0119585623, 0708332911
    // For sandbox, we use a test number or the one provided
    const adminPhone = "0119585623";
    try {
        const payment = await prisma_1.default.payment.create({
            data: {
                userId: caregiverId,
                shiftId,
                amount,
                phoneNumber: adminPhone, // Prompt goes to Admin to authorize
                status: 'PENDING',
                type: 'ADMIN_PAYOUT'
            }
        });
        const darajaResponse = await daraja_1.DarajaService.initiateStkPush(adminPhone, amount, `PAY-${shiftId.slice(0, 8)}`);
        await prisma_1.default.payment.update({
            where: { id: payment.id },
            data: { transactionId: darajaResponse.CheckoutRequestID }
        });
        res.json({ message: "Payout initiated. Admin, please confirm on your phone.", checkoutRequestId: darajaResponse.CheckoutRequestID });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.adminPayCaregiver = adminPayCaregiver;
const mpesaCallback = async (req, res) => {
    const { Body } = req.body;
    try {
        if (!Body.stkCallback) {
            return res.status(400).json({ error: 'Invalid callback data' });
        }
        const { ResultCode, ResultDesc, CallbackMetadata, CheckoutRequestID } = Body.stkCallback;
        const payment = await prisma_1.default.payment.findFirst({
            where: { transactionId: CheckoutRequestID }
        });
        if (!payment) {
            return res.status(404).json({ error: 'Payment not identified' });
        }
        if (ResultCode === 0) {
            const mpesaReceipt = CallbackMetadata.Item.find((item) => item.Name === 'MpesaReceiptNumber')?.Value;
            const updates = [
                prisma_1.default.payment.update({
                    where: { id: payment.id },
                    data: { status: 'SUCCESS', mpesaReceipt, updatedAt: new Date() }
                })
            ];
            if (payment.type === 'STK_PUSH') {
                // Patient paying for service
                updates.push(prisma_1.default.profile.update({
                    where: { userId: payment.userId },
                    data: {
                        totalPaid: { increment: payment.amount },
                        balance: { decrement: payment.amount }
                    }
                }));
                if (payment.requestId) {
                    const request = await prisma_1.default.serviceRequest.findUnique({ where: { id: payment.requestId } });
                    if (request) {
                        const newAmountPaid = Number(request.amountPaid || 0) + Number(payment.amount);
                        const newRemainingBalance = Math.max(0, Number(request.price || 0) - newAmountPaid);
                        updates.push(prisma_1.default.serviceRequest.update({
                            where: { id: payment.requestId },
                            data: {
                                amountPaid: newAmountPaid,
                                remainingBalance: newRemainingBalance,
                                status: newRemainingBalance <= 0 ? 'PAID' : 'PRICED'
                            }
                        }));
                    }
                }
            }
            else if (payment.type === 'ADMIN_PAYOUT') {
                // Admin paid caregiver
                updates.push(prisma_1.default.profile.update({
                    where: { userId: payment.userId }, // Caregiver
                    data: { balance: { increment: payment.amount } }
                }));
                if (payment.shiftId) {
                    updates.push(prisma_1.default.shift.update({
                        where: { id: payment.shiftId },
                        data: { status: 'PAID' }
                    }));
                }
            }
            await prisma_1.default.$transaction(updates);
            console.log(`Payment successful: ${CheckoutRequestID}`);
        }
        else {
            await prisma_1.default.payment.update({
                where: { id: payment.id },
                data: { status: 'FAILED' }
            });
        }
        res.status(200).json({ message: 'OK' });
    }
    catch (error) {
        console.error('Callback error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.mpesaCallback = mpesaCallback;
const getPaymentStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await prisma_1.default.payment.findUnique({
            where: { id }
        });
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.json(payment);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch payment status' });
    }
};
exports.getPaymentStatus = getPaymentStatus;
const getPaymentHistory = async (req, res) => {
    const userId = req.user?.userId;
    try {
        const payments = await prisma_1.default.payment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(payments);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch payment history' });
    }
};
exports.getPaymentHistory = getPaymentHistory;
