
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { SavedWorkflow } from '@/utils/flow/types';
import { WorkflowRunner } from './WorkflowRunner';

interface WorkflowPreviewProps {
  workflow: SavedWorkflow;
  onValidationComplete?: (isValid: boolean, issues: string[]) => void;
}

interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  nodeId: string;
  message: string;
}

export function WorkflowPreview({ 
  workflow, 
  onValidationComplete 
}: WorkflowPreviewProps) {
  const [showRunner, setShowRunner] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationIssue[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  // Validate workflow logic
  const validateWorkflow = async () => {
    setIsValidating(true);
    const issues: ValidationIssue[] = [];

    try {
      // Check for nodes without content
      workflow.nodes.forEach(node => {
        if (!node.data?.title && !node.data?.label) {
          issues.push({
            type: 'error',
            nodeId: node.id,
            message: 'Node missing title or label'
          });
        }

        if (!node.data?.content && !node.data?.richInfo) {
          issues.push({
            type: 'warning',
            nodeId: node.id,
            message: 'Node missing content or instructions'
          });
        }
      });

      // Check for disconnected nodes
      const connectedNodes = new Set<string>();
      workflow.edges.forEach(edge => {
        connectedNodes.add(edge.source);
        connectedNodes.add(edge.target);
      });

      workflow.nodes.forEach(node => {
        if (!connectedNodes.has(node.id) && workflow.nodes.length > 1) {
          issues.push({
            type: 'warning',
            nodeId: node.id,
            message: 'Node is not connected to the workflow'
          });
        }
      });

      // Check for start node
      const incomingEdges = workflow.edges.map(edge => edge.target);
      const startNodes = workflow.nodes.filter(node => !incomingEdges.includes(node.id));
      
      if (startNodes.length === 0 && workflow.nodes.length > 0) {
        issues.push({
          type: 'error',
          nodeId: workflow.nodes[0].id,
          message: 'No starting node found (circular workflow detected)'
        });
      }

      // Check for end nodes
      const outgoingEdges = workflow.edges.map(edge => edge.source);
      const endNodes = workflow.nodes.filter(node => !outgoingEdges.includes(node.id));
      
      if (endNodes.length === 0 && workflow.nodes.length > 1) {
        issues.push({
          type: 'warning',
          nodeId: workflow.nodes[workflow.nodes.length - 1].id,
          message: 'No end nodes found - workflow may run indefinitely'
        });
      }

      // Check for unreachable nodes
      if (startNodes.length > 0) {
        const reachableNodes = new Set<string>();
        const toVisit = [...startNodes.map(node => node.id)];
        
        while (toVisit.length > 0) {
          const currentNodeId = toVisit.pop()!;
          if (reachableNodes.has(currentNodeId)) continue;
          
          reachableNodes.add(currentNodeId);
          const outgoing = workflow.edges
            .filter(edge => edge.source === currentNodeId)
            .map(edge => edge.target);
          toVisit.push(...outgoing);
        }

        workflow.nodes.forEach(node => {
          if (!reachableNodes.has(node.id)) {
            issues.push({
              type: 'warning',
              nodeId: node.id,
              message: 'Node is unreachable from start'
            });
          }
        });
      }

      setValidationResults(issues);
      const isValid = issues.filter(issue => issue.type === 'error').length === 0;
      onValidationComplete?.(isValid, issues.map(issue => issue.message));
      
    } catch (error) {
      issues.push({
        type: 'error',
        nodeId: 'system',
        message: 'Validation failed due to unexpected error'
      });
    }

    setIsValidating(false);
  };

  // Simulate workflow with sample data
  const simulateWorkflow = () => {
    // This would run through the workflow with predefined answers
    console.log('Simulating workflow with sample data...');
    // Implementation for simulation would go here
  };

  const errorCount = validationResults.filter(issue => issue.type === 'error').length;
  const warningCount = validationResults.filter(issue => issue.type === 'warning').length;

  if (showRunner) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Test Workflow Execution</h3>
          <Button variant="outline" onClick={() => setShowRunner(false)}>
            Back to Preview
          </Button>
        </div>
        <WorkflowRunner 
          workflow={workflow} 
          mode="test"
          onComplete={(results) => {
            console.log('Test execution completed:', results);
          }}
          onError={(error) => {
            console.error('Test execution error:', error);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Workflow Preview & Validation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Workflow Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{workflow.nodes.length}</div>
              <div className="text-sm text-gray-600">Total Steps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{workflow.edges.length}</div>
              <div className="text-sm text-gray-600">Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.max(1, Math.ceil(workflow.nodes.length / 2))}
              </div>
              <div className="text-sm text-gray-600">Est. Duration (min)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {workflow.metadata.folder || 'General'}
              </div>
              <div className="text-sm text-gray-600">Category</div>
            </div>
          </div>

          <Separator />

          {/* Validation Actions */}
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={validateWorkflow}
              disabled={isValidating}
              className="flex items-center gap-2"
            >
              {isValidating ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Validate Workflow
            </Button>
            
            <Button 
              variant="outline"
              onClick={simulateWorkflow}
              className="flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Simulate with Sample Data
            </Button>
            
            <Button 
              onClick={() => setShowRunner(true)}
              disabled={errorCount > 0}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Test Run Workflow
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Validation Results
              <div className="flex gap-2">
                {errorCount > 0 && (
                  <Badge variant="destructive">{errorCount} errors</Badge>
                )}
                {warningCount > 0 && (
                  <Badge variant="secondary">{warningCount} warnings</Badge>
                )}
                {errorCount === 0 && warningCount === 0 && (
                  <Badge variant="default" className="bg-green-600">All Good</Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {validationResults.map((issue, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    issue.type === 'error' ? 'bg-red-50 border-l-red-500' :
                    issue.type === 'warning' ? 'bg-yellow-50 border-l-yellow-500' :
                    'bg-blue-50 border-l-blue-500'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Badge 
                      variant={issue.type === 'error' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {issue.type}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm">{issue.message}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Node ID: {issue.nodeId}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow Flow Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Flow Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {workflow.nodes.map((node, index) => (
              <div key={node.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                  {index + 1}
                </Badge>
                <div className="flex-1">
                  <span className="font-medium">
                    {typeof node.data?.title === 'string' ? node.data.title : 
                     typeof node.data?.label === 'string' ? node.data.label : 
                     `Step ${index + 1}`}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {typeof node.data?.type === 'string' ? node.data.type : 'question'}
                </div>
                {index < workflow.nodes.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
