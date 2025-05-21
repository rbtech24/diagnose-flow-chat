
import { Field, MediaItem } from '@/types/node-config';

export function combineFieldsData(fields: Field[]) {
  let combinedContent = '';
  const combinedMedia: MediaItem[] = [];
  let combinedOptions: string[] = [];

  console.log("Combining fields data:", fields);
  
  fields.forEach((field) => {
    switch (field.type) {
      case 'content':
        if (field.content) {
          combinedContent = combinedContent
            ? `${combinedContent}\n\n${field.content}`
            : field.content;
        }
        break;
      case 'media':
        if (field.media && Array.isArray(field.media)) {
          // Debug log to track media items being added
          console.log(`Adding ${field.media.length} media items from field:`, field.media);
          
          field.media.forEach(item => {
            // Ensure each media item is properly typed and structured
            if (item && typeof item === 'object') {
              // Create a new properly typed MediaItem
              const mediaItem: MediaItem = {
                // Default to 'image' if type is missing
                type: (item.type as 'image' | 'video' | 'pdf') || 'image',
                url: item.url as string
              };
              
              // Only add if the URL exists
              if (mediaItem.url) {
                combinedMedia.push(mediaItem);
                console.log("Added media item:", mediaItem);
              }
            }
          });
        }
        break;
      case 'options':
        if (field.options && Array.isArray(field.options)) {
          combinedOptions = [...combinedOptions, ...field.options.filter(Boolean)];
        }
        break;
    }
  });

  console.log("Combined results:", {
    content: combinedContent,
    media: combinedMedia,
    options: combinedOptions
  });

  return {
    content: combinedContent,
    media: combinedMedia,
    options: combinedOptions
  };
}
