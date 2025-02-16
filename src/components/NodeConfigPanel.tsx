
import { useState } from 'react';
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

export default function NodeConfigPanel() {
  const [nodeType, setNodeType] = useState('question');

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Node Configuration</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Node Type</Label>
          <Select defaultValue={nodeType} onValueChange={setNodeType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="symptom">Symptom</SelectItem>
              <SelectItem value="question">Question</SelectItem>
              <SelectItem value="action">Action</SelectItem>
              <SelectItem value="result">Result</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Label</Label>
          <Input placeholder="Enter node label" />
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <Textarea placeholder="Enter node content" className="min-h-[100px]" />
        </div>

        <div className="space-y-2">
          <Label>Options (one per line)</Label>
          <Textarea 
            placeholder="Yes&#10;No" 
            className="min-h-[100px]"
          />
        </div>

        <Card className="p-4 bg-gray-50">
          <Label className="mb-2 block">JSON Preview</Label>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify({
              type: nodeType,
              label: "Node Label",
              content: "Node Content",
              options: ["Yes", "No"]
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
