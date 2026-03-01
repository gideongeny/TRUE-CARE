"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLocation = exports.getUserById = exports.verifyUser = exports.getUsers = exports.updateProfile = exports.getProfile = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found in request" });
        }
        const start = Date.now();
        const user = await prisma_1.default.user.findUnique({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found in request" });
        }
        const { firstName, lastName, phone, address, bio, skills, hourlyRate } = req.body;
        const start = Date.now();
        const profile = await prisma_1.default.profile.upsert({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateProfile = updateProfile;
const getUsers = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            include: { profile: true },
        });
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUsers = getUsers;
const verifyUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.body;
        const profile = await prisma_1.default.profile.update({
            where: { userId: id },
            data: { isVerified }
        });
        res.json(profile);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.verifyUser = verifyUser;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma_1.default.user.findUnique({
            where: { id },
            include: {
                profile: true,
                patientShifts: {
                    include: { caregiver: { include: { profile: true } }, report: true },
                    orderBy: { startTime: 'desc' }
                },
                caregiverShifts: {
                    include: { patient: { include: { profile: true } }, report: true },
                    orderBy: { startTime: 'desc' }
                }
            }
        });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // Security: Exclude password and map shifts to unified array
        const { password, ...userWithoutPassword } = user;
        const shifts = user.role === 'PATIENT' ? user.patientShifts : user.caregiverShifts;
        res.json({
            ...userWithoutPassword,
            shifts
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserById = getUserById;
const updateLocation = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { latitude, longitude } = req.body;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        await prisma_1.default.profile.update({
            where: { userId },
            data: {
                lastLatitude: Number(latitude),
                lastLongitude: Number(longitude),
                locationUpdatedAt: new Date()
            }
        });
        res.json({ message: "Location updated" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateLocation = updateLocation;
