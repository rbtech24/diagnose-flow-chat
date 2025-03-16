
import { useAPIConfigStore } from "@/store/apiConfigStore";

export const getGroxConfig = () => {
  const { configs } = useAPIConfigStore.getState();
  return configs.grox;
};

export async function analyzeProblem(
  description: string,
  deviceType: string,
  symptoms: string[],
  options: {
    includePartsRecommendation?: boolean;
    detailedDiagnosis?: boolean;
  } = {}
) {
  const config = getGroxConfig();
  
  if (!config.enabled || !config.apiKey) {
    throw new Error('Grox is not configured');
  }
  
  const { includePartsRecommendation = true, detailedDiagnosis = true } = options;
  
  try {
    // In a real implementation, this would call a Supabase Edge Function
    const response = await fetch('/api/grox/analyze-problem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        deviceType,
        symptoms,
        includePartsRecommendation,
        detailedDiagnosis
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error analyzing problem with Grox:', error);
    throw new Error('Failed to analyze problem');
  }
}

export async function getRepairSteps(
  deviceType: string,
  issue: string,
  options: {
    skillLevel?: 'beginner' | 'intermediate' | 'advanced';
    includeImages?: boolean;
  } = {}
) {
  const config = getGroxConfig();
  
  if (!config.enabled || !config.apiKey) {
    throw new Error('Grox is not configured');
  }
  
  const { skillLevel = 'intermediate', includeImages = true } = options;
  
  try {
    // In a real implementation, this would call a Supabase Edge Function
    const response = await fetch('/api/grox/repair-steps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceType,
        issue,
        skillLevel,
        includeImages
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error getting repair steps with Grox:', error);
    throw new Error('Failed to get repair steps');
  }
}
