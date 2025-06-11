
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { BarChart, Eye, Clock, GitBranch, Users, GripHorizontal } from 'lucide-react';
import { Node, Edge } from '@xyflow/react';

interface WorkflowOverviewProps {
  nodes: Node[];
  edges: Edge[];
  currentWorkflow?: any;
}

export function WorkflowOverview({ nodes, edges, currentWorkflow }: WorkflowOverviewProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return; // Don't start drag if clicking the button
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const getNodeTypeStats = () => {
    const stats: Record<string, number> = {};
    nodes.forEach(node => {
      const type = node.type || 'default';
      stats[type] = (stats[type] || 0) + 1;
    });
    return stats;
  };

  const getComplexityScore = () => {
    const nodeCount = nodes.length;
    const edgeCount = edges.length;
    const branchingFactor = edgeCount / Math.max(nodeCount, 1);
    
    if (nodeCount < 5) return { level: 'Simple', color: 'bg-green-100 text-green-800' };
    if (nodeCount < 15 && branchingFactor < 2) return { level: 'Moderate', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Complex', color: 'bg-red-100 text-red-800' };
  };

  const nodeStats = getNodeTypeStats();
  const complexity = getComplexityScore();

  return (
    <div 
      ref={containerRef}
      className={`absolute z-10 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="bg-white rounded-lg shadow-lg border p-2 flex items-center gap-2">
        <GripHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Overview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Workflow Overview
              </DialogTitle>
              <DialogDescription>
                {currentWorkflow ? 
                  `Analysis of "${currentWorkflow.metadata.name}"` : 
                  'Current workflow analysis'
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{nodes.length}</div>
                    <div className="text-sm text-muted-foreground">Total Steps</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{edges.length}</div>
                    <div className="text-sm text-muted-foreground">Connections</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Badge className={complexity.color}>{complexity.level}</Badge>
                    <div className="text-sm text-muted-foreground mt-1">Complexity</div>
                  </CardContent>
                </Card>
              </div>

              {/* Node Type Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(nodeStats).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="capitalize">{type.replace('-', ' ')}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Workflow Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GitBranch className="w-5 h-5" />
                    Workflow Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Start nodes</span>
                    <Badge variant={nodes.filter(n => n.type === 'start').length === 1 ? 'default' : 'destructive'}>
                      {nodes.filter(n => n.type === 'start').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>End nodes (solutions)</span>
                    <Badge variant={nodes.filter(n => n.type === 'solution').length > 0 ? 'default' : 'destructive'}>
                      {nodes.filter(n => n.type === 'solution').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Isolated nodes</span>
                    <Badge variant={nodes.filter(n => 
                      !edges.some(e => e.source === n.id || e.target === n.id)
                    ).length === 0 ? 'default' : 'destructive'}>
                      {nodes.filter(n => 
                        !edges.some(e => e.source === n.id || e.target === n.id)
                      ).length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Estimated Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Estimated Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Completion time</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.max(5, nodes.length * 2)} - {nodes.length * 5} minutes
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Difficulty level</span>
                    <Badge className={complexity.color}>{complexity.level}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Decision points</span>
                    <span className="text-sm text-muted-foreground">
                      {nodes.filter(n => n.type === 'question' || n.type === 'decision-tree').length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
