export async function getModels() {
  try {
    const response = await fetch('/config/models.json', {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.warn(`Failed to fetch models: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const config = await response.json();
    
    // Support both array format and object format with models property
    const models = Array.isArray(config) ? config : config.models;
    
    if (!Array.isArray(models)) {
      console.error('Invalid models configuration format');
      return getDefaultModels();
    }

    // Filter models based on enabled providers
    const enabledModels = models.filter(model => {
      if (!model.enabled) return false;
      
      // Check if provider is enabled (has API key)
      const providerEnabled = isProviderEnabled(model.providerId);
      if (!providerEnabled) {
        console.log(`Provider ${model.providerId} disabled (no API key)`);
      }
      
      return providerEnabled;
    });

    return enabledModels.length > 0 ? enabledModels : getDefaultModels();
    
  } catch (error) {
    console.error('Failed to load models:', error);
    return getDefaultModels();
  }
}

function isProviderEnabled(providerId) {
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

function getDefaultModels() {
  return [
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o mini',
      provider: 'OpenAI',
      providerId: 'openai',
      enabled: true,
      toolCallType: 'native'
    }
  ];
}

export function validateModel(model) {
  return (
    model &&
    typeof model === 'object' &&
    typeof model.id === 'string' &&
    typeof model.name === 'string' &&
    typeof model.provider === 'string' &&
    typeof model.providerId === 'string' &&
    typeof model.enabled === 'boolean'
  );
}