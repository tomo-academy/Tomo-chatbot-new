import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import morphicAI from "../lib/morphic-ai";
import ModelSelector from "../components/ModelSelector";
import SearchResults from "../components/SearchResults";
import Message from "../components/Message";
import InputContainer from "../components/InputContainer";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import "../styles/Common.css";

function Chat({ isTouch, chatMessageRef }) {
  const { conversation_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [searchMode, setSearchMode] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const abortControllerRef = useRef(null);

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Load models on component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        const loadedModels = await morphicAI.loadModels();
        setModels(loadedModels);
        setSelectedModel(morphicAI.getCurrentModel());
      } catch (error) {
        console.error('Failed to load models:', error);
        setToastMessage("Failed to load AI models");
        setShowToast(true);
      }
    };

    loadModels();
  }, []);

  // Handle model selection
  const handleModelChange = useCallback((model) => {
    setSelectedModel(model);
    morphicAI.setModel(model);
  }, []);

  // Handle search mode toggle
  const handleSearchModeToggle = useCallback(() => {
    const newSearchMode = !searchMode;
    setSearchMode(newSearchMode);
    morphicAI.setSearchMode(newSearchMode);
  }, [searchMode]);

  const sendMessage = useCallback(
    async (message) => {
      if (!message.trim()) {
        setToastMessage("Please enter a message.");
        setShowToast(true);
        return;
      }

      const userMessage = { 
        role: "user", 
        content: message,
        id: generateMessageId()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputText("");
      setIsLoading(true);
      setSearchResults(null);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      let assistantMessage = "";
      let currentSearchResults = null;

      const assistantMessageObj = {
        role: "assistant",
        content: "",
        id: generateMessageId(),
        isComplete: false
      };

      setMessages(prev => [...prev, assistantMessageObj]);

      try {

        await morphicAI.chat([...messages, userMessage], {
          onUpdate: (content) => {
            assistantMessage = content;
            setMessages(prev => 
              prev.map(msg => 
                msg.id === assistantMessageObj.id 
                  ? { ...msg, content: assistantMessage, isComplete: false }
                  : msg
              )
            );
          },
          onSearchResults: (results) => {
            currentSearchResults = results;
            setSearchResults(results);
          },
          onComplete: (content) => {
            assistantMessage = content;
            setMessages(prev => 
              prev.map(msg => 
                msg.id === assistantMessageObj.id 
                  ? { ...msg, content: assistantMessage, isComplete: true }
                  : msg
              )
            );
            
            // Generate related questions
            if (searchMode && currentSearchResults) {
              morphicAI.generateRelatedQuestions([...messages, userMessage], message)
                .then(questions => {
                  if (questions.length > 0) {
                    setRelatedQuestions(questions);
                  }
                })
                .catch(err => console.error('Failed to generate related questions:', err));
            }
          },
          onError: (error) => {
            setToastMessage(`Error: ${error}`);
            setShowToast(true);
          },
          signal: controller.signal
        });

      } catch (error) {
        if (error.name === "AbortError") return;
        
        setToastMessage("Failed to send message: " + error.message);
        setShowToast(true);
        
        // Remove the incomplete assistant message
        setMessages(prev => prev.filter(msg => msg.id !== assistantMessageObj.id));
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, searchMode]
  );

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const handleRelatedQuestionClick = useCallback((question) => {
    setInputText(question);
    setRelatedQuestions([]);
  }, []);

  // Handle initial message from location state
  useEffect(() => {
    if (location.state?.initialMessage && messages.length === 0) {
      const initialMessage = location.state.initialMessage;
      window.history.replaceState({}, '', location.pathname);
      sendMessage(initialMessage);
    }
  }, [location.state, messages.length, sendMessage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatMessageRef.current) {
      chatMessageRef.current.scrollTop = chatMessageRef.current.scrollHeight;
    }
  }, [messages, chatMessageRef]);

  return (
    <div className="container">
      {/* Model Selector and Search Toggle */}
      <div className="chat-header">
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          models={models}
        />
        <button
          className={`search-toggle ${searchMode ? 'active' : ''}`}
          onClick={handleSearchModeToggle}
          title={`Search mode: ${searchMode ? 'ON' : 'OFF'}`}
        >
          🔍 Search {searchMode ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="chat-messages" ref={chatMessageRef} style={{ scrollbarGutter: "stable" }}>
        {messages.map((msg, idx) => (
          <Message
            key={msg.id}
            messageIndex={idx}
            role={msg.role}
            content={msg.content}
            isComplete={msg.isComplete}
            isTouch={isTouch}
            isLoading={isLoading}
            isLastMessage={idx === messages.length - 1}
            shouldRender={true}
          />
        ))}

        {/* Search Results */}
        {searchResults && (
          <SearchResults 
            results={searchResults.results}
            query={searchResults.query}
            images={searchResults.images}
          />
        )}

        {/* Related Questions */}
        {relatedQuestions.length > 0 && (
          <motion.div
            className="related-questions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4>Related Questions:</h4>
            {relatedQuestions.map((question, index) => (
              <button
                key={index}
                className="related-question"
                onClick={() => handleRelatedQuestionClick(question)}
              >
                {question}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <InputContainer
        isTouch={isTouch}
        placeholder="Ask me anything..."
        inputText={inputText}
        setInputText={setInputText}
        isLoading={isLoading}
        onSend={sendMessage}
        onCancel={cancelRequest}
        uploadedFiles={[]}
        processFiles={() => {}}
        removeFile={() => {}}
        uploadingFiles={false}
      />

      <Toast
        type="error"
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default Chat;