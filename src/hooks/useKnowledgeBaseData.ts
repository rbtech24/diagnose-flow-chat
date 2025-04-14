
import { useState, useEffect } from 'react';
import { useUserManagementStore } from '@/store/userManagementStore';

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
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
  const { fetchKnowledgeBase } = useUserManagementStore();

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
        setCategories(uniqueCategories);
        
        setError(null);
      } catch (err) {
        console.error('Error loading knowledge base:', err);
        setError(err instanceof Error ? err : new Error('Failed to load knowledge base'));
      } finally {
        setIsLoading(false);
      }
    }

    loadKnowledgeBase();
  }, [fetchKnowledgeBase]);

  return { 
    articles, 
    categories, 
    isLoading, 
    error,
  };
}
