import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import adminRoutes from './routes/adminRoutes';
import errorHandler from './middlewares/errorHandler';
import { sanitizeInput } from './middlewares/sanitize';
import { apiLimiter } from './middlewares/rateLimiter';
import { specs, swaggerUi } from './docs/swagger';
import logger from './utils/logger';

const app = express();

// ─── Security Middleware ────────────────────────────────────────
app.use(helmet());                     // Secure HTTP headers
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(hpp());                        // HTTP Parameter Pollution protection
app.use(express.json({ limit: '10kb' })); // Body parser with size limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(sanitizeInput);                // XSS input sanitization

// ─── Logging ────────────────────────────────────────────────────
app.use(morgan('dev'));

// ─── Rate Limiting ──────────────────────────────────────────────
app.use('/api/', apiLimiter);

// ─── API Documentation ─────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TaskMaster Pro API Docs',
}));

// ─── API Routes (versioned) ────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/admin', adminRoutes);

// ─── Health Check ───────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
    });
});

// ─── 404 Handler ────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// ─── Error Handling (must be last) ──────────────────────────────
app.use(errorHandler);

export default app;
