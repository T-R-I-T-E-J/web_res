import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

interface LoginAttempt {
  count: number;
  firstAttempt: Date;
  lastAttempt: Date;
  blocked: boolean;
  blockUntil?: Date;
}

@Injectable()
export class BruteForceProtectionService {
  private attempts: Map<string, LoginAttempt> = new Map();
  
  // Configuration
  private readonly MAX_ATTEMPTS = 5; // Max failed attempts
  private readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private readonly BLOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour
  private readonly PERMANENT_BLOCK_THRESHOLD = 20; // Permanent block after 20 attempts

  constructor(private configService: ConfigService) {}

  /**
   * Check if IP/user is allowed to attempt login
   */
  canAttemptLogin(identifier: string): boolean {
    const attempt = this.attempts.get(identifier);
    
    if (!attempt) {
      return true; // First attempt
    }

    // Check if permanently blocked
    if (attempt.count >= this.PERMANENT_BLOCK_THRESHOLD) {
      throw new UnauthorizedException(
        'Account permanently locked due to suspicious activity. Contact administrator.'
      );
    }

    // Check if currently blocked
    if (attempt.blocked && attempt.blockUntil) {
      if (new Date() < attempt.blockUntil) {
        const minutesLeft = Math.ceil(
          (attempt.blockUntil.getTime() - Date.now()) / 60000
        );
        throw new UnauthorizedException(
          `Too many failed attempts. Try again in ${minutesLeft} minutes.`
        );
      } else {
        // Block expired, reset
        this.attempts.delete(identifier);
        return true;
      }
    }

    // Check if window expired
    const windowExpired = 
      Date.now() - attempt.firstAttempt.getTime() > this.WINDOW_MS;
    
    if (windowExpired) {
      // Reset counter
      this.attempts.delete(identifier);
      return true;
    }

    return true;
  }

  /**
   * Record failed login attempt
   */
  recordFailedAttempt(identifier: string): void {
    const now = new Date();
    const attempt = this.attempts.get(identifier);

    if (!attempt) {
      // First failed attempt
      this.attempts.set(identifier, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
        blocked: false,
      });
      return;
    }

    // Increment counter
    attempt.count++;
    attempt.lastAttempt = now;

    // Check if should block
    if (attempt.count >= this.MAX_ATTEMPTS) {
      attempt.blocked = true;
      attempt.blockUntil = new Date(Date.now() + this.BLOCK_DURATION_MS);
      
      // Log security event
      console.error(
        `[SECURITY] Brute force detected from ${identifier}. ` +
        `${attempt.count} failed attempts. Blocked for 1 hour.`
      );
    }

    this.attempts.set(identifier, attempt);
  }

  /**
   * Record successful login (reset counter)
   */
  recordSuccessfulLogin(identifier: string): void {
    this.attempts.delete(identifier);
  }

  /**
   * Get attempt info for monitoring
   */
  getAttemptInfo(identifier: string): LoginAttempt | null {
    return this.attempts.get(identifier) || null;
  }

  /**
   * Manually block an identifier (for admin use)
   */
  blockIdentifier(identifier: string, permanent = false): void {
    const now = new Date();
    this.attempts.set(identifier, {
      count: permanent ? this.PERMANENT_BLOCK_THRESHOLD : this.MAX_ATTEMPTS,
      firstAttempt: now,
      lastAttempt: now,
      blocked: true,
      blockUntil: permanent ? undefined : new Date(Date.now() + this.BLOCK_DURATION_MS),
    });
  }

  /**
   * Unblock an identifier (for admin use)
   */
  unblockIdentifier(identifier: string): void {
    this.attempts.delete(identifier);
  }

  /**
   * Get all blocked identifiers
   */
  getBlockedIdentifiers(): string[] {
    const blocked: string[] = [];
    this.attempts.forEach((attempt, identifier) => {
      if (attempt.blocked) {
        blocked.push(identifier);
      }
    });
    return blocked;
  }

  /**
   * Clean up old entries (run periodically)
   */
  cleanup(): void {
    const now = Date.now();
    this.attempts.forEach((attempt, identifier) => {
      // Remove if window expired and not blocked
      if (!attempt.blocked && 
          now - attempt.firstAttempt.getTime() > this.WINDOW_MS) {
        this.attempts.delete(identifier);
      }
      // Remove if block expired
      if (attempt.blocked && attempt.blockUntil && 
          now > attempt.blockUntil.getTime()) {
        this.attempts.delete(identifier);
      }
    });
  }
}
