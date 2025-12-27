import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditAction } from '../entities/audit-log.entity.js';

export interface AuditLogOptions {
  userId?: number;
  action: AuditAction;
  entityType?: string;
  entityId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  description?: string;
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
      action: options.action,
      entity_type: options.entityType,
      entity_id: options.entityId,
      old_values: options.oldValues,
      new_values: options.newValues,
      ip_address: options.ipAddress,
      user_agent: options.userAgent,
      description: options.description,
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
   * Get audit logs for a specific entity
   */
  async getEntityLogs(
    entityType: string,
    entityId: string,
    limit: number = 100,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { entity_type: entityType, entity_id: entityId },
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
}
