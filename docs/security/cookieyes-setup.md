# CookieYes Setup & Configuration Guide

## Overview

CookieYes is a GDPR/DPDP-compliant Cookie Consent Management Platform (CMP) that helps manage user consent for cookies and tracking technologies.

---

## Step 1: Create CookieYes Account

1. **Sign Up**: Go to [CookieYes](https://www.cookieyes.com/)
2. **Choose Plan**:
   - **Free Plan**: Up to 25,000 page views/month
   - **Pro Plan**: $10/month for 100,000 page views/month
3. **Verify Email**: Check your inbox and verify your account

---

## Step 2: Add Your Website

1. **Dashboard** → Click **"Add Website"**
2. **Enter Details**:
   ```
   Website Name: Para Shooting Committee of India
   Website URL: https://parashootingindia.org
   Language: English
   ```
3. **Select Compliance Laws**:
   - ✅ GDPR (EU General Data Protection Regulation)
   - ✅ DPDP (India Digital Personal Data Protection Act 2023)
   - ✅ ePrivacy Directive
   - ✅ CCPA (California Consumer Privacy Act) - Optional
4. Click **"Continue"**

---

## Step 3: Configure Cookie Categories

### A. Necessary Cookies (Always Allowed)

**Purpose**: Essential for website functionality

**Cookies to Add**:

```javascript
// Authentication Cookies
{
  name: "auth_token",
  domain: "parashootingindia.org",
  duration: "7 days",
  purpose: "User authentication and session management",
  category: "Necessary"
}

{
  name: "refresh_token",
  domain: "parashootingindia.org",
  duration: "30 days",
  purpose: "Refresh authentication tokens",
  category: "Necessary"
}

{
  name: "XSRF-TOKEN",
  domain: "parashootingindia.org",
  duration: "Session",
  purpose: "CSRF protection",
  category: "Necessary"
}
```

### B. Analytics Cookies (Requires Consent)

**Purpose**: Understand user behavior and improve website

**Cookies to Add**:

```javascript
// Google Analytics
{
  name: "_ga",
  domain: ".parashootingindia.org",
  duration: "2 years",
  purpose: "Google Analytics - Distinguish users",
  category: "Analytics",
  provider: "Google LLC"
}

{
  name: "_gid",
  domain: ".parashootingindia.org",
  duration: "24 hours",
  purpose: "Google Analytics - Distinguish users",
  category: "Analytics",
  provider: "Google LLC"
}

{
  name: "_gat",
  domain: ".parashootingindia.org",
  duration: "1 minute",
  purpose: "Google Analytics - Throttle request rate",
  category: "Analytics",
  provider: "Google LLC"
}
```

### C. Marketing Cookies (Requires Consent)

**Purpose**: Track conversions and ad performance

**Cookies to Add**:

```javascript
// Meta Pixel (Facebook)
{
  name: "_fbp",
  domain: ".parashootingindia.org",
  duration: "3 months",
  purpose: "Facebook Pixel - Track conversions",
  category: "Marketing",
  provider: "Meta Platforms, Inc."
}

// HubSpot
{
  name: "hubspotutk",
  domain: ".parashootingindia.org",
  duration: "13 months",
  purpose: "HubSpot - Track visitor identity",
  category: "Marketing",
  provider: "HubSpot, Inc."
}
```

---

## Step 4: Customize Banner Design

### A. Banner Settings

**Path:** Settings → Banner Design

```javascript
{
  // Position
  position: "bottom-right",

  // Layout
  layout: "popup", // or "bar"

  // Colors
  backgroundColor: "#FFFFFF",
  textColor: "#1F2937",
  buttonColor: "#DC2626", // Brand red
  buttonTextColor: "#FFFFFF",

  // Text
  heading: "We value your privacy",
  description: "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking 'Accept All', you consent to our use of cookies.",

  // Buttons
  acceptAllButton: "Accept All",
  rejectAllButton: "Reject All",
  settingsButton: "Cookie Settings",

  // Links
  privacyPolicyUrl: "https://parashootingindia.org/privacy-policy",
  cookiePolicyUrl: "https://parashootingindia.org/cookie-policy"
}
```

### B. Advanced Settings

**Auto-Block Cookies**: ON

- Automatically blocks analytics/marketing cookies until consent

**Show Badge**: ON

- Display cookie settings badge for users to change preferences

**Consent Logging**: ON

- Log all consent decisions for GDPR compliance

---

## Step 5: Install CookieYes Script

### A. Get Installation Code

1. **Dashboard** → **Install**
2. Copy your unique CookieYes ID (e.g., `abc123xyz`)

### B. Already Implemented in Your Code

The script is already added to `apps/web/src/app/layout.tsx`:

```tsx
<Script
  id="cookieyes"
  src="https://cdn-cookieyes.com/client_data/YOUR_COOKIEYES_ID/script.js"
  strategy="beforeInteractive"
/>
```

**Action Required**: Replace `YOUR_COOKIEYES_ID` with your actual CookieYes ID.

---

## Step 6: Configure Google Analytics with Consent Mode

### A. Update Google Analytics Configuration

**File:** `apps/web/src/app/layout.tsx`

Replace the Google Analytics script with consent-aware version:

```tsx
<Script
  id="google-analytics"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      
      // Default consent to denied
      gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'wait_for_update': 500
      });
      
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID', {
        'anonymize_ip': true
      });
    `,
  }}
/>;

{
  /* Load GA script */
}
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>;
```

### B. CookieYes Consent Callback

Add this script to handle consent updates:

```tsx
<Script
  id="cookieyes-consent-handler"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      document.addEventListener('cookieyes_consent_update', function (eventData) {
        const consentData = eventData.detail;
        
        // Update Google Analytics consent
        if (typeof gtag !== 'undefined') {
          gtag('consent', 'update', {
            'analytics_storage': consentData.accepted.includes('analytics') ? 'granted' : 'denied',
            'ad_storage': consentData.accepted.includes('marketing') ? 'granted' : 'denied',
            'ad_user_data': consentData.accepted.includes('marketing') ? 'granted' : 'denied',
            'ad_personalization': consentData.accepted.includes('marketing') ? 'granted' : 'denied'
          });
        }
        
        // Log consent to backend for GDPR compliance
        fetch('/api/v1/consent/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            analytics: consentData.accepted.includes('analytics'),
            marketing: consentData.accepted.includes('marketing'),
            timestamp: new Date().toISOString()
          })
        });
      });
    `,
  }}
/>
```

---

## Step 7: Create Privacy & Cookie Policies

### A. Privacy Policy

**Path:** Create file `apps/web/src/app/privacy-policy/page.tsx`

Use CookieYes **Policy Generator**:

1. Dashboard → **Policies** → **Generate Privacy Policy**
2. Answer questions about your data practices
3. Download generated policy
4. Add to your website

### B. Cookie Policy

**Path:** Create file `apps/web/src/app/cookie-policy/page.tsx`

Use CookieYes **Cookie Policy Generator**:

1. Dashboard → **Policies** → **Generate Cookie Policy**
2. Automatically lists all detected cookies
3. Download and add to your website

---

## Step 8: Backend Consent Logging API

### A. Create Consent Controller

**File:** `apps/api/src/consent/consent.controller.ts`

```typescript
import { Controller, Post, Body, Req } from "@nestjs/common";
import { Public } from "../auth/decorators/public.decorator";
import { AuditService } from "../common/services/audit.service";
import { Request } from "express";

@Controller("consent")
export class ConsentController {
  constructor(private readonly auditService: AuditService) {}

  @Public()
  @Post("log")
  async logConsent(
    @Body()
    consentData: {
      analytics: boolean;
      marketing: boolean;
      timestamp: string;
    },
    @Req() req: Request
  ) {
    const userId = req.user?.["id"]; // If user is logged in
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];

    // Log analytics consent
    await this.auditService.logConsentChange(
      userId,
      "analytics",
      consentData.analytics,
      ipAddress,
      userAgent
    );

    // Log marketing consent
    await this.auditService.logConsentChange(
      userId,
      "marketing",
      consentData.marketing,
      ipAddress,
      userAgent
    );

    return {
      success: true,
      message: "Consent logged successfully",
    };
  }
}
```

### B. Create Consent Module

**File:** `apps/api/src/consent/consent.module.ts`

```typescript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConsentController } from "./consent.controller";
import { AuditLog } from "../common/entities/audit-log.entity";
import { AuditService } from "../common/services/audit.service";

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [ConsentController],
  providers: [AuditService],
})
export class ConsentModule {}
```

### C. Register Module in AppModule

**File:** `apps/api/src/app.module.ts`

```typescript
import { ConsentModule } from "./consent/consent.module";

@Module({
  imports: [
    // ... other imports
    ConsentModule,
  ],
})
export class AppModule {}
```

---

## Step 9: Testing

### A. Test Cookie Banner

1. Open your website in **Incognito Mode**
2. Verify banner appears on first visit
3. Test **Accept All** button
4. Verify analytics cookies are set
5. Test **Reject All** button
6. Verify analytics cookies are NOT set

### B. Test Consent Persistence

1. Accept cookies
2. Close browser
3. Reopen website
4. Verify banner does NOT appear (consent remembered)

### C. Test Cookie Settings Badge

1. Click the cookie settings badge (bottom-left)
2. Change preferences
3. Verify cookies are added/removed accordingly

### D. Test Backend Logging

```bash
# Check audit logs
curl -X GET http://localhost:8080/api/v1/audit/logs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected response:

```json
{
  "logs": [
    {
      "action": "UPDATE",
      "table_name": "user_consent",
      "new_values": {
        "consent_type": "analytics",
        "granted": true,
        "timestamp": "2025-12-28T17:30:00Z"
      }
    }
  ]
}
```

---

## Step 10: GDPR Compliance Checklist

### ✅ Required Features (Implemented)

- [x] Cookie consent banner before tracking
- [x] Clear explanation of cookie purposes
- [x] Granular consent (analytics, marketing separate)
- [x] Easy opt-out mechanism
- [x] Consent logging for audit trail
- [x] Privacy policy link
- [x] Cookie policy link
- [x] Auto-blocking of non-essential cookies

### ✅ DPDP Act 2023 Compliance (India)

- [x] Consent in clear, plain language
- [x] Separate consent for different purposes
- [x] Easy withdrawal of consent
- [x] Audit trail of consent decisions
- [x] Data minimization (only necessary cookies by default)

---

## Monitoring & Maintenance

### Daily Tasks

- Review consent rates in CookieYes dashboard
- Check for new cookies detected by scanner

### Weekly Tasks

- Analyze consent analytics
- Update cookie descriptions if needed

### Monthly Tasks

- Run CookieYes cookie scanner
- Update cookie policy with new cookies
- Review consent logs for anomalies

---

## Troubleshooting

### Issue: Banner Not Appearing

**Solution:**

1. Check browser console for errors
2. Verify CookieYes script is loaded: `View Source → Search for "cookieyes"`
3. Clear browser cache and cookies
4. Test in Incognito mode

### Issue: Cookies Still Set After Rejection

**Solution:**

1. Enable **Auto-Block** in CookieYes settings
2. Verify cookie categories are correct
3. Check if cookies are set before CookieYes loads (move script to `beforeInteractive`)

### Issue: Consent Not Logged to Backend

**Solution:**

1. Check browser console for API errors
2. Verify `/api/v1/consent/log` endpoint is accessible
3. Check CORS settings allow frontend domain
4. Verify consent handler script is loaded

---

## Cost Breakdown

### Free Plan (Current)

- ✅ 25,000 page views/month
- ✅ Unlimited websites
- ✅ GDPR/CCPA compliance
- ✅ Cookie scanner
- ✅ Consent logging
- ❌ Custom branding
- ❌ Priority support

### Pro Plan ($10/month)

- ✅ 100,000 page views/month
- ✅ Custom branding (remove "Powered by CookieYes")
- ✅ Priority support
- ✅ Advanced analytics

### When to Upgrade

- Exceeding 25k page views/month
- Need custom branding
- Require priority support
- Want advanced consent analytics

---

## Integration with Other Tools

### Google Tag Manager

```javascript
// Trigger tags based on consent
document.addEventListener("cookieyes_consent_update", function (e) {
  if (e.detail.accepted.includes("analytics")) {
    // Trigger GA tags
    dataLayer.push({ event: "analytics_consent_granted" });
  }
  if (e.detail.accepted.includes("marketing")) {
    // Trigger marketing tags
    dataLayer.push({ event: "marketing_consent_granted" });
  }
});
```

### Meta Pixel

```javascript
// Load Meta Pixel only after consent
document.addEventListener('cookieyes_consent_update', function (e) {
  if (e.detail.accepted.includes('marketing')) {
    !function(f,b,e,v,n,t,s){...}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'YOUR_PIXEL_ID');
    fbq('track', 'PageView');
  }
});
```

---

## Support & Resources

- **CookieYes Documentation**: https://www.cookieyes.com/documentation/
- **GDPR Guide**: https://gdpr.eu/cookies/
- **DPDP Act 2023**: https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf
- **Support**: support@cookieyes.com

---

## Next Steps

1. ✅ Replace `YOUR_COOKIEYES_ID` in layout.tsx
2. ✅ Add your Google Analytics ID
3. ✅ Create privacy and cookie policy pages
4. ✅ Implement consent logging API
5. ✅ Test in production
6. ✅ Monitor consent rates
7. ✅ Schedule monthly cookie scans

---

**Last Updated:** 2025-12-28  
**Maintained By:** Para Shooting Committee IT Team
