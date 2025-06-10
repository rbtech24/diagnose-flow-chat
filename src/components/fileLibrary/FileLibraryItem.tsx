
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileLibraryItem as FileItem } from '@/types/fileLibrary';
import { 
  Download, 
  Eye, 
  Star, 
  FileText, 
  Image, 
  Video, 
  File,
  Workflow
} from 'lucide-react';
import { logFileAccess } from '@/api/fileLibraryApi';

interface FileLibraryItemProps {
  file: FileItem;
}

export function FileLibraryItem({ file }: FileLibraryItemProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const getFileIcon = (fileType: string, mimeType: string) => {
    if (fileType === 'tech_sheet' || mimeType.includes('pdf')) {
      return <FileText className="h-5 w-5" />;
    }
    if (fileType === 'wire_diagram') {
      return <Workflow className="h-5 w-5" />;
    }
    if (fileType === 'image' || mimeType.startsWith('image/')) {
      return <Image className="h-5 w-5" />;
    }
    if (fileType === 'video' || mimeType.startsWith('video/')) {
      return <Video className="h-5 w-5" />;
    }
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleView = async () => {
    await logFileAccess(file.id, 'view');
    window.open(file.file_url, '_blank');
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await logFileAccess(file.id, 'download');
      
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = file.file_url;
      link.download = file.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getFileTypeBadgeColor = (fileType: string) => {
    switch (fileType) {
      case 'tech_sheet':
        return 'bg-blue-100 text-blue-800';
      case 'wire_diagram':
        return 'bg-green-100 text-green-800';
      case 'image':
        return 'bg-yellow-100 text-yellow-800';
      case 'video':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div style={{ color: file.category_color }}>
              {getFileIcon(file.file_type, file.mime_type)}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-medium line-clamp-2">
                {file.title}
                {file.is_featured && (
                  <Star className="inline h-4 w-4 text-yellow-500 ml-1" />
                )}
              </CardTitle>
              <div className="text-xs text-gray-500 mt-1">
                {formatFileSize(file.file_size)} • {file.download_count} downloads
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {file.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {file.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1 mb-3">
          <Badge className={getFileTypeBadgeColor(file.file_type)}>
            {file.file_type.replace('_', ' ')}
          </Badge>
          {file.category_name && (
            <Badge variant="outline" className="text-xs">
              {file.category_name}
            </Badge>
          )}
        </div>

        {file.tags && file.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {file.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {file.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{file.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleView}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-1" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
        </div>

        <div className="text-xs text-gray-500 mt-2">
          Added {new Date(file.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
