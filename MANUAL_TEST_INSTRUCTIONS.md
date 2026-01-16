## 🧪 Manual Testing Instructions

Since the browser automation hit rate limits, please test manually:

### **Step 1: Check Deployment Status**

1. Go to: https://vercel.com/t-r-i-t-e-js-projects/web-res-api/3F6orn4U3LjcgeuhbvLC6Y2thGhy
2. Wait for status to show "Ready" (should be ready by now)

### **Step 2: Test Homepage (Check API Calls)**

1. Go to: https://web-res-api.vercel.app
2. Open DevTools (F12)
3. Go to Console tab
4. **Check for errors:**
   - ❌ If you see "Failed to fetch" → deployment not ready yet
   - ✅ If NO errors → API calls are working!
5. Go to Network tab
6. **Check API requests:**
   - Should see requests to `/api/v1/news`, `/api/v1/events`, etc.
   - NOT `https://web-res.onrender.com/api/v1/...`
7. **Check if data loads:**
   - News articles should be visible
   - Events should be visible
   - No loading spinners stuck

### **Step 3: Test Login**

1. **Clear cookies first:**
   - DevTools → Application tab → Cookies
   - Right-click on `web-res-api.vercel.app` → Clear
2. **Go to login page:**
   - https://web-res-api.vercel.app/login
3. **Enter credentials:**
   - Email: `admin@psci.in`
   - Password: `Admin@123`
4. **Click "Sign In"**
5. **Expected result:**
   - ✅ Immediate redirect to `/admin`
   - ✅ Dashboard loads
   - ✅ No redirect back to `/login`

### **Step 4: Verify Cookies**

1. DevTools → Application → Cookies
2. **Check for `auth_token`:**
   - ✅ Should exist
   - ✅ Domain: `.vercel.app`
   - ✅ HttpOnly: ✓
   - ✅ Secure: ✓
   - ✅ SameSite: None

### **Step 5: Test Admin Functions**

1. Navigate to `/admin/news`
2. Check if news articles load
3. Try creating a new article
4. Verify no "Failed to fetch" errors

---

## ✅ Success Criteria

**All of these should be TRUE:**

- [ ] Homepage loads without errors
- [ ] News/Events/Results display correctly
- [ ] Login redirects to `/admin`
- [ ] `auth_token` cookie is set
- [ ] Admin panel loads
- [ ] No "Failed to fetch" errors in console
- [ ] Network requests go to `/api/v1/*` (not `https://web-res.onrender.com`)

---

## 🔴 If Login Still Fails

**Check these:**

1. **Deployment Status:**
   - Is deployment `3F6orn4U3LjcgeuhbvLC6Y2thGhy` marked as "Ready"?
   - If not, wait a bit longer

2. **Environment Variable:**
   - Go to: https://vercel.com/t-r-i-t-e-js-projects/web-res-api/settings/environment-variables
   - Verify `NEXT_PUBLIC_API_URL` = `/api/v1`

3. **Console Errors:**
   - Open DevTools → Console
   - Take a screenshot of any errors
   - Share with me

4. **Network Tab:**
   - Open DevTools → Network
   - Filter by "Fetch/XHR"
   - Check what URL the login request goes to
   - Should be: `https://web-res-api.vercel.app/api/v1/auth/login`
   - NOT: `https://web-res.onrender.com/api/v1/auth/login`

---

## 📸 Screenshots to Share

If it's still not working, please share screenshots of:

1. Console tab (showing any errors)
2. Network tab (showing the login request)
3. Application → Cookies (showing auth_token or lack thereof)
4. Current URL after clicking "Sign In"

---

**Last Updated:** 2026-01-17T02:47:00+05:30  
**Deployment ID:** 3F6orn4U3LjcgeuhbvLC6Y2thGhy  
**Expected Status:** Should be working now! ✅
