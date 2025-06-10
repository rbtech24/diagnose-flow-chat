
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  Clock,
  User,
  ArrowRight
} from 'lucide-react';
import { SavedWorkflow } from '@/utils/flow/types';
import { WorkflowExecutionStep } from './WorkflowExecutionStep';
import { ExecutionHistory } from './ExecutionHistory';
import { toast } from '@/hooks/use-toast';

interface WorkflowExecutionState {
  currentNodeId: string | null;
  completedSteps: string[];
  answers: Record<string, any>;
  startTime: Date | null;
  endTime: Date | null;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
  executionPath: string[];
}

interface WorkflowRunnerProps {
  workflow: SavedWorkflow;
  mode: 'test' | 'production';
  onComplete?: (results: any) => void;
  onError?: (error: string) => void;
}

export function WorkflowRunner({ 
  workflow, 
  mode = 'test',
  onComplete,
  onError 
}: WorkflowRunnerProps) {
  const [executionState, setExecutionState] = useState<WorkflowExecutionState>({
    currentNodeId: null,
    completedSteps: [],
    answers: {},
    startTime: null,
    endTime: null,
    status: 'idle',
    executionPath: []
  });

  const [executionHistory, setExecutionHistory] = useState<any[]>([]);

  // Find the starting node (usually the first node or one with no incoming edges)
  const findStartNode = useCallback(() => {
    const incomingEdges = workflow.edges.map(edge => edge.target);
    const startNode = workflow.nodes.find(node => !incomingEdges.includes(node.id));
    return startNode || workflow.nodes[0];
  }, [workflow]);

  // Start workflow execution
  const startExecution = useCallback(() => {
    const startNode = findStartNode();
    if (!startNode) {
      onError?.('No starting node found in workflow');
      return;
    }

    setExecutionState({
      currentNodeId: startNode.id,
      completedSteps: [],
      answers: {},
      startTime: new Date(),
      endTime: null,
      status: 'running',
      executionPath: [startNode.id]
    });

    toast({
      title: "Workflow Started",
      description: `Executing workflow: ${workflow.metadata.name}`
    });
  }, [workflow, findStartNode, onError]);

  // Handle step completion and navigation
  const handleStepComplete = useCallback((nodeId: string, answer: any) => {
    const currentNode = workflow.nodes.find(node => node.id === nodeId);
    if (!currentNode) return;

    // Find next node based on answer
    const outgoingEdges = workflow.edges.filter(edge => edge.source === nodeId);
    let nextNodeId: string | null = null;

    if (outgoingEdges.length > 0) {
      // For yes/no questions
      if (typeof answer === 'boolean' || answer === 'Yes' || answer === 'No') {
        const targetEdge = outgoingEdges.find(edge => {
          return (answer === true || answer === 'Yes') && edge.sourceHandle === 'a' ||
                 (answer === false || answer === 'No') && edge.sourceHandle === 'b';
        });
        nextNodeId = targetEdge?.target || outgoingEdges[0].target;
      } else {
        // For multiple choice, use first edge for now
        nextNodeId = outgoingEdges[0].target;
      }
    }

    const newCompletedSteps = [...executionState.completedSteps, nodeId];
    const newAnswers = { ...executionState.answers, [nodeId]: answer };
    const newExecutionPath = [...executionState.executionPath];
    
    if (nextNodeId && !newExecutionPath.includes(nextNodeId)) {
      newExecutionPath.push(nextNodeId);
    }

    // Check if workflow is complete
    const isComplete = !nextNodeId || newCompletedSteps.length >= workflow.nodes.length;

    setExecutionState(prev => ({
      ...prev,
      currentNodeId: nextNodeId,
      completedSteps: newCompletedSteps,
      answers: newAnswers,
      executionPath: newExecutionPath,
      status: isComplete ? 'completed' : 'running',
      endTime: isComplete ? new Date() : null
    }));

    // Save to execution history
    const executionEntry = {
      nodeId,
      answer,
      timestamp: new Date(),
      nodeLabel: currentNode.data?.label || currentNode.data?.title || 'Unknown Step'
    };
    setExecutionHistory(prev => [...prev, executionEntry]);

    if (isComplete) {
      const results = {
        workflow: workflow.metadata.name,
        completedSteps: newCompletedSteps,
        answers: newAnswers,
        executionPath: newExecutionPath,
        duration: executionState.startTime ? 
          new Date().getTime() - executionState.startTime.getTime() : 0
      };
      
      onComplete?.(results);
      toast({
        title: "Workflow Completed",
        description: `Successfully completed ${workflow.metadata.name}`
      });
    }
  }, [workflow, executionState, onComplete]);

  // Reset execution
  const resetExecution = useCallback(() => {
    setExecutionState({
      currentNodeId: null,
      completedSteps: [],
      answers: {},
      startTime: null,
      endTime: null,
      status: 'idle',
      executionPath: []
    });
    setExecutionHistory([]);
  }, []);

  // Pause/Resume execution
  const togglePause = useCallback(() => {
    setExecutionState(prev => ({
      ...prev,
      status: prev.status === 'running' ? 'paused' : 'running'
    }));
  }, []);

  const progress = workflow.nodes.length > 0 ? 
    (executionState.completedSteps.length / workflow.nodes.length) * 100 : 0;

  const currentNode = executionState.currentNodeId ? 
    workflow.nodes.find(node => node.id === executionState.currentNodeId) : null;

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Execution Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Workflow Execution
              <Badge variant={mode === 'test' ? 'secondary' : 'default'}>
                {mode === 'test' ? 'Test Mode' : 'Production'}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              {executionState.status === 'idle' && (
                <Button onClick={startExecution} className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Start Workflow
                </Button>
              )}
              {executionState.status === 'running' && (
                <Button variant="outline" onClick={togglePause}>
                  <Pause className="w-4 h-4" />
                </Button>
              )}
              {executionState.status === 'paused' && (
                <Button onClick={togglePause}>
                  <Play className="w-4 h-4" />
                </Button>
              )}
              <Button variant="outline" onClick={resetExecution}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{executionState.completedSteps.length} / {workflow.nodes.length} steps</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Status Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant={executionState.status === 'running' ? 'default' : 'secondary'}>
                {executionState.status === 'running' && <Clock className="w-3 h-3" />}
                {executionState.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                {executionState.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                {executionState.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span>Technician Mode</span>
            </div>
            {executionState.startTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>
                  {executionState.endTime ? 
                    formatDuration(executionState.endTime.getTime() - executionState.startTime.getTime()) :
                    formatDuration(new Date().getTime() - executionState.startTime.getTime())
                  }
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-gray-500" />
              <span>{workflow.metadata.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      {currentNode && executionState.status === 'running' && (
        <WorkflowExecutionStep
          node={currentNode}
          onComplete={(answer) => handleStepComplete(currentNode.id, answer)}
          mode={mode}
        />
      )}

      {/* Execution History */}
      {executionHistory.length > 0 && (
        <ExecutionHistory 
          history={executionHistory}
          answers={executionState.answers}
        />
      )}

      {/* Completion Summary */}
      {executionState.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Workflow Completed Successfully
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Total Steps: {executionState.completedSteps.length}</p>
              <p>Duration: {executionState.startTime && executionState.endTime ? 
                formatDuration(executionState.endTime.getTime() - executionState.startTime.getTime()) : 'N/A'}
              </p>
              <p>Execution Path: {executionState.executionPath.length} nodes</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
