# Vercel Plan Configurations

## Hobby Plan (Free) - Current Configuration
**File**: `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "functions": {
    "app/api/**": {
      "maxDuration": 60
    }
  }
}
```

**Features Available**:
- ✅ Single region deployment (US East)
- ✅ 100GB bandwidth per month
- ✅ 6,000 build minutes per month
- ✅ Serverless functions (10 second timeout)
- ✅ Edge functions
- ✅ Custom domains

## Pro Plan Configuration
**File**: `vercel-pro.json` (rename to `vercel.json` when upgrading)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "functions": {
    "app/api/**": {
      "maxDuration": 300
    }
  },
  "regions": ["iad1", "sfo1", "lhr1", "hnd1"],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

**Additional Features**:
- ✅ Multi-region deployment
- ✅ 1TB bandwidth per month
- ✅ Unlimited build minutes
- ✅ 5-minute function timeout
- ✅ Password protection
- ✅ Analytics
- ✅ Priority support

## Enterprise Plan Configuration
**File**: `vercel-enterprise.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "functions": {
    "app/api/**": {
      "maxDuration": 900
    }
  },
  "regions": ["iad1", "sfo1", "lhr1", "hnd1", "sin1", "syd1"],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "crons": [
    {
      "path": "/api/cleanup",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**Additional Features**:
- ✅ Custom regions
- ✅ 15-minute function timeout
- ✅ Cron jobs
- ✅ Advanced security
- ✅ SAML SSO
- ✅ Dedicated support

## Current Deployment Status
- **Plan**: Hobby (Free) ✅
- **Region**: US East (Washington, D.C.)
- **Function Timeout**: 60 seconds
- **Status**: Ready for deployment

## Upgrading Plans
If you need multi-region deployment or longer function timeouts:
1. Go to Vercel Dashboard → Settings → Usage
2. Click "Upgrade Plan"
3. Choose Pro ($20/month) or Enterprise (custom pricing)
4. Replace `vercel.json` with the appropriate configuration above