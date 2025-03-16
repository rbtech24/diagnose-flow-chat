
import { useAPIConfigStore } from "@/store/apiConfigStore";

export const getOpenAIConfig = () => {
  const { configs } = useAPIConfigStore.getState();
  return configs.openai;
};

export async function generateText(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  const config = getOpenAIConfig();
  
  if (!config.enabled || !config.apiKey) {
    throw new Error('OpenAI is not configured');
  }
  
  const { model = 'gpt-4o-mini', temperature = 0.7, maxTokens = 500 } = options;
  
  try {
    // In a real implementation, this would call a Supabase Edge Function
    const response = await fetch('/api/openai/generate-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model,
        temperature,
        maxTokens,
        organization: config.additionalSettings?.organization || undefined
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error generating text with OpenAI:', error);
    throw new Error('Failed to generate text');
  }
}

export async function analyzeImage(
  imageUrl: string,
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  const config = getOpenAIConfig();
  
  if (!config.enabled || !config.apiKey) {
    throw new Error('OpenAI is not configured');
  }
  
  const { model = 'gpt-4o', temperature = 0.7, maxTokens = 500 } = options;
  
  try {
    // In a real implementation, this would call a Supabase Edge Function
    const response = await fetch('/api/openai/analyze-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl,
        prompt,
        model,
        temperature,
        maxTokens,
        organization: config.additionalSettings?.organization || undefined
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error analyzing image with OpenAI:', error);
    throw new Error('Failed to analyze image');
  }
}
