
import { useState } from 'react';
import { Field } from '@/types/node-config';

export function useNodeFields(initialData: any) {
  const [fields, setFields] = useState<Field[]>([]);

  const initializeFields = (data: any) => {
    const initialFields: Field[] = [];
    
    if (data.content) {
      const contentBlocks = Array.isArray(data.content) 
        ? data.content 
        : data.content.split('\n\n').filter(Boolean);
      contentBlocks.forEach((content: string, index: number) => {
        initialFields.push({
          id: `content-${index + 1}`,
          type: 'content',
          content: content.trim()
        });
      });
    }
    
    if (data.media && data.media.length > 0) {
      data.media.forEach((media: any, index: number) => {
        initialFields.push({
          id: `media-${index + 1}`,
          type: 'media',
          media: [media]
        });
      });
    }
    
    if (data.options) {
      initialFields.push({
        id: 'options-1',
        type: 'options',
        options: data.options
      });
    }
    
    setFields(initialFields.length > 0 ? initialFields : [{ id: 'content-1', type: 'content', content: '' }]);
  };

  const addField = (type: Field['type']) => {
    const newId = `${type}-${fields.filter(f => f.type === type).length + 1}`;
    setFields([...fields, { 
      id: newId, 
      type,
      ...(type === 'options' && { options: [] }),
      ...(type === 'media' && { media: [] }),
      ...(type === 'content' && { content: '' })
    }]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const moveField = (dragIndex: number, hoverIndex: number) => {
    const newFields = [...fields];
    const dragField = newFields[dragIndex];
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, dragField);
    setFields(newFields);
  };

  return {
    fields,
    setFields,
    initializeFields,
    addField,
    removeField,
    moveField
  };
}
