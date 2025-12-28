# SSL/TLS Configuration Guide

## Overview

This guide covers complete SSL/TLS setup for the Para Shooting Committee of India platform, including certificate management, Cloudflare SSL configuration, and security hardening.

---

## Table of Contents

1. [Understanding SSL/TLS](#understanding-ssltls)
2. [Netlify SSL Configuration](#netlify-ssl-configuration)
3. [Cloudflare SSL Configuration](#cloudflare-ssl-configuration)
4. [HSTS Implementation](#hsts-implementation)
5. [Certificate Management](#certificate-management)
6. [Testing & Validation](#testing--validation)
7. [Troubleshooting](#troubleshooting)

---

## Understanding SSL/TLS

### What is SSL/TLS?

- **SSL** (Secure Sockets Layer) - Deprecated protocol
- **TLS** (Transport Layer Security) - Modern, secure protocol
- **Purpose**: Encrypts data between client and server

### Why SSL/TLS Matters

- ✅ **Data Encryption**: Protects user data in transit
- ✅ **Authentication**: Verifies server identity
- ✅ **SEO Boost**: Google ranks HTTPS sites higher
- ✅ **User Trust**: Browser shows padlock icon
- ✅ **GDPR/DPDP**: Required for compliance

### SSL/TLS Versions

| Version | Status         | Security    |
| ------- | -------------- | ----------- |
| SSL 2.0 | ❌ Deprecated  | Insecure    |
| SSL 3.0 | ❌ Deprecated  | Insecure    |
| TLS 1.0 | ❌ Deprecated  | Weak        |
| TLS 1.1 | ❌ Deprecated  | Weak        |
| TLS 1.2 | ✅ Supported   | Secure      |
| TLS 1.3 | ✅ Recommended | Most Secure |

**Recommendation**: Use **TLS 1.2** minimum, prefer **TLS 1.3**

---

## Netlify SSL Configuration

### Automatic SSL (Recommended)

Netlify provides **free, automatic SSL certificates** via Let's Encrypt.

#### Step 1: Enable HTTPS

1. **Login** to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site: **para-shooting-india**
3. Go to **Site settings** → **Domain management**
4. Scroll to **HTTPS** section

#### Step 2: Verify SSL Certificate

```
Certificate Status: Active ✅
Certificate Type: Let's Encrypt
Expires: Auto-renews every 90 days
```

#### Step 3: Force HTTPS Redirect

**Enable automatic HTTPS redirect:**

```
☑ Force HTTPS
☑ HSTS (HTTP Strict Transport Security)
```

**What this does:**

- Redirects all HTTP traffic to HTTPS
- Adds `Strict-Transport-Security` header
- Prevents man-in-the-middle attacks

#### Step 4: Configure netlify.toml

**File:** `netlify.toml`

```toml
[build]
  base = "apps/web"
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

# Force HTTPS redirect
[[redirects]]
  from = "http://parashootingindia.org/*"
  to = "https://parashootingindia.org/:splat"
  status = 301
  force = true

[[redirects]]
  from = "http://www.parashootingindia.org/*"
  to = "https://www.parashootingindia.org/:splat"
  status = 301
  force = true

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    # HSTS - Force HTTPS for 1 year
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"

    # Prevent clickjacking
    X-Frame-Options = "DENY"

    # Prevent MIME sniffing
    X-Content-Type-Options = "nosniff"

    # XSS Protection
    X-XSS-Protection = "1; mode=block"

    # Referrer Policy
    Referrer-Policy = "strict-origin-when-cross-origin"

    # Permissions Policy
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

---

## Cloudflare SSL Configuration

### SSL/TLS Encryption Modes

Cloudflare offers 4 SSL modes:

| Mode              | Description                         | Security | Use Case        |
| ----------------- | ----------------------------------- | -------- | --------------- |
| **Off**           | ❌ No encryption                    | Insecure | Never use       |
| **Flexible**      | ⚠️ Cloudflare ↔ User only           | Weak     | Legacy sites    |
| **Full**          | ✅ End-to-end (self-signed OK)      | Good     | Most sites      |
| **Full (strict)** | ✅ End-to-end (valid cert required) | Best     | **Recommended** |

### Recommended Configuration: Full (strict)

#### Step 1: Access Cloudflare Dashboard

1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select domain: **parashootingindia.org**
3. Go to **SSL/TLS** → **Overview**

#### Step 2: Set Encryption Mode

```
SSL/TLS encryption mode: Full (strict)
```

**What this means:**

```
User Browser ←[HTTPS/TLS]→ Cloudflare ←[HTTPS/TLS]→ Netlify
             (Encrypted)              (Encrypted)
```

**Why Full (strict)?**

- ✅ End-to-end encryption
- ✅ Validates Netlify's certificate
- ✅ Prevents man-in-the-middle attacks
- ✅ Best security practice

#### Step 3: Enable Always Use HTTPS

**Path:** SSL/TLS → Edge Certificates

```
☑ Always Use HTTPS
```

**What this does:**

- Redirects all HTTP requests to HTTPS
- Applies at Cloudflare edge (faster than server-side redirect)

#### Step 4: Enable Automatic HTTPS Rewrites

```
☑ Automatic HTTPS Rewrites
```

**What this does:**

- Rewrites insecure URLs (http://) to secure (https://)
- Fixes mixed content warnings
- Applies to HTML, CSS, JavaScript

#### Step 5: Enable Opportunistic Encryption

```
☑ Opportunistic Encryption
```

**What this does:**

- Enables HTTP/2 Server Push
- Improves performance
- Allows browsers to request resources over HTTPS

#### Step 6: Minimum TLS Version

**Path:** SSL/TLS → Edge Certificates

```
Minimum TLS Version: TLS 1.2
```

**Recommended Settings:**

- **Modern browsers**: TLS 1.2 minimum
- **Maximum security**: TLS 1.3 only (may break old browsers)

**Browser Compatibility:**
| TLS Version | Chrome | Firefox | Safari | Edge |
|-------------|--------|---------|--------|------|
| TLS 1.2 | ✅ All | ✅ All | ✅ All | ✅ All |
| TLS 1.3 | ✅ 70+ | ✅ 63+ | ✅ 12.1+ | ✅ 79+ |

#### Step 7: Enable TLS 1.3

```
☑ TLS 1.3
```

**Benefits:**

- ✅ Faster handshake (1-RTT vs 2-RTT)
- ✅ Better security (removed weak ciphers)
- ✅ Forward secrecy by default

---

## HSTS Implementation

### What is HSTS?

**HTTP Strict Transport Security** tells browsers to ONLY use HTTPS.

### Benefits

- ✅ Prevents SSL stripping attacks
- ✅ Eliminates HTTP → HTTPS redirect delay
- ✅ Improves security score
- ✅ Required for HSTS preload list

### Configuration Levels

#### Level 1: Basic HSTS (Netlify)

**Already configured in backend:**

**File:** `apps/api/src/config/security.config.ts`

```typescript
hsts: {
  maxAge: 31536000, // 1 year in seconds
  includeSubDomains: true, // Apply to all subdomains
  preload: true, // Allow inclusion in browser preload lists
}
```

**Header sent:**

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

#### Level 2: Cloudflare HSTS

**Path:** SSL/TLS → Edge Certificates → HSTS

**Recommended Settings:**

```
☑ Enable HSTS
Max Age: 12 months (31536000 seconds)
☑ Include subdomains
☑ Preload
```

**Warning:** Once enabled, you CANNOT disable HTTPS for the duration of max-age!

#### Level 3: HSTS Preload List

**Submit to browser preload list:**

1. **Verify Requirements:**

   - ✅ Valid SSL certificate
   - ✅ Redirect HTTP → HTTPS
   - ✅ HSTS header on all responses
   - ✅ max-age ≥ 31536000 (1 year)
   - ✅ includeSubDomains directive
   - ✅ preload directive

2. **Submit Domain:**

   - Visit: https://hstspreload.org/
   - Enter: `parashootingindia.org`
   - Click **Check HSTS preload status**
   - If eligible, click **Submit**

3. **Wait for Inclusion:**
   - Chrome: 2-3 months
   - Firefox: Uses Chrome's list
   - Safari: Uses Chrome's list
   - Edge: Uses Chrome's list

**Benefits:**

- ✅ HTTPS enforced even on first visit
- ✅ No HTTP request ever sent
- ✅ Maximum security

**Warning:** Removal from preload list takes 6+ months!

---

## Certificate Management

### Netlify Certificates (Automatic)

#### Certificate Details

```
Issuer: Let's Encrypt
Type: Domain Validation (DV)
Validity: 90 days
Renewal: Automatic (60 days before expiry)
Cost: Free
```

#### Monitoring Certificate Expiry

**Netlify automatically renews**, but you can monitor:

**Option 1: Netlify Dashboard**

```
Site Settings → Domain management → HTTPS
Certificate expires: [Date]
```

**Option 2: Command Line**

```bash
# Check certificate expiry
echo | openssl s_client -servername parashootingindia.org -connect parashootingindia.org:443 2>/dev/null | openssl x509 -noout -dates
```

**Expected Output:**

```
notBefore=Dec 28 00:00:00 2025 GMT
notAfter=Mar 28 23:59:59 2026 GMT
```

#### Manual Certificate Renewal (If Needed)

**Netlify Dashboard:**

```
Site Settings → Domain management → HTTPS
→ Renew certificate
```

**Note:** Should never be needed; automatic renewal is reliable.

### Cloudflare Certificates

#### Universal SSL (Free)

**Automatically enabled** when you add a domain to Cloudflare.

**Certificate Details:**

```
Issuer: Cloudflare
Type: Shared (covers multiple domains)
Validity: 1 year
Renewal: Automatic
Cost: Free
```

#### Dedicated SSL ($10/month)

**For custom branding:**

```
Issuer: DigiCert or similar
Type: Dedicated (your domain only)
Validity: 1 year
Renewal: Automatic
```

**When to use:**

- Need custom certificate
- Require specific CA
- Corporate policy

#### Advanced Certificates ($10/month)

**Features:**

- Custom validity period (14-365 days)
- Multiple hostnames
- Wildcard support
- Custom cipher suites

---

## Testing & Validation

### SSL Labs Test (Comprehensive)

**URL:** https://www.ssllabs.com/ssltest/

**Steps:**

1. Visit SSL Labs
2. Enter: `parashootingindia.org`
3. Click **Submit**
4. Wait 2-3 minutes for scan

**Target Rating:** **A+**

**Scoring Criteria:**
| Grade | Requirements |
|-------|-------------|
| A+ | Perfect config + HSTS preload |
| A | Strong config, TLS 1.2+ |
| B | Weak ciphers or old TLS |
| C | Serious issues |
| F | Critical vulnerabilities |

**Common Issues & Fixes:**

**Issue 1: Grade B (Weak Ciphers)**

```
Fix: Cloudflare → SSL/TLS → Edge Certificates
     → Minimum TLS Version: 1.2
```

**Issue 2: No HSTS**

```
Fix: Enable HSTS in Cloudflare or Netlify
```

**Issue 3: TLS 1.0/1.1 Enabled**

```
Fix: Cloudflare → SSL/TLS → Edge Certificates
     → Minimum TLS Version: 1.2
```

### Security Headers Test

**URL:** https://securityheaders.com/

**Steps:**

1. Visit Security Headers
2. Enter: `https://parashootingindia.org`
3. Click **Scan**

**Target Rating:** **A+**

**Required Headers:**

```
✅ Strict-Transport-Security
✅ Content-Security-Policy
✅ X-Frame-Options
✅ X-Content-Type-Options
✅ Referrer-Policy
✅ Permissions-Policy
```

### Manual Testing

#### Test 1: HTTPS Redirect

```bash
# Should redirect to HTTPS
curl -I http://parashootingindia.org

# Expected:
HTTP/1.1 301 Moved Permanently
Location: https://parashootingindia.org/
```

#### Test 2: HSTS Header

```bash
# Check HSTS header
curl -I https://parashootingindia.org | grep -i strict

# Expected:
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

#### Test 3: TLS Version

```bash
# Test TLS 1.2
openssl s_client -connect parashootingindia.org:443 -tls1_2

# Expected:
Protocol  : TLSv1.2
Cipher    : ECDHE-RSA-AES128-GCM-SHA256

# Test TLS 1.3
openssl s_client -connect parashootingindia.org:443 -tls1_3

# Expected:
Protocol  : TLSv1.3
Cipher    : TLS_AES_256_GCM_SHA384
```

#### Test 4: Certificate Chain

```bash
# Verify certificate chain
echo | openssl s_client -servername parashootingindia.org -connect parashootingindia.org:443 -showcerts

# Expected:
Verify return code: 0 (ok)
```

#### Test 5: Mixed Content

**Open browser console:**

```
F12 → Console → Look for warnings
```

**Should NOT see:**

```
❌ Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource 'http://...'
```

**If you see mixed content:**

1. Enable **Automatic HTTPS Rewrites** in Cloudflare
2. Update hardcoded HTTP URLs to HTTPS
3. Use protocol-relative URLs: `//example.com/script.js`

---

## Troubleshooting

### Issue 1: "Your connection is not private" Error

**Symptoms:**

```
NET::ERR_CERT_AUTHORITY_INVALID
```

**Causes & Solutions:**

**Cause 1: Cloudflare SSL mode is "Flexible"**

```
Solution: Change to "Full (strict)"
Path: Cloudflare → SSL/TLS → Overview
```

**Cause 2: Netlify certificate not provisioned**

```
Solution: Wait 24 hours for DNS propagation
Or: Netlify → Domain settings → Renew certificate
```

**Cause 3: DNS not pointing to Cloudflare**

```
Solution: Update nameservers at domain registrar
```

### Issue 2: 525 SSL Handshake Failed

**Error:**

```
Error 525: SSL handshake failed
```

**Cause:** Cloudflare can't verify Netlify's certificate

**Solution:**

```
Cloudflare → SSL/TLS → Overview
Change from "Full (strict)" to "Full"
Wait 5 minutes
Test again
```

**If still failing:**

```
Netlify → Domain settings → HTTPS
→ Renew certificate
Wait 10 minutes
```

### Issue 3: Redirect Loop

**Symptoms:**

```
ERR_TOO_MANY_REDIRECTS
```

**Cause:** Both Cloudflare and Netlify redirecting HTTP → HTTPS

**Solution:**

```
Option 1: Use Cloudflare SSL mode "Full (strict)"
Option 2: Disable Netlify's "Force HTTPS"
```

**Recommended:** Keep Cloudflare redirect, disable Netlify redirect

### Issue 4: HSTS Not Working

**Test:**

```bash
curl -I https://parashootingindia.org | grep -i strict
# No output = HSTS not enabled
```

**Solutions:**

**Backend (NestJS):**

```typescript
// File: apps/api/src/config/security.config.ts
hsts: {
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true,
}
```

**Cloudflare:**

```
SSL/TLS → Edge Certificates → HSTS
☑ Enable HSTS
Max Age: 12 months
```

**Netlify:**

```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
```

### Issue 5: Mixed Content Warnings

**Symptoms:**

```
Console: Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource 'http://...'
```

**Solutions:**

**1. Enable Automatic HTTPS Rewrites (Cloudflare):**

```
SSL/TLS → Edge Certificates
☑ Automatic HTTPS Rewrites
```

**2. Update Code:**

```javascript
// ❌ Bad
<script src="http://example.com/script.js"></script>

// ✅ Good
<script src="https://example.com/script.js"></script>

// ✅ Better (protocol-relative)
<script src="//example.com/script.js"></script>
```

**3. Content Security Policy:**

```typescript
// apps/api/src/config/security.config.ts
contentSecurityPolicy: {
  directives: {
    upgradeInsecureRequests: [], // Force HTTP → HTTPS
  },
}
```

---

## Best Practices Checklist

### SSL/TLS Configuration

- [x] Use TLS 1.2 minimum
- [x] Enable TLS 1.3
- [x] Disable SSL 2.0, 3.0, TLS 1.0, 1.1
- [x] Use strong cipher suites
- [x] Enable Perfect Forward Secrecy (PFS)

### Certificate Management

- [x] Use trusted CA (Let's Encrypt, DigiCert, etc.)
- [x] Enable automatic renewal
- [x] Monitor certificate expiry
- [x] Use 2048-bit or 4096-bit RSA keys
- [x] Consider ECDSA certificates (faster)

### HSTS

- [x] Enable HSTS with max-age ≥ 1 year
- [x] Include subdomains
- [x] Add preload directive
- [x] Submit to HSTS preload list

### Cloudflare

- [x] Use "Full (strict)" SSL mode
- [x] Enable "Always Use HTTPS"
- [x] Enable "Automatic HTTPS Rewrites"
- [x] Enable "Opportunistic Encryption"
- [x] Set minimum TLS version to 1.2

### Testing

- [x] SSL Labs grade: A+
- [x] Security Headers grade: A+
- [x] No mixed content warnings
- [x] HSTS header present
- [x] Certificate chain valid

---

## Security Recommendations

### Cipher Suites (Advanced)

**Recommended Cipher Order:**

```
TLS_AES_256_GCM_SHA384 (TLS 1.3)
TLS_CHACHA20_POLY1305_SHA256 (TLS 1.3)
TLS_AES_128_GCM_SHA256 (TLS 1.3)
ECDHE-RSA-AES256-GCM-SHA384 (TLS 1.2)
ECDHE-RSA-AES128-GCM-SHA256 (TLS 1.2)
```

**Disable Weak Ciphers:**

```
❌ RC4
❌ 3DES
❌ MD5
❌ SHA1 (for signatures)
❌ Export ciphers
❌ NULL ciphers
```

**Cloudflare handles this automatically** with "Modern" compatibility.

### Certificate Transparency

**What is CT?**

- Public log of all SSL certificates
- Prevents mis-issued certificates
- Required by Chrome

**Cloudflare:** Automatically submits to CT logs  
**Netlify:** Automatically submits to CT logs

**Verify CT:**

```
https://crt.sh/?q=parashootingindia.org
```

### OCSP Stapling

**What is OCSP?**

- Online Certificate Status Protocol
- Checks if certificate is revoked
- Improves performance

**Cloudflare:** Enabled by default  
**Netlify:** Enabled by default

**Verify OCSP:**

```bash
echo | openssl s_client -connect parashootingindia.org:443 -status 2>&1 | grep -A 17 'OCSP'
```

---

## Monitoring & Maintenance

### Daily Checks

- ✅ Site accessible via HTTPS
- ✅ No browser warnings
- ✅ No mixed content errors

### Weekly Checks

- ✅ SSL Labs grade: A+
- ✅ Security Headers grade: A+
- ✅ Certificate valid

### Monthly Checks

- ✅ Review Cloudflare SSL settings
- ✅ Check certificate expiry date
- ✅ Update TLS configuration if needed
- ✅ Review cipher suites

### Quarterly Checks

- ✅ Full security audit
- ✅ Review HSTS preload status
- ✅ Update documentation
- ✅ Test disaster recovery

---

## Support & Resources

### Documentation

- **Cloudflare SSL**: https://developers.cloudflare.com/ssl/
- **Netlify HTTPS**: https://docs.netlify.com/domains-https/https-ssl/
- **Let's Encrypt**: https://letsencrypt.org/docs/

### Testing Tools

- **SSL Labs**: https://www.ssllabs.com/ssltest/
- **Security Headers**: https://securityheaders.com/
- **HSTS Preload**: https://hstspreload.org/
- **Certificate Transparency**: https://crt.sh/

### Support

- **Cloudflare**: https://support.cloudflare.com/
- **Netlify**: https://www.netlify.com/support/
- **Let's Encrypt**: https://community.letsencrypt.org/

---

## Summary

### Current Configuration

**Netlify:**

- ✅ Let's Encrypt certificate (auto-renewed)
- ✅ Force HTTPS enabled
- ✅ HSTS header configured

**Backend (NestJS):**

- ✅ HSTS with preload
- ✅ Security headers via Helmet.js
- ✅ TLS 1.2+ enforced

**Cloudflare (To Configure):**

- [ ] SSL mode: Full (strict)
- [ ] Always Use HTTPS
- [ ] Automatic HTTPS Rewrites
- [ ] HSTS enabled
- [ ] Minimum TLS 1.2

### Expected Results

After full configuration:

- ✅ **SSL Labs Grade**: A+
- ✅ **Security Headers Grade**: A+
- ✅ **TLS Version**: 1.3
- ✅ **HSTS**: Enabled with preload
- ✅ **Certificate**: Valid and trusted
- ✅ **Mixed Content**: None

---

**Last Updated:** 2025-12-28  
**Maintained By:** Para Shooting Committee IT Team  
**Next Review:** 2026-01-28
