# Manual Security Testing Guide

## Quick Security Tests (5 Minutes)

### Test 1: Rate Limiting ✅

**Test DDoS Protection**

```powershell
# Run this in PowerShell - should get rate limited after ~10 requests
for ($i=1; $i -le 20; $i++) {
    Write-Host "Request $i" -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health" -UseBasicParsing | Select-Object StatusCode
    } catch {
        Write-Host "  Rate Limited!" -ForegroundColor Red
    }
}
```

**Expected Result:**

```
Request 1: 200 OK
Request 2: 200 OK
...
Request 11: 429 Too Many Requests ✅
Request 12: 429 Too Many Requests ✅
```

**Status:** [ ] Pass / [ ] Fail

---

### Test 2: Security Headers ✅

**Check HSTS and Security Headers**

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health" -UseBasicParsing
$response.Headers
```

**Expected Headers:**

- ✅ `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- ✅ `X-Frame-Options: DENY`
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`
- ✅ `Content-Security-Policy: ...`

**Status:** [ ] Pass / [ ] Fail

---

### Test 3: Frontend Accessibility ✅

**Check if frontend is running**

```powershell
Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing | Select-Object StatusCode
```

**Expected Result:**

```
StatusCode: 200
```

**Status:** [ ] Pass / [ ] Fail

---

### Test 4: Cookie Consent Banner ⏳

**Visual Test - Open Browser**

1. Open: http://localhost:3000
2. Look for cookie consent banner
3. **Note:** Banner won't show until you replace `YOUR_COOKIEYES_ID`

**Expected:** Cookie banner appears at bottom-right

**Status:** [ ] Pass / [ ] Fail / [ ] Pending (ID not replaced)

---

### Test 5: API Response Time ✅

**Check performance**

```powershell
Measure-Command {
    Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health" -UseBasicParsing
}
```

**Expected:** < 200ms

**Status:** [ ] Pass / [ ] Fail

---

## Production Tests (After Deployment)

### Test 6: SSL Labs Grade 🌐

**URL:** https://www.ssllabs.com/ssltest/

1. Enter: `parashootingindia.org`
2. Click **Submit**
3. Wait 2-3 minutes

**Target:** A+ rating

**Checklist:**

- [ ] Certificate: Trusted
- [ ] Protocol: TLS 1.2, TLS 1.3 only
- [ ] Cipher Strength: 256-bit
- [ ] HSTS: Enabled with preload
- [ ] Overall Grade: A+

**Status:** [ ] Pass / [ ] Fail / [ ] Not Deployed Yet

---

### Test 7: Security Headers Grade 🌐

**URL:** https://securityheaders.com/

1. Enter: `https://parashootingindia.org`
2. Click **Scan**

**Target:** A+ rating

**Required Headers:**

- [ ] Strict-Transport-Security
- [ ] Content-Security-Policy
- [ ] X-Frame-Options
- [ ] X-Content-Type-Options
- [ ] Referrer-Policy
- [ ] Permissions-Policy

**Status:** [ ] Pass / [ ] Fail / [ ] Not Deployed Yet

---

### Test 8: HTTPS Redirect 🌐

**Test HTTP → HTTPS redirect**

```bash
curl -I http://parashootingindia.org
```

**Expected:**

```
HTTP/1.1 301 Moved Permanently
Location: https://parashootingindia.org/
```

**Status:** [ ] Pass / [ ] Fail / [ ] Not Deployed Yet

---

### Test 9: Mixed Content Check 🌐

**Browser Console Test**

1. Open: https://parashootingindia.org
2. Press F12 → Console
3. Look for warnings

**Expected:** No "Mixed Content" warnings

**Status:** [ ] Pass / [ ] Fail / [ ] Not Deployed Yet

---

### Test 10: Cloudflare WAF 🌐

**Check if Cloudflare is active**

```bash
curl -I https://parashootingindia.org
```

**Expected Headers:**

```
cf-ray: [RAY_ID]
cf-cache-status: [HIT/MISS]
server: cloudflare
```

**Status:** [ ] Pass / [ ] Fail / [ ] Not Configured Yet

---

## Capacity Tests (Advanced)

### Test 11: Concurrent Users 🔧

**Simulate 100 concurrent users**

```powershell
# Install if needed: Install-Module -Name PSThreadJob

$jobs = @()
for ($i = 1; $i -le 100; $i++) {
    $jobs += Start-ThreadJob -ScriptBlock {
        param($url)
        try {
            $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
            return $response.StatusCode
        } catch {
            return 0
        }
    } -ArgumentList "http://localhost:8080/api/v1/health"
}

$results = $jobs | Wait-Job | Receive-Job
$successCount = ($results | Where-Object { $_ -eq 200 }).Count

Write-Host "Successful requests: $successCount/100" -ForegroundColor Green
$jobs | Remove-Job
```

**Target:** > 80% success rate

**Status:** [ ] Pass / [ ] Fail

---

### Test 12: Load Testing (Artillery) 🔧

**Install Artillery**

```bash
npm install -g artillery
```

**Create test config:** `load-test.yml`

```yaml
config:
  target: "http://localhost:8080"
  phases:
    - duration: 60
      arrivalRate: 100 # 100 users per second
      name: "Sustained load"
scenarios:
  - name: "Health check"
    flow:
      - get:
          url: "/api/v1/health"
```

**Run test:**

```bash
artillery run load-test.yml
```

**Target Metrics:**

- Requests per second: > 100
- Response time (p95): < 200ms
- Error rate: < 1%

**Status:** [ ] Pass / [ ] Fail / [ ] Not Tested

---

## GDPR/DPDP Compliance Tests

### Test 13: Consent Logging ✅

**Test backend consent API**

```powershell
$body = @{
    analytics = $true
    marketing = $false
    timestamp = (Get-Date).ToString("o")
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/v1/consent/log" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing
```

**Expected:** 200 OK or 201 Created

**Status:** [ ] Pass / [ ] Fail / [ ] Not Implemented Yet

---

### Test 14: Audit Trail ✅

**Check if audit logs are created**

1. Perform actions (login, update profile, etc.)
2. Check database for audit_logs table
3. Verify entries exist

**Expected:** All actions logged with:

- user_id
- action (INSERT/UPDATE/DELETE)
- table_name
- timestamp
- ip_address

**Status:** [ ] Pass / [ ] Fail

---

## Test Results Summary

### Local Tests (Development)

| Test                | Status | Notes                       |
| ------------------- | ------ | --------------------------- |
| Rate Limiting       | [ ]    | DDoS protection             |
| Security Headers    | [ ]    | HSTS, X-Frame-Options, etc. |
| Frontend Accessible | [ ]    | Next.js running             |
| Cookie Banner       | [ ]    | Needs CookieYes ID          |
| API Response Time   | [ ]    | < 200ms target              |

### Production Tests (After Deployment)

| Test                   | Status | Notes         |
| ---------------------- | ------ | ------------- |
| SSL Labs Grade         | [ ]    | Target: A+    |
| Security Headers Grade | [ ]    | Target: A+    |
| HTTPS Redirect         | [ ]    | HTTP → HTTPS  |
| Mixed Content          | [ ]    | No warnings   |
| Cloudflare WAF         | [ ]    | cf-ray header |

### Capacity Tests

| Test                     | Status | Notes         |
| ------------------------ | ------ | ------------- |
| 100 Concurrent Users     | [ ]    | > 80% success |
| Load Testing (Artillery) | [ ]    | 100 req/sec   |

### Compliance Tests

| Test            | Status | Notes              |
| --------------- | ------ | ------------------ |
| Consent Logging | [ ]    | GDPR/DPDP          |
| Audit Trail     | [ ]    | All actions logged |

---

## Quick Start Testing

### Step 1: Test Locally (Now)

```powershell
# 1. Test rate limiting
for ($i=1; $i -le 20; $i++) {
    Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health" -UseBasicParsing | Select-Object StatusCode
}

# 2. Check security headers
(Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health" -UseBasicParsing).Headers

# 3. Test frontend
Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing | Select-Object StatusCode
```

### Step 2: Deploy to Production

1. Push to Git (already done ✅)
2. Netlify auto-deploys
3. Configure Cloudflare

### Step 3: Test Production

1. SSL Labs: https://www.ssllabs.com/ssltest/
2. Security Headers: https://securityheaders.com/
3. Manual browser testing

---

## Expected Results

### Development (Local)

- ✅ Rate limiting: Working
- ✅ Security headers: Present
- ✅ Frontend: Accessible
- ⏳ Cookie banner: Pending ID replacement
- ✅ API performance: < 200ms

### Production (After Cloudflare)

- ✅ SSL Labs: A+ rating
- ✅ Security Headers: A+ rating
- ✅ HTTPS redirect: Working
- ✅ Cloudflare WAF: Active
- ✅ 40k+ users: Supported

---

## Troubleshooting

### Issue: Rate limiting not working

**Solution:** Restart services with `.\restart-services.ps1`

### Issue: Security headers missing

**Solution:** Check if API is running on port 8080

### Issue: Frontend not accessible

**Solution:** Check if web server is running on port 3000

### Issue: Cookie banner not showing

**Solution:** Replace `YOUR_COOKIEYES_ID` in `apps/web/src/app/layout.tsx`

---

## Next Steps

1. ✅ Run local tests above
2. ⏳ Replace CookieYes ID
3. ⏳ Replace Google Analytics ID
4. ⏳ Configure Cloudflare
5. ⏳ Run production tests
6. ⏳ Load testing (optional)

---

**Last Updated:** 2025-12-28  
**Status:** Ready for Testing
