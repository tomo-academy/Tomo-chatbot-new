// Enhanced chat component with Morphic AI capabilities
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const MorphicChat = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const messagesEndRef = useRef(null);

  // AI Models available
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const availableModels = [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
    { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', provider: 'Anthropic' },
    { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', provider: 'Google' },
    { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B', provider: 'Groq' },
    { id: 'deepseek-chat', name: 'DeepSeek Chat', provider: 'DeepSeek' },
    { id: 'grok-beta', name: 'Grok Beta', provider: 'xAI' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = async (query) => {
    try {
      // This would integrate with search providers like Tavily, SearXNG, etc.
      const response = await axios.post('/api/search', {
        query,
        provider: 'tavily' // or other providers
      });
      setSearchResults(response.data.results);
      return response.data.results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // First, perform search if needed
      const searchResults = await handleSearch(input);
      
      // Then send to AI with search context
      const response = await axios.post('/api/chat', {
        messages: [...messages, userMessage],
        model: selectedModel,
        searchResults,
        conversationId
      });

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.content,
        searchResults: response.data.searchResults,
        relatedQuestions: response.data.relatedQuestions,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRelatedQuestion = (question) => {
    setInput(question);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      maxWidth: '100%',
      margin: '0 auto'
    }}>
      {/* Model Selector */}
      <div style={{ 
        padding: '1rem',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>
          AI Model:
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          style={{
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}
        >
          {availableModels.map(model => (
            <option key={model.id} value={model.id}>
              {model.name} ({model.provider})
            </option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#6b7280'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Welcome to AJ STUDIOZ AI
            </h2>
            <p>Ask me anything and I'll provide intelligent, helpful responses with web search capabilities.</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: message.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '0.75rem 1rem',
              borderRadius: '1rem',
              backgroundColor: message.role === 'user' ? '#3b82f6' : '#f3f4f6',
              color: message.role === 'user' ? 'white' : '#1f2937',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </div>
              
              {/* Search Results */}
              {message.searchResults && message.searchResults.length > 0 && (
                <div style={{ 
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Search Results:
                  </h4>
                  {message.searchResults.slice(0, 3).map((result, idx) => (
                    <div key={idx} style={{ marginBottom: '0.5rem' }}>
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: '#3b82f6', 
                          textDecoration: 'none',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}
                      >
                        {result.title}
                      </a>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0' }}>
                        {result.content?.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Related Questions */}
              {message.relatedQuestions && message.relatedQuestions.length > 0 && (
                <div style={{ 
                  marginTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                    Related Questions:
                  </h4>
                  {message.relatedQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRelatedQuestion(question)}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        backgroundColor: 'white',
                        color: '#374151',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#9ca3af', 
              marginTop: '0.25rem',
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#6b7280'
          }}>
            <div style={{
              width: '1rem',
              height: '1rem',
              border: '2px solid #e5e7eb',
              borderTop: '2px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Thinking...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ 
        padding: '1rem',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: input.trim() && !isLoading ? '#3b82f6' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s'
          }}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default MorphicChat;