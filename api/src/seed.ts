import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
    const adminEmail = 'admin@truecare.com';
    const adminPassword = 'adminpassword123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
<<<<<<< HEAD
                profile: {
                    create: {
                        firstName: 'System',
                        lastName: 'Administrator',
                    }
                }
=======
                firstName: 'System',
                lastName: 'Administrator',
>>>>>>> 19273b9096fa76d374989ee9afb141420f514580
            },
        });
        console.log('✅ Admin user created: admin@truecare.com / adminpassword123');
    } else {
        console.log('ℹ️ Admin user already exists.');
    }

    await prisma.$disconnect();
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
