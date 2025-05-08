
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  name: string;
  onAvatarChange: (url: string) => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  currentAvatarUrl, 
  name, 
  onAvatarChange,
  size = 'md' 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(currentAvatarUrl);
  const { toast } = useToast();
  
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`; // Store directly in avatars bucket root
      
      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw uploadError;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const publicUrl = publicUrlData.publicUrl;
      console.log('Upload successful, public URL:', publicUrl);
      
      // Update state and call onAvatarChange callback
      setAvatarUrl(publicUrl);
      await onAvatarChange(publicUrl);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please ensure you're signed in.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveAvatar = async () => {
    try {
      setIsUploading(true);
      
      if (avatarUrl) {
        // Extract the file path from the URL
        const urlParts = avatarUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        // Delete the file from storage if it exists
        if (fileName) {
          const { error } = await supabase.storage
            .from('avatars')
            .remove([fileName]);
            
          if (error) {
            console.error('Error removing file from storage:', error);
            // Continue anyway - we still want to clear the avatar URL
          }
        }
      }
      
      await onAvatarChange('');
      setAvatarUrl(undefined);
      toast({
        title: "Avatar removed",
        description: "Your profile picture has been removed.",
      });
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast({
        title: "Error",
        description: "Failed to remove profile picture.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Get initials for avatar fallback
  const getInitials = () => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className={`${sizeClasses[size]} relative group`}>
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={name} />
        ) : null}
        <AvatarFallback className="bg-primary/10 text-primary text-lg">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isUploading}
          className="relative"
        >
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Upload className="h-4 w-4 mr-1" />
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
        
        {avatarUrl && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRemoveAvatar}
            disabled={isUploading}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};
