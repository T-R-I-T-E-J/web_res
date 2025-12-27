# Authentication & Authorization Quick Reference

## 🔐 Protecting Routes

### Make Route Public (No Auth Required)

```typescript
import { Public } from '../auth/decorators/public.decorator.js';

@Public()
@Get('public-data')
getPublicData() {
  return { message: 'Anyone can access this' };
}
```

### Require Authentication (Default)

```typescript
// No decorator needed - all routes require auth by default
@Get('protected-data')
getProtectedData() {
  return { message: 'Must be logged in' };
}
```

### Require Specific Roles

```typescript
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UseGuards } from '@nestjs/common';

@UseGuards(RolesGuard)
@Roles('admin')
@Delete(':id')
deleteResource(@Param('id') id: number) {
  return { message: 'Only admins can delete' };
}
```

### Multiple Roles (OR logic)

```typescript
@UseGuards(RolesGuard)
@Roles('admin', 'official')
@Get('admin-or-official')
getAdminData() {
  return { message: 'Admins OR officials can access' };
}
```

### Get Current User

```typescript
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Get('my-data')
getMyData(@CurrentUser() user: any) {
  return {
    message: `Hello ${user.first_name}!`,
    userId: user.id,
    roles: user.roles,
  };
}
```

---

## 📝 Complete Controller Example

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
import { Public } from "../auth/decorators/public.decorator.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";

@Controller("resources")
export class ResourcesController {
  // Public endpoint - no auth required
  @Public()
  @Get("public")
  getPublicResources() {
    return { message: "Public resources" };
  }

  // Protected endpoint - auth required
  @Get()
  getAllResources(@CurrentUser() user: any) {
    return {
      message: "All resources",
      requestedBy: user.email,
    };
  }

  // Admin only
  @UseGuards(RolesGuard)
  @Roles("admin")
  @Post()
  createResource(@Body() data: any, @CurrentUser() user: any) {
    return {
      message: "Resource created",
      createdBy: user.id,
    };
  }

  // Admin or Official
  @UseGuards(RolesGuard)
  @Roles("admin", "official")
  @Get("sensitive")
  getSensitiveData() {
    return { message: "Sensitive data" };
  }

  // Admin only
  @UseGuards(RolesGuard)
  @Roles("admin")
  @Delete(":id")
  deleteResource(@Param("id") id: number) {
    return { message: `Resource ${id} deleted` };
  }
}
```

---

## 🔑 Available Roles

- `admin` - Full system access
- `shooter` - Registered para-shooter
- `coach` - Team coach
- `official` - Competition official
- `viewer` - Read-only access (default for new users)

---

## 🌐 Frontend Integration

### Store Token

```typescript
// After login/register
const response = await fetch("http://localhost:8082/api/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

const data = await response.json();
localStorage.setItem("access_token", data.data.access_token);
localStorage.setItem("user", JSON.stringify(data.data.user));
```

### Send Token with Requests

```typescript
const token = localStorage.getItem("access_token");

const response = await fetch("http://localhost:8082/api/v1/users", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

### Handle 401 Unauthorized

```typescript
if (response.status === 401) {
  // Token expired or invalid
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}
```

### Handle 403 Forbidden

```typescript
if (response.status === 403) {
  // User doesn't have required role
  alert("You do not have permission to access this resource");
}
```

---

## 🧪 Testing with cURL

### Register

```bash
curl -X POST http://localhost:8082/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "first_name": "Test",
    "last_name": "User",
    "phone": "+919876543210"
  }'
```

### Login

```bash
curl -X POST http://localhost:8082/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### Access Protected Endpoint

```bash
TOKEN="your-jwt-token-here"

curl -X GET http://localhost:8082/api/v1/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

## ⚠️ Common Errors

### 401 Unauthorized

**Cause:** Missing or invalid token  
**Solution:** Ensure token is included in Authorization header

### 403 Forbidden

**Cause:** User doesn't have required role  
**Solution:** Assign appropriate role to user

### 400 Bad Request

**Cause:** Invalid request body  
**Solution:** Check DTO validation rules

---

## 🛠️ Admin Operations

### Assign Role to User

```typescript
// In AuthService
await this.authService.assignRole(userId, "admin", assignedByUserId);
```

### Remove Role from User

```typescript
await this.authService.removeRole(userId, "viewer");
```

### Check User Roles

```typescript
const roles = await this.authService.getUserRoles(userId);
console.log(roles); // ['viewer', 'shooter']
```

---

## 📊 JWT Token Structure

```json
{
  "sub": 1,
  "email": "user@example.com",
  "roles": ["viewer", "shooter"],
  "iat": 1703673600,
  "exp": 1703677200
}
```

- `sub` - User ID
- `email` - User email
- `roles` - Array of role names
- `iat` - Issued at (timestamp)
- `exp` - Expiration (timestamp)

---

## 🔒 Security Best Practices

1. **Never expose JWT secret** - Keep in environment variables
2. **Use HTTPS in production** - Prevent token interception
3. **Set appropriate token expiration** - Balance security and UX
4. **Implement refresh tokens** - For long-lived sessions
5. **Validate on every request** - Don't trust client-side checks
6. **Log authentication events** - For security auditing
7. **Rate limit auth endpoints** - Prevent brute force attacks

---

**Quick Start:**

1. Register a user → Get token
2. Use token in Authorization header
3. Access protected routes
4. Use @Roles() for admin routes
