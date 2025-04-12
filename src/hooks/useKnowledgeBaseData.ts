
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  author_id?: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  company_id?: string;
  views: number;
}

export function useKnowledgeBaseData() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching knowledge base articles:', error);
      toast({
        description: "Failed to load knowledge base articles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createArticle = async (articleData: Omit<KnowledgeArticle, 'id' | 'created_at' | 'updated_at' | 'views'>) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert([{
          ...articleData,
          author_id: userData.user?.id,
          views: 0
        }])
        .select()
        .single();

      if (error) throw error;
      
      setArticles(prev => [data, ...prev]);
      
      toast({
        description: "Knowledge article created successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating knowledge article:', error);
      toast({
        description: "Failed to create knowledge article",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateArticle = async (id: string, articleData: Partial<KnowledgeArticle>) => {
    try {
      // Convert Date objects to strings if necessary
      const formattedData = Object.entries(articleData).reduce((acc, [key, value]) => {
        acc[key] = value instanceof Date ? value.toISOString() : value;
        return acc;
      }, {} as Record<string, any>);
      
      const { data, error } = await supabase
        .from('knowledge_base')
        .update(formattedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setArticles(prev => prev.map(article => article.id === id ? data : article));
      
      toast({
        description: "Knowledge article updated successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating knowledge article:', error);
      toast({
        description: "Failed to update knowledge article",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setArticles(prev => prev.filter(article => article.id !== id));
      
      toast({
        description: "Knowledge article deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting knowledge article:', error);
      toast({
        description: "Failed to delete knowledge article",
        variant: "destructive",
      });
      return false;
    }
  };

  const incrementArticleViews = async (id: string) => {
    try {
      const { data, error } = await supabase
        .rpc('increment', { 
          row_id: id,
          field_name: 'views',
          table_name: 'knowledge_base'
        });

      if (error) throw error;
      
      // Update article views in local state
      setArticles(prev => prev.map(article => 
        article.id === id ? { ...article, views: article.views + 1 } : article
      ));
      
      return data;
    } catch (error) {
      console.error('Error incrementing article views:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    isLoading,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    incrementArticleViews
  };
}
