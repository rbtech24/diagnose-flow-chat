
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { convertSupabaseDates, formatDateForSupabase, safeParseJsonArray } from "@/utils/dateUtils";

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category?: string;
  is_public: boolean;
  tags: string[];
  views: number;
  author_id?: string;
  company_id?: string;
  created_at: Date;
  updated_at: Date;
}

export function useKnowledgeArticles() {
  const [isLoading, setIsLoading] = useState(false);

  const getArticle = async (id: string): Promise<KnowledgeArticle | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (!data) return null;
      
      // Transform tags
      const tagsArray = Array.isArray(data.tags) 
        ? data.tags 
        : typeof data.tags === 'string'
          ? safeParseJsonArray(data.tags)
          : [];
      
      // Convert dates
      return {
        ...data,
        tags: tagsArray,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error fetching knowledge article:', error);
      toast({
        title: "Error",
        description: "Failed to fetch knowledge article",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateArticle = async (id: string, articleData: Partial<KnowledgeArticle>) => {
    try {
      // Format date fields
      const formattedData: Record<string, any> = {};
      
      Object.entries(articleData).forEach(([key, value]) => {
        if (key === 'created_at' || key === 'updated_at') {
          if (value instanceof Date) {
            formattedData[key] = formatDateForSupabase(value);
          }
        } else if (key === 'tags' && Array.isArray(value)) {
          formattedData[key] = value;
        } else {
          formattedData[key] = value;
        }
      });
      
      const { data, error } = await supabase
        .from('knowledge_base')
        .update(formattedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Transform data
      const tagsArray = Array.isArray(data.tags) 
        ? data.tags 
        : typeof data.tags === 'string'
          ? safeParseJsonArray(data.tags)
          : [];
      
      const formattedResult = {
        ...data,
        tags: tagsArray,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };
      
      toast({
        title: "Success",
        description: "Knowledge article updated successfully",
      });
      
      return formattedResult;
    } catch (error) {
      console.error('Error updating knowledge article:', error);
      toast({
        title: "Error",
        description: "Failed to update knowledge article",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    isLoading,
    getArticle,
    updateArticle
  };
}
