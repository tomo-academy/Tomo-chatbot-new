import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MorphicAI from "../lib/morphic-ai";
import ModelSelector from "../components/ModelSelector";
import InputContainer from "../components/InputContainer";
import Toast from "../components/Toast";
import "../styles/Common.css";
import "../styles/MorphicChat.css";

const sampleQuestions = [
  "What's the latest news in AI technology?",
  "Explain quantum computing in simple terms",
  "How to learn React.js effectively?", 
  "What are the benefits of renewable energy?",
  "Summarize the current crypto market trends",
  "Best practices for web development in 2024"
];

function Home({ isTouch }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [searchMode, setSearchMode] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Load models on component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        const loadedModels = await MorphicAI.loadModels();
        setModels(loadedModels);
        setSelectedModel(MorphicAI.getCurrentModel());
      } catch (error) {
        console.error('Failed to load models:', error);
        setToastMessage("Failed to load AI models");
        setShowToast(true);
      }
    };

    loadModels();
  }, []);

  // Handle error messages from location state
  useEffect(() => {
    if (location.state?.errorModal) {
      setToastMessage(location.state.errorModal);
      setShowToast(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Handle model selection
  const handleModelChange = useCallback((model) => {
    setSelectedModel(model);
    MorphicAI.setModel(model);
  }, []);

  // Handle search mode toggle
  const handleSearchModeToggle = useCallback(() => {
    const newSearchMode = !searchMode;
    setSearchMode(newSearchMode);
    MorphicAI.setSearchMode(newSearchMode);
  }, [searchMode]);

  const sendMessage = useCallback(
    async (message) => {
      if (!message.trim()) return;
      
      try {
        setIsLoading(true);
        
        // Generate a new conversation ID
        const conversationId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Navigate to chat page with initial message
        navigate(`/chat/${conversationId}`, {
          state: {
            initialMessage: message,
          },
          replace: false,
        });
      } catch (error) {
        setToastMessage("Failed to start new conversation");
        setShowToast(true);
        setIsLoading(false);
      }
    },
    [navigate]
  );

  const handleSampleQuestionClick = useCallback((question) => {
    setInputText(question);
  }, []);

  return (
    <div className="container">
      {/* Header with Model Selector */}
      <div className="home-header">
        <motion.div
          className="welcome-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="logo-container">
            <img 
              src="/aj logo.jpg" 
              alt="AJ STUDIOZ" 
              className="home-logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h1 className="welcome-title">AJ STUDIOZ AI</h1>
          <p className="welcome-subtitle">Your intelligent assistant for any question</p>
        </motion.div>

        <motion.div 
          className="controls-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
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
        </motion.div>
      </div>

      {/* Sample Questions */}
      <motion.div
        className="sample-questions"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3>Try asking about:</h3>
        <div className="questions-grid">
          {sampleQuestions.map((question, index) => (
            <motion.button
              key={index}
              className="sample-question"
              onClick={() => handleSampleQuestionClick(question)}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {question}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Input Container */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <InputContainer
          isTouch={isTouch}
          placeholder="Ask me anything..."
          extraClassName="main-input-container"
          inputText={inputText}
          setInputText={setInputText}
          isLoading={isLoading}
          onSend={sendMessage}
          onCancel={() => {}}
          uploadedFiles={[]}
          processFiles={() => {}}
          removeFile={() => {}}
          uploadingFiles={false}
        />
      </motion.div>

      <Toast
        type="error"
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default Home;