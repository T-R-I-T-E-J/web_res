/**
 * Audit Logging - Variable Traffic Scenarios
 * 
 * Tests audit logging under realistic traffic patterns:
 * 1. Low traffic (sporadic events)
 * 2. High traffic (competition registration spikes)
 * 3. Variable traffic (normal → spike → normal)
 * 4. Concurrent operations (multiple users)
 * 5. Sustained load
 */

import { PrismaClient } from '@prisma/client';
import { logAuditEvent, getDailyChangeSummary } from '../src/audit/audit-logger';

const prisma = new PrismaClient();

describe('Audit Logging - Variable Traffic Scenarios', () => {
    beforeAll(async () => {
        await prisma.auditLog.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('Low Traffic Scenarios', () => {
        it('should handle sporadic events efficiently (typical off-season)', async () => {
            console.log('\n📊 Simulating LOW TRAFFIC (off-season pattern)');

            const events = [
                { delay: 5000, action: 'LOGIN', table: 'auth' },
                { delay: 30000, action: 'UPDATE', table: 'users' },
                { delay: 120000, action: 'CREATE', table: 'news' },
                { delay: 60000, action: 'LOGOUT', table: 'auth' },
            ];

            const startTime = Date.now();
            let eventCount = 0;

            // Simulate sporadic events (without actual delays in test)
            for (const event of events) {
                await logAuditEvent({
                    action: event.action,
                    tableName: event.table,
                    recordId: `sporadic-${eventCount}`,
                    context: {
                        userId: 'user-low-traffic',
                        ipAddress: '10.0.0.100',
                        requestId: `req-sporadic-${eventCount}`,
                    },
                    newValues: { timestamp: new Date().toISOString() },
                });
                eventCount++;
            }

            const duration = Date.now() - startTime;

            console.log(`   ✅ ${eventCount} sporadic events logged`);
            console.log(`   ⏱️  Total time: ${duration}ms`);
            console.log(`   📉 Average: ${(duration / eventCount).toFixed(2)}ms per event`);

            expect(eventCount).toBe(4);
            expect(duration).toBeLessThan(1000); // Should be very fast
        });
    });

    describe('High Traffic Scenarios', () => {
        it('should handle competition registration spike (100+ concurrent users)', async () => {
            console.log('\n📊 Simulating HIGH TRAFFIC (competition registration spike)');

            const userCount = 100;
            const startTime = Date.now();

            // Simulate 100 users registering simultaneously
            const registrations = [];
            for (let i = 0; i < userCount; i++) {
                registrations.push(
                    logAuditEvent({
                        action: 'CREATE',
                        tableName: 'competition_entries',
                        recordId: `entry-${i}`,
                        context: {
                            userId: `user-${i}`,
                            ipAddress: `192.168.1.${i % 255}`,
                            requestId: `req-registration-${i}`,
                        },
                        newValues: {
                            competition: 'National Championship',
                            category: 'Air Rifle',
                            timestamp: Date.now() + i,
                        },
                    })
                );
            }

            await Promise.all(registrations);
            const duration = Date.now() - startTime;

            console.log(`   ✅ ${userCount} registrations logged concurrently`);
            console.log(`   ⏱️  Total time: ${duration}ms`);
            console.log(`   📈 Average: ${(duration / userCount).toFixed(2)}ms per registration`);
            console.log(`   🚀 Throughput: ${((userCount / duration) * 1000).toFixed(0)} events/second`);

            expect(duration).toBeLessThan(10000); // 100 logs in < 10 seconds

            // Verify all logs created
            const logs = await prisma.auditLog.findMany({
                where: { tableName: 'competition_entries' },
            });
            expect(logs.length).toBeGreaterThanOrEqual(userCount);
        });

        it('should handle score submission burst (50 shooters finishing simultaneously)', async () => {
            console.log('\n📊 Simulating SCORE SUBMISSION BURST');

            const shooterCount = 50;
            const startTime = Date.now();

            // Multiple updates per shooter (3 rounds)
            const submissions = [];
            for (let shooter = 0; shooter < shooterCount; shooter++) {
                for (let round = 1; round <= 3; round++) {
                    submissions.push(
                        logAuditEvent({
                            action: 'UPDATE',
                            tableName: 'scores',
                            recordId: `shooter-${shooter}`,
                            context: {
                                userId: `shooter-${shooter}`,
                                ipAddress: `10.0.${Math.floor(shooter / 255)}.${shooter % 255}`,
                                requestId: `req-score-${shooter}-${round}`,
                            },
                            oldValues: { totalScore: (round - 1) * 100 },
                            newValues: { totalScore: round * 100 },
                        })
                    );
                }
            }

            await Promise.all(submissions);
            const duration = Date.now() - startTime;
            const totalOps = shooterCount * 3;

            console.log(`   ✅ ${shooterCount} shooters × 3 rounds = ${totalOps} score updates`);
            console.log(`   ⏱️  Total time: ${duration}ms`);
            console.log(`   📈 Throughput: ${((totalOps / duration) * 1000).toFixed(0)} updates/second`);

            expect(duration).toBeLessThan(15000); // 150 logs in < 15 seconds
        });
    });

    describe('Variable Traffic Patterns', () => {
        it('should handle traffic spike then return to normal (realistic pattern)', async () => {
            console.log('\n📊 Simulating VARIABLE TRAFFIC (normal → spike → normal)');

            // Phase 1: Normal traffic (5 events)
            console.log('   Phase 1: Normal traffic');
            const phase1Start = Date.now();
            for (let i = 0; i < 5; i++) {
                await logAuditEvent({
                    action: 'LOGIN',
                    tableName: 'auth',
                    recordId: `normal-${i}`,
                    context: { userId: `user-${i}`, requestId: `req-normal-${i}` },
                    newValues: { phase: 'normal' },
                });
            }
            const phase1Duration = Date.now() - phase1Start;
            console.log(`      ${phase1Duration}ms for 5 events`);

            // Phase 2: Spike (50 concurrent events)
            console.log('   Phase 2: Traffic spike');
            const phase2Start = Date.now();
            const spikeEvents = [];
            for (let i = 0; i < 50; i++) {
                spikeEvents.push(
                    logAuditEvent({
                        action: 'CREATE',
                        tableName: 'competition_entries',
                        recordId: `spike-${i}`,
                        context: { userId: `user-spike-${i}`, requestId: `req-spike-${i}` },
                        newValues: { phase: 'spike' },
                    })
                );
            }
            await Promise.all(spikeEvents);
            const phase2Duration = Date.now() - phase2Start;
            console.log(`      ${phase2Duration}ms for 50 concurrent events`);

            // Phase 3: Back to normal (5 events)
            console.log('   Phase 3: Back to normal');
            const phase3Start = Date.now();
            for (let i = 0; i < 5; i++) {
                await logAuditEvent({
                    action: 'LOGOUT',
                    tableName: 'auth',
                    recordId: `normal-after-${i}`,
                    context: { userId: `user-${i}`, requestId: `req-normal-after-${i}` },
                    newValues: { phase: 'normal-after' },
                });
            }
            const phase3Duration = Date.now() - phase3Start;
            console.log(`      ${phase3Duration}ms for 5 events`);

            console.log(`\n   ✅ System handled traffic variation gracefully`);
            console.log(`   📊 Pattern: ${phase1Duration}ms → ${phase2Duration}ms → ${phase3Duration}ms`);

            // Phase 2 should be faster than sequential despite more events (parallel processing)
            expect(phase2Duration).toBeLessThan(phase1Duration * 50); // Much faster than 50x sequential
        });

        it('should maintain consistency during traffic transitions', async () => {
            console.log('\n📊 Testing CONSISTENCY during traffic transitions');

            const recordId = 'consistency-test-1';

            // Create record
            await logAuditEvent({
                action: 'CREATE',
                tableName: 'test_consistency',
                recordId,
                context: { userId: 'test-user', requestId: 'req-create' },
                newValues: { value: 0 },
            });

            // Concurrent updates (simulating spike)
            const updates = [];
            for (let i = 1; i <= 10; i++) {
                updates.push(
                    logAuditEvent({
                        action: 'UPDATE',
                        tableName: 'test_consistency',
                        recordId,
                        context: { userId: 'test-user', requestId: `req-update-${i}` },
                        oldValues: { value: i - 1 },
                        newValues: { value: i },
                    })
                );
            }
            await Promise.all(updates);

            // Verify all logged
            const logs = await prisma.auditLog.findMany({
                where: {
                    tableName: 'test_consistency',
                    recordId,
                },
                orderBy: { createdAt: 'asc' },
            });

            expect(logs.length).toBe(11); // 1 create + 10 updates
            console.log(`   ✅ All ${logs.length} events logged consistently`);
        });
    });

    describe('Concurrent User Operations', () => {
        it('should handle multiple admins making simultaneous changes', async () => {
            console.log('\n📊 Simulating CONCURRENT ADMIN OPERATIONS');

            const adminCount = 10;
            const operationsPerAdmin = 5;
            const startTime = Date.now();

            const adminOps = [];
            for (let admin = 0; admin < adminCount; admin++) {
                for (let op = 0; op < operationsPerAdmin; op++) {
                    adminOps.push(
                        logAuditEvent({
                            action: ['CREATE', 'UPDATE', 'DELETE'][op % 3],
                            tableName: 'admin_operations',
                            recordId: `record-${admin}-${op}`,
                            context: {
                                userId: `admin-${admin}`,
                                ipAddress: `10.0.0.${admin}`,
                                requestId: `req-admin-${admin}-${op}`,
                            },
                            newValues: {
                                admin: admin,
                                operation: op,
                                timestamp: Date.now(),
                            },
                        })
                    );
                }
            }

            await Promise.all(adminOps);
            const duration = Date.now() - startTime;
            const totalOps = adminCount * operationsPerAdmin;

            console.log(`   ✅ ${adminCount} admins × ${operationsPerAdmin} ops = ${totalOps} total`);
            console.log(`   ⏱️  Completed in: ${duration}ms`);
            console.log(`   🚀 Throughput: ${((totalOps / duration) * 1000).toFixed(0)} ops/second`);

            // Verify each admin's operations are logged
            for (let admin = 0; admin < adminCount; admin++) {
                const adminLogs = await prisma.auditLog.findMany({
                    where: { userId: `admin-${admin}` },
                });
                expect(adminLogs.length).toBe(operationsPerAdmin);
            }
        });
    });

    describe('Sustained Load', () => {
        it('should handle sustained moderate load (realistic competition day)', async () => {
            console.log('\n📊 Simulating SUSTAINED LOAD (competition day - 5 minutes)');

            const durationSeconds = 5; // Simulate 5 minutes compressed
            const eventsPerSecond = 10; // 10 events/second average
            const totalEvents = durationSeconds * eventsPerSecond;

            const startTime = Date.now();
            const events = [];

            // Generate events
            for (let i = 0; i < totalEvents; i++) {
                events.push(
                    logAuditEvent({
                        action: ['LOGIN', 'UPDATE', 'CREATE', 'EXPORT'][i % 4],
                        tableName: 'sustained_test',
                        recordId: `event-${i}`,
                        context: {
                            userId: `user-${i % 20}`, // 20 active users
                            ipAddress: `10.0.0.${i % 255}`,
                            requestId: `req-sustained-${i}`,
                        },
                        newValues: { eventNum: i, time: Date.now() },
                    })
                );

                // Process in batches to simulate sustained load
                if (events.length >= 10) {
                    await Promise.all(events.splice(0, 10));
                }
            }

            // Process remaining
            if (events.length > 0) {
                await Promise.all(events);
            }

            const duration = Date.now() - startTime;

            console.log(`   ✅ ${totalEvents} events over ${durationSeconds} simulated seconds`);
            console.log(`   ⏱️  Actual time: ${duration}ms`);
            console.log(`   📈 Average rate: ${eventsPerSecond} events/second (simulated)`);
            console.log(`   🚀 Actual throughput: ${((totalEvents / duration) * 1000).toFixed(0)} events/second`);

            expect(duration).toBeLessThan(30000); // Should complete in < 30 seconds
        });
    });

    describe('Edge Cases Under Load', () => {
        it('should handle duplicate simultaneous events gracefully', async () => {
            console.log('\n📊 Testing DUPLICATE EVENTS under load');

            const recordId = 'duplicate-test-1';
            const duplicateCount = 10;

            // Same event logged multiple times simultaneously (e.g., webhook retries)
            const duplicates = [];
            for (let i = 0; i < duplicateCount; i++) {
                duplicates.push(
                    logAuditEvent({
                        action: 'WEBHOOK',
                        tableName: 'payments',
                        recordId,
                        context: {
                            userId: 'system',
                            ipAddress: '10.0.0.1',
                            requestId: 'same-request-id', // Same request ID
                        },
                        newValues: { status: 'completed' },
                    })
                );
            }

            await Promise.all(duplicates);

            // All should be logged (idempotency handled at application level)
            const logs = await prisma.auditLog.findMany({
                where: {
                    tableName: 'payments',
                    recordId,
                },
            });

            console.log(`   ✅ ${logs.length} duplicate events logged`);
            console.log(`   ℹ️  Same request ID: ${logs.every(l => l.requestId === 'same-request-id')}`);

            expect(logs.length).toBe(duplicateCount);
        });

        it('should handle very large audit payloads', async () => {
            console.log('\n📊 Testing LARGE PAYLOADS');

            // Simulate bulk data export
            const largePayload = {
                exportType: 'FULL_DATABASE',
                tables: Array.from({ length: 50 }, (_, i) => `table_${i}`),
                filters: {
                    dateRange: { from: '2020-01-01', to: '2025-12-27' },
                    categories: Array.from({ length: 20 }, (_, i) => `category_${i}`),
                },
                recordCount: 50000,
                metadata: Array.from({ length: 100 }, (_, i) => ({
                    key: `meta_${i}`,
                    value: `value_${i}`.repeat(10),
                })),
            };

            const startTime = Date.now();

            await logAuditEvent({
                action: 'EXPORT',
                tableName: 'bulk_operations',
                recordId: 'large-export-1',
                context: {
                    userId: 'admin-001',
                    ipAddress: '10.0.0.5',
                    requestId: 'req-large-payload',
                },
                newValues: largePayload,
            });

            const duration = Date.now() - startTime;

            console.log(`   ✅ Large payload logged successfully`);
            console.log(`   📦 Payload size: ~${JSON.stringify(largePayload).length} characters`);
            console.log(`   ⏱️  Time: ${duration}ms`);

            expect(duration).toBeLessThan(500); // Even large payloads should be fast
        });
    });

    describe('Performance Summary', () => {
        it('should generate traffic pattern report', async () => {
            console.log('\n📊 TRAFFIC PATTERN SUMMARY');

            const summary = await getDailyChangeSummary(1);

            // Group by action
            const actionCounts = new Map<string, number>();
            summary.forEach(s => {
                actionCounts.set(s.action, (actionCounts.get(s.action) || 0) + s.count);
            });

            console.log('\n   Event Distribution:');
            for (const [action, count] of actionCounts.entries()) {
                console.log(`      ${action}: ${count} events`);
            }

            const totalEvents = Array.from(actionCounts.values()).reduce((a, b) => a + b, 0);
            console.log(`\n   📈 Total events logged: ${totalEvents}`);

            expect(totalEvents).toBeGreaterThan(200); // We logged a lot!
        });
    });
});
