
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
  category?: string;
  rating?: number;
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
    let query = supabase
      .from('training_modules')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (companyId) {
      query = query.or(`company_id.eq.${companyId},is_public.eq.true`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching training modules:', error);
      return [];
    }

    return (data || []).map((module: any) => ({
      id: module.id,
      title: module.title,
      description: module.description || '',
      content: module.content || '',
      type: module.type as TrainingModule['type'],
      duration: module.duration_minutes || 0,
      difficulty: module.difficulty as TrainingModule['difficulty'],
      tags: module.tags || [],
      mediaUrl: module.media_url || module.content_url,
      thumbnailUrl: module.thumbnail_url,
      companyId: module.company_id,
      authorId: module.author_id,
      isPublic: module.is_public || false,
      completionCriteria: (module.completion_criteria as Record<string, any>) || {},
      category: module.category,
      rating: module.rating || 0,
      createdAt: new Date(module.created_at),
      updatedAt: new Date(module.updated_at)
    }));
  }, "fetchTrainingModules");

  if (!response.success) {
    console.error('Training modules fetch failed:', response.error);
    return [];
  }
  return response.data || [];
};

// Fetch user training progress
export const fetchUserTrainingProgress = async (userId: string): Promise<TrainingProgress[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    try {
      const { data, error } = await supabase
        .from('training_progress')
        .select('*')
        .eq('user_id', userId)
        .order('last_accessed_at', { ascending: false });

      if (error) {
        console.error('Training progress query failed:', error);
        return [];
      }

      return (data || []).map((progress: any) => ({
        id: progress.id,
        userId: progress.user_id,
        moduleId: progress.module_id,
        status: progress.status as TrainingProgress['status'],
        progress: progress.progress,
        startedAt: progress.started_at ? new Date(progress.started_at) : undefined,
        completedAt: progress.completed_at ? new Date(progress.completed_at) : undefined,
        timeSpent: progress.time_spent,
        lastAccessedAt: new Date(progress.last_accessed_at)
      }));
    } catch (error) {
      console.error('Training progress table not ready yet:', error);
      return [];
    }
  }, "fetchUserTrainingProgress");

  if (!response.success) {
    console.error('Training progress fetch failed:', response.error);
    return [];
  }
  return response.data || [];
};

// Start training module
export const startTrainingModule = async (moduleId: string): Promise<TrainingProgress> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    try {
      const { data, error } = await supabase
        .from('training_progress')
        .insert({
          user_id: userData.user.id,
          module_id: moduleId,
          status: 'in_progress',
          progress: 0,
          started_at: new Date().toISOString(),
          time_spent: 0,
          last_accessed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        userId: data.user_id,
        moduleId: data.module_id,
        status: data.status as TrainingProgress['status'],
        progress: data.progress,
        startedAt: new Date(data.started_at),
        timeSpent: data.time_spent,
        lastAccessedAt: new Date(data.last_accessed_at)
      };
    } catch (error) {
      console.error('Training progress table not ready yet:', error);
      // Return a mock progress object for now
      return {
        id: crypto.randomUUID(),
        userId: userData.user.id,
        moduleId: moduleId,
        status: 'in_progress' as const,
        progress: 0,
        startedAt: new Date(),
        timeSpent: 0,
        lastAccessedAt: new Date()
      };
    }
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
    try {
      const updateData: any = {
        last_accessed_at: new Date().toISOString()
      };

      if (updates.progress !== undefined) {
        updateData.progress = updates.progress;
      }
      if (updates.timeSpent !== undefined) {
        updateData.time_spent = updates.timeSpent;
      }
      if (updates.status !== undefined) {
        updateData.status = updates.status;
        if (updates.status === 'completed') {
          updateData.completed_at = new Date().toISOString();
        }
      }

      const { data, error } = await supabase
        .from('training_progress')
        .update(updateData)
        .eq('id', progressId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        userId: data.user_id,
        moduleId: data.module_id,
        status: data.status as TrainingProgress['status'],
        progress: data.progress,
        startedAt: data.started_at ? new Date(data.started_at) : undefined,
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
        timeSpent: data.time_spent,
        lastAccessedAt: new Date(data.last_accessed_at)
      };
    } catch (error) {
      console.error('Training progress update failed:', error);
      throw new Error('Training progress update not available yet');
    }
  }, "updateTrainingProgress");

  if (!response.success) throw response.error;
  return response.data!;
};

// Fetch certification programs
export const fetchCertificationPrograms = async (companyId?: string): Promise<any[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    let query = supabase
      .from("certification_programs")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (companyId) {
      query = query.eq("company_id", companyId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching certification programs:', error);
      return [];
    }

    return data || [];
  }, "fetchCertificationPrograms");

  if (!response.success) {
    console.error('Certification programs fetch failed:', response.error);
    return [];
  }
  return response.data || [];
};
