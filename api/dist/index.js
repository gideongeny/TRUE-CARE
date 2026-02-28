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
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/shifts', shiftRoutes_1.default);
app.use('/api/requests', requestRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'TRUE CARE API is running' });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
