import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Session } from '../entities/session.entity';
import * as crypto from 'crypto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  /**
   * Create a new session
   */
  async createSession(
    userId: number,
    token: string,
    ipAddress: string,
    userAgent: string,
    expiresIn: number = 7 * 24 * 60 * 60 * 1000, // 7 days default
  ): Promise<Session> {
    // Hash the token for storage (never store plain JWT)
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Parse device from user agent
    const device = this.parseDevice(userAgent);

    const session = this.sessionRepository.create({
      userId,
      token: hashedToken,
      ipAddress,
      userAgent,
      device,
      isActive: true,
      expiresAt: new Date(Date.now() + expiresIn),
      lastActivityAt: new Date(),
    });

    return this.sessionRepository.save(session);
  }

  /**
   * Find session by token
   */
  async findByToken(token: string): Promise<Session | null> {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    return this.sessionRepository.findOne({
      where: { token: hashedToken, isActive: true },
    });
  }

  /**
   * Update session activity
   */
  async updateActivity(sessionId: string): Promise<void> {
    await this.sessionRepository.update(sessionId, {
      lastActivityAt: new Date(),
    });
  }

  /**
   * Get all active sessions for a user
   */
  async getActiveSessions(userId: number): Promise<Session[]> {
    return this.sessionRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string): Promise<void> {
    await this.sessionRepository.update(sessionId, { isActive: false });
  }

  /**
   * Revoke all sessions for a user
   */
  async revokeAllSessions(userId: number): Promise<void> {
    await this.sessionRepository.update(
      { userId, isActive: true },
      { isActive: false },
    );
  }

  /**
   * Revoke all sessions except current one
   */
  async revokeOtherSessions(
    userId: number,
    currentSessionId: string,
  ): Promise<void> {
    await this.sessionRepository
      .createQueryBuilder()
      .update(Session)
      .set({ isActive: false })
      .where('user_id = :userId', { userId })
      .andWhere('id != :currentSessionId', { currentSessionId })
      .andWhere('is_active = :isActive', { isActive: true })
      .execute();
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.sessionRepository.delete({
      expiresAt: LessThan(new Date()),
    });

    return result.affected || 0;
  }

  /**
   * Get session count for user
   */
  async getSessionCount(userId: number): Promise<number> {
    return this.sessionRepository.count({
      where: { userId, isActive: true },
    });
  }

  /**
   * Detect suspicious activity
   * Returns true if activity seems suspicious
   */
  async detectSuspiciousActivity(userId: number): Promise<boolean> {
    const sessions = await this.getActiveSessions(userId);

    // Check for too many active sessions
    if (sessions.length > 10) {
      return true;
    }

    // Check for sessions from different countries (if location is available)
    const locations = sessions
      .map((s) => s.location)
      .filter((l) => l)
      .filter((v, i, a) => a.indexOf(v) === i);

    if (locations.length > 3) {
      return true;
    }

    // Check for rapid session creation (more than 5 in last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentSessions = sessions.filter(
      (s) => s.createdAt > oneHourAgo,
    );

    if (recentSessions.length > 5) {
      return true;
    }

    return false;
  }

  /**
   * Parse device information from user agent
   */
  private parseDevice(userAgent: string): string {
    // Simple device detection
    if (userAgent.includes('iPhone')) return 'iPhone';
    if (userAgent.includes('iPad')) return 'iPad';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('Windows')) return 'Windows PC';
    if (userAgent.includes('Mac')) return 'Mac';
    if (userAgent.includes('Linux')) return 'Linux';

    return 'Unknown Device';
  }
}
