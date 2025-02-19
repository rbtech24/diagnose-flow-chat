
import { useState } from 'react';
import { Field, TechnicalSpecs } from '@/types/node-config';

interface ValidationProps {
  label: string;
  fields: Field[];
  showTechnicalFields: boolean;
  technicalSpecs: TechnicalSpecs;
}

export function useNodeValidation() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateNode = ({ label, fields, showTechnicalFields, technicalSpecs }: ValidationProps) => {
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

  return {
    validationErrors,
    validateNode
  };
}
