import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ModelSelector.css';

const ModelSelector = ({ selectedModel, onModelChange, models = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupedModels, setGroupedModels] = useState({});

  useEffect(() => {
    // Group models by provider
    const grouped = models.reduce((acc, model) => {
      if (!acc[model.provider]) {
        acc[model.provider] = [];
      }
      acc[model.provider].push(model);
      return acc;
    }, {});
    setGroupedModels(grouped);
  }, [models]);

  const handleModelSelect = (model) => {
    onModelChange(model);
    setIsOpen(false);
  };

  const getProviderIcon = (providerId) => {
    const icons = {
      openai: '🤖',
      anthropic: '🎭',
      google: '🔍',
      groq: '⚡',
      deepseek: '🧠',
      xai: '✨'
    };
    return icons[providerId] || '🤖';
  };

  return (
    <div className="model-selector">
      <button
        className="model-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="selected-model">
          <span className="model-icon">
            {getProviderIcon(selectedModel?.providerId)}
          </span>
          <span className="model-name">
            {selectedModel?.name || 'Select Model'}
          </span>
        </div>
        <span className={`chevron ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="model-selector-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {Object.entries(groupedModels).map(([provider, providerModels]) => (
              <div key={provider} className="model-group">
                <div className="model-group-header">{provider}</div>
                {providerModels.map((model) => (
                  <button
                    key={model.id}
                    className={`model-option ${
                      selectedModel?.id === model.id ? 'selected' : ''
                    }`}
                    onClick={() => handleModelSelect(model)}
                  >
                    <span className="model-icon">
                      {getProviderIcon(model.providerId)}
                    </span>
                    <span className="model-name">{model.name}</span>
                    {selectedModel?.id === model.id && (
                      <span className="check-mark">✓</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="model-selector-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ModelSelector;