# SSL/TLS Quick Checklist

## ✅ Pre-Deployment Checklist

### Netlify Configuration

- [x] **HTTPS Enabled**: Automatic via Let's Encrypt
- [x] **Force HTTPS**: Configured in `netlify.toml`
- [x] **HSTS Header**: max-age=31536000; includeSubDomains; preload
- [x] **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- [x] **HTTP → HTTPS Redirects**: 301 redirects configured

**Status:** ✅ **Complete** (already configured in code)

---

### Cloudflare Configuration (User Action Required)

#### Step 1: SSL/TLS Mode

**Path:** Cloudflare Dashboard → SSL/TLS → Overview

```
☑ Encryption mode: Full (strict)
```

**Why:** Ensures end-to-end encryption with valid certificates

---

#### Step 2: Edge Certificates

**Path:** Cloudflare Dashboard → SSL/TLS → Edge Certificates

```
☑ Always Use HTTPS
☑ Automatic HTTPS Rewrites
☑ Opportunistic Encryption
☑ TLS 1.3
Minimum TLS Version: TLS 1.2
```

**Why:** Forces HTTPS, fixes mixed content, enables modern protocols

---

#### Step 3: HSTS

**Path:** Cloudflare Dashboard → SSL/TLS → Edge Certificates → HSTS

```
☑ Enable HSTS
Status: Enabled
Max Age: 12 months (31536000 seconds)
☑ Include subdomains
☑ Preload
```

**⚠️ Warning:** Once enabled, you cannot disable HTTPS for 12 months!

---

## 🧪 Testing Checklist

### Test 1: HTTPS Redirect

```bash
curl -I http://parashootingindia.org
```

**Expected:**

```
HTTP/1.1 301 Moved Permanently
Location: https://parashootingindia.org/
```

**Status:** [ ] Pass / [ ] Fail

---

### Test 2: SSL Labs Grade

**URL:** https://www.ssllabs.com/ssltest/analyze.html?d=parashootingindia.org

**Target:** A+ rating

**Checklist:**

- [ ] Certificate: Trusted
- [ ] Protocol Support: TLS 1.2, TLS 1.3 only
- [ ] Cipher Strength: 256-bit or higher
- [ ] HSTS: Enabled with preload
- [ ] Overall Grade: A+

**Status:** [ ] Pass / [ ] Fail

---

### Test 3: Security Headers

**URL:** https://securityheaders.com/?q=parashootingindia.org

**Target:** A+ rating

**Required Headers:**

- [ ] Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy: (restrictive)
- [ ] Content-Security-Policy: upgrade-insecure-requests

**Status:** [ ] Pass / [ ] Fail

---

### Test 4: Certificate Validity

```bash
echo | openssl s_client -servername parashootingindia.org -connect parashootingindia.org:443 2>/dev/null | openssl x509 -noout -dates
```

**Expected:**

```
notBefore=Dec 28 00:00:00 2025 GMT
notAfter=Mar 28 23:59:59 2026 GMT (or later)
```

**Status:** [ ] Pass / [ ] Fail

---

### Test 5: HSTS Header

```bash
curl -I https://parashootingindia.org | grep -i strict
```

**Expected:**

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Status:** [ ] Pass / [ ] Fail

---

### Test 6: TLS Version

```bash
# Test TLS 1.3
openssl s_client -connect parashootingindia.org:443 -tls1_3 2>&1 | grep "Protocol"
```

**Expected:**

```
Protocol  : TLSv1.3
```

**Status:** [ ] Pass / [ ] Fail

---

### Test 7: Mixed Content

**Steps:**

1. Open https://parashootingindia.org in Chrome
2. Press F12 → Console
3. Look for warnings

**Expected:** No "Mixed Content" warnings

**Status:** [ ] Pass / [ ] Fail

---

## 📋 Configuration Summary

### Current Status

| Component      | Configuration     | Status                      |
| -------------- | ----------------- | --------------------------- |
| **Netlify**    | Let's Encrypt SSL | ✅ Auto-configured          |
| **Netlify**    | Force HTTPS       | ✅ Configured in code       |
| **Netlify**    | HSTS Header       | ✅ Configured in code       |
| **Netlify**    | Security Headers  | ✅ Configured in code       |
| **Backend**    | HSTS (Helmet.js)  | ✅ Configured in code       |
| **Backend**    | Security Headers  | ✅ Configured in code       |
| **Cloudflare** | SSL Mode          | ⏳ **User Action Required** |
| **Cloudflare** | HSTS              | ⏳ **User Action Required** |
| **Cloudflare** | TLS 1.3           | ⏳ **User Action Required** |

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Login to Cloudflare

```
URL: https://dash.cloudflare.com/
Select: parashootingindia.org
```

### Step 2: Configure SSL/TLS

```
1. SSL/TLS → Overview
   → Encryption mode: Full (strict)

2. SSL/TLS → Edge Certificates
   → ☑ Always Use HTTPS
   → ☑ Automatic HTTPS Rewrites
   → ☑ Opportunistic Encryption
   → ☑ TLS 1.3
   → Minimum TLS Version: TLS 1.2

3. SSL/TLS → Edge Certificates → HSTS
   → ☑ Enable HSTS
   → Max Age: 12 months
   → ☑ Include subdomains
   → ☑ Preload
```

### Step 3: Verify Configuration

```bash
# Wait 5 minutes for changes to propagate
# Then run tests above
```

---

## 🆘 Troubleshooting

### Issue: "Your connection is not private"

**Solution:**

1. Verify Cloudflare SSL mode is "Full (strict)"
2. Wait 5 minutes for DNS propagation
3. Clear browser cache (Ctrl + Shift + Delete)

### Issue: Error 525 (SSL Handshake Failed)

**Solution:**

1. Change Cloudflare SSL mode from "Full (strict)" to "Full"
2. Wait 5 minutes
3. Test again
4. If working, change back to "Full (strict)"

### Issue: Redirect Loop

**Solution:**

1. Ensure Cloudflare SSL mode is "Full (strict)"
2. Disable "Force HTTPS" in Netlify (keep Cloudflare redirect only)

### Issue: Mixed Content Warnings

**Solution:**

1. Enable "Automatic HTTPS Rewrites" in Cloudflare
2. Check code for hardcoded HTTP URLs
3. Update to HTTPS or use protocol-relative URLs

---

## 📊 Expected Results

After completing all steps:

| Test             | Target  | Expected Result |
| ---------------- | ------- | --------------- |
| SSL Labs         | A+      | ✅ Pass         |
| Security Headers | A+      | ✅ Pass         |
| HTTPS Redirect   | 301     | ✅ Pass         |
| Certificate      | Valid   | ✅ Pass         |
| HSTS Header      | Present | ✅ Pass         |
| TLS Version      | 1.3     | ✅ Pass         |
| Mixed Content    | None    | ✅ Pass         |

---

## 📚 Full Documentation

For detailed information, see:

- **Complete Guide**: `docs/security/ssl-tls-configuration.md`
- **Cloudflare Setup**: `docs/security/cloudflare-setup.md`
- **Quick Start**: `docs/security/QUICK-START.md`

---

## ✅ Sign-Off

**SSL/TLS Configuration:**

- [x] Code configured (Netlify + Backend)
- [ ] Cloudflare configured (User action required)
- [ ] Testing completed
- [ ] SSL Labs grade: A+
- [ ] Security Headers grade: A+

**Estimated Time:** 5 minutes (Cloudflare setup)  
**Next Step:** Follow Cloudflare configuration above

---

**Last Updated:** 2025-12-28  
**Status:** Code Complete, Cloudflare Pending
