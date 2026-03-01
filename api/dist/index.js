"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// Global Error Handlers for Production Stability
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    console.error(err.stack);
    process.exit(1);
});
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});
const child_process_1 = require("child_process");
const prisma_1 = __importDefault(require("./utils/prisma"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const shiftRoutes_1 = __importDefault(require("./routes/shiftRoutes"));
const requestRoutes_1 = __importDefault(require("./routes/requestRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit")); // Security best practice
const app = (0, express_1.default)();
const port = process.env.PORT || 3001; // Changed to 3001 to avoid conflict with Next.js
// Security Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', limiter);
app.get('/api/public/init-db', async (req, res) => {
    try {
        console.log('Starting manual database initialization...');
        // 1. Push schema
        const pushResult = (0, child_process_1.execSync)('npx prisma db push --accept-data-loss').toString();
        console.log('Prisma push result:', pushResult);
        // 2. Run seed
        const seedResult = (0, child_process_1.execSync)('npm run seed').toString();
        console.log('Seed result:', seedResult);
        res.json({
            message: 'Database initialized successfully',
            push: pushResult,
            seed: seedResult
        });
    }
    catch (error) {
        console.error('Initialization error:', error);
        res.status(500).json({
            message: 'Database initialization failed',
            error: error.message,
            stack: error.stack
        });
    }
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/shifts', shiftRoutes_1.default);
app.use('/api/requests', requestRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.get('/', async (req, res) => {
    let dbStatus = 'Checking...';
    try {
        await prisma_1.default.user.count();
        dbStatus = 'Connected';
    }
    catch (e) {
        dbStatus = `Error: ${e.message}`;
    }
    res.json({
        message: 'TRUE CARE API is running (Ver: 1.0.5)',
        deployedAt: new Date().toISOString(),
        status: 'Operational',
        database: dbStatus
    });
});
app.get('/ping', (req, res) => {
    res.json({ message: 'pong', timestamp: new Date().toISOString() });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port} - Deploy Version: ${new Date().toISOString()}`);
});
