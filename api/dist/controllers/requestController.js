"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRequestStatus = exports.adminSetPrice = exports.getRequests = exports.adminCreateRequest = exports.createRequest = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const createRequest = async (req, res) => {
    try {
        const patientId = req.user?.userId;
        if (!patientId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { careType, duration, location, description } = req.body;
        const request = await prisma_1.default.serviceRequest.create({
            data: {
                patientId,
                careType,
                duration,
                location,
                description,
                status: 'PENDING'
            },
        });
        res.status(201).json(request);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createRequest = createRequest;
const adminCreateRequest = async (req, res) => {
    try {
        const { patientId, careType, duration, location, description } = req.body;
        if (!patientId) {
            return res.status(400).json({ message: "patientId is required" });
        }
        const request = await prisma_1.default.serviceRequest.create({
            data: {
                patientId,
                careType,
                duration,
                location,
                description,
                status: 'PENDING'
            },
        });
        res.status(201).json(request);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.adminCreateRequest = adminCreateRequest;
const getRequests = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        let whereClause = {};
        if (role === 'PATIENT') {
            whereClause = { patientId: userId };
        }
        // Admin sees all, Caregiver might see pending requests (future feature)
        const requests = await prisma_1.default.serviceRequest.findMany({
            where: whereClause,
            include: {
                patient: { include: { profile: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(requests);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getRequests = getRequests;
const adminSetPrice = async (req, res) => {
    try {
        const { id } = req.params;
        const { price } = req.body;
        const request = await prisma_1.default.serviceRequest.update({
            where: { id },
            data: {
                price: Number(price),
                remainingBalance: Number(price),
                status: 'PRICED'
            }
        });
        // Notify patient here
        res.json(request);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.adminSetPrice = adminSetPrice;
const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const request = await prisma_1.default.serviceRequest.update({
            where: { id },
            data: { status }
        });
        // If approved by admin, create an assigned/open shift
        if (status === 'APPROVED') {
            const currentRequest = await prisma_1.default.serviceRequest.findUnique({ where: { id } });
            if (!currentRequest || currentRequest.status !== 'PAID') {
                return res.status(400).json({ message: "Request must be PAID before approval and caregiver assignment" });
            }
            await prisma_1.default.shift.create({
                data: {
                    patientId: request.patientId,
                    requestId: request.id,
                    caregiverId: null,
                    startTime: new Date(),
                    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // Default 8h
                    notes: `Session for ${request.careType}. Description: ${request.description || 'N/A'}`,
                    status: 'ASSIGNED',
                    earnings: Number(request.price) * 0.7 // Default 70% to caregiver
                }
            });
        }
        res.json(request);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateRequestStatus = updateRequestStatus;
