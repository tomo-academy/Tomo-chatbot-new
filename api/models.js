module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const models = [
      // OpenAI Models
      {
        id: 'gpt-4o',
        name: 'GPT-4 Omni',
        provider: 'OpenAI',
        providerId: 'openai'
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4 Omni Mini',
        provider: 'OpenAI',
        providerId: 'openai'
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        providerId: 'openai'
      },
      // Anthropic Models
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        providerId: 'anthropic'
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        provider: 'Anthropic',
        providerId: 'anthropic'
      },
      // Google Models
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'Google',
        providerId: 'google'
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'Google',
        providerId: 'google'
      },
      // Groq Models
      {
        id: 'llama-3.1-70b-versatile',
        name: 'Llama 3.1 70B',
        provider: 'Groq',
        providerId: 'groq'
      },
      {
        id: 'mixtral-8x7b-32768',
        name: 'Mixtral 8x7B',
        provider: 'Groq',
        providerId: 'groq'
      },
      // DeepSeek Models
      {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        provider: 'DeepSeek',
        providerId: 'deepseek'
      },
      // xAI Models
      {
        id: 'grok-beta',
        name: 'Grok Beta',
        provider: 'xAI',
        providerId: 'xai'
      }
    ];

    res.status(200).json(models);

  } catch (error) {
    console.error('Models error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};