import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { IPFilterService } from '../services/ip-filter.service';
import { BruteForceProtectionService } from '../../auth/services/brute-force-protection.service';
import { QueryProtectionService } from '../services/query-protection.service';

@Injectable()
export class SecurityGuard implements CanActivate {
  constructor(
    private ipFilterService: IPFilterService,
    private bruteForceService: BruteForceProtectionService,
    private queryProtectionService: QueryProtectionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Get client IP
    const clientIP = this.getClientIP(request);
    
    // 1. Check IP whitelist/blacklist
    try {
      this.ipFilterService.isAllowed(clientIP);
    } catch (error) {
      console.error(`[SECURITY] IP ${clientIP} blocked:`, error.message);
      throw new ForbiddenException('Access denied');
    }

    // 2. Check brute force protection (for login endpoints)
    if (this.isLoginEndpoint(request)) {
      try {
        this.bruteForceService.canAttemptLogin(clientIP);
      } catch (error) {
        console.error(`[SECURITY] Brute force protection triggered for ${clientIP}`);
        throw error;
      }
    }

    // 3. Validate request body for SQL injection
    if (request.body) {
      this.validateRequestBody(request.body, clientIP);
    }

    // 4. Validate query parameters for SQL injection
    if (request.query) {
      this.validateQueryParams(request.query, clientIP);
    }

    // 5. Check for connection flooding
    const canConnect = await this.queryProtectionService.preventConnectionFlooding();
    if (!canConnect) {
      console.error(`[SECURITY] Connection flooding detected from ${clientIP}`);
      
      // Auto-blacklist the IP
      this.ipFilterService.autoBlacklist(
        clientIP,
        'Connection flooding (DoS attempt)',
        24
      );
      
      throw new ForbiddenException('Too many connections. Access temporarily blocked.');
    }

    return true;
  }

  /**
   * Get client IP address
   */
  private getClientIP(request: Request): string {
    // Check for proxy headers
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      return (forwarded as string).split(',')[0].trim();
    }

    const realIP = request.headers['x-real-ip'];
    if (realIP) {
      return realIP as string;
    }

    return request.ip || request.socket.remoteAddress || 'unknown';
  }

  /**
   * Check if endpoint is a login endpoint
   */
  private isLoginEndpoint(request: Request): boolean {
    const url = request.url.toLowerCase();
    return url.includes('/login') || 
           url.includes('/auth') || 
           url.includes('/signin');
  }

  /**
   * Validate request body for SQL injection
   */
  private validateRequestBody(body: any, clientIP: string): void {
    const values = this.extractValues(body);
    
    for (const value of values) {
      if (typeof value === 'string') {
        if (!this.queryProtectionService.validateInput(value)) {
          console.error(
            `[SECURITY] SQL injection attempt detected from ${clientIP} in request body`
          );
          
          // Auto-blacklist the IP
          this.ipFilterService.autoBlacklist(
            clientIP,
            'SQL injection attempt',
            48 // 48 hours
          );
          
          throw new ForbiddenException('Invalid input detected');
        }
      }
    }
  }

  /**
   * Validate query parameters for SQL injection
   */
  private validateQueryParams(query: any, clientIP: string): void {
    const values = this.extractValues(query);
    
    for (const value of values) {
      if (typeof value === 'string') {
        if (!this.queryProtectionService.validateInput(value)) {
          console.error(
            `[SECURITY] SQL injection attempt detected from ${clientIP} in query params`
          );
          
          // Auto-blacklist the IP
          this.ipFilterService.autoBlacklist(
            clientIP,
            'SQL injection attempt in query params',
            48 // 48 hours
          );
          
          throw new ForbiddenException('Invalid query parameters');
        }
      }
    }
  }

  /**
   * Extract all string values from object (recursive)
   */
  private extractValues(obj: any): string[] {
    const values: string[] = [];
    
    if (typeof obj === 'string') {
      values.push(obj);
    } else if (Array.isArray(obj)) {
      obj.forEach(item => {
        values.push(...this.extractValues(item));
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.values(obj).forEach(value => {
        values.push(...this.extractValues(value));
      });
    }
    
    return values;
  }
}
