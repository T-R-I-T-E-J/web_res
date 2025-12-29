/**
 * Health Check Endpoints and Monitoring
 */

import { PrismaClient } from '@prisma/client';

interface HealthCheckResult {
    healthy: boolean;
    latencyMs?: number;
    message?: string;
}

/**
 * Database health check
 */
export async function checkDatabase(prisma: PrismaClient): Promise<HealthCheckResult> {
    const start = Date.now();

    try {
        await prisma.$queryRaw`SELECT 1`;
        const latencyMs = Date.now() - start;

        return {
            healthy: true,
            latencyMs,
        };
    } catch (error: any) {
        return {
            healthy: false,
            message: error.message,
        };
    }
}

/**
 * Redis health check (mock for now)
 */
export async function checkRedis(): Promise<HealthCheckResult> {
    const start = Date.now();

    try {
        // Simulate Redis ping
        await new Promise(resolve => setTimeout(resolve, 10));
        const latencyMs = Date.now() - start;

        return {
            healthy: true,
            latencyMs,
        };
    } catch (error: any) {
        return {
            healthy: false,
            message: error.message,
        };
    }
}

/**
 * External payment service health check (mock)
 */
export async function checkRazorpay(): Promise<HealthCheckResult> {
    const start = Date.now();

    try {
        // Simulate Razorpay API check
        await new Promise(resolve => setTimeout(resolve, 50));
        const latencyMs = Date.now() - start;

        return {
            healthy: true,
            latencyMs,
        };
    } catch (error: any) {
        return {
            healthy: false,
            message: error.message,
        };
    }
}

/**
 * Comprehensive health check
 */
export async function performHealthCheck(prisma: PrismaClient) {
    const checks = {
        database: await checkDatabase(prisma),
        redis: await checkRedis(),
        razorpay: await checkRazorpay(),
    };

    const allHealthy = Object.values(checks).every(c => c.healthy);

    // Log to database
    for (const [service, result] of Object.entries(checks)) {
        await prisma.healthCheck.create({
            data: {
                service,
                status: result.healthy ? 'healthy' : 'unhealthy',
                latencyMs: result.latencyMs,
                message: result.message,
            },
        }).catch(() => {
            // Don't let health check logging failures crash the check itself
        });
    }

    return {
        status: allHealthy ? 'healthy' : 'degraded',
        checks,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Alert thresholds configuration
 */
export const ALERT_THRESHOLDS = {
    errorRate: {
        warning: 0.01, // 1%
        critical: 0.05, // 5%
    },
    responseTime: {
        warning: 2000, // 2s
        critical: 5000, // 5s
    },
    databaseConnections: {
        warning: 0.70, // 70%
        critical: 0.90, // 90%
    },
    memoryUsage: {
        warning: 0.80, // 80%
        critical: 0.95, // 95%
    },
    diskUsage: {
        warning: 0.70, // 70%
        critical: 0.85, // 85%
    },
};

/**
 * Check if metric exceeds thresholds
 */
export function checkThreshold(
    metric: string,
    value: number
): { level: 'ok' | 'warning' | 'critical'; message: string } {
    const threshold = ALERT_THRESHOLDS[metric as keyof typeof ALERT_THRESHOLDS];

    if (!threshold) {
        return { level: 'ok', message: 'Unknown metric' };
    }

    if (value >= threshold.critical) {
        return {
            level: 'critical',
            message: `${metric} is at critical level: ${value}`,
        };
    }

    if (value >= threshold.warning) {
        return {
            level: 'warning',
            message: `${metric} is at warning level: ${value}`,
        };
    }

    return {
        level: 'ok',
        message: `${metric} is within normal range`,
    };
}

/**
 * Test health checks
 */
export async function testHealthChecks(prisma: PrismaClient) {
    console.log('\n=== Health Check Test ===\n');

    const result = await performHealthCheck(prisma);

    console.log(`Overall Status: ${result.status}`);
    console.log('\nService Health:');

    for (const [service, check] of Object.entries(result.checks)) {
        const status = check.healthy ? '✓' : '✗';
        const latency = check.latencyMs ? `${check.latencyMs}ms` : 'N/A';
        console.log(`  ${status} ${service}: ${latency}`);
        if (check.message) {
            console.log(`    Message: ${check.message}`);
        }
    }

    // Test threshold checking
    console.log('\n=== Threshold Tests ===\n');

    const tests = [
        { metric: 'errorRate', value: 0.03 },
        { metric: 'responseTime', value: 3000 },
        { metric: 'memoryUsage', value: 0.85 },
    ];

    for (const test of tests) {
        const result = checkThreshold(test.metric, test.value);
        console.log(`${test.metric}=${test.value}: ${result.level.toUpperCase()} - ${result.message}`);
    }
}
