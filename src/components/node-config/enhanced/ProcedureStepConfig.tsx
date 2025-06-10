
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardList, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { EnhancedNodeData } from '@/types/enhanced-node-config';

interface ProcedureStepConfigProps {
  nodeData: EnhancedNodeData;
  onChange: (data: EnhancedNodeData) => void;
}

interface ProcedureStep {
  id: string;
  description: string;
  required: boolean;
  estimatedTime?: number;
  safetyWarning?: string;
  tools?: string[];
}

export function ProcedureStepConfig({ nodeData, onChange }: ProcedureStepConfigProps) {
  const steps = (nodeData as any).procedureSteps || [];
  const stepType = (nodeData as any).stepType || 'diagnostic';
  const totalEstimatedTime = (nodeData as any).totalEstimatedTime || 0;

  const updateConfig = (updates: any) => {
    onChange({
      ...nodeData,
      ...updates
    });
  };

  const addStep = () => {
    const newStep: ProcedureStep = {
      id: `step-${Date.now()}`,
      description: '',
      required: true,
      estimatedTime: 5,
      tools: []
    };

    updateConfig({
      procedureSteps: [...steps, newStep]
    });
  };

  const removeStep = (stepId: string) => {
    updateConfig({
      procedureSteps: steps.filter((step: ProcedureStep) => step.id !== stepId)
    });
  };

  const updateStep = (stepId: string, updates: Partial<ProcedureStep>) => {
    const updatedSteps = steps.map((step: ProcedureStep) =>
      step.id === stepId ? { ...step, ...updates } : step
    );
    updateConfig({ procedureSteps: updatedSteps });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4" />
          Procedure Step Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Step Type</Label>
            <Select value={stepType} onValueChange={(value) => updateConfig({ stepType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diagnostic">Diagnostic</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="safety">Safety Check</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Total Estimated Time (minutes)</Label>
            <Input
              type="number"
              value={totalEstimatedTime}
              onChange={(e) => updateConfig({ totalEstimatedTime: Number(e.target.value) })}
              min="0"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label>Procedure Steps</Label>
          <Button onClick={addStep} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Step
          </Button>
        </div>

        <div className="space-y-3">
          {steps.map((step: ProcedureStep, index: number) => (
            <Card key={step.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Step {index + 1}</span>
                  <Button
                    onClick={() => removeStep(step.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <Label>Step Description</Label>
                  <Textarea
                    value={step.description}
                    onChange={(e) => updateStep(step.id, { description: e.target.value })}
                    placeholder="Describe what the technician should do in this step..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={step.required}
                      onCheckedChange={(checked) => updateStep(step.id, { required: !!checked })}
                    />
                    <Label>Required step</Label>
                  </div>
                  <div>
                    <Label>Estimated Time (minutes)</Label>
                    <Input
                      type="number"
                      value={step.estimatedTime || 0}
                      onChange={(e) => updateStep(step.id, { estimatedTime: Number(e.target.value) })}
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Safety Warning (optional)
                  </Label>
                  <Textarea
                    value={step.safetyWarning || ''}
                    onChange={(e) => updateStep(step.id, { safetyWarning: e.target.value })}
                    placeholder="Enter any safety warnings for this step..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Required Tools (comma-separated)</Label>
                  <Input
                    value={step.tools?.join(', ') || ''}
                    onChange={(e) => updateStep(step.id, { 
                      tools: e.target.value.split(',').map(tool => tool.trim()).filter(tool => tool)
                    })}
                    placeholder="Multimeter, Screwdriver, Safety glasses"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {steps.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No procedure steps configured</p>
              <p className="text-sm">Add steps to create a detailed procedure</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
