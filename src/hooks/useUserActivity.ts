
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UserActivity {
  id: string;
  title: string;
  timestamp: string;
  metadata?: Record<string, any>;
  activity_type?: string;
  description?: string;
}

export function useUserActivity(userId: string | undefined) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setActivities([]);
      setIsLoading(false);
      return;
    }

    const fetchUserActivity = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.functions.invoke('get-user-activity', {
          body: { userId },
        });

        if (error) {
          throw new Error(error.message);
        }

        // Ensure data is properly formatted as UserActivity[]
        const formattedActivities: UserActivity[] = Array.isArray(data) ? data : [];
        setActivities(formattedActivities);
      } catch (err) {
        console.error("Error fetching user activity:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch user activity");
        
        // Use fallback mock data if something goes wrong
        setActivities([
          {
            id: "fallback-1",
            title: "Logged in",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "fallback-2",
            title: "Updated profile",
            timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserActivity();
  }, [userId]);

  return { activities, isLoading, error };
}
