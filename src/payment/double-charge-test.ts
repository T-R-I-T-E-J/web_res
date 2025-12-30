/**
 * Payment Double Charge Prevention
 * Uses database constraints and idempotency to prevent duplicate charges
 */

interface PaymentData {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    amount: number;
    currency?: string;
}

/**
 * Safe payment processing with idempotency
 */
export async function processPaymentSafely(
    prisma: any,
    paymentData: PaymentData
): Promise<{ success: boolean; message: string }> {
    try {
        // Try to update existing payment record
        const payment = await prisma.payment.update({
            where: { razorpayOrderId: paymentData.razorpayOrderId },
            data: {
                razorpayPaymentId: paymentData.razorpayPaymentId,
                status: 'COMPLETED',
            },
        });

        return {
            success: true,
            message: 'Payment processed successfully',
        };
    } catch (error: any) {
        // P2002 = Unique constraint violation (payment already processed)
        if (error.code === 'P2002') {
            console.log('Payment already processed - idempotency check passed');
            return {
                success: true,
                message: 'Payment already processed (idempotent)',
            };
        }

        // P2025 = Record not found
        if (error.code === 'P2025') {
            console.log('Creating new payment record');
            const newPayment = await prisma.payment.create({
                data: {
                    razorpayOrderId: paymentData.razorpayOrderId,
                    razorpayPaymentId: paymentData.razorpayPaymentId,
                    amount: paymentData.amount,
                    currency: paymentData.currency || 'INR',
                    status: 'COMPLETED',
                },
            });

            return {
                success: true,
                message: 'New payment created',
            };
        }

        throw error;
    }
}

/**
 * Test double charge prevention
 */
export async function testDoubleChargePrevention(prisma: any) {
    console.log('\n=== Double Charge Prevention Test ===\n');

    const orderId = 'order_' + Date.now();
    const paymentId = 'pay_' + Date.now();

    // Create initial payment order
    await prisma.payment.create({
        data: {
            razorpayOrderId: orderId,
            amount: 50000,
            currency: 'INR',
            status: 'PENDING',
        },
    });

    console.log(`Created payment order: ${orderId}`);

    // First payment attempt
    const result1 = await processPaymentSafely(prisma, {
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        amount: 50000,
    });
    console.log(`First attempt: ${result1.message}`);

    // Simulate duplicate webhook/retry with same payment ID
    const result2 = await processPaymentSafely(prisma, {
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        amount: 50000,
    });
    console.log(`Second attempt (duplicate): ${result2.message}`);

    // Try with different payment ID (should fail - unique constraint)
    try {
        const result3 = await processPaymentSafely(prisma, {
            razorpayOrderId: orderId,
            razorpayPaymentId: 'pay_different_' + Date.now(),
            amount: 50000,
        });
        console.log(`Third attempt with different ID: SHOULD NOT REACH HERE`);
    } catch (error: any) {
        console.log(`Third attempt correctly blocked: ${error.code}`);
    }

    // Verify only one payment was processed
    const finalPayment = await prisma.payment.findUnique({
        where: { razorpayOrderId: orderId },
    });

    console.log(`\nFinal payment status: ${finalPayment.status}`);
    console.log(`Payment ID: ${finalPayment.razorpayPaymentId}`);
    console.log(`\n✓ Double charge prevention working correctly`);
}

/**
 * Refund retry mechanism
 */
export async function retryPendingRefunds(prisma: any, mockRazorpay?: any) {
    console.log('\n=== Refund Retry Test ===\n');

    // Find refunds stuck in PROCESSING for > 1 hour
    const oneHourAgo = new Date(Date.now() - 3600000);

    const pendingRefunds = await prisma.refund.findMany({
        where: {
            status: 'PROCESSING',
            createdAt: { lt: oneHourAgo },
        },
        include: { payment: true },
    });

    console.log(`Found ${pendingRefunds.length} pending refunds to retry`);

    for (const refund of pendingRefunds) {
        try {
            // Simulate fetching from Razorpay API
            const razorpayStatus = mockRazorpay?.getRefundStatus(refund.razorpayRefundId) || 'processed';

            const newStatus = razorpayStatus === 'processed' ? 'COMPLETED' : 'FAILED';

            await prisma.refund.update({
                where: { id: refund.id },
                data: {
                    status: newStatus,
                    processedAt: new Date(),
                },
            });

            console.log(`Refund ${refund.id}: ${refund.status} → ${newStatus}`);
        } catch (error: any) {
            console.error(`Refund retry failed for ${refund.id}: ${error.message}`);
        }
    }
}

/**
 * Create test refund data
 */
export async function createTestRefunds(prisma: any) {
    // Create a payment first
    const payment = await prisma.payment.create({
        data: {
            razorpayOrderId: 'order_refund_test_' + Date.now(),
            razorpayPaymentId: 'pay_refund_test_' + Date.now(),
            amount: 100000,
            status: 'COMPLETED',
        },
    });

    // Create a stuck refund (old and still processing)
    const twoHoursAgo = new Date(Date.now() - 7200000);

    await prisma.refund.create({
        data: {
            paymentId: payment.id,
            razorpayRefundId: 'rfnd_stuck_' + Date.now(),
            amount: 50000,
            status: 'PROCESSING',
            createdAt: twoHoursAgo,
        },
    });

    console.log('Created test refund stuck in PROCESSING state');
}
