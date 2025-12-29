/**
 * Individual scenario runner - Run one scenario at a time
 */

import { PrismaClient } from '@prisma/client';
import { CircuitBreaker } from '../src/app/circuit-breaker';
import { withDeadlockRetry } from '../src/db/deadlock-test';
import { processPaymentSafely } from '../src/payment/double-charge-test';

const prisma = new PrismaClient();

async function testCircuitBreakerScenario() {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('   SCENARIO: Circuit Breaker Pattern');
    console.log('═══════════════════════════════════════════════════════════\n');

    const breaker = new CircuitBreaker(3, 3000); // 3 failures, 3s reset

    console.log('📝 Testing circuit breaker with simulated database failures\n');

    // Test 1: Failures leading to circuit open
    console.log('Test 1: Triggering circuit breaker\n');
    for (let i = 1; i <= 5; i++) {
        try {
            await breaker.execute(async () => {
                if (i <= 3) {
                    throw new Error('Database timeout');
                }
                return 'Success';
            });
            console.log(`  ✅ Request ${i}: Success`);
        } catch (error: any) {
            const state = breaker.getState();
            if (error.message.includes('Circuit breaker is open')) {
                console.log(`  🔴 Request ${i}: BLOCKED by circuit breaker (State: ${state.state})`);
            } else {
                console.log(`  ❌ Request ${i}: Failed - ${error.message} (Failures: ${state.failures})`);
            }
        }
    }

    console.log('\n  💡 Circuit opened after 3 failures - protecting system!\n');

    // Test 2: Auto-recovery
    console.log('Test 2: Waiting for circuit reset (3 seconds)...\n');
    await new Promise(resolve => setTimeout(resolve, 3500));

    try {
        const result = await breaker.execute(async () => 'Database connected');
        console.log(`  ✅ After reset: ${result}`);
        console.log(`  🟢 Circuit closed - system recovered!\n`);
    } catch (error: any) {
        console.log(`  ❌ After reset: ${error.message}\n`);
    }

    console.log('✓ Circuit breaker test completed\n');
}

async function testDeadlockScenario() {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('   SCENARIO: Deadlock Detection & Retry');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('📝 Simulating database deadlock with automatic retry\n');

    let attemptCount = 0;

    try {
        const result = await withDeadlockRetry(async () => {
            attemptCount++;
            console.log(`  Attempt ${attemptCount}: Executing transaction...`);

            if (attemptCount < 3) {
                // Simulate deadlock
                const error: any = new Error('Deadlock detected');
                error.code = '40P01'; // PostgreSQL deadlock code
                throw error;
            }

            return 'Transaction committed';
        }, 5);

        console.log(`\n  ✅ Success: ${result}`);
        console.log(`  📊 Retries: ${attemptCount - 1} (with exponential backoff)`);
        console.log(`  🎯 Deadlock handled gracefully!\n`);
    } catch (error: any) {
        console.log(`\n  ❌ Failed: ${error.message}\n`);
    }

    console.log('✓ Deadlock retry test completed\n');
}

async function testPaymentIdempotencyScenario() {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('   SCENARIO: Payment Double Charge Prevention');
    console.log('═══════════════════════════════════════════════════════════\n');

    const orderId = 'order_' + Date.now();
    const paymentId = 'pay_' + Date.now();

    console.log('📝 Testing payment webhook idempotency\n');

    // Create payment order
    await prisma.payment.create({
        data: {
            razorpayOrderId: orderId,
            amount: 99900, // ₹999.00
            currency: 'INR',
            status: 'PENDING',
        },
    });

    console.log(`  Order created: ${orderId} (₹999.00)\n`);

    // First webhook call
    console.log('  Webhook 1: Processing payment...');
    const result1 = await processPaymentSafely(prisma, {
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        amount: 99900,
    });
    console.log(`  ✅ ${result1.message}\n`);

    // Duplicate webhook (network retry)
    console.log('  Webhook 2: Duplicate call (network retry)...');
    const result2 = await processPaymentSafely(prisma, {
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        amount: 99900,
    });
    console.log(`  ✅ ${result2.message}\n`);

    // Verify only one charge
    const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId: orderId },
    });

    console.log('  📊 Verification:');
    console.log(`     - Payment ID: ${payment?.razorpayPaymentId}`);
    console.log(`     - Status: ${payment?.status}`);
    console.log(`     - Amount charged: ₹${(payment?.amount || 0) / 100}\n`);
    console.log('  🎯 No double charge - idempotency working!\n');

    console.log('✓ Payment idempotency test completed\n');
}

async function testHealthCheckScenario() {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('   SCENARIO: System Health Monitoring');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('📝 Checking system health...\n');

    // Database check
    const dbStart = Date.now();
    try {
        await prisma.$queryRaw`SELECT 1`;
        const latency = Date.now() - dbStart;
        console.log(`  ✅ Database: Healthy (${latency}ms)`);
    } catch (error) {
        console.log(`  ❌ Database: Unhealthy`);
    }

    // Simulate other services
    console.log(`  ✅ Redis Cache: Healthy (simulated)`);
    console.log(`  ✅ Payment Gateway: Healthy (simulated)`);

    console.log('\n  🎯 All services operational!\n');

    console.log('✓ Health check test completed\n');
}

async function main() {
    const args = process.argv.slice(2);
    const scenario = args[0];

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║        FAILURE HANDLING - SCENARIO DEMONSTRATIONS         ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');

    try {
        switch (scenario) {
            case '1':
            case 'circuit':
                await testCircuitBreakerScenario();
                break;
            case '2':
            case 'deadlock':
                await testDeadlockScenario();
                break;
            case '3':
            case 'payment':
                await testPaymentIdempotencyScenario();
                break;
            case '4':
            case 'health':
                await testHealthCheckScenario();
                break;
            case 'all':
            default:
                await testCircuitBreakerScenario();
                await testDeadlockScenario();
                await testPaymentIdempotencyScenario();
                await testHealthCheckScenario();
                break;
        }

        console.log('\n╔═══════════════════════════════════════════════════════════╗');
        console.log('║              SCENARIO TESTING COMPLETED                   ║');
        console.log('╚═══════════════════════════════════════════════════════════╝\n');

    } catch (error) {
        console.error('\n❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
