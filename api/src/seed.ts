import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
    const salt = 10;
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const commonPassword = await bcrypt.hash('password123', salt);

    // Admin
    await prisma.user.upsert({
        where: { email: 'admin@truecare.com' },
        update: {},
        create: {
            email: 'admin@truecare.com',
            password: adminPassword,
            role: 'ADMIN',
            profile: {
                create: { firstName: 'System', lastName: 'Administrator' }
            }
        }
    });

    // Caregivers
    const caregivers = [
        { email: 'john@truecare.com', first: 'John', last: 'Githinji', bio: 'Expert in day-time medical monitoring and post-operative care.' },
        { email: 'francis_cg@truecare.com', first: 'Francis', last: 'Kangethe', bio: 'Specialist in nocturnal patient supervision and emergency response.' },
        { email: 'melsa@truecare.com', first: 'Melsa', last: 'Wanjiru', bio: 'Compassionate long-term care specialist with experience in chronic ailment management.' }
    ];

    for (const cg of caregivers) {
        await prisma.user.upsert({
            where: { email: cg.email },
            update: {},
            create: {
                email: cg.email,
                password: commonPassword,
                role: 'CAREGIVER',
                profile: {
                    create: {
                        firstName: cg.first,
                        lastName: cg.last,
                        bio: cg.bio,
                        isVerified: true,
                        cvVerified: true,
                        idVerified: true
                    }
                }
            }
        });
    }

    // Patient
    const patientFrancis = await prisma.user.upsert({
        where: { email: 'francis_patient@truecare.com' },
        update: {},
        create: {
            email: 'francis_patient@truecare.com',
            password: commonPassword,
            role: 'PATIENT',
            profile: {
                create: {
                    firstName: 'Francis',
                    lastName: 'Kangethe',
                    ailment: 'Post-Operative Cardiovascular Recovery',
                    medicalHistory: 'History of hypertension, successfully completed coronary bypass 2 weeks ago.',
                    paymentStatus: 'PAID'
                }
            }
        }
    });

    // Shifts
    const john = await prisma.user.findUnique({ where: { email: 'john@truecare.com' } });
    const francisCg = await prisma.user.findUnique({ where: { email: 'francis_cg@truecare.com' } });

    if (john && francisCg && patientFrancis) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // John - Day Shift
        const existingDayShift = await prisma.shift.findFirst({
            where: { caregiverId: john.id, patientId: patientFrancis.id, startTime: new Date(today.getTime() + 8 * 60 * 60 * 1000) }
        });
        if (!existingDayShift) {
            await prisma.shift.create({
                data: {
                    caregiverId: john.id,
                    patientId: patientFrancis.id,
                    startTime: new Date(today.getTime() + 8 * 60 * 60 * 1000), // 8 AM
                    endTime: new Date(today.getTime() + 20 * 60 * 60 * 1000), // 8 PM
                    shiftType: 'DAY',
                    status: 'IN_PROGRESS',
                    notes: 'Monitoring vitals and managing medication schedule.'
                }
            });
        }

        // Francis - Night Shift
        const existingNightShift = await prisma.shift.findFirst({
            where: { caregiverId: francisCg.id, patientId: patientFrancis.id, startTime: new Date(today.getTime() + 20 * 60 * 60 * 1000) }
        });
        if (!existingNightShift) {
            await prisma.shift.create({
                data: {
                    caregiverId: francisCg.id,
                    patientId: patientFrancis.id,
                    startTime: new Date(today.getTime() + 20 * 60 * 60 * 1000), // 8 PM
                    endTime: new Date(today.getTime() + 32 * 60 * 60 * 1000), // 8 AM next day
                    shiftType: 'NIGHT',
                    status: 'SCHEDULED',
                    notes: 'Nocturnal supervision and sleep hygiene management.'
                }
            });
        }
    }

    console.log('✅ Production seed complete: John, Francis, and Melsa initialized.');
    await prisma.$disconnect();
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
