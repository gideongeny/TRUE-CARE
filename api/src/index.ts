import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import shiftRoutes from './routes/shiftRoutes';
import requestRoutes from './routes/requestRoutes';

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

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/requests', requestRoutes);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'TRUE CARE API is running' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
