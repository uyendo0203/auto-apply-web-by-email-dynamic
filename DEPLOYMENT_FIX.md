# Deployment Fix - NextAuth Configuration

## Problem
`redirect_uri_mismatch` error when trying to sign in on Vercel

## Solution

### Step 1: Set Environment Variables on Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select project: `auto-apply-web-by-email-v2`
3. Go to **Settings → Environment Variables**
4. Add/Update these variables for **Production** environment (see your `.env.local`):
   - `NEXTAUTH_URL` - Your Vercel production domain
   - `NEXTAUTH_SECRET` - Your NextAuth secret
   - `GOOGLE_CLIENT_ID` - From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
   - `GMAIL_APP_PASSWORD` - Your Gmail app password
   - `POSTGRES_URL` - Your Neon database connection string

### Step 2: Update Google OAuth Redirect URI

1. Go to https://console.cloud.google.com/
2. Select your Google Cloud project
3. Go to **APIs & Services → Credentials**
4. Find and edit your **OAuth 2.0 Client ID**
5. Under **Authorized redirect URIs**, keep only:
   - `http://localhost:3001/api/auth/callback/google` (for local development)
   - `https://<your-vercel-domain>/api/auth/callback/google` (for production)
6. Remove all other old URLs
7. Click **Save**

### Step 3: Redeploy

After saving, go back to Vercel and manually trigger a redeployment:
- Click **Deployments**
- Click the latest deployment
- Click **Redeploy**

Or use CLI:
```bash
vercel --prod
```

### Step 4: Test

Wait 2-3 minutes and try signing in again on:
https://auto-apply-web-by-email-v2.vercel.app

## Troubleshooting

If still getting `redirect_uri_mismatch`:
1. Check that NEXTAUTH_URL matches the deployment URL exactly
2. Wait 5 minutes for Google OAuth changes to propagate
3. Clear browser cookies and try again
4. Check Vercel logs: `vercel logs <deployment-url>`
