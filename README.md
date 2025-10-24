# Tomo AI Chatbot - Advanced AI-Powered Chat Platform

A powerful, production-ready AI chatbot platform combining multiple AI providers with an intuitive interface. Built with Next.js 15, TypeScript, and integrated with DevoChat features.

![Tomo AI Chatbot](/public/screenshot.png)

## 🚀 Features

- **Multiple AI Providers**: OpenAI, Anthropic, Google, Groq, DeepSeek, and more
- **Real-time Chat**: Instant AI responses with streaming support
- **Advanced UI**: Modern, responsive design with dark/light themes
- **Search Integration**: Web search capabilities with Exa and SearXNG
- **Image Chat**: AI-powered image analysis and generation
- **Voice Input**: Speech-to-text functionality
- **Conversation Management**: Save, organize, and share conversations
- **Admin Panel**: User management and system administration
- **Authentication**: Secure user authentication system
- **Real-time Features**: Live chat and real-time updates

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Shadcn/ui
- **AI SDK**: Vercel AI SDK
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel
- **Package Manager**: npm

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/tomo-academy/Tomo-chatbot-new.git
cd Tomo-chatbot-new
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your environment variables in `.env.local`:
```bash
# AI Providers
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key

# Supabase (Optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Search (Optional)
EXA_API_KEY=your_exa_api_key

# Redis (Optional)
UPSTASH_REDIS_URL=your_redis_url
UPSTASH_REDIS_TOKEN=your_redis_token
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Docker

```bash
docker build -t tomo-chatbot .
docker run -p 3000:3000 tomo-chatbot
```

## 🔧 Configuration

### AI Providers

The platform supports multiple AI providers. Configure them in your environment variables:

- **OpenAI**: GPT-4, GPT-3.5 Turbo
- **Anthropic**: Claude 3 Sonnet, Claude 3 Haiku
- **Google**: Gemini Pro, Gemini Pro Vision
- **Groq**: Llama 2, Mixtral
- **DeepSeek**: DeepSeek Chat
- **xAI**: Grok models

### Search Integration

- **Exa**: Semantic search capabilities
- **SearXNG**: Self-hosted search engine

## 📱 Features Overview

### DevoChat Interface
- Classic chat interface with advanced features
- Image analysis and generation
- Voice input and output
- Conversation management
- Admin panel

### Morphic AI Engine
- Advanced AI reasoning
- Web search integration
- Artifact generation
- Real-time streaming

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🌟 Support

If you find this project helpful, please give it a ⭐ on GitHub!

For support, please open an issue on GitHub or contact us at support@tomoacademy.site

---

Built with ❤️ by [Tomo Academy](https://tomoacademy.site)