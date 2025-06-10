
export interface FileLibraryItem {
  id: string;
  title: string;
  description?: string;
  file_type: string;
  tags: string[];
  download_count: number;
  is_featured: boolean;
  visibility: 'public' | 'company_only' | 'private';
  category_name?: string;
  category_icon?: string;
  category_color?: string;
  file_name: string;
  file_size: number;
  file_url: string;
  mime_type: string;
  created_at: string;
  rank: number;
}

export interface FileCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  query: string;
  fileType?: string;
  categoryId?: string;
  tags?: string[];
  visibility: 'public' | 'company_only' | 'private';
}
