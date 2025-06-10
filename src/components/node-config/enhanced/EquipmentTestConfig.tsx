
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import { EnhancedNodeData } from '@/types/enhanced-node-config';

interface EquipmentTestConfigProps {
  nodeData: EnhancedNodeData;
  onChange: (data: EnhancedNodeData) => void;
}

export function EquipmentTestConfig({ nodeData, onChange }: EquipmentTestConfigProps) {
  const equipmentTest = nodeData.equipmentTest || {
    equipmentType: '',
    testProcedure: '',
    requiredTools: [],
    safetyWarnings: [],
    expectedResults: ''
  };

  const updateEquipmentTest = (updates: Partial<typeof equipmentTest>) => {
    onChange({
      ...nodeData,
      equipmentTest: { ...equipmentTest, ...updates }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-4 h-4" />
          Equipment Test Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Equipment Type</Label>
          <Input
            value={equipmentTest.equipmentType}
            onChange={(e) => updateEquipmentTest({ equipmentType: e.target.value })}
            placeholder="e.g., Multimeter, Oscilloscope, etc."
          />
        </div>

        <div>
          <Label>Test Procedure</Label>
          <Textarea
            value={equipmentTest.testProcedure}
            onChange={(e) => updateEquipmentTest({ testProcedure: e.target.value })}
            placeholder="Detailed step-by-step test procedure..."
            rows={4}
          />
        </div>

        <div>
          <Label>Required Tools (comma-separated)</Label>
          <Input
            value={equipmentTest.requiredTools.join(', ')}
            onChange={(e) => updateEquipmentTest({ 
              requiredTools: e.target.value.split(',').map(t => t.trim()).filter(t => t)
            })}
            placeholder="Tool 1, Tool 2, Tool 3"
          />
        </div>

        <div>
          <Label>Safety Warnings (comma-separated)</Label>
          <Input
            value={equipmentTest.safetyWarnings.join(', ')}
            onChange={(e) => updateEquipmentTest({ 
              safetyWarnings: e.target.value.split(',').map(w => w.trim()).filter(w => w)
            })}
            placeholder="Warning 1, Warning 2, Warning 3"
          />
        </div>

        <div>
          <Label>Expected Results</Label>
          <Textarea
            value={equipmentTest.expectedResults}
            onChange={(e) => updateEquipmentTest({ expectedResults: e.target.value })}
            placeholder="What results should be expected from this test..."
            rows={3}
          />
        </div>

        {equipmentTest.toleranceRange && (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Min Value</Label>
              <Input
                type="number"
                value={equipmentTest.toleranceRange.min}
                onChange={(e) => updateEquipmentTest({
                  toleranceRange: {
                    ...equipmentTest.toleranceRange!,
                    min: Number(e.target.value)
                  }
                })}
              />
            </div>
            <div>
              <Label>Max Value</Label>
              <Input
                type="number"
                value={equipmentTest.toleranceRange.max}
                onChange={(e) => updateEquipmentTest({
                  toleranceRange: {
                    ...equipmentTest.toleranceRange!,
                    max: Number(e.target.value)
                  }
                })}
              />
            </div>
            <div>
              <Label>Unit</Label>
              <Input
                value={equipmentTest.toleranceRange.unit}
                onChange={(e) => updateEquipmentTest({
                  toleranceRange: {
                    ...equipmentTest.toleranceRange!,
                    unit: e.target.value
                  }
                })}
                placeholder="V, A, Ω, etc."
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
