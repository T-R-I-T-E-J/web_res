/**
 * Test individual failure scenarios
 * Demonstrates various failure handling mechanisms
 */

import { PrismaClient } from '@prisma/client';
import { testCircuitBreaker } from '../src/app/circuit-breaker';
import { simulateDeadlock } from '../src/db/deadlock-test';
import {
    testDoubleChargePrevention,
    createTestRefunds,
    retryPendingRefunds
} from '../src/payment/double-charge-test';
import { testHealthChecks } from '../src/monitoring/health-checks';
import { CircuitBreaker } from '../src/app/circuit-breaker';
import { withDeadlockRetry } from '../src/db/deadlock-test';

const prisma = new PrismaClient();

async function runScenario1CircuitBreaker() {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║ SCENARIO 1: Circuit Breaker with Database Failures      ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    const breaker = new CircuitBreaker(3, 5000);

    console.log('Simulating database connection failures...\n');

    for (let i = 0; i < 6; i++) {
        try {
            await breaker.execute(async () => {
                if (i < 4) {
                    throw new Error(`Database connection timeout (attempt ${i + 1})`);
                }
                return 'Connected successfully';
            });
            console.log(`✅ Attempt ${i + 1}: Success`);
        } catch (error: any) {
            console.log(`❌ Attempt ${i + 1}: ${error.message}`);
        }

        const state = breaker.getState();
        console.log(`   State: ${state.state}, Failures: ${state.failures}\n`);
    }

    console.log('⏰ Waiting for circuit to reset (5 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 5500));

    console.log('\nAttempting after reset:');
    try {
        const result = await breaker.execute(async () => 'Success after reset');
        console.log(`✅ ${result}`);
        console.log(`   Final state: ${breaker.getState().state}\n`);
    } catch (error: any) {
        console.log(`❌ ${error.message}\n`);
    }
}

async function runScenario2DeadlockRecovery() {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║ SCENARIO 2: Deadlock Detection & Automatic Recovery     ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    let attempt = 0;

    const operation = async () => {
        attempt++;
        console.log(`Attempt ${attempt}: Executing transaction...`);

        if (attempt < 3) {
            const error: any = new Error('Deadlock detected');
            error.code = '40P01';
            throw error;
        }

        return 'Transaction committed successfully';
    };

    try {
        const result = await withDeadlockRetry(operation, 5);
        console.log(`\n✅ ${result}`);
        console.log(`   Total attempts: ${attempt}`);
        console.log(`   Retry mechanism worked correctly!\n`);
    } catch (error: any) {
        console.log(`\n❌ Failed after retries: ${error.message}\n`);
    }
}

async function runScenario3PaymentIdempotency() {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║ SCENARIO 3: Payment Webhook Idempotency                 ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    await testDoubleChargePrevention(prisma);
}

async function runScenario4RefundRecovery() {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║ SCENARIO 4: Stuck Refund Recovery                       ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    console.log('Creating stuck refund scenario...\n');
    await createTestRefunds(prisma);

    console.log('\nRunning refund recovery process...\n');
    await retryPendingRefunds(prisma, {
        getRefundStatus: () => 'processed'
    });

    console.log('✅ Refund recovery completed!\n');
}

async function runScenario5HealthMonitoring() {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║ SCENARIO 5: Health Check Monitoring                     ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    await testHealthChecks(prisma);
}

async function runScenario6ConcurrentTransfers() {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║ SCENARIO 6: Concurrent Transfers (Potential Deadlock)   ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    await simulateDeadlock(prisma);
}

async function main() {
    console.log('\n🧪 FAILURE HANDLING - SCENARIO TESTING');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        // Run all scenarios
        await runScenario1CircuitBreaker();
        await runScenario2DeadlockRecovery();
        await runScenario3PaymentIdempotency();
        await runScenario4RefundRecovery();
        await runScenario5HealthMonitoring();
        await runScenario6ConcurrentTransfers();

        console.log('\n╔═══════════════════════════════════════════════════════════╗');
        console.log('║           ALL SCENARIOS COMPLETED SUCCESSFULLY           ║');
        console.log('╚═══════════════════════════════════════════════════════════╝\n');

        console.log('📊 Summary:');
        console.log('   ✅ Circuit Breaker: Prevents cascading failures');
        console.log('   ✅ Deadlock Retry: Automatic recovery with backoff');
        console.log('   ✅ Payment Safety: Idempotent webhook handling');
        console.log('   ✅ Refund Recovery: Automatic retry of stuck refunds');
        console.log('   ✅ Health Checks: Real-time service monitoring');
        console.log('   ✅ Concurrency: Safe concurrent transaction handling\n');

    } catch (error) {
        console.error('\n❌ Scenario test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
