# Vercel Deployment Configuration Guide

## 🚀 Vercel Build Settings for Tomo AI Chatbot

### Framework Detection
- **Framework**: Next.js (Auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (Auto-detected)
- **Install Command**: `npm install`
- **Dev Command**: `npm run dev`

### Node.js Version
- **Recommended**: Node.js 18.x or 20.x
- **Set in Vercel Dashboard**: Project Settings → General → Node.js Version

## 📋 Environment Variables (Required)

### Essential AI Provider Keys
```bash
# OpenAI (Required for basic functionality)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Anthropic (Optional but recommended)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here

# Google AI (Optional)
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key-here

# Groq (Optional)
GROQ_API_KEY=your-groq-api-key-here

# DeepSeek (Optional)
DEEPSEEK_API_KEY=your-deepseek-key-here

# xAI/Grok (Optional)
XAI_API_KEY=your-xai-key-here
```

### Search Integration (Optional)
```bash
# Exa Search API
EXA_API_KEY=your-exa-api-key-here

# Tavily Search API
TAVILY_API_KEY=your-tavily-api-key-here

# SearXNG Instance (if using custom)
SEARXNG_API_URL=https://your-searxng-instance.com
```

### Database & Authentication (Optional)
```bash
# Supabase (for user auth and chat history)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Redis (for caching)
UPSTASH_REDIS_URL=redis://your-redis-url
UPSTASH_REDIS_TOKEN=your-redis-token
```

### Analytics & Monitoring (Optional)
```bash
# Vercel Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS=true

# Additional tracking
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 🛠️ Vercel Dashboard Configuration

### 1. Import Project
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `tomo-academy/Tomo-chatbot-new`
4. Select the repository and click "Import"

### 2. Build & Development Settings
```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: (leave empty - auto-detected)
Install Command: npm install
Development Command: npm run dev
```

### 3. Environment Variables Setup
In Vercel Dashboard → Project → Settings → Environment Variables:

**Add each environment variable for all environments (Production, Preview, Development)**

### 4. Advanced Build Settings
```json
{
  "functions": {
    "app/api/**": {
      "maxDuration": 60
    }
  },
  "regions": ["iad1"],
  "framework": "nextjs"
}
```

## 🚦 Deployment Process

### Automatic Deployment
- **Production**: Deploys from `master` branch
- **Preview**: Deploys from pull requests
- **Development**: Manual deploys

### Manual Deploy Commands
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## ⚡ Performance Optimizations

### 1. Build Optimizations
```json
// next.config.mjs (already configured)
{
  "experimental": {
    "optimizeCss": true,
    "optimizePackageImports": ["@ai-sdk/anthropic", "@ai-sdk/openai"]
  },
  "images": {
    "formats": ["image/webp", "image/avif"],
    "minimumCacheTTL": 300
  }
}
```

### 2. Edge Runtime (for faster responses)
API routes are configured to use Edge Runtime where possible.

### 3. Static Generation
- Static pages: About, Terms, Privacy
- Dynamic pages: Chat, Search results
- ISR: Model configurations

## 🔍 Monitoring & Debugging

### Build Logs
- Check Vercel Dashboard → Deployments → Build Logs
- Look for TypeScript errors, missing dependencies, or build failures

### Runtime Logs
- Function logs available in Vercel Dashboard
- Real-time logs via Vercel CLI: `vercel logs`

### Common Issues & Solutions

#### 1. Build Timeout
```json
// vercel.json
{
  "functions": {
    "app/api/**": {
      "maxDuration": 60
    }
  }
}
```

#### 2. Environment Variables Not Working
- Ensure variables are set for ALL environments
- Restart deployment after adding variables
- Check variable names match exactly

#### 3. API Route Errors
- Check function logs in Vercel Dashboard
- Verify API keys are correctly set
- Test locally first: `npm run dev`

## 🎯 Post-Deployment Checklist

### ✅ Basic Functionality
- [ ] Homepage loads correctly
- [ ] AI chat responds with OpenAI
- [ ] Theme switching works
- [ ] Mobile responsive design

### ✅ AI Features
- [ ] Multiple AI models selectable
- [ ] Search integration working
- [ ] Streaming responses functional
- [ ] Error handling graceful

### ✅ Performance
- [ ] Page load speed < 3s
- [ ] API response time < 5s
- [ ] Images optimized and loading
- [ ] No console errors

### ✅ Security
- [ ] Environment variables not exposed
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] API keys protected
- [ ] CORS configured properly

## 🔗 Useful Links

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Environment Variables**: https://vercel.com/docs/projects/environment-variables
- **Build Configuration**: https://vercel.com/docs/build-step

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test locally with `npm run build && npm start`
4. Check the project's GitHub Issues
5. Contact Vercel support if needed

---

**Your Tomo AI Chatbot is ready for deployment! 🚀**