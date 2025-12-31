/**
 * Audit Logging Implementation
 * 
 * Provides comprehensive audit trail for all data changes and user actions
 * Based on: 08-audit-logging.md
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuditContext {
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    requestId?: string;
}

export interface AuditEvent {
    action: string;
    tableName: string;
    recordId?: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    context: AuditContext;
}

/**
 * Sanitize sensitive data before logging
 * Redacts passwords, tokens, and masks PII according to GDPR
 */
export function sanitizeForAudit(data: Record<string, any>): Record<string, any> {
    const sensitiveFields = [
        'password', 'passwordHash', 'token', 'secret',
        'creditCard', 'bankAccount', 'aadhaar', 'pan'
    ];

    const sanitized = { ...data };

    // Redact sensitive fields
    for (const field of sensitiveFields) {
        if (field in sanitized) {
            sanitized[field] = '[REDACTED]';
        }
    }

    // Mask email partially (keep first 2 chars + domain)
    if (sanitized.email && typeof sanitized.email === 'string') {
        const [local, domain] = sanitized.email.split('@');
        if (local && domain) {
            sanitized.email = `${local.slice(0, 2)}***@${domain}`;
        }
    }

    // Mask phone (keep last 4 digits)
    if (sanitized.phone && typeof sanitized.phone === 'string') {
        sanitized.phone = sanitized.phone.replace(/\d(?=\d{4})/g, '*');
    }

    return sanitized;
}

/**
 * Log audit event to database
 */
export async function logAuditEvent(event: AuditEvent): Promise<void> {
    // Sanitize old and new values
    const sanitizedOldValues = event.oldValues ? sanitizeForAudit(event.oldValues) : null;
    const sanitizedNewValues = event.newValues ? sanitizeForAudit(event.newValues) : null;

    await prisma.auditLog.create({
        data: {
            userId: event.context.userId,
            action: event.action,
            tableName: event.tableName,
            recordId: event.recordId,
            oldValues: sanitizedOldValues ? JSON.stringify(sanitizedOldValues) : null,
            newValues: sanitizedNewValues ? JSON.stringify(sanitizedNewValues) : null,
            ipAddress: event.context.ipAddress,
            userAgent: event.context.userAgent,
            requestId: event.context.requestId,
        },
    });
}

/**
 * Query audit logs for a specific record
 */
export async function getRecordAuditHistory(tableName: string, recordId: string) {
    return prisma.auditLog.findMany({
        where: {
            tableName,
            recordId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

/**
 * Query audit logs for a specific user
 */
export async function getUserAuditHistory(userId: string, limit = 100) {
    return prisma.auditLog.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: limit,
    });
}

/**
 * Find failed login attempts from suspicious IPs
 */
export async function getFailedLoginAttempts(sinceMinutes = 60, threshold = 5) {
    const since = new Date(Date.now() - sinceMinutes * 60 * 1000);

    const logs = await prisma.auditLog.findMany({
        where: {
            action: 'LOGIN',
            createdAt: {
                gte: since,
            },
        },
    });

    // Group by IP and count failures
    const ipCounts = new Map<string, { count: number; firstAttempt: Date; lastAttempt: Date }>();

    for (const log of logs) {
        if (!log.ipAddress) continue;

        let details: any = {};
        if (log.newValues) {
            try {
                details = JSON.parse(log.newValues);
            } catch (e) {
                // Ignore parsing errors for audit logs
            }
        }
        if (details.success === false) {
            const existing = ipCounts.get(log.ipAddress);
            if (existing) {
                existing.count++;
                existing.lastAttempt = log.createdAt;
            } else {
                ipCounts.set(log.ipAddress, {
                    count: 1,
                    firstAttempt: log.createdAt,
                    lastAttempt: log.createdAt,
                });
            }
        }
    }

    // Filter by threshold
    return Array.from(ipCounts.entries())
        .filter(([_, data]) => data.count >= threshold)
        .map(([ip, data]) => ({ ipAddress: ip, ...data }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Export user's audit data for GDPR compliance
 */
export async function exportUserAuditData(userId: string) {
    const logs = await prisma.auditLog.findMany({
        where: {
            userId,
        },
        select: {
            createdAt: true,
            action: true,
            tableName: true,
            recordId: true,
            ipAddress: true,
            // Exclude sensitive new_values/old_values for privacy
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return logs;
}

/**
 * Anonymize user data in audit logs for GDPR Right to Erasure
 */
export async function anonymizeUserAuditData(userId: string) {
    // Remove PII but keep the audit trail for compliance
    await prisma.auditLog.updateMany({
        where: {
            userId,
        },
        data: {
            ipAddress: null,
            userAgent: null,
            // Note: We can't easily remove specific keys from JSON in SQLite
            // In production with PostgreSQL, use jsonb operators:
            // oldValues = old_values - 'email' - 'phone' - 'name'
        },
    });
}

/**
 * Get daily change summary for reporting
 */
export async function getDailyChangeSummary(days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const logs = await prisma.auditLog.findMany({
        where: {
            createdAt: {
                gte: since,
            },
        },
        select: {
            createdAt: true,
            tableName: true,
            action: true,
        },
    });

    // Group by date, table, and action
    const summary = new Map<string, number>();

    for (const log of logs) {
        const date = log.createdAt.toISOString().split('T')[0];
        const key = `${date}|${log.tableName}|${log.action}`;
        summary.set(key, (summary.get(key) || 0) + 1);
    }

    // Convert to array
    return Array.from(summary.entries()).map(([key, count]) => {
        const [date, tableName, action] = key.split('|');
        return { date, tableName, action, count };
    });
}

export { prisma };
