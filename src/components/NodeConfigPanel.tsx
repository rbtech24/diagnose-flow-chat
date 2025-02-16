
import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export default function NodeConfigPanel({ node }) {
  const [nodeType, setNodeType] = useState('question');
  const [label, setLabel] = useState('');
  const [content, setContent] = useState('');
  const [options, setOptions] = useState('');
  const [showTechnicalFields, setShowTechnicalFields] = useState(false);

  useEffect(() => {
    if (node) {
      setNodeType(node.data.type || 'question');
      setLabel(node.data.label || '');
      setContent(node.data.content || '');
      setOptions(node.data.options?.join('\n') || '');
      setShowTechnicalFields(['voltage-check', 'resistance-check', 'inspection'].includes(node.data.type));
    }
  }, [node]);

  if (!node) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a node to edit its properties
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Node Configuration</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Node Type</Label>
          <Select 
            value={nodeType} 
            onValueChange={(value) => {
              setNodeType(value);
              setShowTechnicalFields(['voltage-check', 'resistance-check', 'inspection'].includes(value));
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="symptom">Symptom</SelectItem>
              <SelectItem value="question">Question</SelectItem>
              <SelectItem value="instruction">Instruction</SelectItem>
              <SelectItem value="voltage-check">Voltage Check</SelectItem>
              <SelectItem value="resistance-check">Resistance Check</SelectItem>
              <SelectItem value="inspection">Visual Inspection</SelectItem>
              <SelectItem value="result">Result</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Label</Label>
          <Input 
            placeholder="Enter node label" 
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <Textarea 
            placeholder="Enter node content" 
            className="min-h-[100px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {showTechnicalFields && (
          <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium text-sm">Technical Specifications</h3>
            
            {nodeType === 'voltage-check' && (
              <>
                <div className="space-y-2">
                  <Label>Expected Voltage Range</Label>
                  <div className="flex gap-2 items-center">
                    <Input type="number" placeholder="Min" className="w-24" />
                    <span>to</span>
                    <Input type="number" placeholder="Max" className="w-24" />
                    <span>V</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Test Points</Label>
                  <Input placeholder="e.g., 'Between terminal 1 and ground'" />
                </div>
              </>
            )}
            
            {nodeType === 'resistance-check' && (
              <>
                <div className="space-y-2">
                  <Label>Expected Resistance</Label>
                  <div className="flex gap-2 items-center">
                    <Input type="number" placeholder="Value" className="w-32" />
                    <span>Ω</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Measurement Points</Label>
                  <Input placeholder="e.g., 'Across heating element'" />
                </div>
              </>
            )}
            
            {nodeType === 'inspection' && (
              <div className="space-y-2">
                <Label>Inspection Points</Label>
                <Textarea placeholder="List specific points to inspect&#10;1. Check for visible damage&#10;2. Verify connection integrity" />
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label>Response Options (one per line)</Label>
          <Textarea 
            placeholder="Enter each possible response on a new line:&#10;Within range&#10;Out of range&#10;Open circuit&#10;Need further testing" 
            className="min-h-[100px]"
            value={options}
            onChange={(e) => setOptions(e.target.value)}
          />
        </div>

        <Card className="p-4 bg-gray-50">
          <Label className="mb-2 block">JSON Preview</Label>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify({
              type: nodeType,
              label,
              content,
              technicalSpecs: showTechnicalFields ? {
                range: { min: 0, max: 0 },
                testPoints: "Between terminals",
              } : undefined,
              options: options.split('\n').filter(Boolean)
            }, null, 2)}
          </pre>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Reset</Button>
          <Button>Apply Changes</Button>
        </div>
      </div>
    </div>
  );
}
