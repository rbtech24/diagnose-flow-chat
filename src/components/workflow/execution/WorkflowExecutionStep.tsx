
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Camera,
  FileText,
  Wrench
} from 'lucide-react';
import { Node } from '@xyflow/react';

interface WorkflowExecutionStepProps {
  node: Node;
  onComplete: (answer: any) => void;
  mode: 'test' | 'production';
}

export function WorkflowExecutionStep({ 
  node, 
  onComplete, 
  mode 
}: WorkflowExecutionStepProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [textInput, setTextInput] = useState('');
  const [notes, setNotes] = useState('');

  const nodeData = node.data;
  const nodeType = typeof nodeData?.type === 'string' ? nodeData.type : 'question';
  const title = (typeof nodeData?.title === 'string' ? nodeData.title : 
                typeof nodeData?.label === 'string' ? nodeData.label : 'Step');
  const content = (typeof nodeData?.content === 'string' ? nodeData.content : 
                  typeof nodeData?.richInfo === 'string' ? nodeData.richInfo : '');
  const options = Array.isArray(nodeData?.options) ? nodeData.options : ['Yes', 'No'];

  const handleSubmit = () => {
    const answer = selectedAnswer || textInput || 'Completed';
    const submissionData = {
      answer,
      notes: notes.trim() || undefined,
      timestamp: new Date(),
      nodeId: node.id,
      mode
    };

    onComplete(submissionData);
  };

  const getStepIcon = () => {
    switch (nodeType) {
      case 'equipment-test':
        return <Wrench className="w-5 h-5 text-blue-600" />;
      case 'photo-capture':
        return <Camera className="w-5 h-5 text-green-600" />;
      case 'procedure-step':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'question':
        return <CheckCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStepTypeLabel = () => {
    switch (nodeType) {
      case 'equipment-test':
        return 'Equipment Test';
      case 'photo-capture':
        return 'Photo Capture';
      case 'procedure-step':
        return 'Procedure Step';
      case 'question':
        return 'Decision Point';
      default:
        return 'Step';
    }
  };

  const isAnswerSelected = selectedAnswer !== null || textInput.trim() !== '';

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-3">
            {getStepIcon()}
            <div>
              <h3 className="text-xl font-bold">{title}</h3>
              <Badge variant="outline" className="mt-1">
                {getStepTypeLabel()}
              </Badge>
            </div>
          </CardTitle>
          {mode === 'test' && (
            <Badge variant="secondary">Test Mode</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Step Content */}
        {content && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div 
              className="prose max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}

        {/* Technical Specifications */}
        {nodeData?.technicalSpecs && typeof nodeData.technicalSpecs === 'object' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Technical Specifications
            </h4>
            <div className="text-sm space-y-1">
              {nodeData.technicalSpecs && 
               typeof nodeData.technicalSpecs === 'object' && 
               'range' in nodeData.technicalSpecs && 
               nodeData.technicalSpecs.range && 
               typeof nodeData.technicalSpecs.range === 'object' && (
                <p><strong>Range:</strong> {(nodeData.technicalSpecs.range as any).min} - {(nodeData.technicalSpecs.range as any).max}</p>
              )}
              {nodeData.technicalSpecs && 
               typeof nodeData.technicalSpecs === 'object' && 
               'testPoints' in nodeData.technicalSpecs && (
                <p><strong>Test Points:</strong> {(nodeData.technicalSpecs as any).testPoints}</p>
              )}
              {nodeData.technicalSpecs && 
               typeof nodeData.technicalSpecs === 'object' && 
               'value' in nodeData.technicalSpecs && (
                <p><strong>Expected Value:</strong> {(nodeData.technicalSpecs as any).value}</p>
              )}
            </div>
          </div>
        )}

        {/* Equipment Test Specific */}
        {nodeType === 'equipment-test' && nodeData?.equipmentTest && typeof nodeData.equipmentTest === 'object' && (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Safety Requirements
              </h4>
              <ul className="text-sm space-y-1">
                {Array.isArray((nodeData.equipmentTest as any).safetyWarnings) && 
                 (nodeData.equipmentTest as any).safetyWarnings.map((warning: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Required Tools</h4>
              <ul className="text-sm space-y-1">
                {Array.isArray((nodeData.equipmentTest as any).requiredTools) && 
                 (nodeData.equipmentTest as any).requiredTools.map((tool: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Answer Options */}
        <div className="space-y-4">
          <h4 className="font-semibold">Response Required</h4>
          
          {Array.isArray(options) && options.length <= 4 ? (
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
              {options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="text-input">Enter your response:</Label>
              <Input
                id="text-input"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your answer here..."
              />
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any observations, measurements, or additional notes..."
            rows={3}
          />
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleSubmit}
          disabled={!isAnswerSelected}
          className="w-full"
          size="lg"
        >
          {nodeType === 'equipment-test' ? 'Complete Test' :
           nodeType === 'photo-capture' ? 'Capture Complete' :
           'Continue to Next Step'}
        </Button>
      </CardContent>
    </Card>
  );
}
