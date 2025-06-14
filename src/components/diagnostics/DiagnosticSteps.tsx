import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle, Stethoscope, AlertCircle, Info, Image, Video, FileText } from "lucide-react";
import { SavedWorkflow } from '@/utils/flow/types';
import { MediaItem, WarningConfig } from '@/types/node-config';
import { PDFViewer } from '../diagnosis/PDFViewer';
import { useNavigate } from 'react-router-dom';

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
  media?: MediaItem[];
  warning?: WarningConfig;
  linkToWorkflow?: {
    workflowName: string;
    stepId?: string;
  };
}

export function DiagnosticSteps({ workflow }: DiagnosticStepsProps) {
  const [history, setHistory] = useState<number[]>([0]);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const currentStepIndex = history[history.length - 1];

  // Sort nodes for consistent display, starting with the 'start' node if available
  const sortedNodes = [...workflow.nodes].sort((a, b) => {
    if (a.data.type === 'start') return -1;
    if (b.data.type === 'start') return 1;
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
    if (currentStepIndex < sortedNodes.length - 1) {
      setHistory([...history, currentStepIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    if (history.length > 1) {
      setHistory(history.slice(0, -1));
    }
  };

  const handleOptionSelect = (option: string, index: number) => {
    // Find edges from current node
    const currentNode = sortedNodes[currentStepIndex];
    const outgoingEdges = edges.filter(edge => edge.source === currentNode.id);
    
    // If there are outgoing edges, follow the path
    if (outgoingEdges.length > 0) {
      // For yes/no type nodes
      if (option === 'Yes' || option === 'No') {
        const targetEdge = outgoingEdges.find(edge => {
          return (option === 'Yes' && (edge.sourceHandle === 'a' || edge.sourceHandle === 'yes')) || 
                 (option === 'No' && (edge.sourceHandle === 'b' || edge.sourceHandle === 'no'));
        });
        
        if (targetEdge) {
          const targetNodeIndex = sortedNodes.findIndex(node => node.id === targetEdge.target);
          if (targetNodeIndex !== -1) {
            setHistory([...history, targetNodeIndex]);
            return;
          }
        }
      }
      
      // For multi-option nodes
      const targetEdge = outgoingEdges[index % outgoingEdges.length];
      if (targetEdge) {
        const targetNodeIndex = sortedNodes.findIndex(node => node.id === targetEdge.target);
        if (targetNodeIndex !== -1) {
          setHistory([...history, targetNodeIndex]);
          return;
        }
      }
    }
    
    // Default to next step if no edge is found
    handleNextStep();
  };

  const handleImageClick = (url: string) => {
    setExpandedImage(url);
  };

  const handleCloseExpandedImage = () => {
    setExpandedImage(null);
  };

  const renderMedia = (media: MediaItem[]) => {
    if (!media || media.length === 0) return null;
    
    // Group media by type
    const images = media.filter(item => item.type === 'image');
    const videos = media.filter(item => item.type === 'video');
    const pdfs = media.filter(item => item.type === 'pdf');
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Image className="h-5 w-5 text-blue-600" />
          Media References
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.length > 0 && images.map((item, idx) => (
            <div key={`image-${idx}`} className="rounded-lg overflow-hidden border border-gray-200">
              <div className="relative">
                <img 
                  src={item.url} 
                  alt="Diagnostic reference" 
                  className="w-full h-auto object-cover cursor-pointer"
                  onClick={() => handleImageClick(item.url)}
                />
              </div>
            </div>
          ))}

          {videos.length > 0 && videos.map((item, idx) => (
            <div key={`video-${idx}`} className="rounded-lg overflow-hidden border border-gray-200">
              <div className="aspect-video">
                <iframe
                  src={item.url}
                  title="Diagnostic video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ))}

          {pdfs.length > 0 && pdfs.map((item, idx) => (
            <div key={`pdf-${idx}`} className="rounded-lg overflow-hidden border border-gray-200">
              <div className="w-full p-2 bg-gray-50">
                <div className="flex items-center justify-between text-sm font-medium text-gray-700 p-1">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-blue-600" />
                    <span>PDF Document {idx + 1}</span>
                  </div>
                </div>
                <div className="h-24 flex items-center justify-center bg-gray-100 rounded">
                  <PDFViewer 
                    url={item.url} 
                    title={`Wire Diagram ${idx + 1}`} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWarning = (warning: WarningConfig) => {
    if (!warning) return null;
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md my-4 flex items-center">
        <AlertCircle className="h-6 w-6 mr-3" />
        <div>
          <p className="font-bold">Warning: {warning.type.charAt(0).toUpperCase() + warning.type.slice(1)} Hazard</p>
          {warning.includeLicenseText && <p className="text-sm">Only licensed professionals should perform this step.</p>}
        </div>
      </div>
    );
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
            This workflow doesn't contain any diagnostic steps yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentNode = sortedNodes[currentStepIndex];
  const { title, content, richInfo, options, type, media, warning, linkToWorkflow } = currentNode.data as NodeData;

  const isSolutionNode = type === 'solution';
  const isQuestionNode = type === 'question';

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isSolutionNode ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Stethoscope className="h-5 w-5 text-blue-500" />}
            {title || 'Diagnostic Step'}
          </CardTitle>
          <CardDescription>
            {content || 'Follow the instructions below.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderWarning(warning!)}

          {richInfo && (
            <div className="prose prose-blue max-w-none mb-6" dangerouslySetInnerHTML={{ __html: richInfo }} />
          )}

          {media && renderMedia(media)}

          {linkToWorkflow && linkToWorkflow.workflowName && (
             <Button
                onClick={() => navigate(`/diagnostics?workflow=${encodeURIComponent(linkToWorkflow.workflowName)}`)}
                className="my-4"
              >
                Go to: {linkToWorkflow.workflowName}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
          )}

          {isQuestionNode && options && (
            <div className="space-y-3">
              <p className="font-semibold text-gray-700">Select an option:</p>
              {options.map((option, index) => (
                <Button 
                  key={index}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleOptionSelect(option, index)}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {!isQuestionNode && (options?.includes('Yes') || options?.includes('No')) && (
            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-green-500 hover:bg-green-600"
                onClick={() => handleOptionSelect('Yes', 0)}
              >
                Yes
              </Button>
              <Button 
                className="flex-1 bg-red-500 hover:bg-red-600"
                onClick={() => handleOptionSelect('No', 1)}
              >
                No
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handlePrevStep} disabled={history.length <= 1}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous Step
        </Button>
        <div className="text-sm text-gray-500">
          Step {history.length} of ~{sortedNodes.length}
        </div>
        {!isSolutionNode && !isQuestionNode && !(options?.includes('Yes') || options?.includes('No')) && (
          <Button onClick={handleNextStep} disabled={currentStepIndex >= sortedNodes.length - 1}>
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {expandedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={handleCloseExpandedImage}
        >
          <img src={expandedImage} alt="Expanded view" className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  );
}
