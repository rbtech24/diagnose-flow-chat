
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'interactive';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  completed: boolean;
  rating: number;
  thumbnail?: string;
  content_url?: string;
}

interface Certification {
  id: string;
  name: string;
  description: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  expiryDate?: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'expired';
}

export function useTraining() {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      setIsLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        setIsLoading(false);
        return;
      }

      // Get user's company ID from technicians table
      const { data: technicianData } = await supabase
        .from('technicians')
        .select('company_id')
        .eq('id', userData.user.id)
        .single();

      if (!technicianData?.company_id) {
        setIsLoading(false);
        return;
      }

      // Fetch training modules
      const { data: trainingModules, error: modulesError } = await supabase
        .from('training_modules')
        .select('*')
        .eq('company_id', technicianData.company_id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (modulesError) {
        console.error('Error fetching training modules:', modulesError);
      }

      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_training_progress')
        .select('module_id, completed_at')
        .eq('user_id', userData.user.id);

      if (progressError) {
        console.error('Error fetching user progress:', progressError);
      }

      // Create progress map
      const progressMap: Record<string, boolean> = {};
      progressData?.forEach(progress => {
        if (progress.completed_at) {
          progressMap[progress.module_id] = true;
        }
      });

      // Transform training modules
      const transformedModules: TrainingModule[] = (trainingModules || []).map(module => ({
        id: module.id,
        title: module.title,
        description: module.description || '',
        type: module.type as TrainingModule['type'],
        duration: `${module.duration_minutes || 30} min`,
        difficulty: module.difficulty as TrainingModule['difficulty'],
        category: module.category,
        completed: progressMap[module.id] || false,
        rating: Number(module.rating) || 0,
        thumbnail: module.thumbnail_url,
        content_url: module.content_url
      }));

      // Fetch certification programs
      const { data: certificationData, error: certError } = await supabase
        .from('certification_programs')
        .select('*')
        .eq('company_id', technicianData.company_id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (certError) {
        console.error('Error fetching certifications:', certError);
      }

      // Transform certifications
      const transformedCertifications: Certification[] = (certificationData || []).map(cert => {
        const completedModules = transformedModules.filter(m => 
          m.category === cert.name && m.completed
        ).length;
        const totalModules = cert.total_modules || transformedModules.filter(m => 
          m.category === cert.name
        ).length;
        const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

        return {
          id: cert.id,
          name: cert.name,
          description: cert.description || '',
          progress,
          totalModules,
          completedModules,
          status: progress === 100 ? 'completed' : completedModules > 0 ? 'in-progress' : 'not-started'
        };
      });

      setModules(transformedModules);
      setCertifications(transformedCertifications);
      setUserProgress(progressMap);

    } catch (error) {
      console.error('Error fetching training data:', error);
      setModules([]);
      setCertifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const markModuleComplete = async (moduleId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) return;

      // Insert or update progress
      const { error } = await supabase
        .from('user_training_progress')
        .upsert({
          user_id: userData.user.id,
          module_id: moduleId,
          completed_at: new Date().toISOString(),
          progress_data: { completed: true }
        });

      if (error) {
        console.error('Error marking module complete:', error);
        return;
      }

      // Update local state
      setUserProgress(prev => ({ ...prev, [moduleId]: true }));
      
      setModules(prev => prev.map(module => 
        module.id === moduleId ? { ...module, completed: true } : module
      ));

      // Update certification progress
      setCertifications(prev => prev.map(cert => {
        const completedCount = modules.filter(m => 
          m.category === cert.name && (userProgress[m.id] || m.id === moduleId)
        ).length;
        
        const progress = Math.round((completedCount / cert.totalModules) * 100);
        
        return {
          ...cert,
          completedModules: completedCount,
          progress,
          status: progress === 100 ? 'completed' : completedCount > 0 ? 'in-progress' : 'not-started'
        };
      }));
    } catch (error) {
      console.error('Error marking module complete:', error);
    }
  };

  const getStats = () => {
    const completedModules = modules.filter(m => m.completed || userProgress[m.id]).length;
    const completedCertifications = certifications.filter(c => c.status === 'completed').length;
    const totalLearningTime = modules.reduce((total, module) => {
      const duration = parseInt(module.duration);
      return total + (isNaN(duration) ? 30 : duration);
    }, 0);

    return {
      completedModules,
      completedCertifications,
      totalLearningTime: `${Math.round(totalLearningTime / 60)}h`
    };
  };

  return {
    modules,
    certifications,
    isLoading,
    userProgress,
    markModuleComplete,
    getStats,
    refreshData: fetchTrainingData
  };
}
