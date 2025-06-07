
import { supabase } from "@/integrations/supabase/client";

export interface FileUploadResult {
  id: string;
  url: string;
  path: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  bucket: string;
  metadata?: Record<string, any>;
}

export interface UploadOptions {
  bucket?: string;
  path?: string;
  metadata?: Record<string, any>;
  allowedTypes?: string[];
  maxSize?: number;
  generateUniqueName?: boolean;
}

class FileUploadService {
  private readonly defaultBucket = 'uploads';
  private readonly defaultMaxSize = 50 * 1024 * 1024; // 50MB
  private readonly defaultAllowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(file: File, options: UploadOptions = {}): Promise<FileUploadResult> {
    // Validate file
    this.validateFile(file, options);

    const bucket = options.bucket || this.defaultBucket;
    const generateUniqueName = options.generateUniqueName !== false;
    
    // Generate file path
    const fileName = generateUniqueName 
      ? this.generateUniqueFileName(file.name)
      : file.name;
    
    const filePath = options.path 
      ? `${options.path}/${fileName}`
      : fileName;

    try {
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      // Get user's company_id
      let companyId = null;
      if (userId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', userId)
          .single();
        companyId = profile?.company_id;
      }

      // Create file upload record
      const { data: fileRecord, error: recordError } = await supabase
        .from('file_uploads')
        .insert({
          file_name: fileName,
          original_name: file.name,
          path: filePath,
          url: urlData.publicUrl,
          mime_type: file.type,
          size: file.size,
          bucket: bucket,
          metadata: options.metadata || {},
          uploaded_by: userId,
          company_id: companyId
        })
        .select()
        .single();

      if (recordError) {
        // Clean up uploaded file if database record creation fails
        await supabase.storage.from(bucket).remove([filePath]);
        throw new Error(`Failed to create file record: ${recordError.message}`);
      }

      return {
        id: fileRecord.id,
        url: urlData.publicUrl,
        path: filePath,
        fileName: fileName,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        bucket: bucket,
        metadata: options.metadata
      };

    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(files: File[], options: UploadOptions = {}): Promise<FileUploadResult[]> {
    const results: FileUploadResult[] = [];
    const errors: Error[] = [];

    for (const file of files) {
      try {
        const result = await this.uploadFile(file, options);
        results.push(result);
      } catch (error) {
        errors.push(error as Error);
      }
    }

    if (errors.length > 0) {
      console.warn(`${errors.length} files failed to upload:`, errors);
    }

    return results;
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      // Get file record
      const { data: fileRecord, error: fetchError } = await supabase
        .from('file_uploads')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fetchError || !fileRecord) {
        throw new Error('File not found');
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(fileRecord.bucket)
        .remove([fileRecord.path]);

      if (storageError) {
        console.warn('Failed to delete from storage:', storageError);
      }

      // Delete database record
      const { error: dbError } = await supabase
        .from('file_uploads')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        throw new Error(`Failed to delete file record: ${dbError.message}`);
      }

    } catch (error) {
      console.error('File deletion error:', error);
      throw error;
    }
  }

  /**
   * Get file info by ID
   */
  async getFileInfo(fileId: string): Promise<FileUploadResult | null> {
    const { data, error } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('id', fileId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      url: data.url,
      path: data.path,
      fileName: data.file_name,
      originalName: data.original_name,
      mimeType: data.mime_type,
      size: data.size,
      bucket: data.bucket,
      metadata: data.metadata || {}
    };
  }

  /**
   * Get files for a company with pagination
   */
  async getFiles(
    companyId?: string,
    options?: {
      limit?: number;
      offset?: number;
      mimeType?: string;
      uploadedBy?: string;
    }
  ): Promise<{ files: FileUploadResult[]; total: number }> {
    let query = supabase
      .from('file_uploads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    if (options?.mimeType) {
      query = query.ilike('mime_type', `${options.mimeType}%`);
    }

    if (options?.uploadedBy) {
      query = query.eq('uploaded_by', options.uploadedBy);
    }

    if (options?.limit) {
      const offset = options.offset || 0;
      query = query.range(offset, offset + options.limit - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching files:', error);
      return { files: [], total: 0 };
    }

    const files = (data || []).map(record => ({
      id: record.id,
      url: record.url,
      path: record.path,
      fileName: record.file_name,
      originalName: record.original_name,
      mimeType: record.mime_type,
      size: record.size,
      bucket: record.bucket,
      metadata: record.metadata || {}
    }));

    return {
      files,
      total: count || 0
    };
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File, options: UploadOptions): void {
    const maxSize = options.maxSize || this.defaultMaxSize;
    const allowedTypes = options.allowedTypes || this.defaultAllowedTypes;

    if (file.size > maxSize) {
      throw new Error(`File size ${this.formatFileSize(file.size)} exceeds maximum allowed size ${this.formatFileSize(maxSize)}`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    if (file.name.length > 255) {
      throw new Error('File name is too long (maximum 255 characters)');
    }
  }

  /**
   * Generate unique file name
   */
  private generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    const nameWithoutExtension = originalName.split('.').slice(0, -1).join('.');
    const safeName = nameWithoutExtension.replace(/[^a-zA-Z0-9]/g, '_');
    
    return `${safeName}_${timestamp}_${randomString}.${extension}`;
  }

  /**
   * Format file size for display
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Check if file type is image
   */
  isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  /**
   * Check if file type is document
   */
  isDocumentFile(mimeType: string): boolean {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];
    return documentTypes.includes(mimeType);
  }
}

export const fileUploadService = new FileUploadService();
