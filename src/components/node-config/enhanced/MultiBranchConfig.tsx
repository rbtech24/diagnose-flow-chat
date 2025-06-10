
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, GitMerge } from 'lucide-react';
import { EnhancedNodeData } from '@/types/enhanced-node-config';

interface MultiBranchConfigProps {
  nodeData: EnhancedNodeData;
  onChange: (data: EnhancedNodeData) => void;
}

export function MultiBranchConfig({ nodeData, onChange }: MultiBranchConfigProps) {
  const maxBranches = nodeData.maxBranches || 3;
  const branchLogic = nodeData.branchLogic || 'any';
  const branches = nodeData.branches || [];

  const updateConfig = (updates: Partial<EnhancedNodeData>) => {
    onChange({
      ...nodeData,
      ...updates
    });
  };

  const addBranch = () => {
    const newBranch = {
      id: `branch-${Date.now()}`,
      label: `Branch ${branches.length + 1}`,
      condition: '',
      color: `hsl(${(branches.length * 60) % 360}, 70%, 50%)`
    };

    updateConfig({
      branches: [...branches, newBranch]
    });
  };

  const removeBranch = (branchId: string) => {
    updateConfig({
      branches: branches.filter(branch => branch.id !== branchId)
    });
  };

  const updateBranch = (branchId: string, updates: any) => {
    const updatedBranches = branches.map(branch =>
      branch.id === branchId ? { ...branch, ...updates } : branch
    );
    updateConfig({ branches: updatedBranches });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitMerge className="w-4 h-4" />
          Multi-Branch Logic Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Maximum Branches</Label>
            <Input
              type="number"
              value={maxBranches}
              onChange={(e) => updateConfig({ maxBranches: Number(e.target.value) })}
              min="2"
              max="10"
            />
          </div>
          <div>
            <Label>Branch Logic</Label>
            <Select value={branchLogic} onValueChange={(value) => updateConfig({ branchLogic: value as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All conditions must be true (AND)</SelectItem>
                <SelectItem value="any">Any condition can be true (OR)</SelectItem>
                <SelectItem value="custom">Custom logic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label>Branch Conditions</Label>
          <Button 
            onClick={addBranch} 
            size="sm" 
            variant="outline"
            disabled={branches.length >= maxBranches}
          >
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
                  <Label>Condition Expression</Label>
                  <Input
                    value={branch.condition}
                    onChange={(e) => updateBranch(branch.id, { condition: e.target.value })}
                    placeholder="e.g., voltage > 12 AND temperature < 80"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {branches.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <GitMerge className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No branches configured</p>
              <p className="text-sm">Add branches to create multi-path logic</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
