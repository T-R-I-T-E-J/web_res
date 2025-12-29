# 🔒 Critical Security: 2FA Bypass Vulnerability

## Problem Description

### What is happening

The authentication system has a **critical logic flaw** that completely bypasses Two-Factor Authentication (2FA). Even when users enable 2FA on their accounts, the login process ignores this setting and immediately issues a JWT token after password verification, granting full access without requiring the second factor.

### Where it is happening

- **Backend**: `apps/api/src/auth/auth.service.ts` - `login()` method
- **Database**: `users` table has `two_factor_enabled` column (unused in auth flow)
- **Affected Feature**: User authentication and account security
- **Impact**: All user accounts with 2FA enabled

### Why it is a problem

This is a **critical security vulnerability** that:

- ✗ Renders the 2FA feature completely useless
- ✗ Provides false security to users who believe their accounts are protected
- ✗ Violates user expectations and trust
- ✗ Exposes accounts to credential stuffing attacks
- ✗ May violate compliance requirements (if applicable)
- ✗ Creates legal liability if accounts are compromised

### Who is affected

- **All Users with 2FA Enabled**: Believe they have enhanced security but don't
- **High-Value Accounts**: Administrators, coaches with sensitive data
- **Organization**: Reputation damage if breach occurs
- **Compliance**: May fail security audits

---

## Root Cause Analysis

### The Vulnerability: Missing 2FA Check in Login Flow

**Current (Broken) Code**:

```typescript
// apps/api/src/auth/auth.service.ts
async login(email: string, password: string) {
  // 1. Find user
  const user = await this.usersService.findByEmail(email);
  if (!user) throw new UnauthorizedException('Invalid credentials');

  // 2. Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

  // 3. ❌ CRITICAL BUG: Immediately return JWT
  //    Never checks if user.two_factor_enabled === true
  return {
    access_token: this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    }),
  };
}
```

**What Should Happen**:

```typescript
async login(email: string, password: string) {
  // 1. Find user
  const user = await this.usersService.findByEmail(email);
  if (!user) throw new UnauthorizedException('Invalid credentials');

  // 2. Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

  // 3. ✅ Check if 2FA is enabled
  if (user.two_factor_enabled) {
    // Generate and send 2FA code (TOTP or SMS)
    const tempToken = this.generateTempToken(user.id);
    await this.send2FACode(user);

    return {
      requires_2fa: true,
      temp_token: tempToken, // Used to verify 2FA code
      message: 'Please enter your 2FA code',
    };
  }

  // 4. Only issue JWT if 2FA is NOT enabled
  return {
    access_token: this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    }),
  };
}
```

### Attack Scenario

**Attacker's Perspective**:

1. Obtain user credentials (phishing, data breach, password reuse)
2. Attempt login with stolen credentials
3. **Expected**: System asks for 2FA code → Attacker blocked ✅
4. **Actual**: System immediately grants access → Attacker succeeds ❌

**Impact**: 2FA provides **zero protection** against credential theft.

---

## Steps to Reproduce

### Setup

1. Create a test user account
2. Enable 2FA for the account (set `two_factor_enabled = true` in database)
3. Note the user's credentials

### Exploitation

1. **Attempt login** with the user's credentials:

   ```bash
   curl -X POST http://localhost:8080/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

2. **Observe the response**:

   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

3. **Expected behavior** (if 2FA was working):

   ```json
   {
     "requires_2fa": true,
     "temp_token": "temp_xyz123",
     "message": "Please enter your 2FA code"
   }
   ```

4. **Verify**: User is fully authenticated without providing 2FA code

### Verification

```sql
-- Check user's 2FA status
SELECT id, email, two_factor_enabled FROM users WHERE email = 'test@example.com';
-- Shows: two_factor_enabled = true

-- But login still succeeds without 2FA verification
```

---

## Impact Assessment

### Security Impact

- **Severity**: Critical (CVSS 9.1 - Critical)
- **Attack Complexity**: Low (just need credentials)
- **Privileges Required**: None
- **User Interaction**: None
- **Confidentiality Impact**: High (full account access)
- **Integrity Impact**: High (can modify data)
- **Availability Impact**: High (can delete data)

### Business Impact

- **Trust**: Users lose confidence in platform security
- **Compliance**: May violate security standards (SOC 2, ISO 27001)
- **Legal**: Potential liability if accounts are compromised
- **Reputation**: Negative publicity if vulnerability is disclosed

### User Impact

- **False Sense of Security**: Users think they're protected but aren't
- **Account Takeover Risk**: Credentials alone are sufficient for full access
- **Data Exposure**: Personal information, competition results, admin data

---

## Scope & Constraints

### ✅ In Scope

- Fix `login()` method to check `two_factor_enabled` flag
- Implement 2FA verification endpoint (`/auth/verify-2fa`)
- Generate and validate TOTP codes (or SMS codes)
- Create temporary tokens for 2FA flow
- Update frontend to handle 2FA flow
- Add 2FA setup/disable endpoints (if not already present)
- Test complete 2FA flow end-to-end

### ❌ Out of Scope (Separate Issues/Future Work)

- 2FA recovery codes
- Multiple 2FA methods (TOTP + SMS + hardware keys)
- 2FA enforcement policies (require for all admins)
- Backup authentication methods
- 2FA audit logging (covered in separate audit issue)

### 📋 Assumptions

- Users have `two_factor_enabled` boolean column in database
- Users have `two_factor_secret` column for TOTP secrets
- Frontend can handle multi-step authentication flow
- TOTP is the preferred 2FA method (can use `speakeasy` or `otplib` library)

### 🔗 Dependencies

- Requires TOTP library (`speakeasy`, `otplib`, or similar)
- Requires QR code generation for 2FA setup (`qrcode` library)
- Frontend must support 2FA verification UI
- May need email/SMS service for code delivery (if not using TOTP)

---

## Acceptance Criteria

This issue is considered **resolved** when:

- [ ] **Backend Logic**

  - [ ] `login()` method checks `two_factor_enabled` flag
  - [ ] If 2FA enabled, returns `requires_2fa: true` instead of JWT
  - [ ] Temporary token generated for 2FA verification
  - [ ] New endpoint `/auth/verify-2fa` created and functional
  - [ ] TOTP codes validated correctly (time-based, 30-second window)

- [ ] **2FA Verification Flow**

  - [ ] User enters 6-digit TOTP code
  - [ ] Backend validates code against user's secret
  - [ ] On success, JWT token is issued
  - [ ] On failure, appropriate error returned (with rate limiting)
  - [ ] Temporary token expires after reasonable time (e.g., 5 minutes)

- [ ] **2FA Setup/Management**

  - [ ] Endpoint to enable 2FA (generates secret, returns QR code)
  - [ ] Endpoint to disable 2FA (requires password confirmation)
  - [ ] Endpoint to verify 2FA setup (test code before enabling)
  - [ ] User's secret stored securely (encrypted)

- [ ] **Security Measures**

  - [ ] Rate limiting on 2FA verification (prevent brute force)
  - [ ] Temporary tokens are single-use
  - [ ] Temporary tokens expire appropriately
  - [ ] Failed 2FA attempts logged
  - [ ] Account lockout after X failed attempts (optional but recommended)

- [ ] **Frontend Integration**

  - [ ] Login page handles `requires_2fa` response
  - [ ] 2FA verification UI implemented
  - [ ] 2FA setup page with QR code display
  - [ ] User can enable/disable 2FA in settings
  - [ ] Clear error messages for invalid codes

- [ ] **Testing**

  - [ ] User with 2FA enabled cannot login without code
  - [ ] User with 2FA disabled can login normally
  - [ ] Invalid 2FA codes are rejected
  - [ ] Expired temporary tokens are rejected
  - [ ] Rate limiting prevents brute force attacks
  - [ ] 2FA setup flow works end-to-end

- [ ] **Documentation**
  - [ ] 2FA flow documented in API docs
  - [ ] User guide for enabling 2FA
  - [ ] Security best practices documented
  - [ ] Recovery process documented (if implemented)

---

## Suggested Labels

- `security` - Security vulnerability
- `critical` - Highest severity
- `authentication` - Auth system issue
- `2fa` - Two-factor authentication
- `backend` - Backend logic fix required
- `frontend` - Frontend changes needed
- `compliance` - May affect compliance
- `high-priority` - Must fix before production

---

## Priority

**🔴 CRITICAL**

**Justification**:

- **Security vulnerability** that completely bypasses a security feature
- **User trust** is at stake (users believe they're protected)
- **Compliance risk** (may violate security requirements)
- **Legal liability** if accounts are compromised
- **Cannot deploy to production** with this vulnerability

---

## Environment

- **Branch**: All branches (security issue in core auth logic)
- **Environment**: All environments (local, staging, production)
- **Affected Code**: `apps/api/src/auth/auth.service.ts`
- **Database**: `users` table (`two_factor_enabled`, `two_factor_secret` columns)
- **Framework**: NestJS with Passport.js

---

## Recommended Fix (Implementation Guidance)

### Step 1: Install Required Packages

```bash
cd apps/api
npm install speakeasy qrcode
npm install -D @types/speakeasy @types/qrcode
```

### Step 2: Update `auth.service.ts` - Fix Login Method

**File**: `apps/api/src/auth/auth.service.ts`

```typescript
import * as speakeasy from 'speakeasy';

async login(email: string, password: string) {
  // 1. Find user
  const user = await this.usersService.findByEmail(email);
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // 2. Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // 3. ✅ CHECK IF 2FA IS ENABLED
  if (user.two_factor_enabled) {
    // Generate temporary token for 2FA verification
    const tempToken = this.jwtService.sign(
      { sub: user.id, purpose: '2fa_verification' },
      { expiresIn: '5m' } // 5 minute expiry
    );

    return {
      requires_2fa: true,
      temp_token: tempToken,
      message: 'Please enter your 2FA code',
    };
  }

  // 4. If 2FA not enabled, issue JWT normally
  return {
    access_token: this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    }),
  };
}
```

### Step 3: Create 2FA Verification Endpoint

```typescript
// apps/api/src/auth/auth.service.ts

async verify2FA(tempToken: string, code: string) {
  // 1. Verify temporary token
  let payload;
  try {
    payload = this.jwtService.verify(tempToken);
    if (payload.purpose !== '2fa_verification') {
      throw new UnauthorizedException('Invalid token');
    }
  } catch (error) {
    throw new UnauthorizedException('Token expired or invalid');
  }

  // 2. Get user
  const user = await this.usersService.findById(payload.sub);
  if (!user || !user.two_factor_enabled) {
    throw new UnauthorizedException('Invalid request');
  }

  // 3. Verify TOTP code
  const isValid = speakeasy.totp.verify({
    secret: user.two_factor_secret,
    encoding: 'base32',
    token: code,
    window: 1, // Allow 1 step before/after for clock skew
  });

  if (!isValid) {
    // Log failed attempt
    await this.auditService.log({
      user_id: user.id,
      action: '2FA_VERIFICATION_FAILED',
      ip_address: '...', // Get from request
    });

    throw new UnauthorizedException('Invalid 2FA code');
  }

  // 4. Issue actual JWT token
  return {
    access_token: this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    }),
  };
}
```

### Step 4: Create 2FA Setup Endpoint

```typescript
// apps/api/src/auth/auth.service.ts
import * as QRCode from 'qrcode';

async setup2FA(userId: string) {
  const user = await this.usersService.findById(userId);

  // Generate secret
  const secret = speakeasy.generateSecret({
    name: `Para Shooting (${user.email})`,
    issuer: 'Para Shooting Committee of India',
  });

  // Generate QR code
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

  // Store secret (temporarily, until verified)
  await this.usersService.updateTempSecret(userId, secret.base32);

  return {
    secret: secret.base32,
    qr_code: qrCodeUrl,
    message: 'Scan this QR code with your authenticator app',
  };
}

async enable2FA(userId: string, verificationCode: string) {
  const user = await this.usersService.findById(userId);

  // Verify the code works before enabling
  const isValid = speakeasy.totp.verify({
    secret: user.temp_two_factor_secret,
    encoding: 'base32',
    token: verificationCode,
    window: 1,
  });

  if (!isValid) {
    throw new BadRequestException('Invalid verification code');
  }

  // Enable 2FA
  await this.usersService.update(userId, {
    two_factor_enabled: true,
    two_factor_secret: user.temp_two_factor_secret,
    temp_two_factor_secret: null,
  });

  return { message: '2FA enabled successfully' };
}
```

### Step 5: Add Controller Endpoints

**File**: `apps/api/src/auth/auth.controller.ts`

```typescript
@Post('verify-2fa')
async verify2FA(@Body() dto: Verify2FADto) {
  return this.authService.verify2FA(dto.temp_token, dto.code);
}

@Post('setup-2fa')
@UseGuards(JwtAuthGuard)
async setup2FA(@Request() req) {
  return this.authService.setup2FA(req.user.id);
}

@Post('enable-2fa')
@UseGuards(JwtAuthGuard)
async enable2FA(@Request() req, @Body() dto: Enable2FADto) {
  return this.authService.enable2FA(req.user.id, dto.code);
}

@Post('disable-2fa')
@UseGuards(JwtAuthGuard)
async disable2FA(@Request() req, @Body() dto: Disable2FADto) {
  // Verify password before disabling
  const user = await this.usersService.findById(req.user.id);
  const isValid = await bcrypt.compare(dto.password, user.password);

  if (!isValid) {
    throw new UnauthorizedException('Invalid password');
  }

  await this.usersService.update(req.user.id, {
    two_factor_enabled: false,
    two_factor_secret: null,
  });

  return { message: '2FA disabled successfully' };
}
```

### Step 6: Update Database Schema (if needed)

```sql
-- Add temp_two_factor_secret column if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS temp_two_factor_secret VARCHAR(255);

-- Ensure two_factor_secret is encrypted
-- (Use application-level encryption, not shown here)
```

### Step 7: Add Rate Limiting

```typescript
// In auth.controller.ts
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
@Post('verify-2fa')
async verify2FA(@Body() dto: Verify2FADto) {
  return this.authService.verify2FA(dto.temp_token, dto.code);
}
```

---

## Security Best Practices

### ✅ Implemented in Fix

- TOTP codes validated with time window for clock skew
- Temporary tokens expire after 5 minutes
- Rate limiting on verification endpoint
- Failed attempts logged for audit
- Secret stored securely (should be encrypted)
- QR code generated server-side

### ⚠️ Additional Recommendations

- **Recovery Codes**: Generate backup codes when enabling 2FA
- **Account Lockout**: Lock account after X failed 2FA attempts
- **Email Notifications**: Notify user when 2FA is enabled/disabled
- **IP Tracking**: Log IP addresses for 2FA attempts
- **Device Fingerprinting**: Remember trusted devices (optional)

---

## Testing Checklist

- [ ] User with 2FA enabled is prompted for code
- [ ] Valid TOTP code grants access
- [ ] Invalid TOTP code is rejected
- [ ] Expired temporary token is rejected
- [ ] Rate limiting blocks brute force attempts
- [ ] 2FA setup generates valid QR code
- [ ] Authenticator app (Google Authenticator, Authy) works
- [ ] 2FA can be disabled with password
- [ ] User without 2FA logs in normally
- [ ] Failed attempts are logged

---

## Related Issues

- **Auth Token Desync** (localStorage vs Cookies issue)
- **Audit Logging** (ensure 2FA events are logged)
- **Email Encryption** (secure storage of user data)

---

**Issue Created**: 2025-12-29  
**Reported By**: Security Audit  
**Severity**: Critical - Security Vulnerability  
**CVE**: (To be assigned if publicly disclosed)  
**Estimated Fix Time**: 4-6 hours  
**Testing Time**: 2 hours
