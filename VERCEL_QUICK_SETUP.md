# 🚀 Vercel Build Settings - Quick Reference

## Import Settings
```
Repository: tomo-academy/Tomo-chatbot-new
Framework: Next.js (auto-detected)
Root Directory: ./ (leave empty)
```

## Build & Development Settings
```
Build Command: npm run build
Output Directory: .next (auto-detected)
Install Command: npm install
Development Command: npm run dev
Node.js Version: 18.x
```

## Essential Environment Variables
Copy these to Vercel Dashboard → Settings → Environment Variables:

### Required (Minimum for basic functionality)
```
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Recommended (For full features)
```
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key-here
EXA_API_KEY=your-exa-api-key-here
```

### Optional (For enhanced features)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
UPSTASH_REDIS_URL=redis://your-redis-url
UPSTASH_REDIS_TOKEN=your-redis-token
GROQ_API_KEY=your-groq-api-key
DEEPSEEK_API_KEY=your-deepseek-key
XAI_API_KEY=your-xai-key
TAVILY_API_KEY=your-tavily-key
```

## Quick Deploy Steps
1. Go to https://vercel.com/new
2. Import `tomo-academy/Tomo-chatbot-new`
3. Add environment variables above
4. Click "Deploy"
5. ✅ Done! Your app will be live in ~2 minutes

## After Deployment
- Test at your-app.vercel.app
- Check all AI models work
- Verify search functionality
- Test mobile responsiveness

🎉 Your Tomo AI Chatbot is ready for the world!