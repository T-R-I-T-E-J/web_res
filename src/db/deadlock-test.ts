/**
 * Deadlock Detection and Retry Mechanism
 * Handles PostgreSQL deadlocks with exponential backoff
 */

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function withDeadlockRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3
): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error: any) {
            // PostgreSQL deadlock error code
            if (error.code === '40P01' && attempt < maxRetries - 1) {
                const backoffMs = 100 * Math.pow(2, attempt);
                console.log(`Deadlock detected, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${maxRetries})`);
                await sleep(backoffMs);
                continue;
            }
            throw error;
        }
    }
    throw new Error('Max deadlock retries exceeded');
}

/**
 * Simulate deadlock scenario for testing
 * Creates two accounts and attempts concurrent transfers
 */
export async function simulateDeadlock(prisma: any) {
    console.log('\n=== Deadlock Simulation Test ===\n');

    // Create two test accounts
    const account1 = await prisma.account.create({
        data: { balance: 1000 }
    });

    const account2 = await prisma.account.create({
        data: { balance: 1000 }
    });

    console.log(`Created accounts: ${account1.id} ($1000), ${account2.id} ($1000)`);

    // Simulate potential deadlock: concurrent transfers in opposite directions
    const transfer1 = async () => {
        return withDeadlockRetry(async () => {
            return await prisma.$transaction(async (tx: any) => {
                // Lock account1 first
                const acc1 = await tx.account.findUnique({
                    where: { id: account1.id }
                });

                await sleep(50); // Simulate processing time

                // Then lock account2
                const acc2 = await tx.account.findUnique({
                    where: { id: account2.id }
                });

                // Transfer $100 from account1 to account2
                await tx.account.update({
                    where: { id: account1.id },
                    data: { balance: acc1.balance - 100 }
                });

                await tx.account.update({
                    where: { id: account2.id },
                    data: { balance: acc2.balance + 100 }
                });

                console.log('Transfer 1 completed: $100 from account1 to account2');
            });
        });
    };

    const transfer2 = async () => {
        return withDeadlockRetry(async () => {
            return await prisma.$transaction(async (tx: any) => {
                // Lock account2 first (opposite order)
                const acc2 = await tx.account.findUnique({
                    where: { id: account2.id }
                });

                await sleep(50); // Simulate processing time

                // Then lock account1
                const acc1 = await tx.account.findUnique({
                    where: { id: account1.id }
                });

                // Transfer $50 from account2 to account1
                await tx.account.update({
                    where: { id: account2.id },
                    data: { balance: acc2.balance - 50 }
                });

                await tx.account.update({
                    where: { id: account1.id },
                    data: { balance: acc1.balance + 50 }
                });

                console.log('Transfer 2 completed: $50 from account2 to account1');
            });
        });
    };

    // Execute both transfers concurrently (may cause deadlock)
    try {
        await Promise.all([transfer1(), transfer2()]);
        console.log('\nBoth transfers completed successfully');

        // Check final balances
        const finalAcc1 = await prisma.account.findUnique({ where: { id: account1.id } });
        const finalAcc2 = await prisma.account.findUnique({ where: { id: account2.id } });

        console.log(`Final balances: Account1=$${finalAcc1.balance}, Account2=$${finalAcc2.balance}`);
        console.log(`Expected: Account1=$950, Account2=$1050`);
    } catch (error: any) {
        console.error(`Deadlock test failed: ${error.message}`);
    }
}

/**
 * Best practices for deadlock prevention
 */
export const DEADLOCK_PREVENTION_TIPS = `
Deadlock Prevention Best Practices:
1. Always acquire locks in consistent order (e.g., by ID ascending)
2. Keep transactions short and simple
3. Use SELECT ... FOR UPDATE NOWAIT for explicit locking
4. Monitor pg_stat_activity for long-running transactions
5. Implement retry logic with exponential backoff
6. Consider optimistic locking for high-contention scenarios
`;
