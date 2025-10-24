// AI SDK integration for Morphic capabilities
import { generateId } from 'ai';

// Mock API endpoints for standalone frontend mode
// In a real implementation, these would connect to your preferred AI provider APIs

class MorphicAI {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
    this.anthropicKey = process.env.REACT_APP_ANTHROPIC_API_KEY || '';
    this.googleKey = process.env.REACT_APP_GOOGLE_API_KEY || '';
    this.groqKey = process.env.REACT_APP_GROQ_API_KEY || '';
    this.deepseekKey = process.env.REACT_APP_DEEPSEEK_API_KEY || '';
    this.xaiKey = process.env.REACT_APP_XAI_API_KEY || '';
    this.tavilyKey = process.env.REACT_APP_TAVILY_API_KEY || '';
  }

  async chat(messages, model = 'gpt-4o-mini', searchResults = []) {
    try {
      // Prepare context with search results if available
      let systemPrompt = `You are AJ STUDIOZ AI, an intelligent assistant created by AJ STUDIOZ. You provide helpful, accurate, and detailed responses.`;
      
      if (searchResults && searchResults.length > 0) {
        const searchContext = searchResults.map(result => 
          `Title: ${result.title}\nURL: ${result.url}\nContent: ${result.content}`
        ).join('\n\n');
        
        systemPrompt += `\n\nHere is some recent search information that may be relevant to the user's query:\n\n${searchContext}\n\nUse this information to provide more accurate and up-to-date responses when relevant.`;
      }

      const requestMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      // Route to appropriate provider based on model
      if (model.includes('gpt') || model.includes('openai')) {
        return await this.callOpenAI(requestMessages, model);
      } else if (model.includes('claude') || model.includes('anthropic')) {
        return await this.callAnthropic(requestMessages, model);
      } else if (model.includes('gemini') || model.includes('google')) {
        return await this.callGoogle(requestMessages, model);
      } else if (model.includes('llama') || model.includes('groq')) {
        return await this.callGroq(requestMessages, model);
      } else if (model.includes('deepseek')) {
        return await this.callDeepSeek(requestMessages, model);
      } else if (model.includes('grok') || model.includes('xai')) {
        return await this.callXAI(requestMessages, model);
      }
      
      // Default to OpenAI
      return await this.callOpenAI(requestMessages, 'gpt-4o-mini');
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw error;
    }
  }

  async callOpenAI(messages, model) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model.includes('gpt-4o') ? 'gpt-4o' : 'gpt-4o-mini',
        messages,
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || 'No response generated',
      usage: data.usage
    };
  }

  async callAnthropic(messages, model) {
    if (!this.anthropicKey) {
      throw new Error('Anthropic API key not configured');
    }

    // Convert messages format for Anthropic
    const systemMessage = messages.find(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.anthropicKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model.includes('sonnet') ? 'claude-3-5-sonnet-20241022' : 'claude-3-5-haiku-20241022',
        max_tokens: 2000,
        system: systemMessage?.content || '',
        messages: conversationMessages
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.content[0]?.text || 'No response generated',
      usage: data.usage
    };
  }

  async callGoogle(messages, model) {
    if (!this.googleKey) {
      throw new Error('Google API key not configured');
    }

    // Implement Google Gemini API call
    // Note: This is a simplified implementation
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.googleKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: messages.filter(m => m.role !== 'system').map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        })),
        systemInstruction: messages.find(m => m.role === 'system')?.content
      })
    });

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.candidates[0]?.content?.parts[0]?.text || 'No response generated',
      usage: data.usageMetadata
    };
  }

  async callGroq(messages, model) {
    if (!this.groqKey) {
      throw new Error('Groq API key not configured');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages,
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || 'No response generated',
      usage: data.usage
    };
  }

  async callDeepSeek(messages, model) {
    if (!this.deepseekKey) {
      throw new Error('DeepSeek API key not configured');
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.deepseekKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || 'No response generated',
      usage: data.usage
    };
  }

  async callXAI(messages, model) {
    if (!this.xaiKey) {
      throw new Error('xAI API key not configured');
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.xaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages,
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`xAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || 'No response generated',
      usage: data.usage
    };
  }

  async search(query, provider = 'tavily') {
    try {
      if (provider === 'tavily' && this.tavilyKey) {
        return await this.searchTavily(query);
      }
      
      // Fallback to a simple web search or return empty results
      return {
        results: [],
        query
      };
    } catch (error) {
      console.error('Search Error:', error);
      return {
        results: [],
        query
      };
    }
  }

  async searchTavily(query) {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: this.tavilyKey,
        query,
        search_depth: 'basic',
        include_answer: false,
        include_images: false,
        include_raw_content: false,
        max_results: 5
      })
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      results: data.results || [],
      query
    };
  }

  async generateRelatedQuestions(messages, currentQuery) {
    try {
      const prompt = `Based on the conversation and the query "${currentQuery}", generate 3 related questions that the user might want to ask next. Return only the questions, one per line.`;
      
      const response = await this.chat([
        ...messages,
        { role: 'user', content: prompt }
      ], 'gpt-4o-mini');

      const questions = response.content
        .split('\n')
        .filter(q => q.trim() && q.includes('?'))
        .slice(0, 3);

      return questions;
    } catch (error) {
      console.error('Related questions error:', error);
      return [];
    }
  }
}

export default new MorphicAI();