
import { useState, useEffect } from 'react';
import { useErrorHandler } from './useErrorHandler';
import { 
  fetchTrainingModules, 
  fetchUserTrainingProgress, 
  startTrainingModule, 
  updateTrainingProgress,
  fetchCertificationPrograms 
} from '@/api/trainingApi';
import type { 
  TrainingModule, 
  TrainingProgress, 
  CertificationProgress 
} from '@/api/trainingApi';

export interface TrainingStats {
  completedModules: number;
  completedCertifications: number;
  totalLearningTime: string;
}

export function useTraining() {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [certifications, setCertifications] = useState<CertificationProgress[]>([]);
  const [userProgress, setUserProgress] = useState<TrainingProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleAsyncError } = useErrorHandler();

  const fetchTrainingData = async () => {
    const result = await handleAsyncError(async () => {
      setIsLoading(true);
      
      // Fetch training modules
      const modulesData = await fetchTrainingModules();
      setModules(modulesData);
      
      // Fetch user progress
      const progressData = await fetchUserTrainingProgress('current-user-id'); // This should come from auth context
      setUserProgress(progressData);
      
      // Fetch certification programs
      const certificationsData = await fetchCertificationPrograms();
      setCertifications(certificationsData);
      
      return { modules: modulesData, progress: progressData, certifications: certificationsData };
    }, 'fetchTrainingData');
    
    setIsLoading(false);
    return result.data;
  };

  const markModuleComplete = async (moduleId: string) => {
    await handleAsyncError(async () => {
      // Find existing progress or start new module
      const existingProgress = userProgress.find(p => p.moduleId === moduleId);
      
      if (existingProgress) {
        await updateTrainingProgress(existingProgress.id, {
          progress: 100,
          status: 'completed'
        });
      } else {
        const newProgress = await startTrainingModule(moduleId);
        await updateTrainingProgress(newProgress.id, {
          progress: 100,
          status: 'completed'
        });
      }
      
      // Refresh data
      await fetchTrainingData();
    }, 'markModuleComplete');
  };

  const getStats = (): TrainingStats => {
    const completedCount = userProgress.filter(p => p.status === 'completed').length;
    const completedCerts = certifications.filter(c => c.status === 'completed').length;
    const totalTime = userProgress.reduce((total, p) => total + p.timeSpent, 0);
    
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    
    return {
      completedModules: completedCount,
      completedCertifications: completedCerts,
      totalLearningTime: `${hours}h ${minutes}min`
    };
  };

  const getModuleProgress = (moduleId: string): TrainingProgress | undefined => {
    return userProgress.find(p => p.moduleId === moduleId);
  };

  useEffect(() => {
    fetchTrainingData();
  }, []);

  return {
    modules,
    certifications,
    userProgress,
    isLoading,
    markModuleComplete,
    getStats,
    getModuleProgress,
    refreshData: fetchTrainingData
  };
}
