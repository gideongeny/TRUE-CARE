import { Response, Request } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const ping = async (req: Request, res: Response) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'OK', database: 'CONNECTED', timestamp: new Date() });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', database: 'DISCONNECTED' });
    }
};

export const getAdminInsights = async (req: AuthRequest, res: Response) => {
    try {
        const totalEarnings = await prisma.profile.aggregate({ _sum: { totalBilled: true } });
        const pendingWithdrawals = await prisma.withdrawalRequest.aggregate({
            where: { status: 'PENDING' },
            _sum: { amount: true },
            _count: true
        });
        const activeShiftsCount = await prisma.shift.count({ where: { status: 'IN_PROGRESS' } });
        const unassignedShiftsCount = await prisma.shift.count({ where: { caregiverId: null } });

        const verificationPending = await prisma.profile.count({
            where: { isVerified: false, user: { role: 'CAREGIVER' } }
        });

        const recentClinicalLogs = await prisma.clinicalLog.count({
            where: { loggedAt: { gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) } }
        });

        const stats = await prisma.user.groupBy({
            by: ['role'],
            _count: true
        });

        const patientCount = stats.find(s => s.role === 'PATIENT')?._count || 0;

        res.json({
            totalNetworkEarnings: totalEarnings._sum.totalBilled || 0,
            pendingPayouts: {
                amount: pendingWithdrawals._sum.amount || 0,
                count: pendingWithdrawals._count || 0
            },
            operational: {
                activeShifts: activeShiftsCount,
                unassignedShifts: unassignedShiftsCount,
                verificationQueue: verificationPending
            },
            clinicalActivity: {
                last24hLogs: recentClinicalLogs
            },
            patientCount,
            patientTrend: 0 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getGlobalStats = async (req: AuthRequest, res: Response) => {
    try {
        const usersCount = await prisma.user.count();
        const shiftsCount = await prisma.shift.count();
        const pendingRequests = await prisma.serviceRequest.count({ where: { status: 'PENDING' } });
        const activeShifts = await prisma.shift.count({ where: { status: 'IN_PROGRESS' } });
        res.json({ usersCount, shiftsCount, pendingRequests, activeShifts });
    } catch (error) { res.status(500).json({ message: "Error fetching stats" }); }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            include: { profile: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) { res.status(500).json({ message: "Error fetching users" }); }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            include: { profile: true }
        });
        res.json(user);
    } catch (error) { res.status(500).json({ message: "Error fetching user" }); }
};

export const approveCaregiver = async (req: AuthRequest, res: Response) => {
    try {
        await prisma.profile.update({
            where: { userId: req.params.id },
            data: { isVerified: true }
        });
        res.json({ message: "Caregiver approved" });
    } catch (error) { res.status(500).json({ message: "Approval failed" }); }
};

export const rejectCaregiver = async (req: AuthRequest, res: Response) => {
    try {
        await prisma.profile.update({
            where: { userId: req.params.id },
            data: { isVerified: false }
        });
        res.json({ message: "Caregiver rejected" });
    } catch (error) { res.status(500).json({ message: "Rejection failed" }); }
};

export const getAllRequests = async (req: AuthRequest, res: Response) => {
    try {
        const requests = await prisma.serviceRequest.findMany({
            include: { patient: { include: { profile: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(requests);
    } catch (error) { res.status(500).json({ message: "Error fetching requests" }); }
};

export const getLiveOperations = async (req: AuthRequest, res: Response) => {
    try {
        const activeShifts = await prisma.shift.findMany({
            where: { status: 'IN_PROGRESS' },
            include: { caregiver: { include: { profile: true } }, patient: { include: { profile: true } } }
        });
        res.json(activeShifts);
    } catch (error) { res.status(500).json({ message: "Error fetching operations" }); }
};

export const reassignShift = async (req: AuthRequest, res: Response) => {
    try {
        const { caregiverId } = req.body;
        const shift = await prisma.shift.update({
            where: { id: req.params.id },
            data: { caregiverId, status: 'ASSIGNED' }
        });
        res.json(shift);
    } catch (error) { res.status(500).json({ message: "Reassignment failed" }); }
};

export const adminCreateUser = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password, role, firstName, lastName, phone, ailment, address, experienceYears } = req.body;
        
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ message: "Email already in system" });

        const hashedPassword = await bcrypt.hash(password || 'TrueCare2024!', 10);
        
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || 'PATIENT',
                profile: {
                    create: {
                        firstName,
                        lastName,
                        phone,
                        ailment,
                        address,
                        experienceYears: experienceYears ? Number(experienceYears) : undefined,
                        isVerified: role === 'CAREGIVER'
                    }
                }
            },
            include: { profile: true }
        });

        res.status(201).json(user);
    } catch (error: any) {
        if (error.code === 'P2002') { // Prisma unique constraint violation
            return res.status(400).json({ message: "Email already in system" });
        }
        console.error('CRITICAL: adminCreateUser failure:', {
            errorMessage: error.message,
            stack: error.stack,
            body: req.body
        });
        res.status(500).json({ message: "Tactical onboarding failed", details: error.message });
    }
};
export const adminUpdateUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, phone, ailment, address, isPremium } = req.body;

        await prisma.profile.update({
            where: { userId: id },
            data: { firstName, lastName, phone, ailment, address, isPremium: Boolean(isPremium) } as any
        });

        res.json({ message: "User vector updated" });
    } catch (error) { res.status(500).json({ message: "Update failed" }); }
};

export const adminDeleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Perform a comprehensive purge in a transaction to handle all relationships manually
        await prisma.$transaction([
            // 1. Delete notifications
            prisma.notification.deleteMany({ where: { userId: id } }),
            // 2. Delete reviews
            prisma.review.deleteMany({ where: { userId: id } }),
            // 3. Delete documentation
            prisma.verificationDoc.deleteMany({ where: { userId: id } }),
            // 4. Delete withdrawal requests
            prisma.withdrawalRequest.deleteMany({ where: { caregiverId: id } }),
            // 5. Delete shifts (and their clinical logs/reports)
            // Note: Clinical logs and reports are linked to shiftId. Let's find shiftIds first
            // or just use deleteMany on related tables if that logic is in place.
            // Since we want a single purge, we'll brute-force clear them based on patient or caregiver ID.
            prisma.clinicalLog.deleteMany({ where: { shift: { OR: [{ patientId: id }, { caregiverId: id }] } } }),
            prisma.report.deleteMany({ where: { shift: { OR: [{ patientId: id }, { caregiverId: id }] } } }),
            prisma.shift.deleteMany({ where: { OR: [{ patientId: id }, { caregiverId: id }] } }),
            // 6. Delete payments
            prisma.payment.deleteMany({ where: { userId: id } }),
            // 7. Delete service requests
            prisma.serviceRequest.deleteMany({ where: { patientId: id } }),
            // 8. Delete profile
            prisma.profile.deleteMany({ where: { userId: id } }),
            // 9. Finally, delete the User record
            prisma.user.delete({ where: { id } })
        ]);

        res.json({ message: "User permanently purged from system" });
    } catch (error) {
        console.error('Purge failed:', error);
        res.status(500).json({ message: "Failed to purge user history" });
    }
};

export const impersonateUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id }, include: { profile: true } });
        if (!user) return res.status(404).json({ message: "Subject not found" });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res.json({ token, user });
    } catch (error) { res.status(500).json({ message: "Impersonation failed" }); }
};

export const adminCancelShift = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.shift.update({
            where: { id },
            data: { status: 'CANCELLED', notes: (req.body.reason || 'Administrative cancellation') }
        });
        res.json({ message: "Shift terminated" });
    } catch (error) { res.status(500).json({ message: "Termination failed" }); }
};

export const adminAddClinicalLog = async (req: AuthRequest, res: Response) => {
    try {
        const { shiftId, content, pulse, temperature, bloodPressure, servicesRendered } = req.body;
        const log = await prisma.clinicalLog.create({
            data: {
                shiftId,
                content: `[ADMIN ENTRY] ${content}`,
                pulse,
                temperature,
                bloodPressure,
                servicesRendered,
                loggedAt: new Date()
            }
        });
        res.json(log);
    } catch (error) { res.status(500).json({ message: "Clinical documentation failed" }); }
};

export const systemReset = async (req: AuthRequest, res: Response) => {
    try {
        // Purge tactical tables
        await prisma.clinicalLog.deleteMany({});
        await prisma.shift.deleteMany({});
        await prisma.serviceRequest.deleteMany({});
        await prisma.payment.deleteMany({});
        await prisma.withdrawalRequest.deleteMany({});
        await prisma.notification.deleteMany({});
        try { await (prisma as any).review.deleteMany({}); } catch (e) { /* skip if model missing */ }
        
        // Delete all users except current admin
        await prisma.user.deleteMany({
            where: { NOT: { email: 'admin@truecare.com' } }
        });

        // Ensure the primary admin exists
        const adminEmail = 'admin@truecare.com';
        const adminPassword = await bcrypt.hash('Admin@123', 10);
        
        await prisma.user.upsert({
            where: { email: adminEmail },
            update: { password: adminPassword },
            create: {
                email: adminEmail,
                password: adminPassword,
                role: 'ADMIN',
                profile: {
                    create: {
                        firstName: 'TRUE-CARE',
                        lastName: 'ADMIN',
                        phone: '254000000000',
                        isVerified: true
                    }
                }
            }
        });

        res.json({ message: "System Reinitialized. Nuclear Reset Successful. Admin Node Active." });
    } catch (error) { 
        console.error(error);
        res.status(500).json({ message: "System reset failed" }); 
    }
};

export const adminSetPremium = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { isPremium } = req.body;

        await prisma.profile.update({
            where: { userId: id },
            data: { isPremium }
        });

        res.json({ message: `Access level updated to ${isPremium ? 'PREMIUM' : 'BASIC'}` });
    } catch (error) {
        res.status(500).json({ message: "Premium update failed" });
    }
};

// Stubs for build compatibility
export const getCaregiverPerformance = async (req: AuthRequest, res: Response) => res.json({ rating: 4.8, attendance: "98%" });
export const getShiftAnalytics = async (req: AuthRequest, res: Response) => {
    const shifts = await prisma.shift.findMany({ take: 7, orderBy: { startTime: 'desc' } });
    const data: any = {};
    shifts.forEach((s: any) => {
        const date = s.startTime.toISOString().split('T')[0];
        data[date] = (data[date] || 0) + 1;
    });
    res.json(data);
};
export const getActivityLog = async (req: AuthRequest, res: Response) => {
    const logs = await prisma.notification.findMany({ take: 10, orderBy: { createdAt: 'desc' } });
    res.json(logs);
};
export const getAdvancedAnalytics = async (req: AuthRequest, res: Response) => res.json({});
export const getSystemReports = async (req: AuthRequest, res: Response) => res.json([]);
export const getClinicalIntelligence = async (req: AuthRequest, res: Response) => res.json({ stabilityRate: "94%" });
export const getFinancialDashboard = async (req: AuthRequest, res: Response) => {
    try {
        const revenue = await prisma.payment.aggregate({
            where: { status: 'SUCCESS' },
            _sum: { amount: true }
        });

        const outstanding = await prisma.profile.aggregate({
            _sum: { balance: true }
        });

        const recentTransactions = await prisma.payment.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: { user: { include: { profile: true } } }
        });

        res.json({
            summary: {
                totalRevenue: revenue._sum.amount || 0,
                outstandingInvoices: outstanding._sum.balance || 0,
                caregiverPayoutsDue: 0 // Implement logic if needed
            },
            recentTransactions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Financial sync failed" });
    }
};
export const getPatientFinancialDetails = async (req: AuthRequest, res: Response) => res.json({});
export const getPlatformAnalytics = async (req: AuthRequest, res: Response) => {
    try {
        const totalRevenue = await prisma.payment.aggregate({
            where: { status: 'SUCCESS' },
            _sum: { amount: true }
        });

        const patientCount = await prisma.user.count({ where: { role: 'PATIENT' } });
        const caregiverCount = await prisma.user.count({ where: { role: 'CAREGIVER' } });
        const requestCount = await prisma.serviceRequest.count();

        // Revenue by day (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const revenueTrend = await prisma.payment.findMany({
            where: {
                status: 'SUCCESS',
                createdAt: { gte: thirtyDaysAgo }
            },
            select: { amount: true, createdAt: true }
        });

        res.json({
            metrics: {
                totalRevenue: totalRevenue._sum.amount || 0,
                activePatients: patientCount,
                verifiedPersonnel: caregiverCount,
                totalRequests: requestCount
            },
            revenueTrend
        });
    } catch (error) {
        res.status(500).json({ message: "Analytics generation failed" });
    }
};
export const updateShiftDetails = async (req: AuthRequest, res: Response) => res.json({});
