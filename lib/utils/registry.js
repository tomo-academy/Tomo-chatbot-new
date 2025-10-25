import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import { openai } from '@ai-sdk/openai';
import { deepseek } from '@ai-sdk/deepseek';
import { xai } from '@ai-sdk/xai';

// Provider registry mapping
const providers = {
  openai,
  anthropic,
  google,
  groq,
  deepseek,
  xai
};

export function getModel(model) {
  try {
    const [provider, ...modelNameParts] = model?.split(':') ?? [];
    const modelName = modelNameParts.join(':');

    if (!provider || !modelName) {
      console.warn(`Invalid model format: ${model}. Expected format: 'provider:modelName'`);
      return openai('gpt-4o-mini'); // fallback
    }

    const selectedProvider = providers[provider];
    if (!selectedProvider) {
      console.warn(`Provider '${provider}' not found. Available providers:`, Object.keys(providers));
      return openai('gpt-4o-mini'); // fallback
    }

    return selectedProvider(modelName);
  } catch (error) {
    console.error('Error getting model:', error);
    return openai('gpt-4o-mini'); // fallback
  }
}

export function isProviderEnabled(providerId) {
  // Check if the provider has the required API key
  const providerConfigs = {
    openai: process.env.REACT_APP_OPENAI_API_KEY,
    anthropic: process.env.REACT_APP_ANTHROPIC_API_KEY,
    google: process.env.REACT_APP_GOOGLE_API_KEY,
    groq: process.env.REACT_APP_GROQ_API_KEY,
    deepseek: process.env.REACT_APP_DEEPSEEK_API_KEY,
    xai: process.env.REACT_APP_XAI_API_KEY
  };

  return Boolean(providerConfigs[providerId]);
}

export function getToolCallModel(model) {
  const [provider, ...modelNameParts] = model?.split(':') ?? [];
  const modelName = modelNameParts.join(':');
  
  switch (provider) {
    case 'deepseek':
      return getModel('deepseek:deepseek-chat');
    case 'groq':
      return getModel('groq:llama-3.1-8b-instant');
    case 'google':
      return getModel('google:gemini-2.0-flash');
    default:
      return getModel('openai:gpt-4o-mini');
  }
}

export function isToolCallSupported(model) {
  const [provider] = model?.split(':') ?? [];
  // Most providers support tool calling natively
  return ['openai', 'anthropic', 'google', 'groq', 'deepseek', 'xai'].includes(provider);
}

export function isReasoningModel(model) {
  return model?.includes('o1') || model?.includes('o3') || model?.includes('reasoning') || model?.includes('r1');
}