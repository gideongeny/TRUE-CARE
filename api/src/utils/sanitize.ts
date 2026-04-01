import prisma from './prisma';

async function sanitize() {
    console.log('--- SYSTEM SANITIZATION PROTOCOL ALPHA-9 ---');
    try {
        await prisma.clinicalLog.deleteMany({});
        await prisma.shift.deleteMany({});
        await prisma.serviceRequest.deleteMany({});
        await prisma.payment.deleteMany({});
        await prisma.withdrawalRequest.deleteMany({});
        await prisma.notification.deleteMany({});
        await prisma.review.deleteMany({});
        
        // Delete all users except ADMIN
        const deletedUsers = await prisma.user.deleteMany({
            where: {
                NOT: { role: 'ADMIN' }
            }
        });

        console.log(`System Sanitized. ${deletedUsers.count} non-admin nodes purged.`);
    } catch (error) {
        console.error('Sanitization failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

sanitize();
