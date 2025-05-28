
import { supabase } from "@/integrations/supabase/client";
import { APIErrorHandler } from "@/utils/apiErrorHandler";

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'video' | 'document' | 'interactive';
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  mediaUrl?: string;
  thumbnailUrl?: string;
  companyId: string;
  authorId: string;
  isPublic: boolean;
  completionCriteria: {
    requiresQuiz: boolean;
    passingScore?: number;
    timeRequired?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingProgress {
  id: string;
  userId: string;
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  progress: number; // 0-100
  startedAt?: Date;
  completedAt?: Date;
  score?: number;
  timeSpent: number; // in minutes
}

export interface CertificationProgram {
  id: string;
  name: string;
  description: string;
  requiredModules: string[];
  companyId: string;
  isActive: boolean;
  validityPeriod: number; // in months
  createdAt: Date;
  updatedAt: Date;
}

// Fetch training modules
export const fetchTrainingModules = async (filters?: {
  type?: string;
  difficulty?: string;
  tags?: string[];
}): Promise<TrainingModule[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    let query = supabase
      .from("training_modules")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.type) {
      query = query.eq("type", filters.type);
    }
    if (filters?.difficulty) {
      query = query.eq("difficulty", filters.difficulty);
    }
    if (filters?.tags && filters.tags.length > 0) {
      query = query.overlaps("tags", filters.tags);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(module => ({
      id: module.id,
      title: module.title,
      description: module.description,
      content: module.content,
      type: module.type,
      duration: module.duration,
      difficulty: module.difficulty,
      tags: module.tags || [],
      mediaUrl: module.media_url,
      thumbnailUrl: module.thumbnail_url,
      companyId: module.company_id,
      authorId: module.author_id,
      isPublic: module.is_public,
      completionCriteria: module.completion_criteria || {
        requiresQuiz: false
      },
      createdAt: new Date(module.created_at),
      updatedAt: new Date(module.updated_at)
    }));
  }, "fetchTrainingModules");

  if (!response.success) throw response.error;
  return response.data || [];
};

// Fetch user's training progress
export const fetchTrainingProgress = async (userId?: string): Promise<TrainingProgress[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    const targetUserId = userId || userData.user.id;

    const { data, error } = await supabase
      .from("training_progress")
      .select("*")
      .eq("user_id", targetUserId)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(progress => ({
      id: progress.id,
      userId: progress.user_id,
      moduleId: progress.module_id,
      status: progress.status,
      progress: progress.progress || 0,
      startedAt: progress.started_at ? new Date(progress.started_at) : undefined,
      completedAt: progress.completed_at ? new Date(progress.completed_at) : undefined,
      score: progress.score,
      timeSpent: progress.time_spent || 0
    }));
  }, "fetchTrainingProgress");

  if (!response.success) throw response.error;
  return response.data || [];
};

// Update training progress
export const updateTrainingProgress = async (
  moduleId: string,
  progressData: {
    status?: TrainingProgress['status'];
    progress?: number;
    score?: number;
    timeSpent?: number;
  }
): Promise<TrainingProgress> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    const updateData: any = {
      ...progressData,
      updated_at: new Date().toISOString()
    };

    if (progressData.status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("training_progress")
      .upsert({
        user_id: userData.user.id,
        module_id: moduleId,
        ...updateData
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      moduleId: data.module_id,
      status: data.status,
      progress: data.progress || 0,
      startedAt: data.started_at ? new Date(data.started_at) : undefined,
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      score: data.score,
      timeSpent: data.time_spent || 0
    };
  }, "updateTrainingProgress");

  if (!response.success) throw response.error;
  return response.data!;
};

// Fetch certification programs
export const fetchCertificationPrograms = async (): Promise<CertificationProgram[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Authentication required");

    const { data, error } = await supabase
      .from("certification_programs")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) throw error;

    return (data || []).map(program => ({
      id: program.id,
      name: program.name,
      description: program.description,
      requiredModules: program.required_modules || [],
      companyId: program.company_id,
      isActive: program.is_active,
      validityPeriod: program.validity_period || 12,
      createdAt: new Date(program.created_at),
      updatedAt: new Date(program.updated_at)
    }));
  }, "fetchCertificationPrograms");

  if (!response.success) throw response.error;
  return response.data || [];
};
