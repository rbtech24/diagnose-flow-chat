
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Camera } from 'lucide-react';
import { EnhancedNodeData } from '@/types/enhanced-node-config';

interface PhotoCaptureConfigProps {
  nodeData: EnhancedNodeData;
  onChange: (data: EnhancedNodeData) => void;
}

export function PhotoCaptureConfig({ nodeData, onChange }: PhotoCaptureConfigProps) {
  const photoCapture = nodeData.photoCapture || {
    required: false,
    maxPhotos: 5,
    guidelines: [],
    requiredAngles: [],
    annotations: false
  };

  const updatePhotoCapture = (updates: Partial<typeof photoCapture>) => {
    onChange({
      ...nodeData,
      photoCapture: { ...photoCapture, ...updates }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Photo Capture Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={photoCapture.required}
            onCheckedChange={(checked) => updatePhotoCapture({ required: !!checked })}
          />
          <Label>Photo capture required</Label>
        </div>

        <div>
          <Label>Maximum Photos</Label>
          <Input
            type="number"
            value={photoCapture.maxPhotos}
            onChange={(e) => updatePhotoCapture({ maxPhotos: Number(e.target.value) })}
            min="1"
            max="20"
          />
        </div>

        <div>
          <Label>Photo Guidelines</Label>
          <Textarea
            value={photoCapture.guidelines.join('\n')}
            onChange={(e) => updatePhotoCapture({ 
              guidelines: e.target.value.split('\n').filter(g => g.trim())
            })}
            placeholder="Enter guidelines, one per line..."
            rows={4}
          />
        </div>

        <div>
          <Label>Required Angles (comma-separated)</Label>
          <Input
            value={photoCapture.requiredAngles?.join(', ') || ''}
            onChange={(e) => updatePhotoCapture({ 
              requiredAngles: e.target.value.split(',').map(a => a.trim()).filter(a => a)
            })}
            placeholder="Front, Back, Left Side, Right Side"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={photoCapture.annotations}
            onCheckedChange={(checked) => updatePhotoCapture({ annotations: !!checked })}
          />
          <Label>Enable photo annotations</Label>
        </div>
      </CardContent>
    </Card>
  );
}
