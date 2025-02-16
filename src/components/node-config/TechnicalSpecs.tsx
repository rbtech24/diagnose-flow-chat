
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { TechnicalSpecs } from '@/types/node-config';

interface TechnicalSpecsProps {
  nodeType: string;
  value: TechnicalSpecs;
  onChange: (specs: TechnicalSpecs) => void;
}

export function TechnicalSpecsPanel({ nodeType, value, onChange }: TechnicalSpecsProps) {
  if (!['voltage-check', 'resistance-check', 'inspection'].includes(nodeType)) {
    return null;
  }

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
      <h3 className="font-medium text-sm">Technical Specifications</h3>
      
      {nodeType === 'voltage-check' && (
        <>
          <div className="space-y-2">
            <Label>Expected Voltage Range</Label>
            <div className="flex gap-2 items-center">
              <Input 
                type="number" 
                placeholder="Min" 
                className="w-24"
                value={value.range?.min || 0}
                onChange={(e) => onChange({
                  ...value,
                  range: { ...value.range, min: Number(e.target.value) }
                })}
              />
              <span>to</span>
              <Input 
                type="number" 
                placeholder="Max" 
                className="w-24"
                value={value.range?.max || 0}
                onChange={(e) => onChange({
                  ...value,
                  range: { ...value.range, max: Number(e.target.value) }
                })}
              />
              <span>V</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Test Points</Label>
            <Input 
              placeholder="e.g., 'Between terminal 1 and ground'"
              value={value.testPoints || ''}
              onChange={(e) => onChange({
                ...value,
                testPoints: e.target.value
              })}
            />
          </div>
        </>
      )}
      
      {nodeType === 'resistance-check' && (
        <>
          <div className="space-y-2">
            <Label>Expected Resistance</Label>
            <div className="flex gap-2 items-center">
              <Input 
                type="number" 
                placeholder="Value" 
                className="w-32"
                value={value.value || 0}
                onChange={(e) => onChange({
                  ...value,
                  value: Number(e.target.value)
                })}
              />
              <span>Ω</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Measurement Points</Label>
            <Input 
              placeholder="e.g., 'Across heating element'"
              value={value.measurementPoints || ''}
              onChange={(e) => onChange({
                ...value,
                measurementPoints: e.target.value
              })}
            />
          </div>
        </>
      )}
      
      {nodeType === 'inspection' && (
        <div className="space-y-2">
          <Label>Inspection Points</Label>
          <Textarea 
            placeholder="List specific points to inspect&#10;1. Check for visible damage&#10;2. Verify connection integrity"
            value={value.points || ''}
            onChange={(e) => onChange({
              ...value,
              points: e.target.value
            })}
          />
        </div>
      )}
    </div>
  );
}
