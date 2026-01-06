# Google Cloud Console - Fix Redirect URI Mismatch

## Problem
Error: `redirect_uri_mismatch` when trying to sign in with Google

## Root Cause
The redirect URI registered in Google Cloud Console doesn't match the actual app domain.

## Solution

### Step 1: Go to Google Cloud Console
https://console.cloud.google.com/apis/credentials

### Step 2: Edit OAuth 2.0 Client ID
1. Find "Auto Apply Web V2" OAuth 2.0 Client ID (Web application)
2. Click it to edit
3. Look for "Authorized redirect URIs"

### Step 3: Add BOTH redirect URIs
Delete any old ones and add:

**For Development (localhost):**
```
http://localhost:3000/api/auth/callback/google
```

**For Production (Vercel):**
```
https://auto-apply-web-by-email-v2-fqqsfpfn6-uyendo0203s-projects.vercel.app/api/auth/callback/google
```

### Step 4: Save Changes
Click "Save" button

### Step 5: Wait 2-5 minutes
Google needs time to propagate the changes

### Step 6: Test
Try signing in again at:
- Local: http://localhost:3000/auth/signin
- Production: https://auto-apply-web-by-email-v2-fqqsfpfn6-uyendo0203s-projects.vercel.app/auth/signin

---

## If error persists:

### Check NEXTAUTH_URL
Make sure it matches the actual domain:
- Should be: `https://auto-apply-web-by-email-v2-fqqsfpfn6-uyendo0203s-projects.vercel.app`
- NOT: `https://auto-apply-web-by-email-v2.vercel.app` (old domain)

### Check environment variables on Vercel
```bash
vercel env ls
```
Should show NEXTAUTH_URL with correct domain.

### Clear browser cache
- Delete cookies for the domain
- Try in incognito/private window
- Try different browser

### Check Console Logs
```bash
npm run dev
# Try signing in and check terminal for errors
```

---

## Current Configuration:
- **NEXTAUTH_URL**: `https://auto-apply-web-by-email-v2-fqqsfpfn6-uyendo0203s-projects.vercel.app`
- **API Route**: `/api/auth/[...nextauth]/route.ts`
- **Callback Path**: `/api/auth/callback/google`

Full Redirect URI should be:
```
https://auto-apply-web-by-email-v2-fqqsfpfn6-uyendo0203s-projects.vercel.app/api/auth/callback/google
```
