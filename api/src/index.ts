import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Global Error Handlers for Production Stability
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    console.error(err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (err: any) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

import { execSync } from 'child_process';
import prisma from './utils/prisma';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import shiftRoutes from './routes/shiftRoutes';
import requestRoutes from './routes/requestRoutes';
import paymentRoutes from './routes/paymentRoutes';

import rateLimit from 'express-rate-limit'; // Security best practice

const app = express();
const port = process.env.PORT || 3001; // Changed to 3001 to avoid conflict with Next.js

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use('/api/', limiter);

app.get('/api/public/init-db', async (req: Request, res: Response) => {
    try {
        console.log('Starting database seeding...');

        // Sanitize URLs to handle common Render entry errors (quotes, spaces)
        if (process.env.DATABASE_URL) {
            process.env.DATABASE_URL = process.env.DATABASE_URL.replace(/['"]/g, '').trim();
        }
        if (process.env.DIRECT_URL) {
            process.env.DIRECT_URL = process.env.DIRECT_URL.replace(/['"]/g, '').trim();
        }

        // Debug URL format (safe)
        const dbUrl = process.env.DATABASE_URL || '';
        const drUrl = process.env.DIRECT_URL || '';
        console.log(`DATABASE_URL prefix: ${dbUrl.substring(0, 15)}... len: ${dbUrl.length}`);
        console.log(`DIRECT_URL prefix: ${drUrl.substring(0, 15)}... len: ${drUrl.length}`);

        // Only run seed — schema is managed via migrations, not db push
        const seedResult = execSync('npm run seed', { timeout: 60000 }).toString();
        console.log('Seed result:', seedResult);

        res.json({
            message: 'Database seeded successfully',
            seed: seedResult
        });
    } catch (error: any) {
        console.error('Seeding error:', error);
        res.status(500).json({
            message: 'Database seeding failed',
            error: error.message,
            stderr: error.stderr?.toString(),
            db_prefix: (process.env.DATABASE_URL || '').substring(0, 15)
        });
    }
});

// Separate endpoint for schema migration (requires direct DB connection)
app.get('/api/public/migrate-db', async (req: Request, res: Response) => {
    try {
        console.log('Running schema push...');

        // Sanitize URLs here too
        if (process.env.DATABASE_URL) {
            process.env.DATABASE_URL = process.env.DATABASE_URL.replace(/['"]/g, '').trim();
        }
        if (process.env.DIRECT_URL) {
            process.env.DIRECT_URL = process.env.DIRECT_URL.replace(/['"]/g, '').trim();
        }

        // Uses DIRECT_URL if set (bypasses PgBouncer pooler)
        const pushResult = execSync('npx prisma db push --skip-generate', { timeout: 120000 }).toString();
        console.log('Push result:', pushResult);
        res.json({ message: 'Schema migration complete', result: pushResult });
    } catch (error: any) {
        console.error('Migration error:', error);
        res.status(500).json({
            message: 'Schema migration failed',
            error: error.message,
            stderr: error.stderr?.toString(),
            dr_prefix: (process.env.DIRECT_URL || '').substring(0, 15)
        });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', async (req: Request, res: Response) => {
    let dbStatus = 'Checking...';
    try {
        await prisma.user.count();
        dbStatus = 'Connected';
    } catch (e: any) {
        dbStatus = `Error: ${e.message}`;
    }
    res.json({
        message: 'TRUE CARE API is running (Ver: 1.0.5)',
        deployedAt: new Date().toISOString(),
        status: 'Operational',
        database: dbStatus
    });
});

app.get('/ping', (req: Request, res: Response) => {
    res.json({ message: 'pong', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port} - Deploy Version: ${new Date().toISOString()}`);
});
