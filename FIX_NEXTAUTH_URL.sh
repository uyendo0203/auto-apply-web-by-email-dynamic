#!/bin/bash
# Manual fix for NEXTAUTH_URL on Vercel Dashboard
# 
# The application is giving "Server error - There is a problem with the server configuration"
# This is because NEXTAUTH_URL environment variable is pointing to wrong domain
#
# SOLUTION: Update manually on Vercel Dashboard
#
# Steps:
# 1. Go to: https://vercel.com/uyendo0203s-projects/auto-apply-web-by-email-v2/settings/environment-variables
# 2. Find NEXTAUTH_URL (currently set to: https://auto-apply-web-by-email-v2.vercel.app)
# 3. Click Edit
# 4. Change the value to: https://auto-apply-web-by-email-v2-akx6knrtu-uyendo0203s-projects.vercel.app
# 5. Save
# 6. Go to Deployments tab
# 7. Click "..." on latest deployment → "Redeploy"
# 8. Wait for build to complete
#
# After this, the app should work!
