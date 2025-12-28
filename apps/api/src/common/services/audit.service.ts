import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditAction } from '../entities/audit-log.entity.js';

export interface AuditLogOptions {
  userId?: number;
  action: AuditAction | string;
  tableName: string;
  recordId?: number;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Create an audit log entry
   */
  async log(options: AuditLogOptions): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      user_id: options.userId,
      action: options.action as any,
      table_name: options.tableName,
      record_id: options.recordId,
      old_values: options.oldValues,
      new_values: options.newValues,
      ip_address: options.ipAddress,
      user_agent: options.userAgent,
      request_id: options.requestId,
    });

    return this.auditLogRepository.save(auditLog);
  }

  /**
   * Get audit logs for a specific user
   */
  async getUserLogs(
    userId: number,
    limit: number = 100,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get audit logs for a specific table/record
   */
  async getTableLogs(
    tableName: string,
    recordId?: number,
    limit: number = 100,
  ): Promise<AuditLog[]> {
    const where: any = { table_name: tableName };
    if (recordId) {
      where.record_id = recordId;
    }
    return this.auditLogRepository.find({
      where,
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get recent audit logs
   */
  async getRecentLogs(limit: number = 100): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get audit logs by action type
   */
  async getLogsByAction(
    action: AuditAction,
    limit: number = 100,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { action },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get audit statistics
   */
  async getStatistics(days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const logs = await this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.created_at >= :since', { since })
      .getMany();

    const actionCounts: Record<string, number> = {};
    logs.forEach((log) => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });

    return {
      total: logs.length,
      period_days: days,
      actions: actionCounts,
      unique_users: new Set(logs.map((l) => l.user_id).filter(Boolean)).size,
    };
  }

  /**
   * GDPR/DPDP Compliance: Log consent changes
   */
  async logConsentChange(
    userId: number,
    consentType: 'analytics' | 'marketing' | 'necessary',
    granted: boolean,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuditLog> {
    return this.log({
      userId,
      action: 'UPDATE',
      tableName: 'user_consent',
      newValues: {
        consent_type: consentType,
        granted,
        timestamp: new Date().toISOString(),
      },
      ipAddress,
      userAgent,
    });
  }

  /**
   * GDPR/DPDP Compliance: Log data export requests
   */
  async logDataExport(
    userId: number,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuditLog> {
    return this.log({
      userId,
      action: 'SELECT',
      tableName: 'user_data_export',
      newValues: {
        export_requested_at: new Date().toISOString(),
        status: 'initiated',
      },
      ipAddress,
      userAgent,
    });
  }

  /**
   * GDPR/DPDP Compliance: Log data deletion requests (Right to be Forgotten)
   */
  async logDataDeletion(
    userId: number,
    reason?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuditLog> {
    return this.log({
      userId,
      action: 'DELETE',
      tableName: 'user_data_deletion',
      newValues: {
        deletion_requested_at: new Date().toISOString(),
        reason,
        status: 'pending',
      },
      ipAddress,
      userAgent,
    });
  }

  /**
   * GDPR/DPDP Compliance: Get user's complete audit trail
   * Required for transparency and accountability
   */
  async getUserCompleteAuditTrail(userId: number): Promise<{
    user_id: number;
    total_actions: number;
    actions_by_type: Record<string, number>;
    consent_history: AuditLog[];
    data_access_history: AuditLog[];
    data_modification_history: AuditLog[];
    first_activity: Date | null;
    last_activity: Date | null;
  }> {
    const allLogs = await this.getUserLogs(userId, 10000);

    const actionsByType: Record<string, number> = {};
    allLogs.forEach((log) => {
      actionsByType[log.action] = (actionsByType[log.action] || 0) + 1;
    });

    return {
      user_id: userId,
      total_actions: allLogs.length,
      actions_by_type: actionsByType,
      consent_history: allLogs.filter((log) =>
        log.table_name.includes('consent'),
      ),
      data_access_history: allLogs.filter((log) => log.action === 'SELECT'),
      data_modification_history: allLogs.filter(
        (log) => log.action === 'UPDATE' || log.action === 'DELETE',
      ),
      first_activity: allLogs.length > 0 ? allLogs[allLogs.length - 1].created_at : null,
      last_activity: allLogs.length > 0 ? allLogs[0].created_at : null,
    };
  }
}
