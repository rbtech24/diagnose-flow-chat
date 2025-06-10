
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ExternalLink, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WorkflowLinkData {
  workflowName: string;
  stepId?: string;
  stepTitle?: string;
}

interface WorkflowLinkFieldProps {
  value?: WorkflowLinkData;
  onChange: (value: WorkflowLinkData | undefined) => void;
}

export function WorkflowLinkField({ value, onChange }: WorkflowLinkFieldProps) {
  const [availableWorkflows, setAvailableWorkflows] = useState<any[]>([]);
  const [workflowSteps, setWorkflowSteps] = useState<any[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(value?.workflowName || '');
  const [selectedStep, setSelectedStep] = useState(value?.stepId || '');

  useEffect(() => {
    // Load available workflows from localStorage
    try {
      const stored = localStorage.getItem('diagnostic-workflows');
      if (stored) {
        const workflows = JSON.parse(stored);
        setAvailableWorkflows(workflows);
      }
    } catch (error) {
      console.error('Failed to load workflows:', error);
    }
  }, []);

  useEffect(() => {
    // Load steps for the selected workflow
    if (selectedWorkflow) {
      const workflow = availableWorkflows.find(w => w.metadata.name === selectedWorkflow);
      if (workflow && workflow.nodes) {
        const steps = workflow.nodes.map((node: any) => ({
          id: node.id,
          title: node.data?.label || node.data?.title || 'Untitled Step',
          type: node.data?.type || 'unknown'
        }));
        setWorkflowSteps(steps);
      }
    } else {
      setWorkflowSteps([]);
      setSelectedStep('');
    }
  }, [selectedWorkflow, availableWorkflows]);

  const handleWorkflowChange = (workflowName: string) => {
    setSelectedWorkflow(workflowName);
    setSelectedStep('');
    
    if (workflowName) {
      onChange({
        workflowName,
        stepId: undefined,
        stepTitle: undefined
      });
    } else {
      onChange(undefined);
    }
  };

  const handleStepChange = (stepId: string) => {
    setSelectedStep(stepId);
    
    if (selectedWorkflow && stepId) {
      const step = workflowSteps.find(s => s.id === stepId);
      onChange({
        workflowName: selectedWorkflow,
        stepId,
        stepTitle: step?.title
      });
    }
  };

  const handleRemoveLink = () => {
    setSelectedWorkflow('');
    setSelectedStep('');
    onChange(undefined);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Link to Another Workflow</Label>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveLink}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-xs text-gray-600">Select Workflow</Label>
          <Select value={selectedWorkflow} onValueChange={handleWorkflowChange}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Choose a workflow..." />
            </SelectTrigger>
            <SelectContent>
              {availableWorkflows.map((workflow) => (
                <SelectItem key={workflow.id} value={workflow.metadata.name}>
                  <div className="flex flex-col">
                    <span className="font-medium">{workflow.metadata.name}</span>
                    <span className="text-xs text-gray-500">{workflow.metadata.folder}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedWorkflow && workflowSteps.length > 0 && (
          <div>
            <Label className="text-xs text-gray-600">Select Specific Step (Optional)</Label>
            <Select value={selectedStep} onValueChange={handleStepChange}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Choose a step or leave blank for start..." />
              </SelectTrigger>
              <SelectContent>
                {workflowSteps.map((step) => (
                  <SelectItem key={step.id} value={step.id}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {step.type}
                      </Badge>
                      <span>{step.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {value && (
          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded border">
            <ExternalLink className="h-4 w-4 text-purple-600" />
            <div className="flex-1 text-sm">
              <div className="font-medium text-purple-900">{value.workflowName}</div>
              {value.stepTitle && (
                <div className="text-xs text-purple-600">→ {value.stepTitle}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
