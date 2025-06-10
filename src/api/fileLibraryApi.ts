import { supabase } from "@/integrations/supabase/client";
import { FileLibraryItem, FileCategory, SearchFilters } from "@/types/fileLibrary";

export const searchFileLibrary = async (
  filters: SearchFilters,
  limit: number = 50,
  offset: number = 0
): Promise<FileLibraryItem[]> => {
  try {
    const { data, error } = await supabase.rpc('search_file_library', {
      p_query: filters.query || '',
      p_file_type: filters.fileType || null,
      p_category_id: filters.categoryId || null,
      p_tags: filters.tags || null,
      p_visibility: filters.visibility,
      p_limit: limit,
      p_offset: offset
    });

    if (error) {
      console.error('Error searching file library:', error);
      throw error;
    }

    // Type assertion to ensure proper typing from database
    return (data || []).map((item: any): FileLibraryItem => ({
      id: item.id,
      title: item.title,
      description: item.description,
      file_type: item.file_type,
      tags: item.tags || [],
      download_count: item.download_count || 0,
      is_featured: item.is_featured || false,
      visibility: item.visibility as 'public' | 'company_only' | 'private',
      category_name: item.category_name,
      category_icon: item.category_icon,
      category_color: item.category_color,
      file_name: item.file_name,
      file_size: item.file_size || 0,
      file_url: item.file_url,
      mime_type: item.mime_type,
      created_at: item.created_at,
      rank: item.rank || 0
    }));
  } catch (error) {
    console.error('Error in searchFileLibrary:', error);
    throw error;
  }
};

export const getFileCategories = async (): Promise<FileCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('file_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('Error fetching file categories:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getFileCategories:', error);
    throw error;
  }
};

export const logFileAccess = async (
  fileLibraryId: string,
  accessType: 'view' | 'download' | 'search' = 'view'
): Promise<void> => {
  try {
    const { error } = await supabase.rpc('log_file_access', {
      p_file_library_id: fileLibraryId,
      p_access_type: accessType
    });

    if (error) {
      console.error('Error logging file access:', error);
    }
  } catch (error) {
    console.error('Error in logFileAccess:', error);
  }
};

export const addFileToLibrary = async (fileData: {
  file_upload_id: string;
  title: string;
  description?: string;
  file_type: string;
  tags?: string[];
  category_id?: string;
  visibility?: 'public' | 'company_only' | 'private';
  is_featured?: boolean;
}): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('file_library')
      .insert({
        file_upload_id: fileData.file_upload_id,
        title: fileData.title,
        description: fileData.description,
        file_type: fileData.file_type,
        tags: fileData.tags || [],
        category_id: fileData.category_id,
        visibility: fileData.visibility || 'public',
        is_featured: fileData.is_featured || false
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error adding file to library:', error);
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error('Error in addFileToLibrary:', error);
    throw error;
  }
};
