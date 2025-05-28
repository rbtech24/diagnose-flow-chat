
import { supabase } from "@/integrations/supabase/client";
import { APIErrorHandler } from "@/utils/apiErrorHandler";

export interface UploadedFile {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  path: string;
  uploadedBy: string;
  companyId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface FileUploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

// Upload single file
export const uploadFile = async (
  file: File,
  options?: {
    bucket?: string;
    folder?: string;
    metadata?: Record<string, any>;
    onProgress?: (progress: number) => void;
  }
): Promise<UploadedFile> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    const bucket = options?.bucket || 'uploads';
    const folder = options?.folder || 'files';
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    // Store file metadata in database
    const { data: fileRecord, error: recordError } = await supabase
      .from("file_uploads")
      .insert({
        file_name: fileName,
        original_name: file.name,
        mime_type: file.type,
        size: file.size,
        path: filePath,
        url: urlData.publicUrl,
        uploaded_by: userData.user.id,
        company_id: userData.user.raw_user_meta_data?.company_id,
        metadata: options?.metadata || {},
        bucket: bucket
      })
      .select()
      .single();

    if (recordError) throw recordError;

    return {
      id: fileRecord.id,
      fileName: fileRecord.file_name,
      originalName: fileRecord.original_name,
      mimeType: fileRecord.mime_type,
      size: fileRecord.size,
      url: fileRecord.url,
      path: fileRecord.path,
      uploadedBy: fileRecord.uploaded_by,
      companyId: fileRecord.company_id,
      metadata: fileRecord.metadata,
      createdAt: new Date(fileRecord.created_at)
    };
  }, "uploadFile");

  if (!response.success) throw response.error;
  return response.data!;
};

// Upload multiple files
export const uploadMultipleFiles = async (
  files: File[],
  options?: {
    bucket?: string;
    folder?: string;
    metadata?: Record<string, any>;
    onProgress?: (fileName: string, progress: number) => void;
    onFileComplete?: (file: UploadedFile) => void;
  }
): Promise<UploadedFile[]> => {
  const uploadedFiles: UploadedFile[] = [];
  const errors: string[] = [];

  for (const file of files) {
    try {
      const uploadedFile = await uploadFile(file, {
        bucket: options?.bucket,
        folder: options?.folder,
        metadata: options?.metadata,
        onProgress: (progress) => options?.onProgress?.(file.name, progress)
      });
      
      uploadedFiles.push(uploadedFile);
      options?.onFileComplete?.(uploadedFile);
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
      errors.push(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  if (errors.length > 0 && uploadedFiles.length === 0) {
    throw new Error(`All uploads failed: ${errors.join(', ')}`);
  }

  return uploadedFiles;
};

// Delete file
export const deleteFile = async (fileId: string): Promise<void> => {
  await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    // Get file record
    const { data: fileRecord, error: fetchError } = await supabase
      .from("file_uploads")
      .select("*")
      .eq("id", fileId)
      .single();

    if (fetchError) throw fetchError;
    if (!fileRecord) throw new Error("File not found");

    // Check permissions
    if (fileRecord.uploaded_by !== userData.user.id) {
      const userRole = userData.user.raw_user_meta_data?.role;
      if (userRole !== 'admin' && userRole !== 'company_admin') {
        throw new Error("Insufficient permissions to delete this file");
      }
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(fileRecord.bucket || 'uploads')
      .remove([fileRecord.path]);

    if (storageError) throw storageError;

    // Delete record from database
    const { error: deleteError } = await supabase
      .from("file_uploads")
      .delete()
      .eq("id", fileId);

    if (deleteError) throw deleteError;
  }, "deleteFile");
};

// Fetch user files
export const fetchUserFiles = async (options?: {
  limit?: number;
  folder?: string;
  mimeTypes?: string[];
}): Promise<UploadedFile[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    let query = supabase
      .from("file_uploads")
      .select("*")
      .eq("uploaded_by", userData.user.id)
      .order("created_at", { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.folder) {
      query = query.like("path", `${options.folder}/%`);
    }

    if (options?.mimeTypes && options.mimeTypes.length > 0) {
      query = query.in("mime_type", options.mimeTypes);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(file => ({
      id: file.id,
      fileName: file.file_name,
      originalName: file.original_name,
      mimeType: file.mime_type,
      size: file.size,
      url: file.url,
      path: file.path,
      uploadedBy: file.uploaded_by,
      companyId: file.company_id,
      metadata: file.metadata,
      createdAt: new Date(file.created_at)
    }));
  }, "fetchUserFiles");

  if (!response.success) throw response.error;
  return response.data || [];
};

// Get file info
export const getFileInfo = async (fileId: string): Promise<UploadedFile> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data, error } = await supabase
      .from("file_uploads")
      .select("*")
      .eq("id", fileId)
      .single();

    if (error) throw error;
    if (!data) throw new Error("File not found");

    return {
      id: data.id,
      fileName: data.file_name,
      originalName: data.original_name,
      mimeType: data.mime_type,
      size: data.size,
      url: data.url,
      path: data.path,
      uploadedBy: data.uploaded_by,
      companyId: data.company_id,
      metadata: data.metadata,
      createdAt: new Date(data.created_at)
    };
  }, "getFileInfo");

  if (!response.success) throw response.error;
  return response.data!;
};

// Generate presigned URL for large file uploads
export const generatePresignedUrl = async (
  fileName: string,
  mimeType: string,
  options?: {
    bucket?: string;
    folder?: string;
    expiresIn?: number;
  }
): Promise<{ url: string; path: string }> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    const bucket = options?.bucket || 'uploads';
    const folder = options?.folder || 'files';
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${timestamp}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = `${folder}/${uniqueFileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(filePath, {
        expiresIn: options?.expiresIn || 3600 // 1 hour default
      });

    if (error) throw error;

    return {
      url: data.signedUrl,
      path: filePath
    };
  }, "generatePresignedUrl");

  if (!response.success) throw response.error;
  return response.data!;
};
