
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  HelpCircle,
  CheckCircle,
  Settings,
  Camera,
  FileText,
  Zap,
  GitBranch,
  Database,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface NodeTemplate {
  id: string;
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  data: any;
}

interface NodePaletteProps {
  onAddNode: (template: NodeTemplate) => void;
  isCollapsed?: boolean;
}

export function NodePalette({ onAddNode, isCollapsed = false }: NodePaletteProps) {
  const nodeTemplates: NodeTemplate[] = [
    // Basic Nodes
    {
      id: 'question-template',
      type: 'diagnosis',
      label: 'Yes/No Question',
      description: 'Simple decision point with yes/no options',
      icon: <HelpCircle className="w-4 h-4" />,
      category: 'Basic',
      data: {
        type: 'question',
        content: 'Enter your question here',
        options: ['Yes', 'No'],
        title: 'Decision Point'
      }
    },
    {
      id: 'choice-template',
      type: 'diagnosis',
      label: 'Multiple Choice',
      description: 'Question with multiple answer options',
      icon: <CheckCircle className="w-4 h-4" />,
      category: 'Basic',
      data: {
        type: 'choice',
        content: 'Select from the available options',
        options: ['Option 1', 'Option 2', 'Option 3'],
        title: 'Multiple Choice'
      }
    },
    {
      id: 'result-template',
      type: 'diagnosis',
      label: 'Result/Solution',
      description: 'Final result or solution step',
      icon: <CheckCircle className="w-4 h-4" />,
      category: 'Basic',
      data: {
        type: 'result',
        content: 'Describe the solution or final result',
        title: 'Solution'
      }
    },

    // Enhanced Nodes
    {
      id: 'equipment-test-template',
      type: 'diagnosis',
      label: 'Equipment Test',
      description: 'Structured equipment testing procedure',
      icon: <Settings className="w-4 h-4" />,
      category: 'Enhanced',
      data: {
        type: 'equipment-test',
        title: 'Equipment Test',
        content: 'Perform equipment test according to specifications',
        equipmentTest: {
          equipmentType: 'Multimeter',
          testProcedure: 'Set device to appropriate mode and measure',
          requiredTools: ['Multimeter', 'Test Probes'],
          safetyWarnings: ['Ensure power is off', 'Wear safety equipment'],
          expectedResults: 'Within acceptable range',
          toleranceRange: { min: 0, max: 100, unit: 'V' }
        }
      }
    },
    {
      id: 'photo-capture-template',
      type: 'diagnosis',
      label: 'Photo Capture',
      description: 'Capture and annotate photos for documentation',
      icon: <Camera className="w-4 h-4" />,
      category: 'Enhanced',
      data: {
        type: 'photo-capture',
        title: 'Photo Documentation',
        content: 'Capture photos of the component or issue',
        photoCapture: {
          required: true,
          maxPhotos: 3,
          guidelines: ['Take clear, well-lit photos', 'Include component labels'],
          requiredAngles: ['Front', 'Back']
        }
      }
    },
    {
      id: 'procedure-step-template',
      type: 'diagnosis',
      label: 'Procedure Step',
      description: 'Detailed step-by-step procedure',
      icon: <FileText className="w-4 h-4" />,
      category: 'Enhanced',
      data: {
        type: 'procedure-step',
        title: 'Procedure Step',
        content: 'Follow the detailed procedure below',
        stepType: 'general',
        procedureSteps: [
          {
            id: 'step-1',
            description: 'First step in the procedure',
            required: true,
            estimatedTime: 5,
            tools: ['Basic Tools']
          }
        ]
      }
    },
    {
      id: 'decision-tree-template',
      type: 'diagnosis',
      label: 'Decision Tree',
      description: 'Multi-branch decision logic',
      icon: <GitBranch className="w-4 h-4" />,
      category: 'Enhanced',
      data: {
        type: 'decision-tree',
        title: 'Decision Tree',
        content: 'Multi-path decision point',
        branches: [
          { id: 'branch-1', label: 'Condition A', condition: 'value > 50', color: '#22c55e' },
          { id: 'branch-2', label: 'Condition B', condition: 'value <= 50', color: '#ef4444' }
        ]
      }
    },

    // Measurement Nodes
    {
      id: 'voltage-check-template',
      type: 'diagnosis',
      label: 'Voltage Check',
      description: 'Electrical voltage measurement',
      icon: <Zap className="w-4 h-4" />,
      category: 'Measurement',
      data: {
        type: 'voltage-check',
        title: 'Voltage Check',
        content: 'Measure voltage at specified test points',
        technicalSpecs: {
          range: { min: 110, max: 130 },
          testPoints: 'L1 to L2, L2 to L3, L3 to L1',
          unit: 'V'
        }
      }
    },
    {
      id: 'resistance-check-template',
      type: 'diagnosis',
      label: 'Resistance Check',
      description: 'Electrical resistance measurement',
      icon: <Settings className="w-4 h-4" />,
      category: 'Measurement',
      data: {
        type: 'resistance-check',
        title: 'Resistance Check',
        content: 'Measure resistance across component',
        technicalSpecs: {
          value: 120,
          measurementPoints: 'Across component terminals',
          unit: 'Ω'
        }
      }
    },

    // Data Collection
    {
      id: 'data-form-template',
      type: 'diagnosis',
      label: 'Data Collection',
      description: 'Structured data collection form',
      icon: <Database className="w-4 h-4" />,
      category: 'Data',
      data: {
        type: 'data-form',
        title: 'Data Collection',
        content: 'Collect required information',
        dataFields: [
          { id: 'field-1', type: 'text', label: 'Observation', required: true },
          { id: 'field-2', type: 'number', label: 'Measurement', required: true }
        ]
      }
    },

    // Timing
    {
      id: 'timer-template',
      type: 'diagnosis',
      label: 'Timed Step',
      description: 'Step with specific timing requirements',
      icon: <Clock className="w-4 h-4" />,
      category: 'Timing',
      data: {
        type: 'timed-step',
        title: 'Timed Procedure',
        content: 'Complete within specified timeframe',
        timing: {
          duration: 300, // 5 minutes
          unit: 'seconds',
          critical: true
        }
      }
    },

    // Safety
    {
      id: 'safety-warning-template',
      type: 'diagnosis',
      label: 'Safety Warning',
      description: 'Important safety notice or warning',
      icon: <AlertTriangle className="w-4 h-4" />,
      category: 'Safety',
      data: {
        type: 'safety-warning',
        title: 'Safety Warning',
        content: 'Important safety information',
        warning: {
          type: 'electric',
          includeLicenseText: true
        }
      }
    }
  ];

  const categories = Array.from(new Set(nodeTemplates.map(template => template.category)));

  const handleDragStart = (e: React.DragEvent, template: NodeTemplate) => {
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleAddNode = (template: NodeTemplate) => {
    onAddNode(template);
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-white border-r border-gray-200 p-2">
        <div className="space-y-2">
          {nodeTemplates.slice(0, 6).map((template) => (
            <div
              key={template.id}
              className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
              draggable
              onDragStart={(e) => handleDragStart(e, template)}
              onClick={() => handleAddNode(template)}
              title={template.label}
            >
              {template.icon}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="w-80 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Node Palette</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-4 space-y-4">
            {categories.map((category) => (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {category}
                </h4>
                <div className="space-y-1">
                  {nodeTemplates
                    .filter(template => template.category === category)
                    .map((template) => (
                      <div
                        key={template.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-move hover:bg-gray-100 hover:border-gray-300 transition-colors"
                        draggable
                        onDragStart={(e) => handleDragStart(e, template)}
                        onClick={() => handleAddNode(template)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {template.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {template.label}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {template.data.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {template.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
