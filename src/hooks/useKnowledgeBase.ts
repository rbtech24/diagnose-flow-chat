
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { KnowledgeArticle } from '@/types/knowledge';

export function useKnowledgeBase() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: articles, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return articles;
    } catch (err) {
      const error = err as Error;
      setError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createArticle = async (article: Omit<KnowledgeArticle, 'id' | 'created_at' | 'updated_at' | 'views'>) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('knowledge_base')
        .insert([article])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Article created successfully",
      });

      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Error",
        description: "Failed to create article",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const searchArticles = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: articles, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .textSearch('title', query)
        .order('views', { ascending: false });

      if (error) throw error;

      return articles;
    } catch (err) {
      const error = err as Error;
      setError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getArticles,
    createArticle,
    searchArticles,
    isLoading,
    error
  };
}
