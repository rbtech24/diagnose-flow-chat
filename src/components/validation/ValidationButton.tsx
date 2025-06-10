
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ValidationSummary } from '@/types/validation';
import { ValidationPanel } from './ValidationPanel';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface ValidationButtonProps {
  validationSummary: ValidationSummary | null;
  isValidating: boolean;
  onValidate: () => void;
  onNodeFocus?: (nodeId: string) => void;
}

export function ValidationButton({
  validationSummary,
  isValidating,
  onValidate,
  onNodeFocus
}: ValidationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getButtonVariant = () => {
    if (!validationSummary) return 'outline';
    if (validationSummary.errors > 0) return 'destructive';
    if (validationSummary.warnings > 0) return 'secondary';
    return 'outline';
  };

  const getButtonIcon = () => {
    if (isValidating) {
      return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />;
    }
    if (!validationSummary) return <Shield className="w-4 h-4" />;
    if (validationSummary.errors > 0) return <AlertTriangle className="w-4 h-4" />;
    if (validationSummary.warnings > 0) return <AlertTriangle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getButtonText = () => {
    if (isValidating) return 'Validating...';
    if (!validationSummary) return 'Validate';
    if (validationSummary.isValid) return 'Valid';
    return 'Issues Found';
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={getButtonVariant()}
          size="sm"
          className="flex items-center gap-2"
          disabled={isValidating}
        >
          {getButtonIcon()}
          {getButtonText()}
          {validationSummary && validationSummary.totalIssues > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {validationSummary.totalIssues}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <ValidationPanel
          validationSummary={validationSummary}
          isValidating={isValidating}
          onClose={() => setIsOpen(false)}
          onNodeFocus={onNodeFocus}
          onValidate={onValidate}
        />
      </PopoverContent>
    </Popover>
  );
}
