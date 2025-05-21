
import { useState, useCallback } from 'react';
import { Field } from '@/types/node-config';

export function useNodeFields(initialData: any) {
  const [fields, setFields] = useState<Field[]>([]);

  const initializeFields = useCallback((data: any) => {
    console.log("Initializing fields with data:", data);
    const initialFields: Field[] = [];
    
    if (data.content) {
      const contentBlocks = Array.isArray(data.content) 
        ? data.content 
        : typeof data.content === 'string'
          ? data.content.split('\n\n').filter(Boolean)
          : [];
          
      contentBlocks.forEach((content: string, index: number) => {
        initialFields.push({
          id: `content-${index + 1}`,
          type: 'content',
          content: content.trim()
        });
      });
    }
    
    if (data.media && data.media.length > 0) {
      console.log("Initializing media fields with:", data.media);
      data.media.forEach((media: any, index: number) => {
        initialFields.push({
          id: `media-${index + 1}`,
          type: 'media',
          media: Array.isArray(media) ? media : [media]
        });
      });
    }
    
    if (data.options && data.options.length > 0) {
      initialFields.push({
        id: 'options-1',
        type: 'options',
        options: data.options
      });
    }
    
    console.log("Initialized fields:", initialFields);
    setFields(initialFields.length > 0 ? initialFields : [{ id: 'content-1', type: 'content', content: '' }]);
  }, []);

  const addField = useCallback((type: Field['type']) => {
    const newId = `${type}-${fields.filter(f => f.type === type).length + 1}`;
    const newField = { 
      id: newId, 
      type,
      ...(type === 'options' && { options: [] }),
      ...(type === 'media' && { media: [] }),
      ...(type === 'content' && { content: '' })
    };
    
    console.log("Adding new field:", newField);
    setFields(prevFields => [...prevFields, newField]);
  }, [fields]);

  const removeField = useCallback((id: string) => {
    console.log("Removing field with id:", id);
    setFields(prevFields => prevFields.filter(f => f.id !== id));
  }, []);

  const moveField = useCallback((dragIndex: number, hoverIndex: number) => {
    if (hoverIndex < 0 || hoverIndex >= fields.length) return;
    
    console.log(`Moving field from index ${dragIndex} to ${hoverIndex}`);
    setFields(prevFields => {
      const newFields = [...prevFields];
      const dragField = newFields[dragIndex];
      newFields.splice(dragIndex, 1);
      newFields.splice(hoverIndex, 0, dragField);
      return newFields;
    });
  }, [fields.length]);

  return {
    fields,
    setFields,
    initializeFields,
    addField,
    removeField,
    moveField
  };
}
