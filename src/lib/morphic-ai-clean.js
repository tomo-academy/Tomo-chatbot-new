// Serverless Morphic AI Implementation
// Based on https://github.com/tomo-academy/morphic-ai-answer-engine-generative-ui

class MorphicAI {
  constructor() {
    this.models = [];
    this.currentModel = null;
    this.searchMode = true;
    this.apiKeys = {
      openai: process.env.REACT_APP_OPENAI_API_KEY,
      anthropic: process.env.REACT_APP_ANTHROPIC_API_KEY,
      google: process.env.REACT_APP_GOOGLE_API_KEY,
      groq: process.env.REACT_APP_GROQ_API_KEY,
      deepseek: process.env.REACT_APP_DEEPSEEK_API_KEY,
      xai: process.env.REACT_APP_XAI_API_KEY,
      tavily: process.env.REACT_APP_TAVILY_API_KEY
    };
  }

  async loadModels() {
    try {
      // Load models from public/config/models.json
      const response = await fetch('/config/models.json');
      if (!response.ok) {
        throw new Error(`Failed to load models: ${response.status}`);
      }
      
      const data = await response.json();
      // Support both array format and object format with models property
      const allModels = Array.isArray(data) ? data : (data.models || []);
      
      // Filter models based on enabled providers (those with API keys)
      this.models = allModels.filter(model => {
        if (!model.enabled) return false;
        return this.isProviderEnabled(model.providerId);
      });

      // Set default model if none selected
      if (!this.currentModel && this.models.length > 0) {
        this.currentModel = this.models.find(m => m.id === 'gpt-4o-mini') || 
                           this.models.find(m => m.providerId === 'openai') || 
                           this.models[0];
      }
      
      return this.models;
    } catch (error) {
      console.error('Failed to load models:', error);
      // Return default model as fallback
      this.models = [{
        id: 'gpt-4o-mini',
        name: 'GPT-4o mini',
        provider: 'OpenAI',
        providerId: 'openai',
        enabled: true,
        toolCallType: 'native'
      }];
      this.currentModel = this.models[0];
      return this.models;
    }
  }

  isProviderEnabled(providerId) {
    return Boolean(this.apiKeys[providerId]);
  }

  setModel(model) {
    this.currentModel = model;
  }

  setSearchMode(enabled) {
    this.searchMode = enabled;
  }

  async chat(messages, options = {}) {
    const {
      onUpdate = () => {},
      onComplete = () => {},
      onError = () => {},
      onSearchResults = () => {},
      signal
    } = options;

    try {
      let searchResults = null;

      // Step 1: Perform search if enabled and query seems to need current information
      if (this.searchMode && this.shouldSearch(messages)) {
        const lastUserMessage = messages.filter(m => m.role === 'user').pop();
        if (lastUserMessage) {
          try {
            onUpdate('🔍 Searching for current information...\n\n');
            searchResults = await this.performSearch(lastUserMessage.content);
            if (searchResults && searchResults.results.length > 0) {
              onSearchResults(searchResults);
              onUpdate('🔍 Search completed. Analyzing results...\n\n');
            }
          } catch (searchError) {
            console.warn('Search failed:', searchError);
            onUpdate('⚠️ Search unavailable, proceeding with knowledge...\n\n');
          }
        }
      }

      // Step 2: Generate AI response with search context
      await this.generateResponse(messages, searchResults, {
        onUpdate,
        onComplete,
        onError,
        signal
      });

    } catch (error) {
      console.error('Chat error:', error);
      onError(error.message);
    }
  }

  shouldSearch(messages) {
    const lastMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastMessage) return false;

    const content = lastMessage.content.toLowerCase();
    
    // Keywords that suggest need for current information
    const searchKeywords = [
      'latest', 'recent', 'current', 'today', 'now', 'this year', '2024', '2025',
      'news', 'update', 'what happened', 'trending', 'price', 'stock',
      'weather', 'status', 'release', 'announcement', 'breaking'
    ];

    return searchKeywords.some(keyword => content.includes(keyword)) || 
           content.includes('?'); // Questions often benefit from search
  }

  async performSearch(query) {
    if (!this.apiKeys.tavily) {
      throw new Error('Tavily API key not configured');
    }

    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: this.apiKeys.tavily,
          query: query,
          search_depth: 'basic',
          include_answer: false,
          include_images: true,
          include_image_descriptions: true,
          max_results: 5
        })
      });

      if (!response.ok) {
        throw new Error(`Tavily API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        results: data.results || [],
        query: data.query || query,
        images: data.images || []
      };
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  async generateResponse(messages, searchResults, options) {
    const { onUpdate, onComplete, onError, signal } = options;

    // Prepare system prompt with search context
    let systemPrompt = `You are AJ STUDIOZ AI, an intelligent assistant created by AJ STUDIOZ. You provide helpful, accurate, and detailed responses.

Always follow these guidelines:
1. Provide comprehensive and well-structured responses
2. Use markdown formatting for better readability
3. When citing sources, use the format [number](url) 
4. Be conversational but professional
5. If you're uncertain about recent information, acknowledge it`;

    if (searchResults && searchResults.results.length > 0) {
      const searchContext = searchResults.results.map((result, index) => 
        `[${index + 1}] ${result.title}\nURL: ${result.url}\nContent: ${result.content}`
      ).join('\n\n');
      
      systemPrompt += `\n\nCurrent search results for reference:\n\n${searchContext}\n\nUse this information to provide accurate, up-to-date responses. Always cite sources using [number](url) format when referencing the search results.`;
    }

    const requestMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Route to appropriate provider
    const provider = this.currentModel?.providerId || 'openai';
    
    switch (provider) {
      case 'openai':
        return await this.callOpenAI(requestMessages, options);
      case 'anthropic':
        return await this.callAnthropic(requestMessages, options);
      case 'google':
        return await this.callGoogle(requestMessages, options);
      case 'groq':
        return await this.callGroq(requestMessages, options);
      case 'deepseek':
        return await this.callDeepSeek(requestMessages, options);
      case 'xai':
        return await this.callXAI(requestMessages, options);
      default:
        return await this.callOpenAI(requestMessages, options);
    }
  }

  async callOpenAI(messages, options) {
    const { onUpdate, onComplete, onError, signal } = options;
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKeys.openai}`
        },
        body: JSON.stringify({
          model: this.currentModel?.id || 'gpt-4o-mini',
          messages: messages,
          stream: true,
          temperature: 0.7,
          max_tokens: 4000
        }),
        signal
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      return this.handleStreamResponse(response, { onUpdate, onComplete, onError });
    } catch (error) {
      onError(error.message);
    }
  }

  async callAnthropic(messages, options) {
    const { onUpdate, onComplete, onError, signal } = options;
    
    try {
      // Convert messages for Anthropic format
      const systemMessage = messages.find(m => m.role === 'system');
      const userMessages = messages.filter(m => m.role !== 'system');
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKeys.anthropic,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.currentModel?.id || 'claude-3-haiku-20240307',
          messages: userMessages,
          system: systemMessage?.content,
          stream: true,
          max_tokens: 4000
        }),
        signal
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      return this.handleAnthropicStream(response, { onUpdate, onComplete, onError });
    } catch (error) {
      onError(error.message);
    }
  }

  async callGoogle(messages, options) {
    const { onUpdate, onComplete, onError, signal } = options;
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.currentModel?.id || 'gemini-1.5-flash'}:streamGenerateContent?key=${this.apiKeys.google}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: this.convertToGeminiFormat(messages),
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4000
          }
        }),
        signal
      });

      if (!response.ok) {
        throw new Error(`Google API error: ${response.status}`);
      }

      return this.handleGoogleStream(response, { onUpdate, onComplete, onError });
    } catch (error) {
      onError(error.message);
    }
  }

  async callGroq(messages, options) {
    const { onUpdate, onComplete, onError, signal } = options;
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKeys.groq}`
        },
        body: JSON.stringify({
          model: this.currentModel?.id || 'llama-3.1-70b-versatile',
          messages: messages,
          stream: true,
          temperature: 0.7,
          max_tokens: 4000
        }),
        signal
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      return this.handleStreamResponse(response, { onUpdate, onComplete, onError });
    } catch (error) {
      onError(error.message);
    }
  }

  async callDeepSeek(messages, options) {
    const { onUpdate, onComplete, onError, signal } = options;
    
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKeys.deepseek}`
        },
        body: JSON.stringify({
          model: this.currentModel?.id || 'deepseek-chat',
          messages: messages,
          stream: true,
          temperature: 0.7,
          max_tokens: 4000
        }),
        signal
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      return this.handleStreamResponse(response, { onUpdate, onComplete, onError });
    } catch (error) {
      onError(error.message);
    }
  }

  async callXAI(messages, options) {
    const { onUpdate, onComplete, onError, signal } = options;
    
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKeys.xai}`
        },
        body: JSON.stringify({
          model: this.currentModel?.id || 'grok-beta',
          messages: messages,
          stream: true,
          temperature: 0.7,
          max_tokens: 4000
        }),
        signal
      });

      if (!response.ok) {
        throw new Error(`xAI API error: ${response.status}`);
      }

      return this.handleStreamResponse(response, { onUpdate, onComplete, onError });
    } catch (error) {
      onError(error.message);
    }
  }

  async handleStreamResponse(response, { onUpdate, onComplete, onError }) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete(fullResponse);
              return fullResponse;
            }

            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                fullResponse += content;
                onUpdate(fullResponse);
              }
            } catch (e) {
              // Ignore malformed JSON chunks
            }
          }
        }
      }

      onComplete(fullResponse);
      return fullResponse;
    } catch (error) {
      onError(error.message);
    }
  }

  async handleAnthropicStream(response, { onUpdate, onComplete, onError }) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            try {
              const json = JSON.parse(data);
              if (json.type === 'content_block_delta') {
                const content = json.delta?.text;
                if (content) {
                  fullResponse += content;
                  onUpdate(fullResponse);
                }
              }
            } catch (e) {
              // Ignore malformed JSON chunks
            }
          }
        }
      }

      onComplete(fullResponse);
      return fullResponse;
    } catch (error) {
      onError(error.message);
    }
  }

  async handleGoogleStream(response, { onUpdate, onComplete, onError }) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.trim()) {
            try {
              const json = JSON.parse(line);
              const content = json.candidates?.[0]?.content?.parts?.[0]?.text;
              if (content) {
                fullResponse += content;
                onUpdate(fullResponse);
              }
            } catch (e) {
              // Ignore malformed JSON chunks
            }
          }
        }
      }

      onComplete(fullResponse);
      return fullResponse;
    } catch (error) {
      onError(error.message);
    }
  }

  convertToGeminiFormat(messages) {
    return messages
      .filter(m => m.role !== 'system') // Gemini doesn't support system messages in the same way
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
  }

  // Generate related questions based on conversation context
  generateRelatedQuestions(messages, searchResults) {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) return [];

    const topic = this.extractTopic(lastUserMessage.content);
    
    // Generate contextual follow-up questions
    const relatedQuestions = [
      `What are the latest developments in ${topic}?`,
      `How does ${topic} compare to alternatives?`,
      `What are the benefits and drawbacks of ${topic}?`,
      `What should I know about ${topic} in 2024?`
    ];

    return relatedQuestions.slice(0, 3); // Return 3 related questions
  }

  extractTopic(text) {
    // Simple topic extraction - in a real implementation, this could be more sophisticated
    const words = text.toLowerCase().split(' ');
    const stopWords = ['what', 'how', 'why', 'when', 'where', 'is', 'are', 'the', 'a', 'an'];
    const meaningfulWords = words.filter(word => 
      word.length > 3 && !stopWords.includes(word)
    );
    
    return meaningfulWords.slice(0, 2).join(' ') || 'this topic';
  }

  // Search functionality
  async search(query) {
    return await this.performSearch(query);
  }

  // Get available models
  getModels() {
    return this.models;
  }

  // Get current model
  getCurrentModel() {
    return this.currentModel;
  }

  // Check if search is enabled
  isSearchEnabled() {
    return this.searchMode && Boolean(this.apiKeys.tavily);
  }

  // Format messages for display
  formatMessages(messages) {
    return messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp || new Date().toISOString(),
      id: msg.id || Math.random().toString(36).substr(2, 9)
    }));
  }

  // Get provider status
  getProviderStatus() {
    const providers = ['openai', 'anthropic', 'google', 'groq', 'deepseek', 'xai'];
    return providers.reduce((status, provider) => {
      status[provider] = {
        enabled: this.isProviderEnabled(provider),
        hasApiKey: Boolean(this.apiKeys[provider])
      };
      return status;
    }, {});
  }
}

// Create and export singleton instance
const morphicAI = new MorphicAI();

export default morphicAI;

// Named exports for convenience
export { MorphicAI };