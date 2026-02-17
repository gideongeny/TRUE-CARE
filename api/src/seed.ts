import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
    const adminEmail = 'admin@truecare.com';
    const adminPassword = 'adminpassword123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const user = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
        },
        create: {
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN',
            profile: {
                create: {
                    firstName: 'System',
                    lastName: 'Administrator',
                }
            }
        },
    });

    console.log('✅ Admin user secured: admin@truecare.com / adminpassword123');

    await prisma.$disconnect();
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
