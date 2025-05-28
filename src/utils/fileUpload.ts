
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface FileUploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface FileUploadOptions {
  bucket: string;
  folder?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  overwrite?: boolean;
}

export class FileUploadService {
  private static readonly DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly DEFAULT_ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'video/mp4',
    'video/webm'
  ];

  static async uploadFile(
    file: File,
    options: FileUploadOptions
  ): Promise<FileUploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file, options);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Generate unique file path
      const filePath = this.generateFilePath(file, options);

      console.log(`Uploading file to ${options.bucket}/${filePath}`);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: options.overwrite || false
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(data.path);

      console.log(`File uploaded successfully: ${publicUrl}`);

      return {
        success: true,
        url: publicUrl,
        path: data.path
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      console.error('File upload failed:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  static async deleteFile(
    bucket: string,
    path: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`Deleting file from ${bucket}/${path}`);

      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        console.error('Delete error:', error);
        return { success: false, error: error.message };
      }

      console.log('File deleted successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown delete error';
      console.error('File deletion failed:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  static async listFiles(
    bucket: string,
    folder?: string
  ): Promise<{ success: boolean; files?: any[]; error?: string }> {
    try {
      console.log(`Listing files in ${bucket}${folder ? `/${folder}` : ''}`);

      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder);

      if (error) {
        console.error('List files error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, files: data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown list error';
      console.error('File listing failed:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  private static validateFile(
    file: File,
    options: FileUploadOptions
  ): { valid: boolean; error?: string } {
    const maxSize = options.maxSize || this.DEFAULT_MAX_SIZE;
    const allowedTypes = options.allowedTypes || this.DEFAULT_ALLOWED_TYPES;

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${(maxSize / 1024 / 1024).toFixed(2)}MB)`
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    return { valid: true };
  }

  private static generateFilePath(file: File, options: FileUploadOptions): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const extension = file.name.split('.').pop();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    const folder = options.folder ? `${options.folder}/` : '';
    return `${folder}${timestamp}_${randomId}_${sanitizedName}`;
  }

  // Utility method for common upload scenarios
  static async uploadAvatar(file: File, userId: string): Promise<FileUploadResult> {
    return this.uploadFile(file, {
      bucket: 'avatars',
      folder: 'users',
      maxSize: 5 * 1024 * 1024, // 5MB for avatars
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      overwrite: true
    });
  }

  static async uploadDocument(file: File, folder?: string): Promise<FileUploadResult> {
    return this.uploadFile(file, {
      bucket: 'documents',
      folder,
      maxSize: 20 * 1024 * 1024, // 20MB for documents
      allowedTypes: ['application/pdf', 'text/plain', 'image/jpeg', 'image/png']
    });
  }

  static async uploadMedia(file: File, folder?: string): Promise<FileUploadResult> {
    return this.uploadFile(file, {
      bucket: 'media',
      folder,
      maxSize: 100 * 1024 * 1024, // 100MB for media files
      allowedTypes: ['image/jpeg', 'image/png', 'video/mp4', 'video/webm']
    });
  }
}

// Hook for easier use in React components
export const useFileUpload = () => {
  const uploadFile = async (file: File, options: FileUploadOptions): Promise<FileUploadResult> => {
    const result = await FileUploadService.uploadFile(file, options);
    
    if (result.success) {
      toast({
        title: "Upload successful",
        description: "File has been uploaded successfully.",
        variant: "default"
      });
    } else {
      toast({
        title: "Upload failed",
        description: result.error || "Failed to upload file.",
        variant: "destructive"
      });
    }
    
    return result;
  };

  return {
    uploadFile,
    uploadAvatar: FileUploadService.uploadAvatar,
    uploadDocument: FileUploadService.uploadDocument,
    uploadMedia: FileUploadService.uploadMedia,
    deleteFile: FileUploadService.deleteFile,
    listFiles: FileUploadService.listFiles
  };
};
