# Cloudflare Security Configuration Guide

## Overview

This guide provides step-by-step instructions for setting up Cloudflare as a Web Application Firewall (WAF) and CDN in front of your Netlify deployment.

## Prerequisites

- Domain name registered
- Netlify site deployed
- Cloudflare account (free tier is sufficient)

---

## Step 1: Add Domain to Cloudflare

1. **Sign up/Login** to [Cloudflare](https://dash.cloudflare.com/)
2. Click **"Add a Site"**
3. Enter your domain name (e.g., `parashootingindia.org`)
4. Select **Free Plan**
5. Click **"Continue"**

---

## Step 2: Update DNS Records

### A. Copy Existing DNS Records

Cloudflare will scan your current DNS records. Verify these records:

```
Type    Name    Content                 Proxy Status
A       @       [Netlify IP]           Proxied (🟠)
CNAME   www     [your-site].netlify.app Proxied (🟠)
```

### B. Update Nameservers

1. Copy the Cloudflare nameservers (e.g., `ns1.cloudflare.com`, `ns2.cloudflare.com`)
2. Go to your domain registrar (GoDaddy, Namecheap, etc.)
3. Replace existing nameservers with Cloudflare nameservers
4. Wait 24-48 hours for propagation (usually faster)

---

## Step 3: Enable Security Features

### A. SSL/TLS Configuration

**Path:** SSL/TLS → Overview

1. Set SSL/TLS encryption mode: **Full (strict)**
2. Enable **Always Use HTTPS**
3. Enable **Automatic HTTPS Rewrites**
4. Enable **Opportunistic Encryption**

### B. Firewall Rules (WAF)

**Path:** Security → WAF

#### 1. Enable Managed Rules

- **Cloudflare Managed Ruleset**: ON
- **Cloudflare OWASP Core Ruleset**: ON

#### 2. Create Custom Firewall Rules

**Rule 1: Block Suspicious Countries (Optional)**

```javascript
// Expression
(ip.geoip.country in {"CN" "RU" "KP"})

// Action: Block
// Description: Block traffic from high-risk countries
```

**Rule 2: Rate Limit Login Attempts**

```javascript
// Expression
(http.request.uri.path eq "/api/v1/auth/login") and (rate(5m) > 10)

// Action: Challenge (CAPTCHA)
// Description: Limit login attempts to 10 per 5 minutes
```

**Rule 3: Protect Admin Routes**

```javascript
// Expression
(http.request.uri.path contains "/api/v1/admin") and (cf.threat_score > 10)

// Action: Challenge
// Description: Challenge suspicious requests to admin endpoints
```

**Rule 4: Block Known Bots**

```javascript
// Expression
(cf.bot_management.score < 30) and not (http.request.uri.path contains "/api/v1/health")

// Action: Block
// Description: Block malicious bots (except health checks)
```

### C. DDoS Protection

**Path:** Security → DDoS

- **HTTP DDoS Attack Protection**: ON (automatic)
- **Network-layer DDoS Attack Protection**: ON (automatic)

### D. Bot Protection

**Path:** Security → Bots

- **Bot Fight Mode**: ON (Free tier)
- **Super Bot Fight Mode**: Upgrade to Pro for advanced features

---

## Step 4: Performance Optimization

### A. Caching Rules

**Path:** Caching → Configuration

#### Browser Cache TTL

- Set to **4 hours** for static assets

#### Cache Rules

Create custom cache rules:

**Rule 1: Cache Static Assets**

```javascript
// Expression
(http.request.uri.path matches "^.*\\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$")

// Settings:
- Edge Cache TTL: 1 year
- Browser Cache TTL: 1 year
```

**Rule 2: Cache API Responses (Selective)**

```javascript
// Expression
(http.request.uri.path contains "/api/v1/news") or
(http.request.uri.path contains "/api/v1/results")

// Settings:
- Edge Cache TTL: 5 minutes
- Browser Cache TTL: 1 minute
```

### B. Auto Minify

**Path:** Speed → Optimization

- **JavaScript**: ON
- **CSS**: ON
- **HTML**: ON

### C. Brotli Compression

**Path:** Speed → Optimization

- **Brotli**: ON

---

## Step 5: Rate Limiting Configuration

**Path:** Security → WAF → Rate Limiting Rules

### Rule 1: Global API Rate Limit

```
Characteristic: IP Address
Period: 10 seconds
Requests: 100
Action: Block for 60 seconds
```

### Rule 2: Login Endpoint Protection

```
URL Path: /api/v1/auth/login
Characteristic: IP Address
Period: 5 minutes
Requests: 5
Action: Challenge (CAPTCHA)
```

### Rule 3: Admin Endpoint Protection

```
URL Path: /api/v1/admin/*
Characteristic: IP Address
Period: 1 minute
Requests: 20
Action: Block for 300 seconds
```

---

## Step 6: Page Rules (Optional)

**Path:** Rules → Page Rules

### Rule 1: Force HTTPS

```
URL: http://*parashootingindia.org/*
Setting: Always Use HTTPS
```

### Rule 2: Cache Everything (Static Pages)

```
URL: *parashootingindia.org/*.html
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 hour
```

---

## Step 7: Security Headers

**Path:** Rules → Transform Rules → Modify Response Header

Add these security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## Step 8: Analytics & Monitoring

### A. Enable Analytics

**Path:** Analytics & Logs → Web Analytics

- Enable **Web Analytics**
- Add tracking code to your site (optional, as you have GA)

### B. Security Events

**Path:** Security → Events

- Monitor blocked requests
- Analyze attack patterns
- Adjust firewall rules based on threats

---

## Step 9: Verify Configuration

### A. Test SSL/TLS

```bash
curl -I https://parashootingindia.org
```

Expected headers:

```
HTTP/2 200
cf-ray: [RAY_ID]
cf-cache-status: HIT
strict-transport-security: max-age=31536000
```

### B. Test Rate Limiting

```bash
# Send 20 rapid requests
for i in {1..20}; do curl https://parashootingindia.org/api/v1/health; done
```

Expected: After 10 requests, you should see rate limit errors.

### C. Test WAF

Try accessing with suspicious user agent:

```bash
curl -A "sqlmap" https://parashootingindia.org
```

Expected: Request should be blocked or challenged.

---

## Step 10: Netlify Integration

### Update Netlify Configuration

**File:** `netlify.toml`

```toml
[build]
  base = "apps/web"
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

# Headers for Cloudflare compatibility
[[headers]]
  for = "/*"
  [headers.values]
    X-Robots-Tag = "index, follow"
    X-Content-Type-Options = "nosniff"
```

---

## Cloudflare Free Tier Limits

| Feature             | Free Tier Limit       |
| ------------------- | --------------------- |
| Bandwidth           | Unlimited             |
| DDoS Protection     | Unlimited             |
| SSL Certificates    | Unlimited             |
| Firewall Rules      | 5 rules               |
| Page Rules          | 3 rules               |
| Rate Limiting       | 10,000 requests/month |
| Cache Purge         | Unlimited             |
| Analytics Retention | 24 hours              |

---

## Monitoring & Maintenance

### Daily Checks

- Review **Security Events** for blocked threats
- Monitor **Analytics** for traffic patterns

### Weekly Tasks

- Analyze **Firewall Events** logs
- Adjust rate limiting thresholds if needed

### Monthly Tasks

- Review **Cache Hit Ratio** (aim for >80%)
- Update firewall rules based on new threats
- Check **SSL certificate** expiry (auto-renewed)

---

## Troubleshooting

### Issue: Site Not Loading

**Solution:**

1. Check DNS propagation: `nslookup parashootingindia.org`
2. Verify Cloudflare proxy status (orange cloud)
3. Check SSL/TLS mode is **Full (strict)**

### Issue: 525 Error (SSL Handshake Failed)

**Solution:**

1. Change SSL/TLS mode to **Full** (not strict)
2. Wait 5 minutes
3. Test again

### Issue: Too Many Rate Limit Blocks

**Solution:**

1. Go to **Security → WAF → Rate Limiting Rules**
2. Increase threshold or period
3. Add exceptions for trusted IPs

---

## Security Best Practices

1. ✅ **Enable DNSSEC** (Security → DNSSEC)
2. ✅ **Use Cloudflare Access** for admin routes (paid feature)
3. ✅ **Enable Email Security** (Email → Email Security)
4. ✅ **Set up Notifications** (Notifications → Add)
5. ✅ **Regular Security Audits** (monthly)

---

## Cost Optimization

### When to Upgrade to Pro ($20/month)

- Need more than 5 firewall rules
- Require advanced bot protection
- Need longer analytics retention (30 days)
- Want image optimization
- Require priority support

### When to Upgrade to Business ($200/month)

- Handling 100k+ concurrent users
- Need custom SSL certificates
- Require PCI compliance
- Need 100% uptime SLA

---

## Support & Resources

- **Cloudflare Community**: https://community.cloudflare.com/
- **Documentation**: https://developers.cloudflare.com/
- **Status Page**: https://www.cloudflarestatus.com/
- **Support**: https://support.cloudflare.com/

---

## Next Steps

After Cloudflare setup:

1. ✅ Configure CookieYes consent banner
2. ✅ Set up Google Analytics with consent mode
3. ✅ Test all security features
4. ✅ Monitor performance metrics
5. ✅ Document any custom configurations

---

**Last Updated:** 2025-12-28  
**Maintained By:** Para Shooting Committee IT Team
