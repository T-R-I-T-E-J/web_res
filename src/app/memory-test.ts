/**
 * Memory Monitoring and Exhaustion Detection
 */

export class MemoryMonitor {
    private warningThreshold = 0.80; // 80%
    private criticalThreshold = 0.90; // 90%
    private checkInterval: NodeJS.Timeout | null = null;

    start(intervalMs = 30000) {
        console.log('Starting memory monitor...');

        this.checkInterval = setInterval(() => {
            const usage = process.memoryUsage();
            const heapPercentage = usage.heapUsed / usage.heapTotal;

            if (heapPercentage > this.criticalThreshold) {
                console.error(`🔴 CRITICAL: Memory usage at ${(heapPercentage * 100).toFixed(2)}%`);
                this.handleCriticalMemory(usage);
            } else if (heapPercentage > this.warningThreshold) {
                console.warn(`🟡 WARNING: Memory usage at ${(heapPercentage * 100).toFixed(2)}%`);
                this.handleWarningMemory(usage);
            }
        }, intervalMs);
    }

    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
            console.log('Memory monitor stopped');
        }
    }

    private handleWarningMemory(usage: NodeJS.MemoryUsage) {
        console.log('Memory details:', {
            heapUsed: `${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
            heapTotal: `${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
            external: `${(usage.external / 1024 / 1024).toFixed(2)} MB`,
            rss: `${(usage.rss / 1024 / 1024).toFixed(2)} MB`,
        });
    }

    private handleCriticalMemory(usage: NodeJS.MemoryUsage) {
        this.handleWarningMemory(usage);

        // Trigger garbage collection if available
        if (global.gc) {
            console.log('Triggering manual garbage collection...');
            global.gc();
        } else {
            console.warn('Garbage collection not available (run with --expose-gc flag)');
        }
    }

    getCurrentUsage() {
        const usage = process.memoryUsage();
        return {
            heapUsedMB: (usage.heapUsed / 1024 / 1024).toFixed(2),
            heapTotalMB: (usage.heapTotal / 1024 / 1024).toFixed(2),
            percentUsed: ((usage.heapUsed / usage.heapTotal) * 100).toFixed(2),
            rssMB: (usage.rss / 1024 / 1024).toFixed(2),
        };
    }
}

/**
 * Simulate memory exhaustion for testing
 */
export async function simulateMemoryExhaustion() {
    console.log('\n=== Memory Exhaustion Simulation ===\n');

    const monitor = new MemoryMonitor();
    monitor.start(2000); // Check every 2 seconds

    const leaks: any[] = [];

    console.log('Initial memory:', monitor.getCurrentUsage());

    try {
        // Gradually allocate memory
        for (let i = 0; i < 100; i++) {
            // Allocate ~10MB per iteration
            const leak = new Array(10 * 1024 * 1024).fill('x');
            leaks.push(leak);

            if (i % 10 === 0) {
                console.log(`Iteration ${i}, Memory:`, monitor.getCurrentUsage());
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            // Stop before crashing
            const current = monitor.getCurrentUsage();
            if (parseFloat(current.percentUsed) > 85) {
                console.log('\n🛑 Stopping before memory exhaustion');
                break;
            }
        }
    } finally {
        // Cleanup
        leaks.length = 0;
        monitor.stop();

        if (global.gc) {
            console.log('\nCleaning up...');
            global.gc();
            console.log('Final memory:', monitor.getCurrentUsage());
        }
    }
}

/**
 * Global error handlers
 */
export function setupErrorHandlers() {
    process.on('uncaughtException', (error) => {
        console.error('❌ Uncaught Exception:', error);
        // Log to external service in production
        gracefulShutdown().then(() => process.exit(1));
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
        // Log to external service in production
    });

    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received');
        gracefulShutdown().then(() => process.exit(0));
    });

    process.on('SIGINT', () => {
        console.log('SIGINT signal received');
        gracefulShutdown().then(() => process.exit(0));
    });
}

async function gracefulShutdown() {
    console.log('Starting graceful shutdown...');

    // Close database connections
    // Close server
    // Finish pending requests

    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Graceful shutdown complete');
}
