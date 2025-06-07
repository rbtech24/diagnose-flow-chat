
import { useState, useEffect } from 'react';
import { TechnicalSpecs, NodeType, Field } from '@/types/node-config';
import { toast } from '@/hooks/use-toast';
import { useNodeFields } from './hooks/useNodeFields';
import { useNodeValidation } from './hooks/useNodeValidation';
import { combineFieldsData } from './utils/nodeDataTransform';

interface UseNodeConfigProps {
  node: any;
  onUpdate: (nodeData: any) => void;
}

export function useNodeConfig({ node, onUpdate }: UseNodeConfigProps) {
  const [nodeType, setNodeType] = useState<NodeType>('question');
  const [label, setLabel] = useState('');
  const [showTechnicalFields, setShowTechnicalFields] = useState(false);
  const [technicalSpecs, setTechnicalSpecs] = useState<TechnicalSpecs>({
    range: { min: 0, max: 0 },
    testPoints: '',
    value: 0,
    measurementPoints: '',
    points: ''
  });

  const { fields, setFields, initializeFields, addField, removeField, moveField } = useNodeFields(node?.data);
  const { validationErrors, validateNode } = useNodeValidation();

  useEffect(() => {
    if (node) {
      console.log('Initializing node config with data:', node.data);
      setNodeType((node.data.type || 'question') as NodeType);
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
  }, [node?.id, node?.data, initializeFields]);

  const handleNodeTypeChange = (value: NodeType) => {
    setNodeType(value);
    setShowTechnicalFields(['voltage-check', 'resistance-check', 'inspection'].includes(value));
  };

  const handleApplyChanges = () => {
    if (!node) return;
    
    if (!validateNode({ label, fields, showTechnicalFields, technicalSpecs })) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before applying changes.",
        variant: "destructive"
      });
      return;
    }

    console.log('Fields before combining:', fields);
    const combinedData = combineFieldsData(fields);
    console.log('Combined data from fields:', combinedData);
    
    const updatedData = {
      type: nodeType,
      label,
      ...combinedData, // This spreads content, media, options into the updatedData object
      technicalSpecs: showTechnicalFields ? technicalSpecs : undefined
    };

    console.log('Applying changes with data:', updatedData);
    onUpdate(updatedData);
  };

  const handleReset = () => {
    if (!node) return;
    setNodeType(node.data.type as NodeType);
    setLabel(node.data.label);
    initializeFields(node.data);
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
    addField: (type: Field['type']) => addField(type),
    removeField: (id: string) => removeField(id),
    moveField: (dragIndex: number, hoverIndex: number) => moveField(dragIndex, hoverIndex),
    handleReset,
    handleApplyChanges
  };
}
