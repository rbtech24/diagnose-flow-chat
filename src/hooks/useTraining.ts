
import { useState, useEffect } from 'react';
import { useErrorHandler } from './useErrorHandler';
import { supabase } from '@/integrations/supabase/client';
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { handleAsyncError } = useErrorHandler();

  // Get current user ID from Supabase auth
  useEffect(() => {
    async function getCurrentUserId() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    }
    getCurrentUserId();
  }, []);

  const fetchTrainingData = async () => {
    if (!currentUserId) return;

    const result = await handleAsyncError(async () => {
      setIsLoading(true);
      
      // Fetch training modules from database
      const modulesData = await fetchTrainingModules();
      setModules(modulesData);
      
      // Fetch user progress from database
      const progressData = await fetchUserTrainingProgress(currentUserId);
      setUserProgress(progressData);
      
      // Fetch certification programs from database - convert to CertificationProgress format
      const certificationsRaw = await fetchCertificationPrograms();
      const certificationsData: CertificationProgress[] = certificationsRaw.map((cert: any) => ({
        id: cert.id,
        userId: currentUserId,
        programId: cert.name || cert.id,
        status: 'not_started' as const,
        progress: 0,
        moduleProgress: []
      }));
      setCertifications(certificationsData);
      
      return { modules: modulesData, progress: progressData, certifications: certificationsData };
    }, 'fetchTrainingData');
    
    setIsLoading(false);
    return result.data;
  };

  const markModuleComplete = async (moduleId: string) => {
    if (!currentUserId) return;

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
    if (currentUserId) {
      fetchTrainingData();
    }
  }, [currentUserId]);

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
