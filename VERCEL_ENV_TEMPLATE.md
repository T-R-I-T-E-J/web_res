# Vercel Environment Variables Configuration

# Copy these to Vercel Dashboard → Project Settings → Environment Variables

# ============================================

# REQUIRED VARIABLES

# ============================================

# Backend API URL (REQUIRED)

# Replace with your actual backend API URL

NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1

# JWT Secret (Server-side only, REQUIRED)

# MUST match your backend JWT_SECRET

JWT_SECRET=your-secret-key-here

# ============================================

# APPLICATION METADATA

# ============================================

NODE_ENV=production
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_APP_NAME=Para Shooting Committee of India
NEXT_PUBLIC_APP_VERSION=1.0.0

# ============================================

# FEATURE FLAGS

# ============================================

NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_SENTRY=false

# ============================================

# OPTIONAL SERVICES

# ============================================

# Google Analytics (if using)

NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=

# Sentry Error Tracking (if using)

NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production

# ============================================

# API CONFIGURATION

# ============================================

NEXT_PUBLIC_API_TIMEOUT=30000

# ============================================

# INSTRUCTIONS

# ============================================

# 1. Go to Vercel Dashboard

# 2. Select your project

# 3. Go to Settings → Environment Variables

# 4. Add each variable above

# 5. Select "Production", "Preview", and "Development" for each

# 6. Click "Save"

# 7. Redeploy your application
