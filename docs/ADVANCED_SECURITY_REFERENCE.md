# Advanced Security Quick Reference

## 🚦 Rate Limiting

### Global Rate Limit

**Default:** 100 requests per minute (all endpoints)

### Custom Rate Limit

```typescript
import { Throttle } from '@nestjs/throttler';

// Strict limit for sensitive operations
@Throttle({ default: { limit: 5, ttl: 60000 } })
@Post('change-password')
changePassword() {}

// Relaxed limit for public data
@Throttle({ default: { limit: 200, ttl: 60000 } })
@Get('public-competitions')
getCompetitions() {}
```

### Skip Rate Limiting

```typescript
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Get('health')
healthCheck() {}
```

---

## 📝 Audit Logging

### Automatic Logging

**All requests are automatically logged!**

Includes:

- User ID
- Action type (CREATE, READ, UPDATE, DELETE)
- IP address
- User agent
- Timestamp

### Manual Logging

```typescript
import { AuditService, AuditAction } from './common/services/audit.service.js';

constructor(private auditService: AuditService) {}

// Log with old/new values
await this.auditService.log({
  userId: currentUser.id,
  action: AuditAction.UPDATE,
  entityType: 'user',
  entityId: user.id.toString(),
  oldValues: { email: 'old@example.com' },
  newValues: { email: 'new@example.com' },
  description: 'Email updated',
});
```

### Query Logs

```typescript
// User activity
const logs = await this.auditService.getUserLogs(userId, 50);

// Entity history
const history = await this.auditService.getEntityLogs("user", "123");

// Recent activity
const recent = await this.auditService.getRecentLogs(100);

// Statistics
const stats = await this.auditService.getStatistics(30); // Last 30 days
```

---

## 🔐 Fine-Grained Permissions

### Require Permissions

```typescript
import { RequirePermissions } from './common/decorators/permissions.decorator.js';
import { PermissionsGuard } from './common/guards/permissions.guard.js';
import { UseGuards } from '@nestjs/common';

// Single permission
@UseGuards(PermissionsGuard)
@RequirePermissions('users:delete')
@Delete(':id')
deleteUser() {}

// Multiple permissions (ALL required)
@UseGuards(PermissionsGuard)
@RequirePermissions('users:read', 'audit:read')
@Get('user-audit/:id')
getUserAudit() {}
```

### Available Permissions

**Users:**

- `users:read` - View users
- `users:create` - Create users
- `users:update` - Update users
- `users:delete` - Delete users

**Roles:**

- `roles:read` - View roles
- `roles:create` - Create roles
- `roles:update` - Update roles
- `roles:delete` - Delete roles
- `roles:assign` - Assign roles to users

**Shooters:**

- `shooters:read` - View shooters
- `shooters:create` - Register shooters
- `shooters:update` - Update shooter info
- `shooters:delete` - Remove shooters

**Competitions:**

- `competitions:read` - View competitions
- `competitions:create` - Create competitions
- `competitions:update` - Update competitions
- `competitions:delete` - Delete competitions

**Scores:**

- `scores:read` - View scores
- `scores:create` - Enter scores
- `scores:update` - Update scores
- `scores:delete` - Delete scores

**Audit:**

- `audit:read` - View audit logs

**System:**

- `system:admin` - Full system access

---

## 🏗️ Role Hierarchy

### Create Role with Parent

```typescript
const role = {
  name: "scorer",
  display_name: "Competition Scorer",
  parent_id: officialRoleId, // Inherits from official
  level: 2, // Lower privilege than official (1)
  permissions: {
    "scores:create": true,
    "scores:update": true,
  },
};
```

### Permission Inheritance

```
admin (level 0)
  permissions: { 'system:admin': true, 'users:*': true }

  ├── official (level 1)
  │   permissions: { 'competitions:create': true }
  │
  │   └── scorer (level 2)
  │       permissions: { 'scores:create': true }
  │
  │       Effective permissions:
  │       - 'system:admin' (from admin)
  │       - 'users:*' (from admin)
  │       - 'competitions:create' (from official)
  │       - 'scores:create' (own)
```

---

## 📊 Complete Controller Example

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { Throttle, SkipThrottle } from "@nestjs/throttler";
import { Public } from "../auth/decorators/public.decorator.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { RequirePermissions } from "../common/decorators/permissions.decorator.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { PermissionsGuard } from "../common/guards/permissions.guard.js";
import { AuditService, AuditAction } from "../common/services/audit.service.js";

@Controller("users")
export class UsersController {
  constructor(private auditService: AuditService) {}

  // Public endpoint - no auth, no rate limit
  @Public()
  @SkipThrottle()
  @Get("public")
  getPublicData() {
    return { message: "Public data" };
  }

  // Protected - requires auth (default)
  @Get()
  getAllUsers(@CurrentUser() user: any) {
    return { users: [], requestedBy: user.email };
  }

  // Requires specific permission
  @UseGuards(PermissionsGuard)
  @RequirePermissions("users:create")
  @Post()
  async createUser(@Body() data: any, @CurrentUser() user: any) {
    const newUser = { id: 1, ...data };

    // Manual audit log
    await this.auditService.log({
      userId: user.id,
      action: AuditAction.CREATE,
      entityType: "user",
      entityId: newUser.id.toString(),
      newValues: newUser,
    });

    return newUser;
  }

  // Requires role
  @UseGuards(RolesGuard)
  @Roles("admin")
  @Delete(":id")
  async deleteUser(@Param("id") id: number, @CurrentUser() user: any) {
    // Audit log
    await this.auditService.log({
      userId: user.id,
      action: AuditAction.DELETE,
      entityType: "user",
      entityId: id.toString(),
    });

    return { message: "User deleted" };
  }

  // Custom rate limit
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post("bulk-import")
  bulkImport() {
    return { message: "Limited to 10 per minute" };
  }

  // Multiple permissions required
  @UseGuards(PermissionsGuard)
  @RequirePermissions("users:read", "audit:read")
  @Get(":id/audit")
  async getUserAudit(@Param("id") id: number) {
    const logs = await this.auditService.getUserLogs(id, 50);
    return { logs };
  }
}
```

---

## 🎯 Common Patterns

### Admin-Only Endpoint

```typescript
@UseGuards(RolesGuard)
@Roles('admin')
@Delete(':id')
adminOnlyAction() {}
```

### Permission-Based Access

```typescript
@UseGuards(PermissionsGuard)
@RequirePermissions('users:delete')
@Delete(':id')
permissionBasedAction() {}
```

### Strict Rate Limit

```typescript
@Throttle({ default: { limit: 5, ttl: 60000 } })
@Post('sensitive')
sensitiveAction() {}
```

### Audit Important Actions

```typescript
async criticalAction(@CurrentUser() user: any) {
  await this.auditService.log({
    userId: user.id,
    action: AuditAction.DELETE,
    entityType: 'resource',
    entityId: '123',
    description: 'Critical action performed',
  });
}
```

---

## 🔍 Debugging

### Check User Permissions

```typescript
// In PermissionsGuard, permissions are collected
// Add logging to see what permissions user has:
console.log("User permissions:", Array.from(userPermissions));
console.log("Required permissions:", requiredPermissions);
```

### View Audit Logs

```typescript
// Get recent activity
const logs = await this.auditService.getRecentLogs(100);
console.log(logs);

// Get statistics
const stats = await this.auditService.getStatistics(7);
console.log(stats);
```

### Test Rate Limiting

```bash
# Send multiple requests quickly
for i in {1..150}; do
  curl http://localhost:8082/api/v1/users
done

# Should see 429 after 100 requests
```

---

## ⚠️ Common Errors

### 429 Too Many Requests

**Cause:** Rate limit exceeded  
**Solution:** Wait for TTL to expire or adjust limits

### 403 Forbidden (Permissions)

**Cause:** User lacks required permission  
**Solution:** Assign permission to user's role

### 403 Forbidden (Roles)

**Cause:** User doesn't have required role  
**Solution:** Assign role to user

---

## 📈 Monitoring

### Audit Statistics

```typescript
const stats = await this.auditService.getStatistics(30);
// Returns:
{
  total: 1523,
  period_days: 30,
  actions: {
    'LOGIN': 450,
    'CREATE': 123,
    'UPDATE': 567,
    'DELETE': 45,
    ...
  },
  unique_users: 87
}
```

### Rate Limit Monitoring

Monitor 429 responses in logs to identify:

- Potential attacks
- Legitimate high-traffic periods
- Need for limit adjustments

---

**Quick Tips:**

1. Use `@Public()` for public endpoints
2. Use `@Roles()` for simple role checks
3. Use `@RequirePermissions()` for fine-grained control
4. Use `@Throttle()` for custom rate limits
5. Always audit sensitive operations
6. Review audit logs regularly
7. Adjust rate limits based on usage patterns
