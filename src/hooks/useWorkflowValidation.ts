
import { useState, useCallback, useEffect } from 'react';
import { ValidationSummary, ValidationContext } from '@/types/validation';
import { validateWorkflow } from '@/utils/validation/workflow-validator';

export function useWorkflowValidation() {
  const [validationSummary, setValidationSummary] = useState<ValidationSummary | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [autoValidate, setAutoValidate] = useState(true);

  const validate = useCallback(async (context: ValidationContext): Promise<ValidationSummary> => {
    setIsValidating(true);
    
    try {
      // Add a small delay to prevent excessive validation calls
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const summary = validateWorkflow(context);
      setValidationSummary(summary);
      return summary;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearValidation = useCallback(() => {
    setValidationSummary(null);
  }, []);

  const toggleAutoValidate = useCallback(() => {
    setAutoValidate(prev => !prev);
  }, []);

  return {
    validationSummary,
    isValidating,
    autoValidate,
    validate,
    clearValidation,
    toggleAutoValidate
  };
}
