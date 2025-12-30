/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures by detecting failures and opening the circuit
 */

export class CircuitBreaker {
    private failures = 0;
    private lastFailure = 0;
    private state: 'closed' | 'open' | 'half-open' = 'closed';
    private readonly failureThreshold: number;
    private readonly resetTimeout: number;

    constructor(failureThreshold = 5, resetTimeout = 30000) {
        this.failureThreshold = failureThreshold;
        this.resetTimeout = resetTimeout;
    }

    async execute<T>(operation: () => Promise<T>): Promise<T> {
        if (this.state === 'open') {
            if (Date.now() - this.lastFailure > this.resetTimeout) {
                this.state = 'half-open';
                console.log('Circuit breaker entering half-open state');
            } else {
                throw new Error('Circuit breaker is open - request rejected');
            }
        }

        try {
            const result = await operation();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    private onSuccess() {
        this.failures = 0;
        if (this.state === 'half-open') {
            console.log('Circuit breaker closing after successful request');
        }
        this.state = 'closed';
    }

    private onFailure() {
        this.failures++;
        this.lastFailure = Date.now();

        if (this.failures >= this.failureThreshold) {
            console.log(`Circuit breaker opening after ${this.failures} failures`);
            this.state = 'open';
        }
    }

    getState() {
        return {
            state: this.state,
            failures: this.failures,
            lastFailure: this.lastFailure,
        };
    }
}

/**
 * Database Circuit Breaker - Specialized for database operations
 */
export class DatabaseCircuitBreaker extends CircuitBreaker {
    constructor() {
        super(5, 30000); // 5 failures, 30s reset
    }
}

// Example usage and testing
export async function testCircuitBreaker() {
    const breaker = new CircuitBreaker(3, 5000);

    console.log('\n=== Circuit Breaker Test ===\n');

    // Simulate failures
    for (let i = 0; i < 5; i++) {
        try {
            await breaker.execute(async () => {
                if (i < 4) {
                    throw new Error(`Simulated failure ${i + 1}`);
                }
                return 'success';
            });
        } catch (error: any) {
            console.log(`Attempt ${i + 1}: ${error.message}`);
            console.log(`State:`, breaker.getState());
        }

        // Small delay between attempts
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Wait for reset
    console.log('\nWaiting for circuit to reset...');
    await new Promise(resolve => setTimeout(resolve, 5500));

    // Try again after reset
    try {
        const result = await breaker.execute(async () => 'success after reset');
        console.log(`\nSuccess after reset: ${result}`);
        console.log(`Final state:`, breaker.getState());
    } catch (error: any) {
        console.log(`Failed after reset: ${error.message}`);
    }
}
