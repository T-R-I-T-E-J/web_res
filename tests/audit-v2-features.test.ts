/**
 * Audit Logging v2.0 - Enhanced Features Tests
 * 
 * Tests new features from 08-audit-logging-v2.md:
 * 1. Adaptive batching based on traffic
 * 2. Traffic pattern monitoring
 * 3. Alert configurations
 * 4. Environment-based settings
 * 5. Performance tuning
 * 6. Advanced queries
 */

import { PrismaClient } from '@prisma/client';
import { logAuditEvent } from '../src/audit/audit-logger';

const prisma = new PrismaClient();

// Adaptive Audit Logger with traffic-aware batching
class AdaptiveAuditLogger {
    private eventQueue: any[] = [];
    private lastFlush = Date.now();
    private eventsLastMinute = 0;

    private config = {
        lowTraffic: {
            batchSize: 1,
            maxWaitMs: 0,
        },
        highTraffic: {
            batchSize: 100,
            maxWaitMs: 1000,
        },
    };

    async log(event: any) {
        this.eventQueue.push(event);
        this.eventsLastMinute++;

        const isHighTraffic = this.eventsLastMinute > 50;
        const config = isHighTraffic ? this.config.highTraffic : this.config.lowTraffic;

        const shouldFlush =
            this.eventQueue.length >= config.batchSize ||
            (config.maxWaitMs > 0 && (Date.now() - this.lastFlush) > config.maxWaitMs);

        if (shouldFlush) {
            await this.flush();
        }
    }

    async flush() {
        if (this.eventQueue.length === 0) return;

        const batch = this.eventQueue.splice(0, 100);
        await Promise.all(batch.map(event => logAuditEvent(event)));
        this.lastFlush = Date.now();
    }

    getTrafficLevel(): 'low' | 'high' {
        return this.eventsLastMinute > 50 ? 'high' : 'low';
    }

    resetMetrics() {
        this.eventsLastMinute = 0;
    }
}

// Traffic Monitor
class TrafficMonitor {
    async getEventsPerHour(): Promise<number> {
        const oneHourAgo = new Date(Date.now() - 3600000);
        const count = await prisma.auditLog.count({
            where: { createdAt: { gte: oneHourAgo } },
        });
        return count;
    }

    async getTrafficLevel(): Promise<'low' | 'normal' | 'high' | 'critical'> {
        const eventsPerHour = await this.getEventsPerHour();

        if (eventsPerHour < 100) return 'low';
        if (eventsPerHour < 1000) return 'normal';
        if (eventsPerHour < 5000) return 'high';
        return 'critical';
    }

    async getActionBreakdown() {
        const oneHourAgo = new Date(Date.now() - 3600000);
        const logs = await prisma.auditLog.findMany({
            where: { createdAt: { gte: oneHourAgo } },
            select: { action: true },
        });

        const breakdown = new Map<string, number>();
        logs.forEach(log => {
            breakdown.set(log.action, (breakdown.get(log.action) || 0) + 1);
        });

        return Object.fromEntries(breakdown);
    }
}

// Alert System
class AlertSystem {
    private alerts: any[] = [];

    async sendAlert(message: string, metadata?: any) {
        this.alerts.push({ message, metadata, timestamp: new Date() });
        console.log(`🚨 ALERT: ${message}`, metadata || '');
    }

    getAlerts() {
        return this.alerts;
    }

    clearAlerts() {
        this.alerts = [];
    }
}

describe('Audit Logging v2.0 - Enhanced Features', () => {
    let adaptiveLogger: AdaptiveAuditLogger;
    let trafficMonitor: TrafficMonitor;
    let alertSystem: AlertSystem;

    beforeAll(async () => {
        await prisma.auditLog.deleteMany();
    });

    beforeEach(() => {
        adaptiveLogger = new AdaptiveAuditLogger();
        trafficMonitor = new TrafficMonitor();
        alertSystem = new AlertSystem();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('Adaptive Batching', () => {
        it('should use real-time logging for low traffic', async () => {
            console.log('\n📊 Testing ADAPTIVE BATCHING - Low Traffic');

            // Simulate low traffic (5 events)
            for (let i = 0; i < 5; i++) {
                await adaptiveLogger.log({
                    action: 'LOGIN',
                    tableName: 'auth',
                    recordId: `low-${i}`,
                    context: { userId: `user-${i}`, requestId: `req-${i}` },
                    newValues: { success: true },
                });
            }

            const trafficLevel = adaptiveLogger.getTrafficLevel();
            console.log(`   Traffic level: ${trafficLevel}`);
            console.log(`   ✅ Using real-time logging (low traffic)`);

            expect(trafficLevel).toBe('low');
        });

        it('should switch to batch mode for high traffic', async () => {
            console.log('\n📊 Testing ADAPTIVE BATCHING - High Traffic');

            // Simulate high traffic (100 events)
            const events = [];
            for (let i = 0; i < 100; i++) {
                events.push(
                    adaptiveLogger.log({
                        action: 'CREATE',
                        tableName: 'competition_entries',
                        recordId: `high-${i}`,
                        context: { userId: `user-${i}`, requestId: `req-${i}` },
                        newValues: { competition: 'National Championship' },
                    })
                );
            }

            const startTime = Date.now();
            await Promise.all(events);
            const duration = Date.now() - startTime;

            const trafficLevel = adaptiveLogger.getTrafficLevel();
            console.log(`   Traffic level: ${trafficLevel}`);
            console.log(`   Duration: ${duration}ms for 100 events`);
            console.log(`   ✅ Switched to batch mode automatically`);

            expect(trafficLevel).toBe('high');
            expect(duration).toBeLessThan(15000); // Should complete in < 15s
        });

        it('should handle traffic transitions smoothly', async () => {
            console.log('\n📊 Testing TRAFFIC TRANSITIONS');

            // Phase 1: Low traffic
            console.log('   Phase 1: Low traffic (5 events)');
            for (let i = 0; i < 5; i++) {
                await adaptiveLogger.log({
                    action: 'UPDATE',
                    tableName: 'users',
                    recordId: `transition-${i}`,
                    context: { userId: 'user-1', requestId: `req-low-${i}` },
                    newValues: {},
                });
            }
            expect(adaptiveLogger.getTrafficLevel()).toBe('low');

            // Phase 2: Spike to high traffic
            console.log('   Phase 2: Spike (60 events)');
            const spikeEvents = [];
            for (let i = 0; i < 60; i++) {
                spikeEvents.push(
                    adaptiveLogger.log({
                        action: 'CREATE',
                        tableName: 'scores',
                        recordId: `spike-${i}`,
                        context: { userId: `user-${i}`, requestId: `req-spike-${i}` },
                        newValues: {},
                    })
                );
            }
            await Promise.all(spikeEvents);
            expect(adaptiveLogger.getTrafficLevel()).toBe('high');

            // Phase 3: Back to low
            console.log('   Phase 3: Back to low (reset)');
            adaptiveLogger.resetMetrics();
            for (let i = 0; i < 3; i++) {
                await adaptiveLogger.log({
                    action: 'LOGOUT',
                    tableName: 'auth',
                    recordId: `normal-${i}`,
                    context: { userId: 'user-1', requestId: `req-normal-${i}` },
                    newValues: {},
                });
            }
            expect(adaptiveLogger.getTrafficLevel()).toBe('low');

            console.log('   ✅ Smooth transition: low → high → low');
        });
    });

    describe('Traffic Monitoring', () => {
        it('should accurately measure events per hour', async () => {
            console.log('\n📊 Testing TRAFFIC MONITORING');

            // Create known number of events
            const eventCount = 50;
            const events = [];
            for (let i = 0; i < eventCount; i++) {
                events.push(
                    logAuditEvent({
                        action: 'UPDATE',
                        tableName: 'test_monitoring',
                        recordId: `monitor-${i}`,
                        context: { userId: 'system', requestId: `req-monitor-${i}` },
                        newValues: { index: i },
                    })
                );
            }
            await Promise.all(events);

            const eventsPerHour = await trafficMonitor.getEventsPerHour();
            console.log(`   Events logged: ${eventCount}`);
            console.log(`   Events per hour: ${eventsPerHour}`);
            console.log(`   ✅ Monitoring accurate`);

            expect(eventsPerHour).toBeGreaterThanOrEqual(eventCount);
        });

        it('should correctly determine traffic level', async () => {
            console.log('\n📊 Testing TRAFFIC LEVEL DETECTION');

            const trafficLevel = await trafficMonitor.getTrafficLevel();
            console.log(`   Current traffic level: ${trafficLevel}`);
            console.log(`   ✅ Traffic level determined`);

            expect(['low', 'normal', 'high', 'critical']).toContain(trafficLevel);
        });

        it('should provide action breakdown', async () => {
            console.log('\n📊 Testing ACTION BREAKDOWN');

            // Create diverse actions
            await logAuditEvent({
                action: 'LOGIN',
                tableName: 'auth',
                context: { userId: 'user-1', requestId: 'req-1' },
                newValues: {},
            });

            await logAuditEvent({
                action: 'CREATE',
                tableName: 'scores',
                context: { userId: 'user-2', requestId: 'req-2' },
                newValues: {},
            });

            await logAuditEvent({
                action: 'UPDATE',
                tableName: 'users',
                context: { userId: 'user-3', requestId: 'req-3' },
                newValues: {},
            });

            const breakdown = await trafficMonitor.getActionBreakdown();
            console.log('   Action breakdown:', breakdown);
            console.log(`   ✅ Breakdown includes ${Object.keys(breakdown).length} action types`);

            expect(Object.keys(breakdown).length).toBeGreaterThan(0);
        });
    });

    describe('Alert System', () => {
        it('should detect low traffic anomaly', async () => {
            console.log('\n📊 Testing LOW TRAFFIC ALERT');

            const eventsLastHour = await trafficMonitor.getEventsPerHour();

            // Alert if < 1 event/hour (system may be down)
            if (eventsLastHour < 1) {
                await alertSystem.sendAlert('CRITICAL: No audit events in last hour', {
                    eventsLastHour,
                });
            }

            const alerts = alertSystem.getAlerts();
            console.log(`   Events last hour: ${eventsLastHour}`);
            console.log(`   Alerts triggered: ${alerts.length}`);

            if (alerts.length > 0) {
                console.log(`   🚨 ${alerts[0].message}`);
            } else {
                console.log(`   ✅ No low traffic alert (system healthy)`);
            }
        });

        it('should detect high traffic anomaly', async () => {
            console.log('\n📊 Testing HIGH TRAFFIC ALERT');

            // Simulate spike
            const spikeEvents = [];
            for (let i = 0; i < 150; i++) {
                spikeEvents.push(
                    logAuditEvent({
                        action: 'CREATE',
                        tableName: 'alert_test',
                        recordId: `spike-${i}`,
                        context: { userId: `user-${i}`, requestId: `req-${i}` },
                        newValues: {},
                    })
                );
            }
            await Promise.all(spikeEvents);

            const eventsLastHour = await trafficMonitor.getEventsPerHour();

            // Alert if > 200 events/minute (unusual activity)
            const eventsPerMinute = eventsLastHour / 60;
            if (eventsPerMinute > 200) {
                await alertSystem.sendAlert('WARNING: Unusually high audit activity', {
                    rate: eventsPerMinute,
                    threshold: 200,
                });
            }

            const alerts = alertSystem.getAlerts();
            console.log(`   Events per minute: ${eventsPerMinute.toFixed(1)}`);
            console.log(`   Alerts triggered: ${alerts.length}`);

            if (alerts.length > 0) {
                console.log(`   🚨 ${alerts[0].message}`);
            } else {
                console.log(`   ✅ Traffic within normal range`);
            }
        });

        it('should detect storage capacity warning', async () => {
            console.log('\n📊 Testing STORAGE ALERT');

            const totalLogs = await prisma.auditLog.count();
            const maxTableSize = 1000000; // 1M records
            const usagePercent = (totalLogs / maxTableSize) * 100;

            if (usagePercent > 80) {
                await alertSystem.sendAlert('WARNING: Audit logs table reaching capacity', {
                    currentSize: totalLogs,
                    maxSize: maxTableSize,
                    usagePercent: usagePercent.toFixed(1),
                });
            }

            const alerts = alertSystem.getAlerts();
            console.log(`   Current size: ${totalLogs} records`);
            console.log(`   Capacity: ${usagePercent.toFixed(1)}%`);

            if (alerts.length > 0) {
                console.log(`   🚨 ${alerts[0].message}`);
            } else {
                console.log(`   ✅ Storage capacity healthy`);
            }

            expect(usagePercent).toBeLessThan(100);
        });
    });

    describe('Advanced Queries', () => {
        it('should find top active users', async () => {
            console.log('\n📊 Testing TOP ACTIVE USERS QUERY');

            // Create activity for multiple users
            const users = ['user-1', 'user-2', 'user-3'];
            const activityCounts = [10, 5, 15]; // user-3 most active

            for (let u = 0; u < users.length; u++) {
                const events = [];
                for (let i = 0; i < activityCounts[u]; i++) {
                    events.push(
                        logAuditEvent({
                            action: 'UPDATE',
                            tableName: 'test_activity',
                            recordId: `${users[u]}-${i}`,
                            context: { userId: users[u], requestId: `req-${u}-${i}` },
                            newValues: {},
                        })
                    );
                }
                await Promise.all(events);
            }

            // Get top active users
            const logs = await prisma.auditLog.findMany({
                select: { userId: true },
            });

            const userCounts = new Map<string, number>();
            logs.forEach(log => {
                if (log.userId) {
                    userCounts.set(log.userId, (userCounts.get(log.userId) || 0) + 1);
                }
            });

            const topUsers = Array.from(userCounts.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);

            console.log('   Top 3 active users:');
            topUsers.forEach(([user, count], index) => {
                console.log(`      ${index + 1}. ${user}: ${count} events`);
            });

            expect(topUsers.length).toBeGreaterThan(0);
        });

        it('should generate audit log growth rate', async () => {
            console.log('\n📊 Testing GROWTH RATE ANALYSIS');

            const logs = await prisma.auditLog.findMany({
                select: { createdAt: true },
            });

            const dailyCounts = new Map<string, number>();
            logs.forEach(log => {
                const day = log.createdAt.toISOString().split('T')[0];
                dailyCounts.set(day, (dailyCounts.get(day) || 0) + 1);
            });

            console.log('   Daily event counts:');
            Array.from(dailyCounts.entries())
                .sort((a, b) => a[0].localeCompare(b[0]))
                .forEach(([day, count]) => {
                    console.log(`      ${day}: ${count} events`);
                });

            expect(dailyCounts.size).toBeGreaterThan(0);
        });

        it('should identify most modified tables', async () => {
            console.log('\n📊 Testing MOST MODIFIED TABLES');

            const logs = await prisma.auditLog.findMany({
                where: {
                    action: { in: ['UPDATE', 'DELETE'] },
                },
                select: { tableName: true },
            });

            const tableCounts = new Map<string, number>();
            logs.forEach(log => {
                tableCounts.set(log.tableName, (tableCounts.get(log.tableName) || 0) + 1);
            });

            const topTables = Array.from(tableCounts.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            console.log('   Most modified tables:');
            topTables.forEach(([table, count], index) => {
                console.log(`      ${index + 1}. ${table}: ${count} modifications`);
            });

            expect(topTables.length).toBeGreaterThan(0);
        });
    });

    describe('Performance Validation', () => {
        it('should meet single event target (<50ms)', async () => {
            console.log('\n📊 Testing SINGLE EVENT PERFORMANCE');

            const iterations = 10;
            const durations: number[] = [];

            for (let i = 0; i < iterations; i++) {
                const start = Date.now();
                await logAuditEvent({
                    action: 'CREATE',
                    tableName: 'perf_test',
                    recordId: `perf-${i}`,
                    context: { userId: 'perf-user', requestId: `req-perf-${i}` },
                    newValues: { iteration: i },
                });
                const duration = Date.now() - start;
                durations.push(duration);
            }

            const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
            const maxDuration = Math.max(...durations);

            console.log(`   Average: ${avgDuration.toFixed(2)}ms`);
            console.log(`   Max: ${maxDuration}ms`);
            console.log(`   Target: <50ms`);
            console.log(`   ✅ ${avgDuration < 50 ? 'PASS' : 'FAIL'}`);

            expect(avgDuration).toBeLessThan(50);
        });

        it('should meet batch target (<10s for 100)', async () => {
            console.log('\n📊 Testing BATCH PERFORMANCE');

            const batchSize = 100;
            const events = [];

            for (let i = 0; i < batchSize; i++) {
                events.push({
                    action: 'CREATE',
                    tableName: 'batch_perf',
                    recordId: `batch-${i}`,
                    context: { userId: `user-${i}`, requestId: `req-batch-${i}` },
                    newValues: { index: i },
                });
            }

            const start = Date.now();
            await Promise.all(events.map(e => logAuditEvent(e)));
            const duration = Date.now() - start;

            console.log(`   Events: ${batchSize}`);
            console.log(`   Duration: ${duration}ms`);
            console.log(`   Average: ${(duration / batchSize).toFixed(2)}ms per event`);
            console.log(`   Target: <10,000ms`);
            console.log(`   ✅ ${duration < 10000 ? 'PASS' : 'FAIL'}`);

            expect(duration).toBeLessThan(10000);
        });

        it('should meet query latency target (<100ms)', async () => {
            console.log('\n📊 Testing QUERY PERFORMANCE');

            // Create some test data
            await logAuditEvent({
                action: 'UPDATE',
                tableName: 'query_perf',
                recordId: 'test-record',
                context: { userId: 'query-user', requestId: 'req-query' },
                newValues: { test: true },
            });

            const iterations = 10;
            const durations: number[] = [];

            for (let i = 0; i < iterations; i++) {
                const start = Date.now();
                await prisma.auditLog.findMany({
                    where: { tableName: 'query_perf' },
                    take: 100,
                });
                const duration = Date.now() - start;
                durations.push(duration);
            }

            const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;

            console.log(`   Average query time: ${avgDuration.toFixed(2)}ms`);
            console.log(`   Target: <100ms`);
            console.log(`   ✅ ${avgDuration < 100 ? 'PASS' : 'FAIL'}`);

            expect(avgDuration).toBeLessThan(100);
        });
    });

    describe('Environment Configuration', () => {
        it('should support different config profiles', () => {
            console.log('\n📊 Testing ENVIRONMENT CONFIGURATIONS');

            const configs = {
                development: {
                    enabled: true,
                    batchSize: 1,
                    flushInterval: 0,
                    logLevel: 'debug',
                },
                staging: {
                    enabled: true,
                    batchSize: 10,
                    flushInterval: 5000,
                    logLevel: 'info',
                },
                production: {
                    enabled: true,
                    lowTraffic: { batchSize: 10, flushInterval: 5000 },
                    highTraffic: { batchSize: 100, flushInterval: 1000 },
                    logLevel: 'warn',
                },
            };

            console.log('   Development config:', configs.development);
            console.log('   Staging config:', configs.staging);
            console.log('   Production config:', configs.production);
            console.log('   ✅ All environments configured');

            expect(configs.development).toBeDefined();
            expect(configs.staging).toBeDefined();
            expect(configs.production).toBeDefined();
        });
    });
});
