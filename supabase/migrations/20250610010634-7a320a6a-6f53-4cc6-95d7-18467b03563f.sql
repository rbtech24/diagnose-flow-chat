
-- Create a central file library table to index all uploaded files
CREATE TABLE public.file_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_upload_id UUID REFERENCES public.file_uploads(id) ON DELETE CASCADE,
  community_post_id UUID REFERENCES public.community_posts(id) ON DELETE SET NULL,
  community_comment_id UUID REFERENCES public.community_comments(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_type TEXT NOT NULL, -- e.g., 'image', 'document', 'video', 'tech_sheet', 'wire_diagram'
  tags TEXT[] DEFAULT '{}',
  search_vector TSVECTOR, -- Full-text search vector
  download_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'company_only', 'private')),
  indexed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better search performance
CREATE INDEX idx_file_library_search_vector ON public.file_library USING gin(search_vector);
CREATE INDEX idx_file_library_file_type ON public.file_library(file_type);
CREATE INDEX idx_file_library_tags ON public.file_library USING gin(tags);
CREATE INDEX idx_file_library_created_at ON public.file_library(created_at DESC);
CREATE INDEX idx_file_library_visibility ON public.file_library(visibility);

-- Create file categories table for better organization
CREATE TABLE public.file_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Lucide icon name
  color TEXT DEFAULT '#3b82f6',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add category reference to file library
ALTER TABLE public.file_library 
ADD COLUMN category_id UUID REFERENCES public.file_categories(id) ON DELETE SET NULL;

-- Create file library access logs for analytics
CREATE TABLE public.file_library_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_library_id UUID REFERENCES public.file_library(id) ON DELETE CASCADE,
  user_id UUID, -- References auth.users but no FK constraint
  access_type TEXT DEFAULT 'view' CHECK (access_type IN ('view', 'download', 'search')),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default file categories
INSERT INTO public.file_categories (name, description, icon, color, sort_order) VALUES
('Tech Sheets', 'Technical specification documents and manuals', 'FileText', '#3b82f6', 1),
('Wire Diagrams', 'Electrical wiring and circuit diagrams', 'Workflow', '#10b981', 2),
('Photos', 'Images and photographs related to repairs', 'Image', '#f59e0b', 3),
('Documents', 'General documents and PDFs', 'File', '#6b7280', 4),
('Videos', 'Video files and tutorials', 'Video', '#ef4444', 5),
('Other', 'Miscellaneous files and attachments', 'Paperclip', '#8b5cf6', 6);

-- Create function to automatically update search vector
CREATE OR REPLACE FUNCTION public.update_file_library_search_vector()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.title, '') || ' ' || 
    COALESCE(NEW.description, '') || ' ' || 
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Create trigger to update search vector on insert/update
CREATE TRIGGER trigger_update_file_library_search_vector
  BEFORE INSERT OR UPDATE ON public.file_library
  FOR EACH ROW
  EXECUTE FUNCTION public.update_file_library_search_vector();

-- Create function to search files
CREATE OR REPLACE FUNCTION public.search_file_library(
  p_query TEXT DEFAULT '',
  p_file_type TEXT DEFAULT NULL,
  p_category_id UUID DEFAULT NULL,
  p_tags TEXT[] DEFAULT NULL,
  p_visibility TEXT DEFAULT 'public',
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  title TEXT,
  description TEXT,
  file_type TEXT,
  tags TEXT[],
  download_count INTEGER,
  is_featured BOOLEAN,
  visibility TEXT,
  category_name TEXT,
  category_icon TEXT,
  category_color TEXT,
  file_name TEXT,
  file_size INTEGER,
  file_url TEXT,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  rank REAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fl.id,
    fl.title,
    fl.description,
    fl.file_type,
    fl.tags,
    fl.download_count,
    fl.is_featured,
    fl.visibility,
    fc.name as category_name,
    fc.icon as category_icon,
    fc.color as category_color,
    fu.file_name,
    fu.size as file_size,
    fu.url as file_url,
    fu.mime_type,
    fl.created_at,
    CASE 
      WHEN p_query = '' THEN 1.0
      ELSE ts_rank(fl.search_vector, plainto_tsquery('english', p_query))
    END as rank
  FROM public.file_library fl
  LEFT JOIN public.file_categories fc ON fc.id = fl.category_id
  LEFT JOIN public.file_uploads fu ON fu.id = fl.file_upload_id
  WHERE 
    (p_query = '' OR fl.search_vector @@ plainto_tsquery('english', p_query))
    AND (p_file_type IS NULL OR fl.file_type = p_file_type)
    AND (p_category_id IS NULL OR fl.category_id = p_category_id)
    AND (p_tags IS NULL OR fl.tags && p_tags)
    AND fl.visibility = p_visibility
  ORDER BY 
    fl.is_featured DESC,
    rank DESC,
    fl.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Create function to log file access
CREATE OR REPLACE FUNCTION public.log_file_access(
  p_file_library_id UUID,
  p_access_type TEXT DEFAULT 'view',
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.file_library_access_logs (
    file_library_id,
    user_id,
    access_type,
    ip_address,
    user_agent
  ) VALUES (
    p_file_library_id,
    auth.uid(),
    p_access_type,
    p_ip_address,
    p_user_agent
  );
  
  -- Update download count if it's a download
  IF p_access_type = 'download' THEN
    UPDATE public.file_library 
    SET download_count = download_count + 1
    WHERE id = p_file_library_id;
  END IF;
END;
$$;

-- Create RLS policies
ALTER TABLE public.file_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_library_access_logs ENABLE ROW LEVEL SECURITY;

-- Public files can be viewed by anyone
CREATE POLICY "Anyone can view public files" ON public.file_library
  FOR SELECT USING (visibility = 'public');

-- Users can view their own private files
CREATE POLICY "Users can view their own files" ON public.file_library
  FOR SELECT USING (
    visibility = 'private' AND 
    EXISTS (
      SELECT 1 FROM public.file_uploads fu 
      WHERE fu.id = file_upload_id AND fu.uploaded_by = auth.uid()
    )
  );

-- Anyone can view file categories
CREATE POLICY "Anyone can view file categories" ON public.file_categories
  FOR SELECT USING (is_active = true);

-- Users can view their own access logs
CREATE POLICY "Users can view their own access logs" ON public.file_library_access_logs
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own access logs
CREATE POLICY "Users can insert access logs" ON public.file_library_access_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());
