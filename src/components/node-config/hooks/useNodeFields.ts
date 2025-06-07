
import { useState, useCallback } from 'react';
import { Field } from '@/types/node-config';

export function useNodeFields(initialData?: any) {
  const [fields, setFields] = useState<Field[]>([]);

  const initializeFields = useCallback((nodeData?: any) => {
    console.log('Initializing fields with nodeData:', nodeData);
    
    if (!nodeData) {
      // Create a default content field if no data
      setFields([{
        id: `field-${Date.now()}`,
        type: 'content',
        content: ''
      }]);
      return;
    }

    const initialFields: Field[] = [];

    // Add content field if there's content
    if (nodeData.content || nodeData.richInfo) {
      initialFields.push({
        id: `content-${Date.now()}`,
        type: 'content',
        content: nodeData.content || nodeData.richInfo || ''
      });
    }

    // Add media field if there's media
    if (nodeData.media && Array.isArray(nodeData.media) && nodeData.media.length > 0) {
      initialFields.push({
        id: `media-${Date.now()}`,
        type: 'media',
        media: nodeData.media
      });
    }

    // Add options field if there are options
    if (nodeData.options && Array.isArray(nodeData.options) && nodeData.options.length > 0) {
      initialFields.push({
        id: `options-${Date.now()}`,
        type: 'options',
        options: nodeData.options
      });
    }

    // If no fields were created, add a default content field
    if (initialFields.length === 0) {
      initialFields.push({
        id: `field-${Date.now()}`,
        type: 'content',
        content: ''
      });
    }

    console.log('Initialized fields:', initialFields);
    setFields(initialFields);
  }, []);

  const addField = useCallback((type: Field['type']) => {
    console.log('Adding new field of type:', type);
    
    const newField: Field = {
      id: `${type}-${Date.now()}`,
      type,
      ...(type === 'content' && { content: '' }),
      ...(type === 'media' && { media: [] }),
      ...(type === 'options' && { options: [] })
    };

    console.log('Created new field:', newField);
    setFields(prev => [...prev, newField]);
  }, []);

  const removeField = useCallback((fieldId: string) => {
    console.log('Removing field with ID:', fieldId);
    setFields(prev => {
      const filtered = prev.filter(field => field.id !== fieldId);
      console.log('Fields after removal:', filtered);
      return filtered;
    });
  }, []);

  const moveField = useCallback((dragIndex: number, hoverIndex: number) => {
    setFields(prev => {
      const newFields = [...prev];
      const draggedField = newFields[dragIndex];
      newFields.splice(dragIndex, 1);
      newFields.splice(hoverIndex, 0, draggedField);
      return newFields;
    });
  }, []);

  return {
    fields,
    setFields,
    initializeFields,
    addField,
    removeField,
    moveField
  };
}
