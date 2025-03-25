
import { useState, useEffect } from "react";

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  category?: string;
  complexity?: "beginner" | "intermediate" | "advanced";
  lastUsed?: string;
  status?: "active" | "draft" | "archived";
  createdAt?: string;
  updatedAt?: string;
  // Add missing properties to match SavedWorkflow
  metadata: {
    name: string;
    folder: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
  };
  nodes: any[];
  edges: any[];
  nodeCounter: number;
}

const mockWorkflows: Workflow[] = [
  {
    id: "workflow-1",
    name: "Refrigerator Cooling Diagnosis",
    description: "Step-by-step diagnosis for refrigerators not cooling properly",
    category: "appliance",
    complexity: "beginner",
    lastUsed: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    // Add these fields to match SavedWorkflow
    metadata: {
      name: "Refrigerator Cooling Diagnosis",
      folder: "appliance",
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      isActive: true
    },
    nodes: [],
    edges: [],
    nodeCounter: 0
  },
  {
    id: "workflow-2",
    name: "Washing Machine Motor Troubleshooting",
    description: "Diagnose and fix common washing machine motor issues",
    category: "appliance",
    complexity: "intermediate",
    lastUsed: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    // Add these fields to match SavedWorkflow
    metadata: {
      name: "Washing Machine Motor Troubleshooting",
      folder: "appliance",
      createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      isActive: true
    },
    nodes: [],
    edges: [],
    nodeCounter: 0
  },
  {
    id: "workflow-3",
    name: "Smart TV Connection Issues",
    description: "Troubleshoot network connectivity problems with smart TVs",
    category: "electronics",
    complexity: "beginner",
    lastUsed: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    // Add these fields to match SavedWorkflow
    metadata: {
      name: "Smart TV Connection Issues",
      folder: "electronics",
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      isActive: true
    },
    nodes: [],
    edges: [],
    nodeCounter: 0
  },
  {
    id: "workflow-4",
    name: "HVAC Airflow Analysis",
    description: "Comprehensive diagnosis of HVAC airflow problems",
    category: "hvac",
    complexity: "advanced",
    lastUsed: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    // Add these fields to match SavedWorkflow
    metadata: {
      name: "HVAC Airflow Analysis",
      folder: "hvac",
      createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      isActive: true
    },
    nodes: [],
    edges: [],
    nodeCounter: 0
  }
];

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [folders, setFolders] = useState<string[]>([]);

  useEffect(() => {
    const loadWorkflows = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, we would fetch workflows from an API
        // For now, we'll use the mock data
        setWorkflows(mockWorkflows);
        
        // Extract unique folders
        const uniqueFolders = Array.from(new Set(mockWorkflows.map(w => w.metadata.folder)));
        setFolders(uniqueFolders);
      } catch (err) {
        console.error("Error getting all workflows:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWorkflows();
  }, []);

  const handleDeleteWorkflow = (workflow: Workflow) => {
    setWorkflows(prevWorkflows => prevWorkflows.filter(w => w.id !== workflow.id));
  };

  const handleToggleWorkflowActive = (workflow: Workflow) => {
    setWorkflows(prevWorkflows => 
      prevWorkflows.map(w => 
        w.id === workflow.id 
          ? { ...w, metadata: { ...w.metadata, isActive: !w.metadata.isActive } } 
          : w
      )
    );
  };

  const handleMoveWorkflow = (fromIndex: number, toIndex: number) => {
    const updatedWorkflows = [...workflows];
    const [movedItem] = updatedWorkflows.splice(fromIndex, 1);
    updatedWorkflows.splice(toIndex, 0, movedItem);
    setWorkflows(updatedWorkflows);
  };

  const handleMoveWorkflowToFolder = (workflow: Workflow, targetFolder: string) => {
    setWorkflows(prevWorkflows => 
      prevWorkflows.map(w => 
        w.id === workflow.id 
          ? { ...w, metadata: { ...w.metadata, folder: targetFolder } } 
          : w
      )
    );
  };

  return {
    workflows,
    isLoading,
    error,
    folders,
    selectedFolder,
    setSelectedFolder,
    handleDeleteWorkflow,
    handleToggleWorkflowActive,
    handleMoveWorkflow,
    handleMoveWorkflowToFolder
  };
}
