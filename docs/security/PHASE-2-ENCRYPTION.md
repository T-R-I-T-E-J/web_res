y# Phase-2 Security Enhancements: Encryption & Advanced Security

## Overview

This document covers additional security features not yet implemented:

1. **Data Encryption at Rest** (Database)
2. **Data Encryption in Transit** (API)
3. **Password Hashing** (bcrypt/argon2)
4. **Sensitive Data Encryption** (Field-level)
5. **API Key Encryption**
6. **File Upload Security**
7. **Two-Factor Authentication (2FA)**
8. **Session Management**
9. **IP Whitelisting**
10. **Advanced Monitoring & Alerting**

---

## 🔐 1. Data Encryption at Rest

### Current Status: ⏳ **NOT IMPLEMENTED**

### What It Means

Encrypting data stored in the database so even if someone gains access to the database files, they cannot read the data.

### Implementation Options

#### Option A: PostgreSQL Native Encryption (Recommended)

**Enable Transparent Data Encryption (TDE):**

```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive columns
ALTER TABLE users
ADD COLUMN encrypted_email BYTEA;

-- Encrypt data
UPDATE users
SET encrypted_email = pgp_sym_encrypt(email, 'encryption-key-here');

-- Decrypt data
SELECT pgp_sym_decrypt(encrypted_email, 'encryption-key-here') AS email
FROM users;
```

**Pros:**

- ✅ Database-level encryption
- ✅ No application changes needed
- ✅ Industry standard

**Cons:**

- ❌ Requires PostgreSQL configuration
- ❌ Performance overhead

---

#### Option B: Application-Level Encryption (NestJS)

**Install crypto library:**

```bash
npm install --save @nestjs/config crypto-js
npm install --save-dev @types/crypto-js
```

**Create encryption service:**

**File:** `apps/api/src/common/services/encryption.service.ts`

```typescript
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as CryptoJS from "crypto-js";

@Injectable()
export class EncryptionService {
  private readonly encryptionKey: string;

  constructor(private configService: ConfigService) {
    this.encryptionKey = this.configService.get<string>("ENCRYPTION_KEY");
    if (!this.encryptionKey) {
      throw new Error("ENCRYPTION_KEY must be set in environment variables");
    }
  }

  /**
   * Encrypt sensitive data
   * @param data - Plain text data to encrypt
   * @returns Encrypted string
   */
  encrypt(data: string): string {
    if (!data) return null;
    return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
  }

  /**
   * Decrypt encrypted data
   * @param encryptedData - Encrypted string
   * @returns Decrypted plain text
   */
  decrypt(encryptedData: string): string {
    if (!encryptedData) return null;
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Hash data (one-way, cannot be decrypted)
   * @param data - Data to hash
   * @returns Hashed string
   */
  hash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Verify hashed data
   * @param data - Plain text data
   * @param hashedData - Hashed data to compare
   * @returns True if match
   */
  verifyHash(data: string, hashedData: string): boolean {
    return this.hash(data) === hashedData;
  }

  /**
   * Generate random encryption key
   * @param length - Key length (default: 32)
   * @returns Random key
   */
  static generateKey(length: number = 32): string {
    return CryptoJS.lib.WordArray.random(length).toString();
  }
}
```

**Usage in entities:**

```typescript
import { Entity, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import { EncryptionService } from "../services/encryption.service";

@Entity("users")
export class User {
  @Column({ type: "text", nullable: true })
  private encryptedEmail: string;

  // Virtual property (not stored in DB)
  email: string;

  @BeforeInsert()
  @BeforeUpdate()
  encryptSensitiveData() {
    const encryptionService = new EncryptionService(/* inject config */);
    if (this.email) {
      this.encryptedEmail = encryptionService.encrypt(this.email);
    }
  }

  // Getter to decrypt
  getEmail(): string {
    const encryptionService = new EncryptionService(/* inject config */);
    return encryptionService.decrypt(this.encryptedEmail);
  }
}
```

**Environment variable:**

```bash
# .env
ENCRYPTION_KEY=<generate-strong-32-char-key>
```

**Generate key:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🔒 2. Password Hashing (Already Implemented?)

### Current Status: ✅ **CHECK IMPLEMENTATION**

Let me verify if password hashing is already implemented in your auth service.

**Best Practice: Use bcrypt or argon2**

**File:** `apps/api/src/auth/auth.service.ts`

```typescript
import * as bcrypt from "bcrypt";

export class AuthService {
  private readonly SALT_ROUNDS = 12; // Higher = more secure, slower

  /**
   * Hash password before storing
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verify password during login
   */
  async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
```

**Usage:**

```typescript
// During registration
const hashedPassword = await this.authService.hashPassword(dto.password);
user.password = hashedPassword;

// During login
const isValid = await this.authService.verifyPassword(
  loginDto.password,
  user.password
);
```

---

## 🔐 3. Field-Level Encryption for Sensitive Data

### What to Encrypt

**High Priority:**

- ✅ Email addresses
- ✅ Phone numbers
- ✅ Aadhaar numbers (India)
- ✅ Bank account details
- ✅ Medical information
- ✅ Personal addresses

**Medium Priority:**

- ⏳ Full names (depends on use case)
- ⏳ Date of birth
- ⏳ Profile pictures (URLs)

**Do NOT Encrypt:**

- ❌ User IDs
- ❌ Usernames (needed for login)
- ❌ Roles/permissions
- ❌ Timestamps
- ❌ Foreign keys

### Implementation

**Create encrypted entity:**

```typescript
import { Entity, Column, BeforeInsert, BeforeUpdate } from "typeorm";

@Entity("shooters")
export class Shooter {
  @Column()
  id: number;

  @Column()
  name: string; // Public, not encrypted

  // Encrypted fields
  @Column({ type: "text", name: "encrypted_email" })
  private _encryptedEmail: string;

  @Column({ type: "text", name: "encrypted_phone", nullable: true })
  private _encryptedPhone: string;

  @Column({ type: "text", name: "encrypted_aadhaar", nullable: true })
  private _encryptedAadhaar: string;

  // Virtual properties
  email: string;
  phone: string;
  aadhaar: string;

  @BeforeInsert()
  @BeforeUpdate()
  encryptFields() {
    const encryption = new EncryptionService(/* config */);

    if (this.email) {
      this._encryptedEmail = encryption.encrypt(this.email);
    }
    if (this.phone) {
      this._encryptedPhone = encryption.encrypt(this.phone);
    }
    if (this.aadhaar) {
      this._encryptedAadhaar = encryption.encrypt(this.aadhaar);
    }
  }

  // Getters
  getEmail(): string {
    const encryption = new EncryptionService(/* config */);
    return encryption.decrypt(this._encryptedEmail);
  }

  getPhone(): string {
    const encryption = new EncryptionService(/* config */);
    return encryption.decrypt(this._encryptedPhone);
  }

  getAadhaar(): string {
    const encryption = new EncryptionService(/* config */);
    return encryption.decrypt(this._encryptedAadhaar);
  }
}
```

---

## 🔑 4. API Key Encryption & Management

### Current Status: ⏳ **NOT IMPLEMENTED**

**Create API key service:**

**File:** `apps/api/src/common/services/api-key.service.ts`

```typescript
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiKey } from "../entities/api-key.entity";
import * as crypto from "crypto";

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeyRepository: Repository<ApiKey>
  ) {}

  /**
   * Generate new API key
   */
  async generateApiKey(userId: number, name: string): Promise<string> {
    // Generate random key
    const key = crypto.randomBytes(32).toString("hex");

    // Hash for storage (never store plain API keys!)
    const hashedKey = crypto.createHash("sha256").update(key).digest("hex");

    // Save to database
    const apiKey = this.apiKeyRepository.create({
      userId,
      name,
      keyHash: hashedKey,
      lastUsedAt: null,
    });

    await this.apiKeyRepository.save(apiKey);

    // Return plain key ONCE (user must save it)
    return key;
  }

  /**
   * Validate API key
   */
  async validateApiKey(key: string): Promise<ApiKey | null> {
    const hashedKey = crypto.createHash("sha256").update(key).digest("hex");

    const apiKey = await this.apiKeyRepository.findOne({
      where: { keyHash: hashedKey, isActive: true },
    });

    if (apiKey) {
      // Update last used timestamp
      apiKey.lastUsedAt = new Date();
      await this.apiKeyRepository.save(apiKey);
    }

    return apiKey;
  }

  /**
   * Revoke API key
   */
  async revokeApiKey(keyId: number): Promise<void> {
    await this.apiKeyRepository.update(keyId, { isActive: false });
  }
}
```

**Entity:**

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("api_keys")
export class ApiKey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  name: string;

  @Column({ unique: true })
  keyHash: string; // Never store plain keys!

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  lastUsedAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;
}
```

---

## 📁 5. File Upload Security

### Current Status: ⏳ **NOT IMPLEMENTED**

**Secure file upload configuration:**

```typescript
import { diskStorage } from "multer";
import { extname } from "path";
import * as crypto from "crypto";

export const multerConfig = {
  storage: diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
      // Generate random filename to prevent path traversal
      const randomName = crypto.randomBytes(16).toString("hex");
      const ext = extname(file.originalname);
      cb(null, `${randomName}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Whitelist allowed file types
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type. Only images and documents allowed."));
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
};
```

**File upload controller:**

```typescript
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "./config/multer.config";

@Controller("upload")
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor("file", multerConfig))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Scan file for viruses (optional, requires ClamAV)
    // await this.virusScanService.scan(file.path);

    return {
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
```

**Additional Security:**

- ✅ Scan files for viruses (ClamAV)
- ✅ Store files outside web root
- ✅ Use CDN for serving files
- ✅ Implement file size limits
- ✅ Validate file content (not just extension)

---

## 🔐 6. Two-Factor Authentication (2FA)

### Current Status: ⏳ **NOT IMPLEMENTED**

**Install dependencies:**

```bash
npm install --save speakeasy qrcode
npm install --save-dev @types/speakeasy @types/qrcode
```

**2FA Service:**

```typescript
import { Injectable } from "@nestjs/common";
import * as speakeasy from "speakeasy";
import * as QRCode from "qrcode";

@Injectable()
export class TwoFactorAuthService {
  /**
   * Generate 2FA secret for user
   */
  async generateSecret(email: string) {
    const secret = speakeasy.generateSecret({
      name: `Para Shooting India (${email})`,
      length: 32,
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32, // Store this in database (encrypted!)
      qrCode: qrCodeUrl, // Show to user once
    };
  }

  /**
   * Verify 2FA token
   */
  verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 2, // Allow 2 time steps before/after
    });
  }

  /**
   * Generate backup codes
   */
  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }
}
```

**Usage:**

```typescript
// Enable 2FA
const { secret, qrCode } = await this.twoFactorAuthService.generateSecret(
  user.email
);
user.twoFactorSecret = encryptionService.encrypt(secret); // Encrypt before storing!
user.twoFactorEnabled = true;

// Verify during login
const isValid = this.twoFactorAuthService.verifyToken(
  decryptedSecret,
  loginDto.twoFactorToken
);
```

---

## 🛡️ 7. Advanced Session Management

### Current Status: ⏳ **PARTIAL** (JWT implemented)

**Add session tracking:**

```typescript
@Entity("sessions")
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: number;

  @Column()
  token: string; // Hashed JWT

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date;

  @Column({ nullable: true })
  lastActivityAt: Date;
}
```

**Session service:**

```typescript
@Injectable()
export class SessionService {
  /**
   * Create new session
   */
  async createSession(
    userId: number,
    token: string,
    ipAddress: string,
    userAgent: string
  ): Promise<Session> {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const session = this.sessionRepository.create({
      userId,
      token: hashedToken,
      ipAddress,
      userAgent,
      isActive: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return this.sessionRepository.save(session);
  }

  /**
   * Revoke all sessions for user
   */
  async revokeAllSessions(userId: number): Promise<void> {
    await this.sessionRepository.update(
      { userId, isActive: true },
      { isActive: false }
    );
  }

  /**
   * Get active sessions for user
   */
  async getActiveSessions(userId: number): Promise<Session[]> {
    return this.sessionRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: "DESC" },
    });
  }
}
```

---

## 🌐 8. IP Whitelisting

### Current Status: ⏳ **NOT IMPLEMENTED**

**IP whitelist guard:**

```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class IpWhitelistGuard implements CanActivate {
  private readonly whitelist: string[];

  constructor(private configService: ConfigService) {
    this.whitelist = this.configService
      .get<string>("IP_WHITELIST", "")
      .split(",")
      .map((ip) => ip.trim())
      .filter((ip) => ip.length > 0);
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientIp = this.getClientIp(request);

    // If no whitelist configured, allow all
    if (this.whitelist.length === 0) {
      return true;
    }

    // Check if IP is whitelisted
    if (!this.whitelist.includes(clientIp)) {
      throw new ForbiddenException(`Access denied for IP: ${clientIp}`);
    }

    return true;
  }

  private getClientIp(request: any): string {
    return (
      request.headers["x-forwarded-for"]?.split(",")[0] ||
      request.headers["x-real-ip"] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress
    );
  }
}
```

**Usage:**

```typescript
@Controller("admin")
@UseGuards(IpWhitelistGuard)
export class AdminController {
  // Only accessible from whitelisted IPs
}
```

**Environment:**

```bash
# .env
IP_WHITELIST=192.168.1.1,10.0.0.1,203.0.113.0
```

---

## 📊 9. Advanced Monitoring & Alerting

### Current Status: ⏳ **NOT IMPLEMENTED**

**Security event monitoring:**

```typescript
@Injectable()
export class SecurityMonitoringService {
  /**
   * Log security event
   */
  async logSecurityEvent(event: {
    type:
      | "login_failed"
      | "suspicious_activity"
      | "rate_limit_exceeded"
      | "unauthorized_access";
    userId?: number;
    ipAddress: string;
    userAgent: string;
    details: any;
  }): Promise<void> {
    // Log to database
    await this.securityEventRepository.save(event);

    // Alert if critical
    if (this.isCritical(event)) {
      await this.sendAlert(event);
    }
  }

  /**
   * Detect suspicious patterns
   */
  async detectSuspiciousActivity(userId: number): Promise<boolean> {
    // Check for multiple failed logins
    const failedLogins = await this.getFailedLogins(userId, 15); // Last 15 minutes
    if (failedLogins > 5) {
      return true;
    }

    // Check for unusual IP addresses
    const recentIps = await this.getRecentIps(userId, 24); // Last 24 hours
    if (recentIps.length > 10) {
      return true;
    }

    return false;
  }

  /**
   * Send security alert
   */
  private async sendAlert(event: any): Promise<void> {
    // Send email to admin
    // Send Slack notification
    // Log to external monitoring service
  }
}
```

---

## 📋 Implementation Priority

### Phase 2A: Critical (Implement Now)

1. ✅ **Password Hashing** (bcrypt) - If not already done
2. ✅ **Field-Level Encryption** (Email, Phone, Aadhaar)
3. ✅ **File Upload Security**
4. ✅ **Session Management**

### Phase 2B: Important (Next Sprint)

5. ✅ **2FA (Two-Factor Authentication)**
6. ✅ **API Key Management**
7. ✅ **Security Monitoring**

### Phase 2C: Advanced (Future)

8. ✅ **IP Whitelisting** (Admin only)
9. ✅ **Database Encryption at Rest**
10. ✅ **Advanced Threat Detection**

---

## 🔒 Summary of Missing Security Features

| Feature              | Status     | Priority | Effort  |
| -------------------- | ---------- | -------- | ------- |
| Password Hashing     | ✅ Check   | Critical | 1 hour  |
| Field Encryption     | ❌ Missing | Critical | 4 hours |
| File Upload Security | ❌ Missing | High     | 2 hours |
| Session Management   | ⏳ Partial | High     | 3 hours |
| 2FA                  | ❌ Missing | Medium   | 4 hours |
| API Key Encryption   | ❌ Missing | Medium   | 2 hours |
| IP Whitelisting      | ❌ Missing | Low      | 1 hour  |
| Security Monitoring  | ❌ Missing | Medium   | 3 hours |
| Database Encryption  | ❌ Missing | Low      | 8 hours |

**Total Estimated Effort:** 28 hours (3-4 days)

---

**Would you like me to implement any of these security features now?**
