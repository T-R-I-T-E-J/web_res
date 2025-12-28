import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface IPRule {
  ip: string;
  type: 'whitelist' | 'blacklist';
  reason: string;
  addedAt: Date;
  expiresAt?: Date;
}

@Injectable()
export class IPFilterService {
  private whitelist: Map<string, IPRule> = new Map();
  private blacklist: Map<string, IPRule> = new Map();

  constructor(private configService: ConfigService) {
    this.initializeDefaultRules();
  }

  /**
   * Initialize default rules
   */
  private initializeDefaultRules(): void {
    // Whitelist localhost and Docker network
    this.addToWhitelist('127.0.0.1', 'Localhost', true);
    this.addToWhitelist('::1', 'Localhost IPv6', true);
    
    // Whitelist Docker network range
    for (let i = 0; i <= 255; i++) {
      this.addToWhitelist(`172.25.0.${i}`, 'Docker network', true);
    }

    // Blacklist known malicious IPs (examples)
    this.addToBlacklist('0.0.0.0', 'Invalid IP', true);
    
    // Add your production server IPs to whitelist
    const allowedIPs = this.configService.get<string>('ALLOWED_IPS');
    if (allowedIPs) {
      allowedIPs.split(',').forEach(ip => {
        this.addToWhitelist(ip.trim(), 'Configured allowed IP', true);
      });
    }
  }

  /**
   * Check if IP is allowed
   */
  isAllowed(ip: string): boolean {
    // Remove if expired
    this.cleanupExpired();

    // Check blacklist first
    if (this.blacklist.has(ip)) {
      const rule = this.blacklist.get(ip)!;
      throw new ForbiddenException(
        `Access denied. IP ${ip} is blacklisted. Reason: ${rule.reason}`
      );
    }

    // If whitelist is empty, allow all (except blacklisted)
    if (this.whitelist.size === 0) {
      return true;
    }

    // Check whitelist
    if (this.whitelist.has(ip)) {
      return true;
    }

    // Check if IP is in whitelisted range
    if (this.isInWhitelistedRange(ip)) {
      return true;
    }

    // Not in whitelist
    throw new ForbiddenException(
      `Access denied. IP ${ip} is not whitelisted.`
    );
  }

  /**
   * Check if IP is in any whitelisted range
   */
  private isInWhitelistedRange(ip: string): boolean {
    // Check Docker network range (172.25.0.0/16)
    if (ip.startsWith('172.25.')) {
      return true;
    }

    // Check private network ranges
    if (ip.startsWith('10.') || 
        ip.startsWith('192.168.') ||
        ip.startsWith('172.16.')) {
      return true;
    }

    return false;
  }

  /**
   * Add IP to whitelist
   */
  addToWhitelist(
    ip: string, 
    reason: string, 
    permanent = false,
    durationHours = 24
  ): void {
    const rule: IPRule = {
      ip,
      type: 'whitelist',
      reason,
      addedAt: new Date(),
      expiresAt: permanent ? undefined : new Date(Date.now() + durationHours * 60 * 60 * 1000),
    };
    
    this.whitelist.set(ip, rule);
    
    // Remove from blacklist if exists
    this.blacklist.delete(ip);
    
    console.log(`[SECURITY] IP ${ip} added to whitelist. Reason: ${reason}`);
  }

  /**
   * Add IP to blacklist
   */
  addToBlacklist(
    ip: string, 
    reason: string, 
    permanent = false,
    durationHours = 24
  ): void {
    const rule: IPRule = {
      ip,
      type: 'blacklist',
      reason,
      addedAt: new Date(),
      expiresAt: permanent ? undefined : new Date(Date.now() + durationHours * 60 * 60 * 1000),
    };
    
    this.blacklist.set(ip, rule);
    
    // Remove from whitelist if exists
    this.whitelist.delete(ip);
    
    console.error(`[SECURITY] IP ${ip} added to blacklist. Reason: ${reason}`);
  }

  /**
   * Remove IP from whitelist
   */
  removeFromWhitelist(ip: string): void {
    this.whitelist.delete(ip);
  }

  /**
   * Remove IP from blacklist
   */
  removeFromBlacklist(ip: string): void {
    this.blacklist.delete(ip);
  }

  /**
   * Get all whitelisted IPs
   */
  getWhitelist(): IPRule[] {
    return Array.from(this.whitelist.values());
  }

  /**
   * Get all blacklisted IPs
   */
  getBlacklist(): IPRule[] {
    return Array.from(this.blacklist.values());
  }

  /**
   * Clean up expired rules
   */
  private cleanupExpired(): void {
    const now = new Date();
    
    this.whitelist.forEach((rule, ip) => {
      if (rule.expiresAt && now > rule.expiresAt) {
        this.whitelist.delete(ip);
      }
    });
    
    this.blacklist.forEach((rule, ip) => {
      if (rule.expiresAt && now > rule.expiresAt) {
        this.blacklist.delete(ip);
      }
    });
  }

  /**
   * Auto-blacklist IP after suspicious activity
   */
  autoBlacklist(ip: string, reason: string, hours = 24): void {
    this.addToBlacklist(ip, `Auto-blocked: ${reason}`, false, hours);
  }
}
