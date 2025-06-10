import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Thermometer, 
  Wrench, 
  Camera, 
  ClipboardCheck,
  File 
} from 'lucide-react';
import { EnhancedNodeData } from '@/types/enhanced-node-config';

interface DiagnosticTemplatesProps {
  onApplyTemplate: (template: EnhancedNodeData) => void;
}

export function DiagnosticTemplates({ onApplyTemplate }: DiagnosticTemplatesProps) {
  const templates = [
    {
      name: "Voltage Check",
      icon: <Zap className="w-4 h-4" />,
      category: "Electrical",
      data: {
        type: "equipment-test",
        title: "Voltage Check",
        content: "Measure voltage at specified test points",
        equipmentTest: {
          equipmentType: "Multimeter",
          testProcedure: "Set multimeter to DC voltage mode and measure at test points",
          requiredTools: ["Digital Multimeter", "Test Probes", "Safety Glasses"],
          safetyWarnings: ["Ensure power is off before connecting probes", "Wear safety glasses"],
          expectedResults: "Normal operating voltage range",
          toleranceRange: {
            min: 110,
            max: 130,
            unit: "V"
          }
        }
      } as EnhancedNodeData
    },
    {
      name: "Temperature Reading",
      icon: <Thermometer className="w-4 h-4" />,
      category: "Thermal",
      data: {
        type: "equipment-test",
        title: "Temperature Reading",
        content: "Check operating temperature of component",
        equipmentTest: {
          equipmentType: "Thermometer",
          testProcedure: "Use infrared thermometer to measure component temperature",
          requiredTools: ["Infrared Thermometer", "Safety Glasses"],
          safetyWarnings: ["Allow equipment to cool before handling"],
          expectedResults: "Temperature within normal operating range",
          toleranceRange: {
            min: 60,
            max: 85,
            unit: "°C"
          }
        }
      } as EnhancedNodeData
    },
    {
      name: "Part Replacement",
      icon: <Wrench className="w-4 h-4" />,
      category: "Repair",
      data: {
        type: "procedure-step",
        title: "Part Replacement Procedure",
        content: "Step-by-step part replacement guide",
        stepType: "repair",
        procedureSteps: [
          {
            id: "step-1",
            description: "Turn off power and disconnect from electrical source",
            required: true,
            estimatedTime: 5,
            safetyWarning: "Ensure all power sources are disconnected",
            tools: ["Screwdriver"]
          },
          {
            id: "step-2",
            description: "Remove old part carefully",
            required: true,
            estimatedTime: 10,
            tools: ["Screwdriver", "Pliers"]
          },
          {
            id: "step-3",
            description: "Install new part and secure connections",
            required: true,
            estimatedTime: 15,
            tools: ["Screwdriver", "Wire nuts"]
          }
        ]
      } as EnhancedNodeData
    },
    {
      name: "Photo Documentation",
      icon: <Camera className="w-4 h-4" />,
      category: "Documentation",
      data: {
        type: "photo-capture",
        title: "Photo Documentation",
        content: "Capture photos for documentation and analysis",
        photoCapture: {
          required: true,
          maxPhotos: 5,
          guidelines: [
            "Take clear, well-lit photos",
            "Include component labels in frame",
            "Capture both overview and detail shots"
          ],
          requiredAngles: ["Front", "Back", "Left Side", "Right Side"],
          annotations: true
        }
      } as EnhancedNodeData
    },
    {
      name: "Safety Checklist",
      icon: <ClipboardCheck className="w-4 h-4" />,
      category: "Safety",
      data: {
        type: "data-form",
        title: "Safety Checklist",
        content: "Complete safety verification checklist",
        dataFields: [
          {
            id: "power-off",
            type: "checkbox",
            label: "Power disconnected",
            required: true
          },
          {
            id: "ppe-worn",
            type: "checkbox",
            label: "Personal protective equipment worn",
            required: true
          },
          {
            id: "area-clear",
            type: "checkbox",
            label: "Work area cleared of hazards",
            required: true
          },
          {
            id: "tools-inspected",
            type: "checkbox",
            label: "Tools inspected for damage",
            required: true
          }
        ]
      } as EnhancedNodeData
    },
    {
      name: "Decision Tree",
      icon: <File className="w-4 h-4" />,
      category: "Logic",
      data: {
        type: "decision-tree",
        title: "Diagnostic Decision Tree",
        content: "Multi-path diagnostic decision tree",
        branches: [
          {
            id: "branch-1",
            label: "Power Present",
            condition: "voltage > 100",
            color: "#22c55e"
          },
          {
            id: "branch-2",
            label: "No Power",
            condition: "voltage <= 100",
            color: "#ef4444"
          },
          {
            id: "branch-3",
            label: "Intermittent",
            condition: "voltage_fluctuating",
            color: "#f59e0b"
          }
        ]
      } as EnhancedNodeData
    }
  ];

  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700 mb-3">
        Choose a diagnostic template to get started:
      </div>
      
      {categories.map(category => (
        <div key={category} className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600">{category}</h4>
          <div className="grid grid-cols-1 gap-2">
            {templates
              .filter(template => template.category === category)
              .map(template => (
                <Card key={template.name} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {template.icon}
                        <span className="text-sm font-medium">{template.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onApplyTemplate(template.data)}
                      >
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
