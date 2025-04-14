import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (url: string) => void;
}

export function ProfileImageUpload({ currentImageUrl, onImageUpdate }: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const { toast } = useToast();
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.includes('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (jpg, png, etc.)",
        type: "error"
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Image file size must be less than 5MB",
        type: "error"
      });
      return;
    }
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // In a real app, we would upload to a server or storage service here
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      // Normally we'd get the URL from the server response
      const mockUploadedUrl = reader.result as string;
      onImageUpdate(mockUploadedUrl);
      setIsUploading(false);
      
      toast({
        title: "Profile image updated",
        description: "Your profile image has been successfully updated.",
        type: "success"
      });
    }, 1500);
  };
  
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUpdate("");
    
    toast({
      title: "Profile image removed",
      description: "Your profile image has been removed.",
      type: "success"
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-blue-500" />
          Profile Image
        </CardTitle>
        <CardDescription>
          Upload or update your profile picture
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32 border-2 border-primary/10">
            <AvatarImage src={previewUrl || undefined} alt="Profile" />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {!previewUrl && "AT"}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-4 w-full max-w-xs">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Upload picture</Label>
              <Input 
                id="picture" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                disabled={isUploading}
                className="cursor-pointer"
              />
            </div>
            
            {previewUrl && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleRemoveImage}
                disabled={isUploading}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Image
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
