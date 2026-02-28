"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReport = exports.clockOut = exports.clockIn = exports.acceptShift = exports.updateShiftPayment = exports.deleteShift = exports.claimShift = exports.getAvailableShifts = exports.getShifts = exports.createShift = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const createShift = async (req, res) => {
    try {
        const { caregiverId, patientId, requestId, startTime, endTime, notes, earnings } = req.body;
        if (!patientId || !startTime || !endTime) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const shift = await prisma_1.default.shift.create({
            data: {
                caregiverId: caregiverId || null,
                patientId,
                requestId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                notes,
                status: caregiverId ? 'ASSIGNED' : 'ASSIGNED', // Start as ASSIGNED even if caregiverId is present
                earnings: earnings ? Number(earnings) : 0,
            },
            include: {
                caregiver: { include: { profile: true } },
                patient: { include: { profile: true } },
            },
        });
        // Trigger notification logic here if needed
        res.status(201).json(shift);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createShift = createShift;
const getShifts = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        let whereClause = {};
        if (role === 'PATIENT') {
            whereClause = { patientId: userId };
        }
        else if (role === 'CAREGIVER') {
            whereClause = { caregiverId: userId };
        }
        // ADMIN sees all
        const shifts = await prisma_1.default.shift.findMany({
            where: whereClause,
            include: {
                caregiver: { include: { profile: true } },
                patient: { include: { profile: true } },
            },
            orderBy: { startTime: 'desc' },
        });
        res.json(shifts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getShifts = getShifts;
const getAvailableShifts = async (req, res) => {
    try {
        const shifts = await prisma_1.default.shift.findMany({
            where: {
                caregiverId: null,
                status: 'ASSIGNED'
            },
            include: {
                patient: { include: { profile: true } },
            },
            orderBy: { startTime: 'asc' },
        });
        res.json(shifts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAvailableShifts = getAvailableShifts;
const claimShift = async (req, res) => {
    try {
        const { id } = req.params;
        const caregiverId = req.user?.userId;
        if (!caregiverId)
            return res.status(401).json({ message: "Unauthorized" });
        const shift = await prisma_1.default.shift.findUnique({ where: { id } });
        if (!shift)
            return res.status(404).json({ message: "Shift not found" });
        if (shift.caregiverId)
            return res.status(400).json({ message: "Shift already claimed" });
        const updatedShift = await prisma_1.default.shift.update({
            where: { id },
            data: {
                caregiverId,
                status: 'ACCEPTED' // Auto-accept when claimed
            },
        });
        res.json(updatedShift);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.claimShift = claimShift;
const deleteShift = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.shift.delete({ where: { id } });
        res.json({ message: 'Shift deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteShift = deleteShift;
const updateShiftPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { earnings } = req.body;
        const updatedShift = await prisma_1.default.shift.update({
            where: { id },
            data: { earnings: Number(earnings) }
        });
        res.json(updatedShift);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateShiftPayment = updateShiftPayment;
const acceptShift = async (req, res) => {
    try {
        const { id } = req.params;
        const caregiverId = req.user?.userId;
        const shift = await prisma_1.default.shift.findUnique({ where: { id } });
        if (!shift)
            return res.status(404).json({ message: "Shift not found" });
        if (shift.caregiverId !== caregiverId)
            return res.status(403).json({ message: "Unassigned shift" });
        const updatedShift = await prisma_1.default.shift.update({
            where: { id },
            data: { status: 'ACCEPTED' },
        });
        res.json(updatedShift);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.acceptShift = acceptShift;
const clockIn = async (req, res) => {
    try {
        const { id } = req.params;
        const clockInTime = new Date();
        const updatedShift = await prisma_1.default.shift.update({
            where: { id },
            data: { clockInTime, status: 'IN_PROGRESS' },
        });
        res.json(updatedShift);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.clockIn = clockIn;
const clockOut = async (req, res) => {
    try {
        const { id } = req.params;
        const clockOutTime = new Date();
        const shift = await prisma_1.default.shift.findUnique({ where: { id } });
        if (!shift || !shift.clockInTime) {
            return res.status(400).json({ message: "Cannot clock out without clocking in" });
        }
        const diffMs = clockOutTime.getTime() - shift.clockInTime.getTime();
        const actualDuration = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
        const updatedShift = await prisma_1.default.shift.update({
            where: { id },
            data: {
                clockOutTime,
                status: 'COMPLETED',
                actualDuration
            },
        });
        // Notify Admin logic here
        res.json(updatedShift);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.clockOut = clockOut;
const createReport = async (req, res) => {
    try {
        const { id: shiftId } = req.params;
        const { content, vitals } = req.body;
        const shift = await prisma_1.default.shift.findUnique({ where: { id: shiftId } });
        if (!shift)
            return res.status(404).json({ message: "Shift not found" });
        const report = await prisma_1.default.report.upsert({
            where: { shiftId },
            update: { content, vitals },
            create: { shiftId, content, vitals },
        });
        res.status(201).json(report);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createReport = createReport;
