
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

      // For now, we'll use structured data since training modules aren't in the schema
      // In a real implementation, this would query actual training tables
      const mockModules: TrainingModule[] = [
        {
          id: '1',
          title: 'Washing Machine Diagnostics',
          description: 'Learn to diagnose common washing machine problems',
          type: 'video',
          duration: '45 min',
          difficulty: 'beginner',
          category: 'Appliance Repair',
          completed: false,
          rating: 4.8
        },
        {
          id: '2',
          title: 'Refrigerator Compressor Repair',
          description: 'Advanced techniques for compressor troubleshooting',
          type: 'interactive',
          duration: '2 hours',
          difficulty: 'advanced',
          category: 'Appliance Repair',
          completed: false,
          rating: 4.9
        },
        {
          id: '3',
          title: 'Safety Protocols Manual',
          description: 'Essential safety guidelines for appliance repair',
          type: 'document',
          duration: '30 min',
          difficulty: 'beginner',
          category: 'Safety',
          completed: false,
          rating: 4.6
        }
      ];

      const mockCertifications: Certification[] = [
        {
          id: '1',
          name: 'Appliance Repair Fundamentals',
          description: 'Basic certification for appliance repair technicians',
          progress: 0,
          totalModules: 8,
          completedModules: 0,
          status: 'not-started'
        },
        {
          id: '2',
          name: 'Advanced Diagnostics',
          description: 'Advanced troubleshooting and diagnostic techniques',
          progress: 0,
          totalModules: 12,
          completedModules: 0,
          status: 'not-started'
        }
      ];

      // Check if we have any knowledge base articles that could serve as training content
      const { data: knowledgeArticles } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (knowledgeArticles) {
        const additionalModules: TrainingModule[] = knowledgeArticles.map(article => ({
          id: article.id,
          title: article.title,
          description: article.content.substring(0, 100) + '...',
          type: 'document' as const,
          duration: '15 min',
          difficulty: 'intermediate' as const,
          category: article.category || 'General',
          completed: false,
          rating: 4.5,
          content_url: `/knowledge/${article.id}`
        }));

        setModules([...mockModules, ...additionalModules]);
      } else {
        setModules(mockModules);
      }

      setCertifications(mockCertifications);
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
      // In a real implementation, this would update the database
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
