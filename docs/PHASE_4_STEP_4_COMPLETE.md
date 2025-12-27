# Phase 4, Step 4 Complete: Advanced Security & Auditing

**Date:** 2025-12-27  
**Status:** ✅ **SUCCESS**

---

## 🎉 What Was Accomplished

### 1. ✅ API Rate Limiting

**Implementation:**

- `@nestjs/throttler` integration
- Global rate limiting (100 requests/minute)
- Configurable TTL and limits
- Automatic 429 Too Many Requests responses

**Configuration:**

```typescript
ThrottlerModule.forRoot([
  {
    ttl: 60000, // 60 seconds
    limit: 100, // 100 requests per minute
  },
]);
```

### 2. ✅ Audit Logging

**Features:**

- Comprehensive audit log entity
- Automatic request logging via interceptor
- Track user actions, IP addresses, user agents
- Support for old/new values (change tracking)
- Query by user, entity, action type
- Audit statistics

**Audit Actions:**

- CREATE, READ, UPDATE, DELETE
- LOGIN, LOGOUT, REGISTER
- PASSWORD_CHANGE
- ROLE_ASSIGN, ROLE_REMOVE
- PERMISSION_GRANT, PERMISSION_REVOKE

**AuditLog Entity:**

```typescript
{
  id: number;
  user_id?: number;
  action: AuditAction;
  entity_type?: string;
  entity_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  description?: string;
  created_at: Date;
}
```

### 3. ✅ Fine-Grained Permissions

**Permission System:**

- Resource-based permissions (e.g., `users:read`, `users:create`)
- Action-based granularity (read, create, update, delete)
- Custom permissions support
- Permission inheritance from parent roles

**Available Permissions:**

```typescript
// User permissions
"users:read", "users:create", "users:update", "users:delete";

// Role permissions
"roles:read", "roles:create", "roles:update", "roles:delete", "roles:assign";

// Shooter permissions
"shooters:read", "shooters:create", "shooters:update", "shooters:delete";

// Competition permissions
"competitions:read",
  "competitions:create",
  "competitions:update",
  "competitions:delete";

// Score permissions
"scores:read", "scores:create", "scores:update", "scores:delete";

// Audit permissions
("audit:read");

// System permissions
("system:admin");
```

### 4. ✅ Role Hierarchy

**Features:**

- Parent-child role relationships
- Permission inheritance
- Role levels (0 = highest privilege)
- Recursive permission collection

**Role Structure:**

```typescript
{
  id: number;
  name: string;
  display_name: string;
  description?: string;
  permissions: RolePermissions;
  is_system: boolean;
  parent_id?: number;      // NEW: Parent role
  level: number;           // NEW: Hierarchy level
  parent?: Role;           // NEW: Parent relationship
}
```

**Example Hierarchy:**

```
admin (level 0)
  ├── official (level 1)
  │   └── scorer (level 2)
  ├── coach (level 1)
  └── shooter (level 1)
      └── viewer (level 2)
```

---

## 📦 File Structure

```
apps/api/src/
├── common/
│   ├── decorators/
│   │   └── permissions.decorator.ts    # @RequirePermissions()
│   ├── entities/
│   │   └── audit-log.entity.ts         # Audit log entity
│   ├── guards/
│   │   └── permissions.guard.ts        # Permission checking
│   ├── interceptors/
│   │   └── audit.interceptor.ts        # Auto audit logging
│   └── services/
│       └── audit.service.ts            # Audit operations
├── auth/
│   └── entities/
│       └── role.entity.ts              # Updated with hierarchy
└── app.module.ts                       # Global config
```

---

## 🔐 Security Features

### Rate Limiting

✅ Prevents brute force attacks  
✅ Protects against DDoS  
✅ Configurable per endpoint  
✅ Automatic throttling

### Audit Logging

✅ Complete activity trail  
✅ Forensic analysis capability  
✅ Compliance support  
✅ Security incident investigation

### Fine-Grained Permissions

✅ Least privilege principle  
✅ Resource-level control  
✅ Action-level granularity  
✅ Flexible permission model

### Role Hierarchy

✅ Permission inheritance  
✅ Simplified management  
✅ Scalable role structure  
✅ Clear privilege levels

---

## 📝 Usage Examples

### 1. Rate Limiting

**Default (Global):**
All endpoints automatically rate-limited to 100 req/min

**Custom Rate Limit:**

```typescript
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { limit: 10, ttl: 60000 } })
@Post('sensitive-operation')
sensitiveOp() {
  // Limited to 10 requests per minute
}
```

**Skip Rate Limiting:**

```typescript
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Get('public-data')
getPublicData() {
  // No rate limiting
}
```

### 2. Audit Logging

**Automatic Logging:**
All requests are automatically logged via `AuditInterceptor`

**Manual Logging:**

```typescript
import { AuditService, AuditAction } from './common/services/audit.service.js';

constructor(private auditService: AuditService) {}

async deleteUser(id: number, currentUser: any) {
  const user = await this.findById(id);

  // Log the action
  await this.auditService.log({
    userId: currentUser.id,
    action: AuditAction.DELETE,
    entityType: 'user',
    entityId: id.toString(),
    oldValues: { ...user },
    description: `User ${user.email} deleted`,
  });

  await this.userRepository.delete(id);
}
```

**Query Audit Logs:**

```typescript
// Get user's activity
const userLogs = await this.auditService.getUserLogs(userId, 50);

// Get entity history
const entityLogs = await this.auditService.getEntityLogs("user", "123", 100);

// Get recent activity
const recentLogs = await this.auditService.getRecentLogs(100);

// Get statistics
const stats = await this.auditService.getStatistics(30); // Last 30 days
```

### 3. Fine-Grained Permissions

**Require Specific Permissions:**

```typescript
import { RequirePermissions } from './common/decorators/permissions.decorator.js';
import { PermissionsGuard } from './common/guards/permissions.guard.js';
import { UseGuards } from '@nestjs/common';

@UseGuards(PermissionsGuard)
@RequirePermissions('users:delete')
@Delete(':id')
deleteUser(@Param('id') id: number) {
  // Only users with 'users:delete' permission can access
}
```

**Multiple Permissions (AND logic):**

```typescript
@UseGuards(PermissionsGuard)
@RequirePermissions('users:read', 'audit:read')
@Get('user-audit/:id')
getUserAudit(@Param('id') id: number) {
  // Requires BOTH permissions
}
```

**Assign Permissions to Role:**

```typescript
const adminRole = {
  name: "admin",
  display_name: "Administrator",
  permissions: {
    "users:read": true,
    "users:create": true,
    "users:update": true,
    "users:delete": true,
    "roles:read": true,
    "roles:create": true,
    "roles:update": true,
    "roles:delete": true,
    "roles:assign": true,
    "audit:read": true,
    "system:admin": true,
  },
  level: 0,
};
```

### 4. Role Hierarchy

**Create Role with Parent:**

```typescript
const scorerRole = {
  name: "scorer",
  display_name: "Competition Scorer",
  parent_id: officialRoleId, // Inherits from 'official'
  level: 2,
  permissions: {
    "scores:create": true,
    "scores:update": true,
  },
};
```

**Permission Inheritance:**

```
official (parent)
  permissions: { 'competitions:read': true }

scorer (child)
  permissions: { 'scores:create': true }

Effective permissions for scorer:
  - 'competitions:read' (inherited from official)
  - 'scores:create' (own permission)
```

---

## 🎯 Default Role Setup

### Admin (Level 0)

```typescript
{
  name: 'admin',
  level: 0,
  permissions: {
    'system:admin': true,
    'users:*': true,
    'roles:*': true,
    'audit:read': true,
    // ... all permissions
  }
}
```

### Official (Level 1, Parent: admin)

```typescript
{
  name: 'official',
  parent_id: adminId,
  level: 1,
  permissions: {
    'competitions:read': true,
    'competitions:create': true,
    'competitions:update': true,
    'shooters:read': true,
    'scores:read': true,
  }
}
```

### Shooter (Level 1)

```typescript
{
  name: 'shooter',
  level: 1,
  permissions: {
    'competitions:read': true,
    'scores:read': true,
    'shooters:read': true,
  }
}
```

### Viewer (Level 2, Parent: shooter)

```typescript
{
  name: 'viewer',
  parent_id: shooterId,
  level: 2,
  permissions: {
    'competitions:read': true,
  }
}
```

---

## 📊 Audit Log Examples

### Login Event

```json
{
  "user_id": 1,
  "action": "LOGIN",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "description": "User logged in",
  "created_at": "2025-12-27T12:00:00Z"
}
```

### User Update

```json
{
  "user_id": 1,
  "action": "UPDATE",
  "entity_type": "user",
  "entity_id": "5",
  "old_values": {
    "first_name": "John",
    "email": "john@old.com"
  },
  "new_values": {
    "first_name": "John",
    "email": "john@new.com"
  },
  "ip_address": "192.168.1.100",
  "description": "Updated user email",
  "created_at": "2025-12-27T12:05:00Z"
}
```

### Role Assignment

```json
{
  "user_id": 1,
  "action": "ROLE_ASSIGN",
  "entity_type": "user",
  "entity_id": "5",
  "new_values": {
    "role": "admin"
  },
  "description": "Assigned admin role to user",
  "created_at": "2025-12-27T12:10:00Z"
}
```

---

## 🔧 Configuration

### Rate Limiting

```typescript
// Global (app.module.ts)
ThrottlerModule.forRoot([{
  ttl: 60000,    // Time window in ms
  limit: 100,    // Max requests per window
}])

// Per-endpoint
@Throttle({ default: { limit: 10, ttl: 60000 } })
```

### Audit Logging

```typescript
// Automatic via global interceptor
{
  provide: APP_INTERCEPTOR,
  useClass: AuditInterceptor,
}

// Manual logging
await this.auditService.log({
  userId: user.id,
  action: AuditAction.CREATE,
  entityType: 'user',
  entityId: newUser.id.toString(),
  newValues: { ...newUser },
});
```

---

## ✅ Features Completed

- [x] API rate limiting (global)
- [x] Custom rate limits per endpoint
- [x] Audit log entity
- [x] Automatic audit logging
- [x] Manual audit logging
- [x] Audit log queries
- [x] Audit statistics
- [x] Fine-grained permissions
- [x] Permission decorator
- [x] Permissions guard
- [x] Role hierarchy
- [x] Permission inheritance
- [x] Role levels

---

## 🚀 API Endpoints

### Audit Logs (Admin Only)

```typescript
GET /api/v1/audit/logs              // Recent logs
GET /api/v1/audit/logs/user/:id     // User activity
GET /api/v1/audit/logs/entity/:type/:id  // Entity history
GET /api/v1/audit/statistics        // Audit stats
```

---

## 🎓 How It Works

### Rate Limiting Flow:

1. Request arrives
2. ThrottlerGuard checks request count
3. If under limit → Allow
4. If over limit → Return 429 Too Many Requests

### Audit Logging Flow:

1. Request processed
2. AuditInterceptor captures request details
3. After successful response → Log to database
4. Includes user, action, IP, user agent

### Permission Check Flow:

1. Request arrives with JWT
2. JwtAuthGuard validates token
3. PermissionsGuard checks required permissions
4. Fetches user roles
5. Collects permissions (including inherited)
6. Compares with required permissions
7. Allow or deny access

### Role Hierarchy:

1. User has role (e.g., "scorer")
2. Role has parent (e.g., "official")
3. Permissions collected recursively:
   - Scorer's own permissions
   - Official's permissions (inherited)
   - Admin's permissions (if official has admin parent)
4. All permissions combined for check

---

## 📚 Best Practices

### Rate Limiting

1. **Set appropriate limits** - Balance security and UX
2. **Use custom limits** - Sensitive endpoints need stricter limits
3. **Monitor 429 responses** - Adjust limits based on usage
4. **Whitelist internal services** - Skip throttling for trusted sources

### Audit Logging

1. **Log all sensitive operations** - User changes, role assignments, deletions
2. **Include context** - IP address, user agent, old/new values
3. **Regular cleanup** - Archive old logs to maintain performance
4. **Monitor for anomalies** - Unusual patterns may indicate security issues

### Permissions

1. **Least privilege** - Grant minimum required permissions
2. **Use hierarchy** - Leverage inheritance to simplify management
3. **Regular audits** - Review and update permissions periodically
4. **Document permissions** - Clear descriptions for each permission

### Role Hierarchy

1. **Keep it simple** - Max 3-4 levels deep
2. **Logical structure** - Hierarchy should match organizational structure
3. **Test inheritance** - Ensure permissions flow correctly
4. **Version control** - Track changes to role structure

---

**Conclusion:** The system now has production-grade security with rate limiting, comprehensive audit logging, fine-grained permissions, and role hierarchy. All user actions are tracked, API abuse is prevented, and access control is granular and flexible!
