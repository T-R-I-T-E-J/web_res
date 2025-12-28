# 🚀 Security Implementation - Quick Start Guide

## ⚡ Immediate Action Items (Required Before Production)

### 1. CookieYes Setup (15 minutes)

```bash
# Step 1: Sign up at https://www.cookieyes.com/
# Step 2: Add your website
# Step 3: Get your CookieYes ID (looks like: abc123xyz)
# Step 4: Update the code below
```

**File to Edit:** `apps/web/src/app/layout.tsx`

**Find this line (around line 57):**

```tsx
src = "https://cdn-cookieyes.com/client_data/YOUR_COOKIEYES_ID/script.js";
```

**Replace with:**

```tsx
src="https://cdn-cookieyes.com/client_data/abc123xyz/script.js"
                                        ↑↑↑↑↑↑↑↑↑
                                    Your actual ID
```

---

### 2. Google Analytics Setup (10 minutes)

```bash
# Step 1: Get your GA4 Measurement ID from Google Analytics
# Format: G-XXXXXXXXXX
# Step 2: Update the code below
```

**File to Edit:** `apps/web/src/app/layout.tsx`

**Find this line (around line 81):**

```tsx
gtag('config', 'GA_MEASUREMENT_ID', {
```

**Replace with:**

```tsx
gtag('config', 'G-XXXXXXXXXX', {
                ↑↑↑↑↑↑↑↑↑↑↑↑
            Your GA4 Measurement ID
```

**Also update line 88:**

```tsx
src = "https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID";
```

**Replace with:**

```tsx
src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX";
```

---

### 3. Production Environment Variables

**File to Create:** `apps/api/.env.production`

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Security
JWT_SECRET=<generate-strong-secret-here>
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=<generate-another-strong-secret>
REFRESH_TOKEN_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=https://parashootingindia.org

# App
NODE_ENV=production
PORT=8080
API_PREFIX=api/v1

# Optional: Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX
COOKIEYES_ID=abc123xyz
```

**Generate Strong Secrets:**

```bash
# Run in PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

---

### 4. Cloudflare Setup (2-4 hours)

**Follow the detailed guide:** `docs/security/cloudflare-setup.md`

**Quick Checklist:**

- [ ] Create Cloudflare account
- [ ] Add domain: `parashootingindia.org`
- [ ] Update nameservers at your domain registrar
- [ ] Wait for DNS propagation (24-48 hours, usually faster)
- [ ] Enable SSL/TLS: **Full (strict)**
- [ ] Enable **Always Use HTTPS**
- [ ] Enable **WAF Managed Rules**
- [ ] Create rate limiting rule for `/api/v1/auth/login`
- [ ] Set up caching rules for static assets

---

## 🧪 Testing Checklist

### Local Testing (Before Deployment)

```bash
# 1. Restart services to apply changes
cd c:\Users\trite\Downloads\demowebsite
.\restart-services.ps1

# 2. Test cookie banner
# Open http://localhost:3000 in Incognito mode
# Verify banner appears

# 3. Test rate limiting
# Run this in PowerShell (should get rate limited after 10 requests)
for ($i=1; $i -le 20; $i++) {
  Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health"
}

# 4. Test security headers
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health" | Select-Object -ExpandProperty Headers
```

**Expected Headers:**

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
```

---

### Production Testing (After Deployment)

```bash
# 1. Test HTTPS
curl -I https://parashootingindia.org

# 2. Test security headers
curl -I https://parashootingindia.org/api/v1/health

# 3. Test rate limiting
for i in {1..20}; do curl https://parashootingindia.org/api/v1/health; done

# 4. Test cookie consent
# Open site in Incognito, verify banner appears
# Accept cookies, verify GA tracking starts
# Reject cookies, verify no tracking

# 5. Security score
# Visit: https://securityheaders.com/?q=parashootingindia.org
# Target: A+ rating
```

---

## 📊 Monitoring Setup

### 1. Cloudflare Dashboard

**URL:** https://dash.cloudflare.com/

**Daily Checks:**

- Security Events (blocked threats)
- Analytics (traffic patterns)
- Cache Hit Ratio (aim for >80%)

### 2. CookieYes Dashboard

**URL:** https://app.cookieyes.com/

**Daily Checks:**

- Consent acceptance rate (aim for >60%)
- New cookies detected
- Compliance status

### 3. Google Analytics

**URL:** https://analytics.google.com/

**Daily Checks:**

- User traffic
- Bounce rate
- Page load times

---

## 🆘 Troubleshooting

### Issue: Cookie banner not showing

```bash
# Solution 1: Clear browser cache
Ctrl + Shift + Delete → Clear all

# Solution 2: Check browser console
F12 → Console → Look for errors

# Solution 3: Verify script loaded
F12 → Network → Filter: cookieyes
```

### Issue: Rate limiting too aggressive

```typescript
// File: apps/api/src/main.ts
// Increase the limit:
max: 200, // Changed from 100
```

### Issue: CORS errors in production

```typescript
// File: apps/api/.env.production
// Update CORS origin:
CORS_ORIGIN=https://parashootingindia.org,https://www.parashootingindia.org
```

### Issue: 525 SSL Error (Cloudflare)

```bash
# Cloudflare Dashboard → SSL/TLS → Overview
# Change from "Full (strict)" to "Full"
# Wait 5 minutes, test again
```

---

## 📞 Emergency Contacts

### Security Incident

1. **Immediate**: Stop affected services
2. **Notify**: CTO/Security Team
3. **Document**: All actions taken
4. **Investigate**: Root cause
5. **Report**: GDPR breach (if applicable, within 72 hours)

### DDoS Attack

1. **Cloudflare**: Enable "I'm Under Attack" mode
2. **Monitor**: Cloudflare security events
3. **Adjust**: Rate limiting rules
4. **Scale**: Backend if needed

### Data Breach

1. **Isolate**: Affected systems
2. **Assess**: Scope of breach
3. **Notify**: Users (within 72 hours for GDPR)
4. **Report**: Authorities (GDPR/DPDP)
5. **Remediate**: Fix vulnerability

---

## ✅ Pre-Launch Checklist

### Code Changes

- [ ] CookieYes ID updated in `layout.tsx`
- [ ] Google Analytics ID updated in `layout.tsx`
- [ ] Production `.env` file created
- [ ] Strong JWT secrets generated
- [ ] CORS origin set to production domain

### External Services

- [ ] Cloudflare account created
- [ ] Domain added to Cloudflare
- [ ] Nameservers updated
- [ ] SSL/TLS configured (Full Strict)
- [ ] WAF enabled
- [ ] Rate limiting configured
- [ ] CookieYes account created
- [ ] Cookie banner configured
- [ ] Privacy policy page created
- [ ] Cookie policy page created

### Testing

- [ ] Cookie consent tested
- [ ] Rate limiting tested
- [ ] Security headers verified
- [ ] HTTPS enforced
- [ ] API authentication working
- [ ] Audit logging functional
- [ ] Load testing completed (40k users)

### Documentation

- [ ] Security implementation reviewed
- [ ] Team trained on monitoring
- [ ] Incident response plan documented
- [ ] Backup procedures verified

---

## 🎯 Success Metrics (Week 1)

| Metric                     | Target | How to Check         |
| -------------------------- | ------ | -------------------- |
| Security Score             | A+     | securityheaders.com  |
| Cookie Consent Rate        | >60%   | CookieYes Dashboard  |
| Cache Hit Ratio            | >80%   | Cloudflare Analytics |
| API Uptime                 | 99.9%  | Monitoring tools     |
| Rate Limit False Positives | <1%    | API logs             |
| DDoS Attacks Blocked       | All    | Cloudflare Security  |

---

## 📚 Reference Documents

1. **Cloudflare Setup**: `docs/security/cloudflare-setup.md`
2. **CookieYes Setup**: `docs/security/cookieyes-setup.md`
3. **Full Security Summary**: `docs/security/security-implementation-summary.md`

---

## 🚀 Deployment Command

```bash
# Build frontend
cd apps/web
npm run build

# Deploy to Netlify (automatic via Git push)
git add .
git commit -m "feat: implement Phase-1 security enhancements"
git push origin main

# Netlify will auto-deploy
# Monitor: https://app.netlify.com/
```

---

**Estimated Time to Complete:** 4-6 hours  
**Difficulty:** Medium  
**Support:** Refer to detailed guides in `docs/security/`

**Good luck! 🎉**
