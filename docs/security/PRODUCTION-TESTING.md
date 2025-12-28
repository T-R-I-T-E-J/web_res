# Production Deployment & Testing Guide

## ⚠️ IMPORTANT: Production Tests Require Deployment

**Production tests CANNOT run on localhost.** They require:

- ✅ Public URL (e.g., `parashootingindia.org`)
- ✅ SSL/TLS certificate
- ✅ Cloudflare configuration
- ✅ DNS propagation complete

---

## Current Status Check

### Is Your Site Deployed?

**Option 1: Check Netlify**

1. Login to https://app.netlify.com/
2. Find your site
3. Check deployment status
4. Get your Netlify URL (e.g., `your-site.netlify.app`)

**Option 2: Check Domain**

```bash
# Check if domain is live
nslookup parashootingindia.org
```

---

## Pre-Deployment Checklist

Before running production tests, complete these steps:

### ✅ Step 1: Replace Placeholder IDs

#### A. CookieYes ID

**File:** `apps/web/src/app/layout.tsx` (Line 57)

```tsx
// BEFORE:
src="https://cdn-cookieyes.com/client_data/YOUR_COOKIEYES_ID/script.js"

// AFTER:
src="https://cdn-cookieyes.com/client_data/abc123xyz/script.js"
                                        ↑↑↑↑↑↑↑↑↑
                                    Your actual ID
```

**How to get ID:**

1. Sign up at https://www.cookieyes.com/
2. Add your website
3. Go to Install → Copy ID from script URL

#### B. Google Analytics ID

**File:** `apps/web/src/app/layout.tsx` (Lines 81, 88)

```tsx
// BEFORE:
gtag('config', 'GA_MEASUREMENT_ID', {

// AFTER:
gtag('config', 'G-XXXXXXXXXX', {
```

**How to get ID:**

1. Go to Google Analytics
2. Admin → Data Streams → Your website
3. Copy Measurement ID (format: G-XXXXXXXXXX)

---

### ✅ Step 2: Create Production Environment File

**File:** `apps/api/.env.production`

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Security
NODE_ENV=production
JWT_SECRET=<generate-strong-64-char-secret>
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=<generate-another-strong-secret>
REFRESH_TOKEN_EXPIRES_IN=30d

# CORS - Update with your production domain
CORS_ORIGIN=https://parashootingindia.org

# App
PORT=8080
API_PREFIX=api/v1

# Analytics (optional)
GA_MEASUREMENT_ID=G-XXXXXXXXXX
COOKIEYES_ID=abc123xyz
```

**Generate secrets:**

```powershell
# Run in PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

---

### ✅ Step 3: Deploy to Netlify

#### Option A: Automatic Deployment (Recommended)

```bash
# Already done! Your Git push triggers auto-deployment
# Check: https://app.netlify.com/
```

#### Option B: Manual Deployment

```bash
cd apps/web
npm run build
netlify deploy --prod
```

---

### ✅ Step 4: Configure Cloudflare

**Follow:** `docs/security/cloudflare-setup.md`

**Quick Steps:**

1. Create Cloudflare account
2. Add domain: `parashootingindia.org`
3. Update nameservers at domain registrar
4. Wait for DNS propagation (24-48 hours, usually faster)
5. Configure SSL/TLS:
   - SSL mode: Full (strict)
   - Always Use HTTPS: ON
   - HSTS: ON
   - TLS 1.3: ON
6. Enable WAF managed rules
7. Create rate limiting rules

---

## Production Testing Suite

### Once Deployed, Run These Tests:

---

### 🧪 Test 1: SSL Labs (A+ Rating)

**URL:** https://www.ssllabs.com/ssltest/

**Steps:**

1. Visit SSL Labs
2. Enter: `parashootingindia.org` (or your Netlify URL)
3. Click **Submit**
4. Wait 2-3 minutes for scan

**Target Results:**

```
Overall Rating: A+
Certificate: Trusted (Let's Encrypt)
Protocol Support: TLS 1.2, TLS 1.3
Cipher Strength: 256-bit
HSTS: Yes (max-age=31536000)
```

**Checklist:**

- [ ] Certificate valid and trusted
- [ ] TLS 1.2 and 1.3 only (no SSL, TLS 1.0, 1.1)
- [ ] Strong cipher suites (ECDHE, AES-GCM)
- [ ] HSTS enabled with preload
- [ ] Overall grade: A+

**If Failed:**

- Check Cloudflare SSL mode (should be "Full (strict)")
- Verify HSTS is enabled
- Ensure TLS 1.0/1.1 are disabled

---

### 🧪 Test 2: Security Headers (A+ Rating)

**URL:** https://securityheaders.com/

**Steps:**

1. Visit Security Headers
2. Enter: `https://parashootingindia.org`
3. Click **Scan**

**Target Results:**

```
Grade: A+

Required Headers:
✅ Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
✅ Content-Security-Policy: upgrade-insecure-requests
✅ X-Frame-Options: DENY
✅ X-Content-Type-Options: nosniff
✅ Referrer-Policy: strict-origin-when-cross-origin
✅ Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Checklist:**

- [ ] All 6 security headers present
- [ ] HSTS with correct max-age
- [ ] CSP configured
- [ ] Overall grade: A+

**If Failed:**

- Check `netlify.toml` headers configuration
- Verify Cloudflare isn't stripping headers
- Check backend Helmet.js configuration

---

### 🧪 Test 3: HTTPS Redirect

**Test HTTP → HTTPS redirect**

**Command:**

```bash
curl -I http://parashootingindia.org
```

**Expected Output:**

```
HTTP/1.1 301 Moved Permanently
Location: https://parashootingindia.org/
```

**Checklist:**

- [ ] HTTP redirects to HTTPS (301)
- [ ] www redirects to non-www (or vice versa)
- [ ] No redirect loops

**If Failed:**

- Check Cloudflare "Always Use HTTPS" setting
- Verify `netlify.toml` redirects
- Check for conflicting redirect rules

---

### 🧪 Test 4: Cloudflare WAF

**Verify Cloudflare is active**

**Command:**

```bash
curl -I https://parashootingindia.org
```

**Expected Headers:**

```
cf-ray: [RAY_ID]
cf-cache-status: [HIT/MISS/DYNAMIC]
server: cloudflare
```

**Checklist:**

- [ ] `cf-ray` header present
- [ ] `server: cloudflare` header present
- [ ] WAF rules active in Cloudflare dashboard

**If Failed:**

- Verify domain is proxied through Cloudflare (orange cloud)
- Check nameservers point to Cloudflare
- Wait for DNS propagation

---

### 🧪 Test 5: Cookie Consent Banner

**Visual Test**

**Steps:**

1. Open `https://parashootingindia.org` in **Incognito mode**
2. Look for cookie consent banner

**Expected:**

- Banner appears at bottom-right
- Shows "Accept All" and "Reject All" buttons
- Links to Privacy Policy and Cookie Policy

**Checklist:**

- [ ] Banner appears on first visit
- [ ] Banner doesn't appear after consent
- [ ] Preferences are saved
- [ ] Analytics blocked until consent

**If Failed:**

- Check CookieYes ID is correct
- Verify script is loaded (View Source → Search "cookieyes")
- Check browser console for errors

---

### 🧪 Test 6: Mixed Content Check

**Check for insecure resources**

**Steps:**

1. Open `https://parashootingindia.org`
2. Press F12 → Console
3. Look for warnings

**Expected:**

- No "Mixed Content" warnings
- All resources loaded over HTTPS

**Checklist:**

- [ ] No mixed content warnings
- [ ] All images loaded over HTTPS
- [ ] All scripts loaded over HTTPS
- [ ] All stylesheets loaded over HTTPS

**If Failed:**

- Enable "Automatic HTTPS Rewrites" in Cloudflare
- Update hardcoded HTTP URLs to HTTPS
- Check third-party scripts

---

### 🧪 Test 7: Rate Limiting

**Test DDoS protection**

**Command:**

```bash
# Send 20 rapid requests
for i in {1..20}; do
  curl -I https://parashootingindia.org/api/v1/health
done
```

**Expected:**

- First 10-15 requests: 200 OK
- Remaining requests: 429 Too Many Requests

**Checklist:**

- [ ] Rate limiting active
- [ ] Appropriate error message
- [ ] Rate limit headers present

**If Failed:**

- Check Cloudflare rate limiting rules
- Verify backend rate limiting is active
- Check if health endpoint is exempted

---

### 🧪 Test 8: Performance (GTmetrix)

**URL:** https://gtmetrix.com/

**Steps:**

1. Visit GTmetrix
2. Enter: `https://parashootingindia.org`
3. Click **Analyze**

**Target Results:**

```
Performance Score: A (90%+)
Structure Score: A (90%+)
Fully Loaded Time: < 3 seconds
Total Page Size: < 2 MB
```

**Checklist:**

- [ ] Performance score: A
- [ ] Load time < 3 seconds
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s

---

### 🧪 Test 9: Mobile Responsiveness

**URL:** https://search.google.com/test/mobile-friendly

**Steps:**

1. Visit Mobile-Friendly Test
2. Enter: `https://parashootingindia.org`
3. Click **Test URL**

**Expected:**

- Page is mobile-friendly
- No mobile usability issues

**Checklist:**

- [ ] Mobile-friendly
- [ ] Text readable without zooming
- [ ] Tap targets appropriately sized
- [ ] Content fits screen

---

### 🧪 Test 10: GDPR Compliance

**Manual Checklist**

**Cookie Consent:**

- [ ] Banner appears before tracking
- [ ] Clear explanation of cookie purposes
- [ ] Granular consent options
- [ ] Easy opt-out mechanism
- [ ] Privacy policy linked

**Data Rights:**

- [ ] Privacy policy accessible
- [ ] Cookie policy accessible
- [ ] Contact information for data requests
- [ ] Consent logging active

**Backend:**

- [ ] Audit logs created for user actions
- [ ] Consent changes logged
- [ ] User data exportable
- [ ] User data deletable

---

## Production Test Results Template

### Test Execution Date: [DATE]

| Test             | Target  | Result | Grade | Notes |
| ---------------- | ------- | ------ | ----- | ----- |
| SSL Labs         | A+      | [ ]    | [ ]   |       |
| Security Headers | A+      | [ ]    | [ ]   |       |
| HTTPS Redirect   | 301     | [ ]    | [ ]   |       |
| Cloudflare WAF   | Active  | [ ]    | [ ]   |       |
| Cookie Banner    | Visible | [ ]    | [ ]   |       |
| Mixed Content    | None    | [ ]    | [ ]   |       |
| Rate Limiting    | Active  | [ ]    | [ ]   |       |
| Performance      | A       | [ ]    | [ ]   |       |
| Mobile-Friendly  | Yes     | [ ]    | [ ]   |       |
| GDPR Compliance  | 90%+    | [ ]    | [ ]   |       |

**Overall Production Grade:** [ ]

**Issues Found:**

1.
2.
3.

**Actions Required:**

1.
2.
3.

---

## What to Do Right Now

### If NOT Deployed Yet:

1. **Complete Pre-Deployment Checklist:**

   - [ ] Replace CookieYes ID
   - [ ] Replace Google Analytics ID
   - [ ] Create production .env
   - [ ] Review code changes

2. **Deploy:**

   ```bash
   # Already done via Git push!
   # Check Netlify dashboard for deployment status
   ```

3. **Configure Cloudflare:**

   - Follow `docs/security/cloudflare-setup.md`
   - Estimated time: 2-4 hours

4. **Wait for DNS Propagation:**

   - Usually 1-24 hours
   - Check: `nslookup parashootingindia.org`

5. **Run Production Tests:**
   - Follow this guide
   - Document results

---

### If Already Deployed:

**Run these commands now:**

```bash
# Test 1: Check if site is live
curl -I https://parashootingindia.org

# Test 2: Check SSL
echo | openssl s_client -connect parashootingindia.org:443 -servername parashootingindia.org 2>/dev/null | openssl x509 -noout -dates

# Test 3: Check security headers
curl -I https://parashootingindia.org | grep -i "strict\|frame\|content-type"

# Test 4: Check Cloudflare
curl -I https://parashootingindia.org | grep -i "cf-"
```

**Then visit:**

1. https://www.ssllabs.com/ssltest/ → Enter your domain
2. https://securityheaders.com/ → Enter your domain
3. https://gtmetrix.com/ → Enter your domain

---

## Need Help?

### Deployment Issues

- **Netlify:** https://docs.netlify.com/
- **Cloudflare:** https://developers.cloudflare.com/

### Testing Issues

- **SSL Labs:** https://github.com/ssllabs/research/wiki/SSL-Server-Rating-Guide
- **Security Headers:** https://securityheaders.com/

### Documentation

- **Quick Start:** `docs/security/QUICK-START.md`
- **Cloudflare Setup:** `docs/security/cloudflare-setup.md`
- **SSL/TLS Guide:** `docs/security/ssl-tls-configuration.md`

---

**Last Updated:** 2025-12-28  
**Status:** Awaiting Deployment
