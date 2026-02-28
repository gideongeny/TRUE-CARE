"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disable2FA = exports.verifyAndEnable2FA = exports.setup2FA = void 0;
// @ts-ignore
const { authenticator } = require('otplib');
const qrcode_1 = __importDefault(require("qrcode"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const setup2FA = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const secret = authenticator.generateSecret();
        const otpauth = authenticator.keyuri(user.email, 'TRUE-CARE', secret);
        const qrCodeUrl = await qrcode_1.default.toDataURL(otpauth);
        // Store secret temporarily or expect verification before saving
        res.json({ secret, qrCodeUrl });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error setting up 2FA' });
    }
};
exports.setup2FA = setup2FA;
const verifyAndEnable2FA = async (req, res) => {
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
        await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                twoFactorSecret: secret,
                twoFactorEnabled: true,
            },
        });
        res.json({ message: '2FA enabled successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error enabling 2FA' });
    }
};
exports.verifyAndEnable2FA = verifyAndEnable2FA;
const disable2FA = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                twoFactorSecret: null,
                twoFactorEnabled: false,
            },
        });
        res.json({ message: '2FA disabled successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error disabling 2FA' });
    }
};
exports.disable2FA = disable2FA;
