
import { useAPIConfigStore } from "@/store/apiConfigStore";

export const getClaudeConfig = () => {
  const { configs } = useAPIConfigStore.getState();
  return configs.claude;
};

export async function generateWithClaude(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  const config = getClaudeConfig();
  
  if (!config.enabled || !config.apiKey) {
    throw new Error('Claude AI is not configured');
  }
  
  const { model = 'claude-3-opus-20240229', temperature = 0.7, maxTokens = 1000 } = options;
  
  try {
    // In a real implementation, this would call a Supabase Edge Function
    const response = await fetch('/api/claude/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model,
        temperature,
        maxTokens
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error generating with Claude:', error);
    throw new Error('Failed to generate with Claude');
  }
}

export async function analyzeDocumentWithClaude(
  documentUrl: string,
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  const config = getClaudeConfig();
  
  if (!config.enabled || !config.apiKey) {
    throw new Error('Claude AI is not configured');
  }
  
  const { model = 'claude-3-opus-20240229', temperature = 0.7, maxTokens = 1000 } = options;
  
  try {
    // In a real implementation, this would call a Supabase Edge Function
    const response = await fetch('/api/claude/analyze-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentUrl,
        prompt,
        model,
        temperature,
        maxTokens
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error analyzing document with Claude:', error);
    throw new Error('Failed to analyze document');
  }
}
