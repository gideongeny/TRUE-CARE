"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// @ts-ignore
const { authenticator } = require('otplib');
const prisma_1 = __importDefault(require("../utils/prisma"));
const getJwtSecret = () => process.env.JWT_SECRET || 'secret';
const register = async (req, res) => {
    try {
        const { email, password, role, firstName, lastName, phone, profile: profileData } = req.body;
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
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
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, getJwtSecret());
        res.status(201).json({ token, user });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password, userId, token: tfaToken, is2FAAction } = req.body;
        if (is2FAAction) {
            const user = await prisma_1.default.user.findUnique({ where: { id: userId }, include: { profile: true } });
            if (!user || !user.twoFactorSecret) {
                return res.status(400).json({ message: 'Invalid 2FA request' });
            }
            const isValid = authenticator.verify({ token: tfaToken, secret: user.twoFactorSecret });
            if (!isValid) {
                return res.status(400).json({ message: 'Invalid verification code' });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, getJwtSecret());
            return res.json({ token, user });
        }
        const user = await prisma_1.default.user.findUnique({ where: { email }, include: { profile: true } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (user.twoFactorEnabled) {
            return res.json({ require2FA: true, userId: user.id });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, getJwtSecret(), { expiresIn: '1d' });
        res.json({ token, user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                notifications: { orderBy: { createdAt: 'desc' }, take: 5 }
            }
        });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    }
    catch (error) {
        console.error('getMe error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getMe = getMe;
