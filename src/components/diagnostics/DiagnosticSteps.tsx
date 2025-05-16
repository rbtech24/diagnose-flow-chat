import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle, Stethoscope, AlertCircle, Info } from "lucide-react";
import { SavedWorkflow } from '@/utils/flow/types';

interface DiagnosticStepsProps {
  workflow: SavedWorkflow;
}

interface NodeData {
  title?: string;
  content?: string;
  richInfo?: string;
  technicalSpecs?: any;
  yes?: string;
  no?: string;
  options?: string[];
  type?: string;
}

export function DiagnosticSteps({ workflow }: DiagnosticStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answerPath, setAnswerPath] = useState<string[]>([]);
  
  // Sort nodes for consistent display
  const sortedNodes = workflow.nodes.sort((a, b) => {
    // First by position Y
    if (a.position.y !== b.position.y) {
      return a.position.y - b.position.y;
    }
    // Then by position X if Y is the same
    return a.position.x - b.position.x;
  });
  
  // Get all edges for navigation
  const edges = workflow.edges;
  
  const handleNextStep = () => {
    if (currentStep < sortedNodes.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Remove the last answer from the path when going back
      if (answerPath.length > 0) {
        setAnswerPath(answerPath.slice(0, -1));
      }
    }
  };

  const handleOptionSelect = (option: string, index: number) => {
    // Find edges from current node
    const currentNode = sortedNodes[currentStep];
    const outgoingEdges = edges.filter(edge => edge.source === currentNode.id);
    
    // If there are outgoing edges, follow the path
    if (outgoingEdges.length > 0) {
      // For yes/no type nodes
      if (option === 'Yes' || option === 'No') {
        const targetEdge = outgoingEdges.find(edge => {
          return (option === 'Yes' && edge.sourceHandle === 'a') || 
                 (option === 'No' && edge.sourceHandle === 'b');
        });
        
        if (targetEdge) {
          const targetNode = sortedNodes.findIndex(node => node.id === targetEdge.target);
          if (targetNode !== -1) {
            setCurrentStep(targetNode);
            setAnswerPath([...answerPath, option]);
            return;
          }
        }
      }
      
      // For multi-option nodes (future enhancement)
      const targetEdge = outgoingEdges[index % outgoingEdges.length];
      if (targetEdge) {
        const targetNode = sortedNodes.findIndex(node => node.id === targetEdge.target);
        if (targetNode !== -1) {
          setCurrentStep(targetNode);
          setAnswerPath([...answerPath, option]);
          return;
        }
      }
    }
    
    // Default to next step if no edge is found
    handleNextStep();
  };

  if (!sortedNodes.length) {
    return (
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            No diagnostic steps available
          </CardTitle>
          <CardDescription>
            This workflow doesn't contain any diagnostic steps
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentNode = sortedNodes[currentStep];
  const data = currentNode?.data as NodeData;
  const nodeContent = data.richInfo || data.content || '';
  const isFlowAnswer = currentNode.type === 'flowAnswer';
  const isFlowNode = currentNode.type === 'flowNode';
  const isQuestion = data.type === 'question' || isFlowNode;
  
  // Determine if node has Yes/No options or custom options
  const hasYesNo = data.yes !== undefined && data.no !== undefined;
  const options = data.options || (hasYesNo ? ['Yes', 'No'] : []);

  return (
    <Card className="w-full mb-6">
      {/* Updated header with more vibrant styling */}
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Stethoscope className="h-6 w-6 text-blue-600" />
            Step {currentStep + 1} of {sortedNodes.length}
          </CardTitle>
          <div className="flex items-center text-sm gap-2">
            <span className="px-2 py-1 bg-blue-100 rounded text-blue-700">
              {workflow.metadata.name}
            </span>
          </div>
        </div>
        {/* Enhanced title with larger font and bold styling */}
        <div className="mt-3 border-l-4 border-blue-500 pl-3">
          <h2 className="text-2xl font-bold text-blue-800 mb-1">
            {data.title || 'Diagnostic Step'}
          </h2>
          <CardDescription className="text-base text-blue-700">
            Follow the instructions below to diagnose the issue
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 prose max-w-none">
          {typeof nodeContent === 'string' && nodeContent && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <div 
                className="prose max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: nodeContent }}
              />
            </div>
          )}
          
          {data.technicalSpecs && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                Technical Details
              </h3>
              <div className="text-sm">
                {data.type === 'voltage-check' && (
                  <>
                    <p><strong>Expected:</strong> {data.technicalSpecs.range?.min}V - {data.technicalSpecs.range?.max}V</p>
                    <p><strong>Test Points:</strong> {data.technicalSpecs.testPoints}</p>
                  </>
                )}
                {data.type === 'resistance-check' && (
                  <>
                    <p><strong>Expected:</strong> {data.technicalSpecs.value}Ω</p>
                    <p><strong>Measure:</strong> {data.technicalSpecs.measurementPoints}</p>
                  </>
                )}
                {data.type === 'inspection' && (
                  <div dangerouslySetInnerHTML={{ 
                    __html: data.technicalSpecs.points?.replace(/\n/g, '<br/>') || ''
                  }} />
                )}
              </div>
            </div>
          )}
          
          {isQuestion && options.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Decision Points:</h3>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div 
                    key={index}
                    className="p-3 border rounded-lg flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleOptionSelect(option, index)}
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-base">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {isFlowAnswer && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold mb-2 text-green-700">Solution:</h3>
              {typeof nodeContent === 'string' && (
                <div 
                  className="prose max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: nodeContent }}
                />
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous Step
          </Button>
          
          {!isQuestion && (
            <Button
              onClick={handleNextStep}
              disabled={currentStep === sortedNodes.length - 1}
              className="flex items-center gap-2"
            >
              Next Step
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {answerPath.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            <span>Path: </span>
            {answerPath.map((answer, index) => (
              <span key={index}>
                {index > 0 && " → "}
                <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs">{answer}</span>
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
