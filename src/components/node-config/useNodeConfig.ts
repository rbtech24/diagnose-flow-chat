
import { useState, useEffect } from 'react';
import { Field, TechnicalSpecs } from '@/types/node-config';
import { toast } from '@/hooks/use-toast';

interface UseNodeConfigProps {
  node: any;
  onUpdate: (nodeId: string, data: any) => void;
}

export function useNodeConfig({ node, onUpdate }: UseNodeConfigProps) {
  const [nodeType, setNodeType] = useState('question');
  const [label, setLabel] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [showTechnicalFields, setShowTechnicalFields] = useState(false);
  const [technicalSpecs, setTechnicalSpecs] = useState<TechnicalSpecs>({
    range: { min: 0, max: 0 },
    testPoints: '',
    value: 0,
    measurementPoints: '',
    points: ''
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Reset state when node changes
  useEffect(() => {
    if (node) {
      setNodeType(node.data.type || 'question');
      setLabel(node.data.label || '');
      initializeFields(node.data);
      setShowTechnicalFields(['voltage-check', 'resistance-check', 'inspection'].includes(node.data.type));
      setTechnicalSpecs(node.data.technicalSpecs || {
        range: { min: 0, max: 0 },
        testPoints: '',
        value: 0,
        measurementPoints: '',
        points: ''
      });
    }
  }, [node?.id, node?.data]);

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

  const handleNodeTypeChange = (value: string) => {
    setNodeType(value);
    setShowTechnicalFields(['voltage-check', 'resistance-check', 'inspection'].includes(value));
  };

  const validateNode = () => {
    const errors: string[] = [];
    
    if (!label.trim()) {
      errors.push('Label is required');
    }
    
    if (fields.length === 0) {
      errors.push('At least one field is required');
    }
    
    if (showTechnicalFields) {
      if (technicalSpecs.range.max <= technicalSpecs.range.min) {
        errors.push('Maximum range must be greater than minimum range');
      }
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleApplyChanges = () => {
    if (!node) return;
    
    if (!validateNode()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before applying changes.",
        variant: "destructive"
      });
      return;
    }

    // Prepare the data in the correct format
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

    const updatedData = {
      type: nodeType,
      label,
      content: combinedContent,
      media: combinedMedia,
      options: combinedOptions,
      technicalSpecs: showTechnicalFields ? technicalSpecs : undefined
    };

    console.log('Applying changes with data:', updatedData);
    onUpdate(node.id, updatedData);
  };

  const handleReset = () => {
    if (!node) return;
    setNodeType(node.data.type);
    setLabel(node.data.label);
    initializeFields(node.data);
    setValidationErrors([]);
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
    nodeType,
    label,
    fields,
    showTechnicalFields,
    technicalSpecs,
    validationErrors,
    handleNodeTypeChange,
    setLabel,
    setFields,
    setTechnicalSpecs,
    addField,
    removeField,
    moveField,
    handleReset,
    handleApplyChanges
  };
}
