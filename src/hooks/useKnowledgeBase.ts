
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  categoryId?: string;
  tags: string[];
  views: number;
  isPublic: boolean;
  authorId: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface KnowledgeCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  companyId: string;
}

export function useKnowledgeBase() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchKnowledgeData();
  }, []);

  const fetchKnowledgeData = async () => {
    try {
      setIsLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        setIsLoading(false);
        return;
      }

      // Get user's company ID
      const { data: technicianData } = await supabase
        .from('technicians')
        .select('company_id')
        .eq('id', userData.user.id)
        .single();

      if (!technicianData?.company_id) {
        setIsLoading(false);
        return;
      }

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('knowledge_categories')
        .select('*')
        .eq('company_id', technicianData.company_id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (categoriesError) {
        console.error('Error fetching knowledge categories:', categoriesError);
      }

      // Fetch articles
      const { data: articlesData, error: articlesError } = await supabase
        .from('knowledge_base')
        .select(`
          *,
          knowledge_categories(name)
        `)
        .eq('company_id', technicianData.company_id)
        .order('created_at', { ascending: false });

      if (articlesError) {
        console.error('Error fetching knowledge articles:', articlesError);
      }

      // Transform categories
      const transformedCategories: KnowledgeCategory[] = (categoriesData || []).map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        parentId: cat.parent_id,
        sortOrder: cat.sort_order,
        isActive: cat.is_active,
        companyId: cat.company_id
      }));

      // Transform articles
      const transformedArticles: KnowledgeArticle[] = (articlesData || []).map(article => ({
        id: article.id,
        title: article.title,
        content: article.content,
        category: article.knowledge_categories?.name || article.category || 'General',
        categoryId: article.category_id,
        tags: article.tags || [],
        views: article.views || 0,
        isPublic: article.is_public || false,
        authorId: article.author_id,
        companyId: article.company_id,
        createdAt: new Date(article.created_at),
        updatedAt: new Date(article.updated_at)
      }));

      setCategories(transformedCategories);
      setArticles(transformedArticles);

    } catch (error) {
      console.error('Error fetching knowledge base data:', error);
      setArticles([]);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchArticles = async (query: string): Promise<KnowledgeArticle[]> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return [];

      const { data: technicianData } = await supabase
        .from('technicians')
        .select('company_id')
        .eq('id', userData.user.id)
        .single();

      if (!technicianData?.company_id) return [];

      const { data, error } = await supabase
        .from('knowledge_base')
        .select(`
          *,
          knowledge_categories(name)
        `)
        .eq('company_id', technicianData.company_id)
        .textSearch('title', query, { type: 'websearch' });

      if (error) {
        console.error('Error searching articles:', error);
        return [];
      }

      return (data || []).map(article => ({
        id: article.id,
        title: article.title,
        content: article.content,
        category: article.knowledge_categories?.name || article.category || 'General',
        categoryId: article.category_id,
        tags: article.tags || [],
        views: article.views || 0,
        isPublic: article.is_public || false,
        authorId: article.author_id,
        companyId: article.company_id,
        createdAt: new Date(article.created_at),
        updatedAt: new Date(article.updated_at)
      }));
    } catch (error) {
      console.error('Error searching articles:', error);
      return [];
    }
  };

  const incrementViews = async (articleId: string) => {
    try {
      const { error } = await supabase.rpc('increment_view_count', {
        table_name: 'knowledge_base',
        row_id: articleId
      });

      if (error) {
        console.error('Error incrementing views:', error);
        return;
      }

      // Update local state
      setArticles(prev => prev.map(article =>
        article.id === articleId 
          ? { ...article, views: article.views + 1 }
          : article
      ));
    } catch (error) {
      console.error('Error incrementing article views:', error);
    }
  };

  return {
    articles,
    categories,
    isLoading,
    searchArticles,
    incrementViews,
    refreshData: fetchKnowledgeData
  };
}
