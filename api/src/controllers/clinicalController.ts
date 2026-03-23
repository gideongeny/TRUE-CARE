import { Response } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import prisma from '../utils/prisma';

export const addClinicalLog = async (req: AuthRequest, res: Response) => {
    try {
        const { 
            shiftId, 
            content, 
            vitals,
            servicesRendered,
            pulse,
            temperature,
            respiration,
            bloodPressure,
            nutritionHydration,
            eliminationDetails,
            safetyEnvironment
        } = req.body;
        const caregiverId = req.user?.userId;

        if (!shiftId || !content) {
            return res.status(400).json({ message: "Missing shiftId or content" });
        }

        // Verify shift belongs to caregiver or admin
        const shift = await prisma.shift.findUnique({
            where: { id: shiftId }
        });

        if (!shift) return res.status(404).json({ message: "Shift not found" });

        if (req.user?.role !== 'ADMIN' && shift.caregiverId !== caregiverId) {
            return res.status(403).json({ message: "Unauthorized to log for this shift" });
        }

        const log = await prisma.clinicalLog.create({
            data: {
                shiftId,
                content,
                servicesRendered,
                pulse,
                temperature,
                respiration,
                bloodPressure,
                nutritionHydration,
                eliminationDetails,
                safetyEnvironment,
                vitals: typeof vitals === 'string' ? vitals : JSON.stringify(vitals)
            }
        });

        res.status(201).json(log);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getClinicalLogs = async (req: AuthRequest, res: Response) => {
    try {
        const { shiftId } = req.params;
        const logs = await prisma.clinicalLog.findMany({
            where: { shiftId },
            orderBy: { loggedAt: 'desc' }
        });
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPatientHealthHistory = async (req: AuthRequest, res: Response) => {
    try {
        const { patientId } = req.params;
        const logs = await prisma.clinicalLog.findMany({
            where: {
                shift: {
                    patientId: patientId
                }
            },
            include: {
                shift: {
                    select: {
                        startTime: true,
                        caregiver: {
                            select: {
                                profile: {
                                    select: { firstName: true, lastName: true }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { loggedAt: 'desc' }
        });
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
