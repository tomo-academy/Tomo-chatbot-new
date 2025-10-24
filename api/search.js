import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, model = 'gpt-4o-mini' } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Create search-optimized prompt
    const searchPrompt = `You are a helpful AI assistant that provides comprehensive answers to user queries. 
    
User query: "${query}"

Please provide a detailed, accurate, and helpful response in English. Include relevant information, examples, and context where appropriate.`;

    const result = await streamText({
      model: openai(model.startsWith('gpt-') ? model : 'gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: 'You are a knowledgeable AI assistant. Provide comprehensive, accurate, and well-structured responses.'
        },
        {
          role: 'user',
          content: searchPrompt
        }
      ],
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
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}