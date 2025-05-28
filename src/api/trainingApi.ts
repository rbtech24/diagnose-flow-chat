
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
    let query = supabase
      .from('training_modules')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (companyId) {
      query = query.or(`company_id.eq.${companyId},is_public.eq.true`);
    } else {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch training modules: ${error.message}`);
    }

    return (data || []).map(module => ({
      id: module.id,
      title: module.title,
      description: module.description,
      content: module.content,
      type: module.type as TrainingModule['type'],
      duration: module.duration,
      difficulty: module.difficulty as TrainingModule['difficulty'],
      tags: module.tags || [],
      mediaUrl: module.media_url,
      thumbnailUrl: module.thumbnail_url,
      companyId: module.company_id,
      authorId: module.author_id,
      isPublic: module.is_public,
      completionCriteria: module.completion_criteria || {},
      createdAt: new Date(module.created_at),
      updatedAt: new Date(module.updated_at)
    }));
  }, "fetchTrainingModules");

  if (!response.success) throw response.error;
  return response.data || [];
};

// Fetch user training progress
export const fetchUserTrainingProgress = async (userId: string): Promise<TrainingProgress[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data, error } = await supabase
      .from('training_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_accessed_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch training progress: ${error.message}`);
    }

    return (data || []).map(progress => ({
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
  }, "fetchUserTrainingProgress");

  if (!response.success) throw response.error;
  return response.data || [];
};

// Start training module
export const startTrainingModule = async (moduleId: string): Promise<TrainingProgress> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

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

    if (error) {
      throw new Error(`Failed to start training module: ${error.message}`);
    }

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

    if (error) {
      throw new Error(`Failed to update training progress: ${error.message}`);
    }

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
      throw new Error(`Failed to fetch certification programs: ${error.message}`);
    }

    return data || [];
  }, "fetchCertificationPrograms");

  if (!response.success) throw response.error;
  return response.data || [];
};
