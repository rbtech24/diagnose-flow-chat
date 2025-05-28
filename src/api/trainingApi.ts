
import { supabase } from "@/integrations/supabase/client";
import { APIErrorHandler } from "@/utils/apiErrorHandler";

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'video' | 'document' | 'interactive';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  mediaUrl?: string;
  thumbnailUrl?: string;
  companyId?: string;
  authorId?: string;
  isPublic: boolean;
  completionCriteria: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingProgress {
  id: string;
  userId: string;
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  timeSpent: number;
  lastAccessedAt: Date;
}

export interface CertificationProgress {
  id: string;
  userId: string;
  programId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  moduleProgress: TrainingProgress[];
}

// Fetch training modules
export const fetchTrainingModules = async (companyId?: string): Promise<TrainingModule[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    // Since training_modules table doesn't exist in the schema, return mock data
    console.log('Training modules table not found, using mock data');
    
    return [
      {
        id: '1',
        title: 'Basic Appliance Diagnostics',
        description: 'Learn the fundamentals of appliance troubleshooting',
        content: 'This module covers basic diagnostic techniques...',
        type: 'video' as const,
        duration: 30,
        difficulty: 'beginner' as const,
        tags: ['diagnostics', 'fundamentals'],
        thumbnailUrl: '/placeholder.svg',
        companyId: companyId,
        isPublic: true,
        completionCriteria: { minScore: 80 },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Advanced Repair Techniques',
        description: 'Master complex repair procedures',
        content: 'This module covers advanced repair techniques...',
        type: 'document' as const,
        duration: 45,
        difficulty: 'advanced' as const,
        tags: ['repair', 'advanced'],
        thumbnailUrl: '/placeholder.svg',
        companyId: companyId,
        isPublic: true,
        completionCriteria: { minScore: 85 },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }, "fetchTrainingModules");

  if (!response.success) throw response.error;
  return response.data || [];
};

// Fetch user training progress
export const fetchUserTrainingProgress = async (userId: string): Promise<TrainingProgress[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    // Since training_progress table doesn't exist in the schema, return mock data
    console.log('Training progress table not found, using mock data');
    
    return [
      {
        id: '1',
        userId: userId,
        moduleId: '1',
        status: 'completed' as const,
        progress: 100,
        startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        timeSpent: 1800,
        lastAccessedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        userId: userId,
        moduleId: '2',
        status: 'in_progress' as const,
        progress: 65,
        startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        timeSpent: 1200,
        lastAccessedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];
  }, "fetchUserTrainingProgress");

  if (!response.success) throw response.error;
  return response.data || [];
};

// Start training module
export const startTrainingModule = async (moduleId: string): Promise<TrainingProgress> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    // Mock implementation - would normally insert into training_progress table
    return {
      id: `progress_${Date.now()}`,
      userId: userData.user.id,
      moduleId: moduleId,
      status: 'in_progress' as const,
      progress: 0,
      startedAt: new Date(),
      timeSpent: 0,
      lastAccessedAt: new Date()
    };
  }, "startTrainingModule");

  if (!response.success) throw response.error;
  return response.data!;
};

// Update training progress
export const updateTrainingProgress = async (
  progressId: string,
  updates: {
    progress?: number;
    timeSpent?: number;
    status?: TrainingProgress['status'];
  }
): Promise<TrainingProgress> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    // Mock implementation - would normally update training_progress table
    return {
      id: progressId,
      userId: 'mock-user-id',
      moduleId: 'mock-module-id',
      status: updates.status || 'in_progress',
      progress: updates.progress || 0,
      timeSpent: updates.timeSpent || 0,
      lastAccessedAt: new Date(),
      startedAt: new Date()
    };
  }, "updateTrainingProgress");

  if (!response.success) throw response.error;
  return response.data!;
};

// Fetch certification programs
export const fetchCertificationPrograms = async (companyId?: string): Promise<any[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data, error } = await supabase
      .from("certification_programs")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.log('Certification programs query failed, using mock data');
      return [
        {
          id: '1',
          name: 'Appliance Repair Certification',
          description: 'Complete certification program for appliance repair technicians',
          totalModules: 5,
          companyId: companyId,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
    }

    return data || [];
  }, "fetchCertificationPrograms");

  if (!response.success) throw response.error;
  return response.data || [];
};
