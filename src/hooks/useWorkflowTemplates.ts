
import { useState, useCallback, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  nodes: Node[];
  edges: Edge[];
  nodeCounter: number;
  thumbnail?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  createdAt: Date;
  isPublic: boolean;
  author?: string;
}

const DEFAULT_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'electrical-basic',
    name: 'Basic Electrical Troubleshooting',
    description: 'A comprehensive workflow for diagnosing common electrical issues in appliances',
    category: 'Electrical',
    tags: ['electrical', 'voltage', 'safety', 'basic'],
    difficulty: 'beginner',
    estimatedTime: '15-30 minutes',
    isPublic: true,
    author: 'System',
    createdAt: new Date('2024-01-01'),
    nodeCounter: 6,
    nodes: [
      {
        id: 'start-1',
        type: 'diagnosis',
        position: { x: 100, y: 100 },
        data: {
          id: 'start-1',
          type: 'start',
          title: 'Safety Check',
          content: 'Before beginning any electrical work:\n\n1. Turn off power at the breaker\n2. Verify power is off with a non-contact voltage tester\n3. Lock out/tag out the breaker\n4. Wear appropriate PPE',
          technicalSpecs: {
            safetyWarnings: ['High voltage hazard', 'Always verify power is off before starting']
          }
        }
      },
      {
        id: 'check-power',
        type: 'diagnosis',
        position: { x: 100, y: 250 },
        data: {
          id: 'check-power',
          type: 'question',
          title: 'Power Supply Check',
          content: 'Check if the appliance is receiving power:\n\n1. Verify the outlet with a known working device\n2. Check the circuit breaker\n3. Inspect the power cord for damage',
          options: [
            { id: 'power-yes', label: 'Power present', value: 'yes' },
            { id: 'power-no', label: 'No power', value: 'no' }
          ]
        }
      },
      {
        id: 'internal-check',
        type: 'diagnosis',
        position: { x: 300, y: 250 },
        data: {
          id: 'internal-check',
          type: 'instruction',
          title: 'Internal Wiring Check',
          content: 'Check internal wiring and connections:\n\n1. Remove access panels safely\n2. Visually inspect for loose connections\n3. Look for burnt or damaged wires\n4. Check wire nuts and terminals',
          technicalSpecs: {
            tools: ['Flashlight', 'Wire nuts', 'Electrical tape']
          }
        }
      },
      {
        id: 'fix-power',
        type: 'diagnosis',
        position: { x: 100, y: 400 },
        data: {
          id: 'fix-power',
          type: 'action',
          title: 'Fix Power Issue',
          content: 'Address the power supply problem:\n\n1. Reset circuit breaker if tripped\n2. Replace damaged power cord\n3. Test outlet and replace if faulty\n4. Verify grounding connections'
        }
      },
      {
        id: 'test-operation',
        type: 'diagnosis',
        position: { x: 300, y: 400 },
        data: {
          id: 'test-operation',
          type: 'condition',
          title: 'Test Operation',
          content: 'Test the appliance operation:\n\n1. Restore power at the breaker\n2. Test all functions\n3. Monitor for proper operation\n4. Check for any unusual sounds or smells',
          options: [
            { id: 'works', label: 'Working properly', value: 'working' },
            { id: 'still-issue', label: 'Still has issues', value: 'issues' }
          ]
        }
      },
      {
        id: 'complete',
        type: 'diagnosis',
        position: { x: 200, y: 550 },
        data: {
          id: 'complete',
          type: 'end',
          title: 'Repair Complete',
          content: 'Electrical troubleshooting completed successfully. Document the repair and any parts used.'
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'check-power', type: 'smoothstep' },
      { id: 'e2', source: 'check-power', target: 'internal-check', type: 'smoothstep' },
      { id: 'e3', source: 'check-power', target: 'fix-power', type: 'smoothstep' },
      { id: 'e4', source: 'internal-check', target: 'test-operation', type: 'smoothstep' },
      { id: 'e5', source: 'fix-power', target: 'test-operation', type: 'smoothstep' },
      { id: 'e6', source: 'test-operation', target: 'complete', type: 'smoothstep' }
    ]
  },
  {
    id: 'mechanical-diagnosis',
    name: 'Mechanical Component Diagnosis',
    description: 'Step-by-step workflow for diagnosing mechanical issues in appliances',
    category: 'Mechanical',
    tags: ['mechanical', 'bearings', 'motors', 'belts'],
    difficulty: 'intermediate',
    estimatedTime: '20-45 minutes',
    isPublic: true,
    author: 'System',
    createdAt: new Date('2024-01-01'),
    nodeCounter: 5,
    nodes: [
      {
        id: 'mech-start',
        type: 'diagnosis',
        position: { x: 100, y: 100 },
        data: {
          id: 'mech-start',
          type: 'start',
          title: 'Initial Assessment',
          content: 'Begin mechanical diagnosis:\n\n1. Document customer complaint\n2. Observe operation (if safe)\n3. Note any unusual sounds or vibrations\n4. Check for visible damage'
        }
      },
      {
        id: 'sound-check',
        type: 'diagnosis',
        position: { x: 100, y: 250 },
        data: {
          id: 'sound-check',
          type: 'question',
          title: 'Sound Analysis',
          content: 'What type of sound is the appliance making?',
          options: [
            { id: 'grinding', label: 'Grinding/scraping', value: 'grinding' },
            { id: 'squealing', label: 'Squealing/squeaking', value: 'squealing' },
            { id: 'rattling', label: 'Rattling/loose parts', value: 'rattling' },
            { id: 'no-sound', label: 'No unusual sounds', value: 'normal' }
          ]
        }
      },
      {
        id: 'motor-check',
        type: 'diagnosis',
        position: { x: 300, y: 250 },
        data: {
          id: 'motor-check',
          type: 'instruction',
          title: 'Motor Inspection',
          content: 'Inspect the motor and drive components:\n\n1. Check motor mounting bolts\n2. Inspect drive belt condition\n3. Test motor shaft for play\n4. Check pulley alignment',
          technicalSpecs: {
            tools: ['Straight edge', 'Belt tension gauge', 'Flashlight']
          }
        }
      },
      {
        id: 'repair-action',
        type: 'diagnosis',
        position: { x: 200, y: 400 },
        data: {
          id: 'repair-action',
          type: 'action',
          title: 'Repair/Replace',
          content: 'Perform necessary repairs:\n\n1. Replace worn belts\n2. Lubricate bearings if serviceable\n3. Tighten loose components\n4. Replace damaged parts as needed'
        }
      },
      {
        id: 'mech-complete',
        type: 'diagnosis',
        position: { x: 200, y: 550 },
        data: {
          id: 'mech-complete',
          type: 'end',
          title: 'Test and Complete',
          content: 'Final testing and completion:\n\n1. Reassemble all components\n2. Test operation under load\n3. Verify proper alignment\n4. Document repairs performed'
        }
      }
    ],
    edges: [
      { id: 'me1', source: 'mech-start', target: 'sound-check', type: 'smoothstep' },
      { id: 'me2', source: 'sound-check', target: 'motor-check', type: 'smoothstep' },
      { id: 'me3', source: 'motor-check', target: 'repair-action', type: 'smoothstep' },
      { id: 'me4', source: 'repair-action', target: 'mech-complete', type: 'smoothstep' }
    ]
  }
];

export function useWorkflowTemplates() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load templates from localStorage and merge with defaults
  const loadTemplates = useCallback(() => {
    try {
      const stored = localStorage.getItem('workflow-templates');
      const userTemplates = stored ? JSON.parse(stored) : [];
      
      // Merge user templates with default templates
      const allTemplates = [...DEFAULT_TEMPLATES, ...userTemplates];
      setTemplates(allTemplates);
    } catch (error) {
      console.error('Failed to load templates:', error);
      setTemplates(DEFAULT_TEMPLATES);
    }
  }, []);

  // Save a new template
  const saveTemplate = useCallback((template: Omit<WorkflowTemplate, 'id' | 'createdAt'>) => {
    const newTemplate: WorkflowTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date()
    };

    setTemplates(prev => {
      const userTemplates = prev.filter(t => !DEFAULT_TEMPLATES.find(dt => dt.id === t.id));
      const updated = [...userTemplates, newTemplate];
      
      try {
        localStorage.setItem('workflow-templates', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save template:', error);
      }
      
      return [...DEFAULT_TEMPLATES, ...updated];
    });

    return newTemplate;
  }, []);

  // Delete a template (only user templates)
  const deleteTemplate = useCallback((templateId: string) => {
    if (DEFAULT_TEMPLATES.find(t => t.id === templateId)) {
      console.warn('Cannot delete system template');
      return false;
    }

    setTemplates(prev => {
      const updated = prev.filter(t => t.id !== templateId);
      const userTemplates = updated.filter(t => !DEFAULT_TEMPLATES.find(dt => dt.id === t.id));
      
      try {
        localStorage.setItem('workflow-templates', JSON.stringify(userTemplates));
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
      
      return updated;
    });

    return true;
  }, []);

  // Get filtered templates
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Get unique categories
  const categories = Array.from(new Set(templates.map(t => t.category))).sort();

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  return {
    templates: filteredTemplates,
    allTemplates: templates,
    categories,
    selectedCategory,
    searchTerm,
    setSelectedCategory,
    setSearchTerm,
    saveTemplate,
    deleteTemplate,
    loadTemplates
  };
}
