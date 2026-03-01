import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

export const getGlobalStats = async (req: Request, res: Response) => {
    try {
        const [
            patientCount,
            caregiverCount,
            pendingRequests,
            activeShifts,
            totalRevenueResult,
            allCaregivers,
        ] = await Promise.all([
            prisma.user.count({ where: { role: 'PATIENT', isDeleted: false } }),
            prisma.user.count({ where: { role: 'CAREGIVER', isDeleted: false, profile: { isVerified: true } } }),
            prisma.serviceRequest.count({ where: { status: 'PENDING' } }),
            prisma.shift.count({ where: { status: 'IN_PROGRESS' } }),
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: { status: 'SUCCESS', type: 'STK_PUSH' }
            }),
            prisma.user.findMany({
                where: { role: 'CAREGIVER', isDeleted: false },
                include: { profile: true }
            })
        ]);

        const verifiedCount = allCaregivers.filter(c => c.profile?.isVerified).length;
        const totalRevenue = totalRevenueResult._sum.amount ? parseFloat(totalRevenueResult._sum.amount.toString()) : 0;

        res.json({
            patientCount,
            patientTrend: "+12%",
            caregiverCount: verifiedCount,
            caregiverTrend: "+5%",
            pendingRequests,
            activeShifts,
            totalRevenue,
            operationalLoad: activeShifts > 10 ? 'High' : activeShifts > 5 ? 'Active' : 'Stable'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getFinancialDashboard = async (req: Request, res: Response) => {
    try {
        const [patients, recentTransactions, totals] = await Promise.all([
            prisma.user.findMany({
                where: { role: 'PATIENT', isDeleted: false },
                include: { profile: true, serviceRequests: true }
            }),
            prisma.payment.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { user: { include: { profile: true } } }
            }),
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: { status: 'SUCCESS' }
            })
        ]);

        const summary = {
            totalRevenue: totals._sum.amount ? parseFloat(totals._sum.amount.toString()) : 0,
            outstandingInvoices: patients.reduce((acc, p) => acc + Number(p.profile?.balance || 0), 0),
            caregiverPayoutsDue: 0
        };

        const financials = patients.map(p => {
            const totalBilled = Number(p.profile?.totalBilled || 0);
            const totalPaid = Number(p.profile?.totalPaid || 0);
            return {
                id: p.id,
                name: `${p.profile?.firstName} ${p.profile?.lastName}`,
                totalSessions: p.serviceRequests.length,
                totalBilled,
                totalPaid,
                balance: Number(p.profile?.balance || 0),
                status: totalBilled > totalPaid ? 'Balance Due' : 'Paid'
            };
        });

        res.json({
            patients: financials,
            recentTransactions,
            summary
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: { isDeleted: false },
            include: { profile: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllRequests = async (req: Request, res: Response) => {
    try {
        const requests = await prisma.serviceRequest.findMany({
            include: {
                patient: { include: { profile: true } },
                shift: { include: { caregiver: { include: { profile: true } } } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPatientFinancialDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const patient = await prisma.user.findUnique({
            where: { id },
            include: {
                profile: true,
                serviceRequests: { orderBy: { createdAt: 'desc' } },
                payments: { orderBy: { createdAt: 'desc' } }
            }
        });

        if (!patient) return res.status(404).json({ message: "Patient not found" });

        res.json({
            profile: patient.profile,
            sessions: patient.serviceRequests,
            transactions: patient.payments,
            summary: {
                totalBilled: Number(patient.profile?.totalBilled || 0),
                totalPaid: Number(patient.profile?.totalPaid || 0),
                balance: Number(patient.profile?.balance || 0)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAdvancedAnalytics = async (req: Request, res: Response) => {
    try {
        const [shiftsByType, recentShifts] = await Promise.all([
            prisma.serviceRequest.groupBy({
                by: ['careType'],
                _count: { _all: true }
            }),
            prisma.shift.findMany({
                where: { status: 'COMPLETED' },
                take: 100,
                orderBy: { endTime: 'desc' }
            })
        ]);

        const distribution = shiftsByType.map(item => ({
            name: item.careType,
            value: item._count._all
        }));

        res.json({
            distribution,
            retentionRate: '92.4' // Logic for retention could be added here based on recurring patientIds
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCaregiverPerformance = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const caregiver = await prisma.user.findUnique({
            where: { id },
            include: {
                profile: true,
                caregiverShifts: {
                    include: { patient: { include: { profile: true } } },
                    orderBy: { startTime: 'desc' },
                }
            }
        });

        if (!caregiver) return res.status(404).json({ message: "Caregiver not found" });

        // Calculate total hours
        const totalHours = caregiver.caregiverShifts.reduce((acc, shift) => acc + (shift.actualDuration || 0), 0);

        res.json({
            caregiver,
            totalHours: parseFloat(totalHours.toFixed(2)),
            shiftCount: caregiver.caregiverShifts.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getShiftAnalytics = async (req: Request, res: Response) => {
    try {
        // Last 7 days aggregation
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const shifts = await prisma.shift.findMany({
            where: {
                startTime: { gte: sevenDaysAgo }
            },
            select: {
                startTime: true,
                status: true
            }
        });

        // Simple grouping by date
        const analytics = shifts.reduce((acc: any, shift) => {
            const date = shift.startTime.toISOString().split('T')[0];
            if (!acc[date]) acc[date] = 0;
            acc[date]++;
            return acc;
        }, {});

        res.json(analytics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getActivityLog = async (req: Request, res: Response) => {
    try {
        const [recentRequests, recentShifts] = await Promise.all([
            prisma.serviceRequest.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { patient: { include: { profile: true } } }
            }),
            prisma.shift.findMany({
                take: 5,
                orderBy: { updatedAt: 'desc' },
                include: {
                    caregiver: { include: { profile: true } },
                    patient: { include: { profile: true } }
                }
            })
        ]);

        const events = [
            ...recentRequests.map(r => ({
                id: r.id,
                type: 'REQUEST',
                title: 'New Service Request',
                description: `${r.patient.profile?.firstName} requested ${r.careType}`,
                time: r.createdAt,
                status: r.status
            })),
            ...recentShifts.map(s => ({
                id: s.id,
                type: 'SHIFT',
                title: s.status === 'IN_PROGRESS' ? 'Shift Started' : s.status === 'COMPLETED' ? 'Shift Completed' : 'Shift Claimed',
                description: `${s.caregiver?.profile?.firstName || 'Caregiver'} for ${s.patient.profile?.firstName}`,
                time: s.updatedAt,
                status: s.status
            }))
        ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 10);

        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getVerificationQueue = async (req: Request, res: Response) => {
    try {
        const { skip = 0, take = 50 } = req.query;
        const pending = await prisma.user.findMany({
            where: {
                role: 'CAREGIVER',
                isDeleted: false,
                profile: { isVerified: false }
            },
            include: { profile: true },
            orderBy: { createdAt: 'desc' },
            skip: Number(skip),
            take: Number(take)
        });

        const queue = pending.map(p => ({
            id: p.id,
            name: `${p.profile?.firstName} ${p.profile?.lastName}`,
            role: 'Care Professional',
            status: p.profile?.idCardUrl ? 'Identity Uploaded' : 'Pending Documents',
            risk: 'Low',
            date: p.createdAt
        }));

        res.json(queue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const approveCaregiver = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.profile.update({
            where: { userId: id },
            data: { isVerified: true }
        });

        // Create notification
        await prisma.notification.create({
            data: {
                userId: id,
                title: 'Account Verified',
                message: 'Your caregiver profile has been approved. You can now claim shifts!',
                type: 'SYSTEM'
            }
        });

        res.json({ message: 'Caregiver approved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const rejectCaregiver = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // In a real system, you might delete the profile or mark as rejected
        // For now we just reset verification or could soft delete
        await prisma.profile.update({
            where: { userId: id },
            data: { isVerified: false }
        });

        await prisma.notification.create({
            data: {
                userId: id,
                title: 'Verification Update',
                message: 'Your verification request was rejected. Please review your documents.',
                type: 'SYSTEM'
            }
        });

        res.json({ message: 'Caregiver rejected' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSystemReports = async (req: Request, res: Response) => {
    try {
        const { skip = 0, take = 50 } = req.query;
        const reports = await prisma.report.findMany({
            include: {
                shift: {
                    include: {
                        caregiver: { include: { profile: true } },
                        patient: { include: { profile: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip: Number(skip),
            take: Number(take)
        });

        res.json({
            reports: reports.map(r => ({
                id: r.id,
                name: `Clinical Report - ${r.shift.patient.profile?.lastName}`,
                caregiver: `${r.shift.caregiver?.profile?.firstName} ${r.shift.caregiver?.profile?.lastName}`,
                patient: `${r.shift.patient.profile?.firstName} ${r.shift.patient.profile?.lastName}`,
                type: 'Clinical',
                date: r.createdAt.toISOString().split('T')[0],
                size: '0.1 MB',
                content: r.content,
                vitals: r.vitals
            })),
            stats: {
                generated: reports.length,
                completionRate: 100
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getClinicalIntelligence = async (req: Request, res: Response) => {
    try {
        // Target specifically Francis Kangethe as requested by user
        const patient = await prisma.user.findFirst({
            where: {
                role: 'PATIENT',
                profile: {
                    OR: [
                        { firstName: { contains: 'Francis' } },
                        { lastName: { contains: 'Kangethe' } }
                    ]
                }
            },
            include: {
                profile: true,
                patientShifts: {
                    include: {
                        caregiver: { include: { profile: true } },
                        report: true
                    },
                    orderBy: { startTime: 'desc' }
                }
            }
        });

        if (!patient) {
            // Fallback to first patient if Francis is not found
            const fallback = await prisma.user.findFirst({
                where: { role: 'PATIENT' },
                include: {
                    profile: true,
                    patientShifts: {
                        include: {
                            caregiver: { include: { profile: true } },
                            report: true
                        },
                        orderBy: { startTime: 'desc' }
                    }
                }
            });
            return res.json(fallback);
        }

        res.json(patient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const adminDeleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.user.update({
            where: { id },
            data: { isDeleted: true }
        });
        res.json({ message: 'User soft-deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const adminCreateUser = async (req: Request, res: Response) => {
    try {
        const { email, password, role, firstName, lastName, phone, address, ailment, experienceYears } = req.body;

        // Basic check
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                profile: {
                    create: {
                        firstName,
                        lastName,
                        phone,
                        address,
                        ailment: role === 'PATIENT' ? ailment : undefined,
                        experienceYears: role === 'CAREGIVER' ? Number(experienceYears) : undefined,
                        isVerified: role === 'ADMIN' // Admins are verified by default
                    }
                }
            },
            include: { profile: true }
        });

        res.json(user);
    } catch (error: any) {
        console.error('adminCreateUser error:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

export const adminUpdateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, phone, ailment, experienceYears, role } = req.body;

        const updated = await prisma.user.update({
            where: { id },
            data: {
                role,
                profile: {
                    update: {
                        firstName,
                        lastName,
                        phone,
                        ailment,
                        experienceYears: experienceYears ? Number(experienceYears) : undefined
                    }
                }
            },
            include: { profile: true }
        });

        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPlatformAnalytics = async (req: Request, res: Response) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [
            usersCount,
            patientsCount,
            caregiversCount,
            monthlyRevenue,
            activeShiftsTrend,
            recentPayments
        ] = await Promise.all([
            prisma.user.count({ where: { isDeleted: false } }),
            prisma.user.count({ where: { role: 'PATIENT', isDeleted: false } }),
            prisma.user.count({ where: { role: 'CAREGIVER', isDeleted: false } }),
            prisma.payment.groupBy({
                by: ['createdAt'],
                where: { status: 'SUCCESS', createdAt: { gte: sixMonthsAgo } },
                _sum: { amount: true }
            }),
            prisma.shift.groupBy({
                by: ['startTime'],
                where: { startTime: { gte: thirtyDaysAgo } },
                _count: { _all: true }
            }),
            prisma.payment.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { user: { include: { profile: true } } }
            })
        ]);

        // Process time-series data
        const revenueTrend = monthlyRevenue.map(r => ({
            date: r.createdAt.toISOString().split('T')[0],
            amount: parseFloat(r._sum.amount?.toString() || '0')
        }));

        const shiftsTrend = activeShiftsTrend.map(s => ({
            date: s.startTime.toISOString().split('T')[0],
            count: s._count._all
        }));

        res.json({
            totals: {
                users: usersCount,
                patients: patientsCount,
                caregivers: caregiversCount
            },
            revenueTrend,
            shiftsTrend,
            recentPayments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
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

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const impersonateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id }, include: { profile: true } });

        if (!user) return res.status(404).json({ message: "User not found" });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const reassignShift = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { caregiverId } = req.body;

        const updatedShift = await prisma.shift.update({
            where: { id },
            data: { caregiverId },
            include: { caregiver: { include: { profile: true } } }
        });

        res.json(updatedShift);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateShiftDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { endTime, earnings, notes } = req.body;

        const updatedShift = await prisma.shift.update({
            where: { id },
            data: {
                endTime: endTime ? new Date(endTime) : undefined,
                earnings: earnings ? Number(earnings) : undefined,
                notes
            },
            include: { patient: { include: { profile: true } }, caregiver: { include: { profile: true } } }
        });

        res.json(updatedShift);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getLiveOperations = async (req: Request, res: Response) => {
    try {
        const activeShifts = await prisma.shift.findMany({
            where: { status: 'IN_PROGRESS' },
            include: {
                caregiver: { include: { profile: true } },
                patient: { include: { profile: true } }
            }
        });

        res.json(activeShifts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

