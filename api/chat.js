import { streamText } from 'ai';
import { researcher } from '../lib/agents/researcher.js';
import { isProviderEnabled } from '../lib/utils/registry.js';

const DEFAULT_MODEL = {
  id: 'gpt-4o-mini',
  name: 'GPT-4o mini',
  provider: 'OpenAI',
  providerId: 'openai',
  enabled: true,
  toolCallType: 'native'
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model: selectedModel, searchMode } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages are required and must be an array' });
    }

    // Use selected model or default
    let modelToUse = selectedModel || DEFAULT_MODEL;
    
    // Validate that the provider is enabled
    if (!isProviderEnabled(modelToUse.providerId) || modelToUse.enabled === false) {
      console.warn(`Provider ${modelToUse.providerId} is not enabled, using default`);
      modelToUse = DEFAULT_MODEL;
    }

    // Create the model string in format provider:modelId
    const modelString = `${modelToUse.providerId}:${modelToUse.id}`;
    
    console.log(`Using model: ${modelString}, Search mode: ${searchMode}`);

    // Check if provider supports tool calling
    const supportsToolCalling = modelToUse.toolCallType === 'native';

    if (supportsToolCalling) {
      // Use streamText with tools for native tool calling
      const result = researcher({
        messages,
        model: modelString,
        searchMode: searchMode || false
      });

      const stream = await streamText(result);
      
      // Set headers for streaming
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });

      // Stream the response
      for await (const chunk of stream.textStream) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }
      
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      
    } else {
      // For models without native tool calling, use basic text generation
      const result = researcher({
        messages,
        model: modelString,
        searchMode: false // Disable search for non-tool-calling models
      });

      const stream = await streamText(result);
      
      // Set headers for streaming
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });

      // Stream the response
      for await (const chunk of stream.textStream) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }
      
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    }

  } catch (error) {
    console.error('Chat API error:', error);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  }
}