
import React from 'react';
import { NodeTypeSelect } from './NodeTypeSelect';
import { NodeFields } from './NodeFields';
import { TechnicalSpecsPanel } from './TechnicalSpecs';
import { EnhancedNodeConfig } from './enhanced/EnhancedNodeConfig';
import { DiagnosticTemplates } from './enhanced/DiagnosticTemplates';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { RotateCcw, Check, File } from 'lucide-react';
import { Field, TechnicalSpecs as TechnicalSpecsType } from '@/types/node-config';
import { EnhancedNodeData, EnhancedNodeType } from '@/types/enhanced-node-config';

interface NodeConfigFormProps {
  nodeType: string;
  label: string;
  fields: Field[];
  showTechnicalFields: boolean;
  technicalSpecs: TechnicalSpecsType;
  onNodeTypeChange: (value: string) => void;
  onLabelChange: (value: string) => void;
  onFieldsChange: (fields: Field[]) => void;
  onTechnicalSpecsChange: (specs: TechnicalSpecsType) => void;
  onAddField: (type: Field['type']) => void;
  onRemoveField: (id: string) => void;
  onMoveField: (dragIndex: number, hoverIndex: number) => void;
  onReset: () => void;
  onApply: () => void;
  hasValidationErrors: boolean;
}

export function NodeConfigForm({
  nodeType,
  label,
  fields,
  showTechnicalFields,
  technicalSpecs,
  onNodeTypeChange,
  onLabelChange,
  onFieldsChange,
  onTechnicalSpecsChange,
  onAddField,
  onRemoveField,
  onMoveField,
  onReset,
  onApply,
  hasValidationErrors
}: NodeConfigFormProps) {
  const isEnhancedNodeType = [
    'decision-tree',
    'data-form', 
    'equipment-test',
    'photo-capture',
    'multi-branch',
    'data-collection',
    'procedure-step'
  ].includes(nodeType);

  const handleTemplateApply = (templateData: EnhancedNodeData) => {
    // Apply template data to the current node
    onNodeTypeChange(templateData.type as string || 'question');
    onLabelChange(templateData.title || templateData.label as string || '');
    
    // Convert template data to the expected format
    const convertedFields: Field[] = [];
    if (templateData.content) {
      convertedFields.push({
        id: 'content-1',
        type: 'content',
        content: templateData.content
      });
    }
    onFieldsChange(convertedFields);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="enhanced">Enhanced</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <NodeTypeSelect value={nodeType} onChange={onNodeTypeChange} />
              
              <div className="space-y-2">
                <Label htmlFor="node-label">Node Label</Label>
                <Input
                  id="node-label"
                  value={label}
                  onChange={(e) => onLabelChange(e.target.value)}
                  placeholder="Enter node label"
                />
              </div>

              {isEnhancedNodeType && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Enhanced Node Type</Badge>
                  <span className="text-sm text-gray-600">
                    Configure in Enhanced tab
                  </span>
                </div>
              )}

              {!isEnhancedNodeType && (
                <>
                  <Separator />
                  <NodeFields
                    fields={fields}
                    onFieldsChange={onFieldsChange}
                    onAddField={onAddField}
                    onRemoveField={onRemoveField}
                    onMoveField={onMoveField}
                  />
                </>
              )}

              {showTechnicalFields && (
                <>
                  <Separator />
                  <TechnicalSpecsPanel
                    nodeType={nodeType}
                    value={technicalSpecs}
                    onChange={onTechnicalSpecsChange}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enhanced" className="space-y-4">
          {isEnhancedNodeType ? (
            <EnhancedNodeConfig 
              nodeData={{ 
                type: nodeType as EnhancedNodeType, 
                title: label,
                label 
              }} 
              onChange={(data) => {
                // Handle enhanced node data changes
                if (data.title !== label) {
                  onLabelChange(data.title as string || data.label as string || '');
                }
              }} 
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 mb-4">
                  Enhanced configuration is only available for enhanced node types.
                </p>
                <p className="text-sm text-gray-400">
                  Select an enhanced node type in the Basic tab to access advanced features.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="w-4 h-4" />
                Diagnostic Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DiagnosticTemplates onApplyTemplate={handleTemplateApply} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button 
          onClick={onApply} 
          disabled={hasValidationErrors}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Check className="w-4 h-4 mr-2" />
          Apply Changes
        </Button>
      </div>
    </div>
  );
}
