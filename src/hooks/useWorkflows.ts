
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
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
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
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString()
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
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
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
    updatedAt: new Date(Date.now() - 86400000 * 15).toISOString()
  }
];

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
      } catch (err) {
        console.error("Error getting all workflows:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWorkflows();
  }, []);

  return {
    workflows,
    isLoading,
    error,
  };
}
