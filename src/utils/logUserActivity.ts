
import { supabase } from "@/integrations/supabase/client";

/**
 * Logs a user activity to the database
 * @param userId The ID of the user
 * @param activityType The type of activity (e.g., 'login', 'profile_update', 'password_change')
 * @param description A description of the activity
 * @param metadata Optional additional data
 */
export async function logUserActivity(
  userId: string,
  activityType: string,
  description: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  try {
    const { error } = await supabase.from('user_activity_logs').insert({
      user_id: userId,
      activity_type: activityType,
      description,
      metadata
    });

    if (error) {
      console.error('Error logging user activity:', error);
    }
  } catch (err) {
    console.error('Failed to log user activity:', err);
  }
}
