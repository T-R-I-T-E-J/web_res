/**
 * Express server with health check endpoints
 */

import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkDatabase, checkRedis, checkRazorpay, performHealthCheck } from './monitoring/health-checks';
import { setupErrorHandlers } from './app/memory-test';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Setup global error handlers
setupErrorHandlers();

// Middleware
app.use(express.json());

// Health check endpoints
app.get('/health/db', async (req: Request, res: Response) => {
    try {
        const result = await checkDatabase(prisma);

        if (result.healthy) {
            res.json({
                status: 'healthy',
                latencyMs: result.latencyMs,
            });
        } else {
            res.status(503).json({
                status: 'unhealthy',
                error: result.message,
            });
        }
    } catch (error: any) {
        res.status(503).json({
            status: 'unhealthy',
            error: error.message,
        });
    }
});

app.get('/health/redis', async (req: Request, res: Response) => {
    const result = await checkRedis();

    if (result.healthy) {
        res.json({
            status: 'healthy',
            latencyMs: result.latencyMs,
        });
    } else {
        res.status(503).json({
            status: 'unhealthy',
            error: result.message,
        });
    }
});

app.get('/health', async (req: Request, res: Response) => {
    const result = await performHealthCheck(prisma);
    const statusCode = result.status === 'healthy' ? 200 : 503;

    res.status(statusCode).json(result);
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        service: 'Failure Handling Test Environment',
        version: '1.0.0',
        endpoints: {
            healthCheck: '/health',
            dbHealth: '/health/db',
            redisHealth: '/health/redis',
        },
    });
});

// Start server
if (require.main === module) {
    const server = app.listen(PORT, () => {
        console.log(`🚀 Failure handling test server running on port ${PORT}`);
        console.log(`   Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const shutdown = async () => {
        console.log('SIGTERM/SIGINT received. Shutting down...');
        server.close(() => {
            console.log('HTTP server closed');
        });
        await prisma.$disconnect();
        console.log('Prisma client disconnected');
        process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}

export { app, prisma };
