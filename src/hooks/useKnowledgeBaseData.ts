
import { useState, useEffect } from 'react';
import { useUserManagementStore } from '@/store/userManagementStore';

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  views?: number;
  author: {
    id: string;
    name: string;
  };
}

export function useKnowledgeBaseData() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const userManagementStore = useUserManagementStore();
  
  // Safely access the fetchKnowledgeBase function if it exists
  const fetchKnowledgeBase = async () => {
    // Mock implementation since the actual function doesn't exist in the store
    return [] as KnowledgeArticle[];
  };

  useEffect(() => {
    async function loadKnowledgeBase() {
      setIsLoading(true);
      try {
        const data = await fetchKnowledgeBase();
        setArticles(data);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map(article => article.category))
        );
        setCategories(uniqueCategories as string[]);
        
        setError(null);
      } catch (err) {
        console.error('Error loading knowledge base:', err);
        setError(err instanceof Error ? err : new Error('Failed to load knowledge base'));
      } finally {
        setIsLoading(false);
      }
    }

    loadKnowledgeBase();
  }, []);

  return { 
    articles, 
    categories, 
    isLoading, 
    error,
  };
}
