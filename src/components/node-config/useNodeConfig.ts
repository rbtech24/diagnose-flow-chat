
import { useState, useEffect } from 'react';
import { TechnicalSpecs } from '@/types/node-config';
import { useToast } from '@/hooks/use-toast';
import { useNodeFields } from './hooks/useNodeFields';
import { useNodeValidation } from './hooks/useNodeValidation';
import { combineFieldsData } from './utils/nodeDataTransform';

interface UseNodeConfigProps {
  node: any;
  onUpdate: (nodeId: string, data: any) => void;
}

export function useNodeConfig({ node, onUpdate }: UseNodeConfigProps) {
  const [nodeType, setNodeType] = useState('question');
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
  const { toast } = useToast();

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

  const handleNodeTypeChange = (value: string) => {
    setNodeType(value);
    setShowTechnicalFields(['voltage-check', 'resistance-check', 'inspection'].includes(value));
  };

  const handleApplyChanges = () => {
    if (!node) return;
    
    if (!validateNode({ label, fields, showTechnicalFields, technicalSpecs })) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before applying changes.",
        type: "error" // Use type instead of variant
      });
      return;
    }

    const combinedData = combineFieldsData(fields);
    
    const updatedData = {
      type: nodeType,
      label,
      ...combinedData,
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
