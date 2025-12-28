import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../services/audit.service.js';
import { AuditAction } from '../entities/audit-log.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      url: string;
      user: User;
      ip: string;
      headers: Record<string, any>;
    }>();
    const { method, url, user, ip, headers } = request;

    // Map HTTP methods to audit actions
    const actionMap: Record<string, AuditAction> = {
      POST: AuditAction.CREATE,
      GET: AuditAction.READ,
      PUT: AuditAction.UPDATE,
      PATCH: AuditAction.UPDATE,
      DELETE: AuditAction.DELETE,
    };

    const action = actionMap[method] || AuditAction.READ;

    return next.handle().pipe(
      tap(() => {
        // Log after successful request
        void this.auditService.log({
          userId: user?.id,
          action,
          tableName: this.extractTableName(url),
          ipAddress: (ip || headers['x-forwarded-for'] || headers['x-real-ip']) as string,
          userAgent: headers['user-agent'] as string,
        });
      }),
    );
  }

  private extractTableName(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 2] || parts[parts.length - 1] || 'unknown';
  }
}
