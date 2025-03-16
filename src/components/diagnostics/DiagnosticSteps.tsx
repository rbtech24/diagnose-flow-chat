
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, Stethoscope, AlertCircle, Info } from "lucide-react";
import { SavedWorkflow } from '@/utils/flow/types';

interface DiagnosticStepsProps {
  workflow: SavedWorkflow;
}

interface NodeData {
  title?: string;
  content?: string;
  technicalContent?: string;
  options?: string[];
}

export function DiagnosticSteps({ workflow }: DiagnosticStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const nodes = workflow.nodes.sort((a, b) => a.position.y - b.position.y);
  
  const handleNextStep = () => {
    if (currentStep < nodes.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!nodes.length) {
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

  const currentNode = nodes[currentStep];
  const data = currentNode?.data as NodeData;

  return (
    <Card className="w-full mb-6">
      <CardHeader className="bg-blue-50 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            Step {currentStep + 1} of {nodes.length}
          </CardTitle>
          <div className="flex items-center text-sm gap-2">
            <span className="px-2 py-1 bg-blue-100 rounded text-blue-700">
              {workflow.metadata.name}
            </span>
          </div>
        </div>
        <CardDescription>{data.title || 'Diagnostic Step'}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 prose max-w-none">
          {data.content && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p>{data.content}</p>
            </div>
          )}
          
          {data.technicalContent && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                Technical Details
              </h3>
              <p>{data.technicalContent}</p>
            </div>
          )}
          
          {data.options && data.options.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Decision Points:</h3>
              <div className="space-y-2">
                {data.options.map((option: string, index: number) => (
                  <div 
                    key={index}
                    className="p-3 border rounded-lg flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span>{option}</span>
                  </div>
                ))}
              </div>
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
          <Button
            onClick={handleNextStep}
            disabled={currentStep === nodes.length - 1}
            className="flex items-center gap-2"
          >
            Next Step
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
