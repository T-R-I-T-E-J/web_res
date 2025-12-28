# Security Master Guide

**Date**: 2025-12-28
**Scope**: Backend & Frontend Security Measures

---

## 1. Authentication & Authorization

### JWT Strategy

- **Token Type**: Bearer Token (Stateless).
- **Expiration**: Short-lived access tokens (15m-1h recommended).
- **Storage**:
  - **Dev/Phase 4**: `localStorage` (Simple, functional).
  - **Prod/Phase 5+**: `httpOnly` secure cookies recommended for XSS protection.

### Role-Based Access Control (RBAC)

- **Implementation**: `@Roles('admin')` Decorator + `RolesGuard`.
- **Roles**:
  - `admin`: Full access (Uploads, User Management).
  - `shooter`: Read/Write personal data.
  - `viewer`: Read-only public data.

---

## 2. API Security Headers (Helmet.js)

The backend (`main.ts`) implements comprehensive security headers:

| Header                      | Value                             | Purpose                              |
| :-------------------------- | :-------------------------------- | :----------------------------------- |
| `Content-Security-Policy`   | Strict default                    | Prevents XSS, limits script sources. |
| `X-Frame-Options`           | `DENY`                            | Prevents Clickjacking.               |
| `X-Content-Type-Options`    | `nosniff`                         | Prevents MIME-sniffing attacks.      |
| `Strict-Transport-Security` | `max-age=31536000`                | Enforces HTTPS (HSTS).               |
| `Referrer-Policy`           | `strict-origin-when-cross-origin` | Privacy protection.                  |

---

## 3. Data Protection

### Input Validation

- **DTOs**: All inputs validated using `class-validator` (e.g., Email format, Password complexity).
- **Sanitization**: All strings sanitized to prevent SQL Injection/XSS.
- **File Uploads**:
  - **Type Check**: PDF Mime-type enforcement.
  - **Size Limit**: 10MB hard limit.
  - **Renaming**: Files stored as UUIDs to prevent directory traversal.

### Database Security

- **Passwords**: Bcrypt Hashing (Salt Rounds: 10).
- **Credentials**: Database password stored in `.env`, never in code.
- **Access**: Application connects via specific user, not root (in prod).

---

## 4. Rate Limiting (Throttler)

- **Global Limit**: 100 requests / 60 seconds per IP.
- **Login Endpoint**: stricter limits (e.g., 5 requests / minute) to prevent Brute Force.

---

## 5. Environment & Secrets

- **.env Files**: Not committed to Git.
- **.env.example**: Template committed with dummy values.
- **Secret Rotation**: `JWT_SECRET` and DB credentials should be rotated periodically.

---

## 6. Audit Logging

- **Database**: `updated_at` and `created_at` timestamps on all records.
- **Action Logs**: (Planned) `audit_logs` table to track Admin actions (Upload/Delete).
