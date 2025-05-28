
import { useState, useEffect } from 'react';
import { useErrorHandler } from './useErrorHandler';

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'interactive';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  rating: number;
  completed: boolean;
}

export interface Certification {
  id: string;
  name: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'expired';
  progress: number;
  completedModules: number;
  totalModules: number;
  expiryDate?: Date;
}

export interface TrainingStats {
  completedModules: number;
  completedCertifications: number;
  totalLearningTime: string;
}

export function useTraining() {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleAsyncError } = useErrorHandler();

  const fetchTrainingData = async () => {
    const result = await handleAsyncError(async () => {
      setIsLoading(true);
      
      // Mock data - replace with actual API calls
      const mockModules: TrainingModule[] = [
        {
          id: '1',
          title: 'HVAC Fundamentals',
          description: 'Learn the basics of heating, ventilation, and air conditioning systems',
          type: 'video',
          duration: '2h 30min',
          difficulty: 'beginner',
          category: 'Technical Skills',
          rating: 4.8,
          completed: false
        },
        {
          id: '2',
          title: 'Safety Procedures Manual',
          description: 'Essential safety guidelines for technicians',
          type: 'document',
          duration: '45min',
          difficulty: 'beginner',
          category: 'Safety',
          rating: 4.9,
          completed: true
        },
        {
          id: '3',
          title: 'Advanced Diagnostics',
          description: 'Interactive troubleshooting scenarios',
          type: 'interactive',
          duration: '3h 15min',
          difficulty: 'advanced',
          category: 'Technical Skills',
          rating: 4.7,
          completed: false
        }
      ];

      const mockCertifications: Certification[] = [
        {
          id: '1',
          name: 'HVAC Technician Level 1',
          description: 'Basic certification for HVAC technicians',
          status: 'in_progress',
          progress: 60,
          completedModules: 3,
          totalModules: 5,
          expiryDate: new Date(2025, 11, 31)
        },
        {
          id: '2',
          name: 'Safety Compliance',
          description: 'Workplace safety certification',
          status: 'completed',
          progress: 100,
          completedModules: 2,
          totalModules: 2,
          expiryDate: new Date(2026, 5, 15)
        }
      ];

      setModules(mockModules);
      setCertifications(mockCertifications);
      
      return { modules: mockModules, certifications: mockCertifications };
    }, 'fetchTrainingData');
    
    setIsLoading(false);
    return result.data;
  };

  const markModuleComplete = async (moduleId: string) => {
    await handleAsyncError(async () => {
      setModules(prev => prev.map(module => 
        module.id === moduleId 
          ? { ...module, completed: true }
          : module
      ));
    }, 'markModuleComplete');
  };

  const getStats = (): TrainingStats => {
    const completedModules = modules.filter(m => m.completed).length;
    const completedCertifications = certifications.filter(c => c.status === 'completed').length;
    
    return {
      completedModules,
      completedCertifications,
      totalLearningTime: '12h 30min'
    };
  };

  useEffect(() => {
    fetchTrainingData();
  }, []);

  return {
    modules,
    certifications,
    isLoading,
    markModuleComplete,
    getStats,
    refreshData: fetchTrainingData
  };
}
