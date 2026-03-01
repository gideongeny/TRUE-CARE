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
        console.log('Starting manual database initialization...');

        // 1. Push schema (Non-destructive)
        const pushResult = execSync('npx prisma db push').toString();
        console.log('Prisma push result:', pushResult);

        // 2. Run seed
        const seedResult = execSync('npm run seed').toString();
        console.log('Seed result:', seedResult);

        res.json({
            message: 'Database initialized successfully',
            push: pushResult,
            seed: seedResult
        });
    } catch (error: any) {
        console.error('Initialization error:', error);
        res.status(500).json({
            message: 'Database initialization failed',
            error: error.message,
            stack: error.stack
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
