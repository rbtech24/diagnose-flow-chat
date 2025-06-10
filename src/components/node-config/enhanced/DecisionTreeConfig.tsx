
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GitBranch } from 'lucide-react';
import { DecisionBranch, EnhancedNodeData } from '@/types/enhanced-node-config';

interface DecisionTreeConfigProps {
  nodeData: EnhancedNodeData;
  onChange: (data: EnhancedNodeData) => void;
}

export function DecisionTreeConfig({ nodeData, onChange }: DecisionTreeConfigProps) {
  const branches = nodeData.branches || [];

  const addBranch = () => {
    const newBranch: DecisionBranch = {
      id: `branch-${Date.now()}`,
      label: `Branch ${branches.length + 1}`,
      condition: '',
      color: `hsl(${(branches.length * 60) % 360}, 70%, 50%)`
    };

    onChange({
      ...nodeData,
      branches: [...branches, newBranch]
    });
  };

  const updateBranch = (branchId: string, updates: Partial<DecisionBranch>) => {
    const updatedBranches = branches.map(branch =>
      branch.id === branchId ? { ...branch, ...updates } : branch
    );

    onChange({
      ...nodeData,
      branches: updatedBranches
    });
  };

  const removeBranch = (branchId: string) => {
    const updatedBranches = branches.filter(branch => branch.id !== branchId);
    onChange({
      ...nodeData,
      branches: updatedBranches
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          Decision Tree Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Decision Branches</Label>
          <Button onClick={addBranch} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Branch
          </Button>
        </div>

        <div className="space-y-3">
          {branches.map((branch, index) => (
            <Card key={branch.id} className="border-l-4" style={{ borderLeftColor: branch.color }}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Branch {index + 1}</span>
                  <Button
                    onClick={() => removeBranch(branch.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <Label>Branch Label</Label>
                  <Input
                    value={branch.label}
                    onChange={(e) => updateBranch(branch.id, { label: e.target.value })}
                    placeholder="Enter branch label"
                  />
                </div>

                <div>
                  <Label>Condition</Label>
                  <Input
                    value={branch.condition}
                    onChange={(e) => updateBranch(branch.id, { condition: e.target.value })}
                    placeholder="Enter condition logic"
                  />
                </div>

                <div>
                  <Label>Color</Label>
                  <input
                    type="color"
                    value={branch.color}
                    onChange={(e) => updateBranch(branch.id, { color: e.target.value })}
                    className="w-full h-8 rounded border"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {branches.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No branches configured</p>
              <p className="text-sm">Add branches to create decision paths</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
