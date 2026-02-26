import app from './app';
import dotenv from 'dotenv';
import { prisma } from './db';
import logger from './utils/logger';

dotenv.config();

const PORT = parseInt(process.env.PORT || '5000', 10);

async function main() {
    // Verify database connection
    await prisma.$connect();
    logger.info('✅ Database connected successfully');

    const server = app.listen(PORT, () => {
        logger.info(`🚀 Server running on port ${PORT}`);
        logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
        logger.info(`❤️  Health: http://localhost:${PORT}/health`);
    });

    server.on('error', (err: any) => {
        if (err?.code === 'EADDRINUSE') {
            logger.error(`❌ Port ${PORT} is already in use. Please free the port or change PORT environment variable.`);
            process.exit(1);
        }
        throw err;
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
        logger.info(`\n${signal} received. Shutting down gracefully...`);
        server.close(async () => {
            await prisma.$disconnect();
            logger.info('Database disconnected');
            process.exit(0);
        });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch(async (e) => {
    logger.error('Failed to start server:', e instanceof Error ? e.message : e);
    await prisma.$disconnect();
    process.exit(1);
});
