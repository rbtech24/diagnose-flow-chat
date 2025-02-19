
import { Field } from '@/types/node-config';

export function combineFieldsData(fields: Field[]) {
  let combinedContent = '';
  const combinedMedia: any[] = [];
  let combinedOptions: string[] = [];

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
        if (field.media) {
          combinedMedia.push(...field.media);
        }
        break;
      case 'options':
        if (field.options) {
          combinedOptions = field.options;
        }
        break;
    }
  });

  return {
    content: combinedContent,
    media: combinedMedia,
    options: combinedOptions
  };
}
