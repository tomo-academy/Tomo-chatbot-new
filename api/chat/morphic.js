const { openai } = require('@ai-sdk/openai');
const { anthropic } = require('@ai-sdk/anthropic');
const { google } = require('@ai-sdk/google');
const { groq } = require('@ai-sdk/groq');
const { deepseek } = require('@ai-sdk/deepseek');
const { xai } = require('@ai-sdk/xai');
const { streamText } = require('ai');

// AI Provider configurations
const getProvider = (modelName) => {
  if (modelName.startsWith('gpt-') || modelName.startsWith('o1-')) {
    return openai(modelName);
  } else if (modelName.startsWith('claude-')) {
    return anthropic(modelName);
  } else if (modelName.startsWith('gemini-')) {
    return google(modelName);
  } else if (modelName.startsWith('llama') || modelName.startsWith('mixtral')) {
    return groq(modelName);
  } else if (modelName.startsWith('deepseek-')) {
    return deepseek(modelName);
  } else if (modelName.startsWith('grok-')) {
    return xai(modelName);
  }
  // Default to OpenAI
  return openai('gpt-4o-mini');
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, model = 'gpt-4o-mini', history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build conversation history
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant integrated with DevoChat. Provide clear, accurate, and helpful responses in English.'
      },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    const result = await streamText({
      model: getProvider(model),
      messages,
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream the response
    for await (const chunk of result.textStream) {
      res.write(chunk);
    }

    res.end();

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};