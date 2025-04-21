
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { showToast } from "@/utils/toast-helpers";

interface TechMetrics {
  assignedJobs: number;
  completedJobs: number;
  avgCompletionTime: string;
  responseTime: string;
  satisfaction: number;
  firstTimeFixRate: number;
  openIssues: number;
  isLoading: boolean;
  error: Error | null;
}

// Ensure proper check: metadata must have first_time_fix and be object, not array
function isMetadataWithFirstTimeFix(metadata: unknown): metadata is { first_time_fix: boolean } {
  return (
    metadata !== null &&
    typeof metadata === "object" &&
    !Array.isArray(metadata) &&
    "first_time_fix" in (metadata as object) &&
    typeof (metadata as any).first_time_fix === "boolean"
  );
}

export function useTechMetrics(): TechMetrics {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<TechMetrics>({
    assignedJobs: 0,
    completedJobs: 0,
    avgCompletionTime: "N/A",
    responseTime: "N/A",
    satisfaction: 0,
    firstTimeFixRate: 0,
    openIssues: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchMetrics() {
      if (!user?.id) {
        setMetrics((prev) => ({
          ...prev,
          isLoading: false,
          error: new Error("User not found"),
        }));
        return;
      }

      try {
        // Assigned repair jobs
        const { count: assignedCount, error: assignedError } = await supabase
          .from("repairs")
          .select("*", { count: "exact", head: true })
          .eq("technician_id", user.id)
          .in("status", ["assigned", "in_progress"]);

        if (assignedError) throw assignedError;

        // Completed repair jobs
        const { count: completedCount, error: completedError } = await supabase
          .from("repairs")
          .select("*", { count: "exact", head: true })
          .eq("technician_id", user.id)
          .eq("status", "completed");

        if (completedError) throw completedError;

        // Open support tickets/issues
        const { count: openIssuesCount, error: openIssuesError } = await supabase
          .from("support_tickets")
          .select("*", { count: "exact", head: true })
          .eq("assigned_to", user.id)
          .in("status", ["open", "in_progress"]);

        if (openIssuesError) throw openIssuesError;

        // Actual completion times (intervals) for completed repairs
        const { data: timeData, error: timeError } = await supabase
          .from("repairs")
          .select("actual_duration")
          .eq("technician_id", user.id)
          .eq("status", "completed")
          .not("actual_duration", "is", null);

        if (timeError) throw timeError;

        // Response times
        const { data: responseTimeData, error: respTimeError } = await supabase
          .from("repairs")
          .select("scheduled_at, started_at")
          .eq("technician_id", user.id)
          .not("started_at", "is", null)
          .not("scheduled_at", "is", null)
          .order("created_at", { ascending: false })
          .limit(10);

        if (respTimeError) throw respTimeError;

        // First-time fix rate from repair metadata
        const { data: fixRateData, error: fixRateError } = await supabase
          .from("repairs")
          .select("metadata")
          .eq("technician_id", user.id)
          .eq("status", "completed");

        if (fixRateError) throw fixRateError;

        // Customer satisfaction ratings
        const { data: ratingData, error: ratingError } = await supabase
          .from("service_records")
          .select("rating")
          .eq("technician_id", user.id)
          .not("rating", "is", null);

        if (ratingError) throw ratingError;

        // Compute satisfaction average (if data available)
        let satisfactionScore = 0;
        if (ratingData && ratingData.length > 0) {
          const sum = ratingData.reduce((acc, record) => acc + record.rating, 0);
          const avgRating = sum / ratingData.length;
          satisfactionScore = Math.round((avgRating / 5) * 100);
        }

        // Actual average completion time calculation (intervals)
        let avgTime = "N/A";
        if (timeData && timeData.length > 0) {
          // Attempt to parse PostgreSQL interval strings: sum total minutes/hours
          let totalMinutes = 0;
          let count = 0;
          timeData.forEach((row) => {
            const val = row.actual_duration;
            if (typeof val === "string") {
              // Simple regex for extracting hours and minutes
              const match = val.match(/(\d+)\s+hours?/i);
              const mins = val.match(/(\d+)\s+mins?/i) || val.match(/(\d+)\s+minutes?/i);
              const hours = match ? parseInt(match[1], 10) : 0;
              const minutes = mins ? parseInt(mins[1], 10) : 0;
              totalMinutes += hours * 60 + minutes;
              count++;
            }
          });
          if (count > 0) {
            const avgMins = totalMinutes / count;
            const avgHr = Math.floor(avgMins / 60);
            const avgMin = Math.round(avgMins % 60);
            avgTime = `${avgHr}h ${avgMin}m`;
          }
        }

        // Compute average response time
        let respTime = "N/A";
        if (responseTimeData && responseTimeData.length > 0) {
          let totalResponseTime = 0;
          let validRecords = 0;

          responseTimeData.forEach((record) => {
            if (record.scheduled_at && record.started_at) {
              const scheduledTime = new Date(record.scheduled_at).getTime();
              const startedTime = new Date(record.started_at).getTime();
              if (!isNaN(scheduledTime) && !isNaN(startedTime) && startedTime >= scheduledTime) {
                totalResponseTime += (startedTime - scheduledTime) / (1000 * 60); // minutes
                validRecords++;
              }
            }
          });

          if (validRecords > 0) {
            const avgMins = totalResponseTime / validRecords;
            const avgHr = Math.floor(avgMins / 60);
            const avgMin = Math.round(avgMins % 60);
            respTime = `${avgHr}h ${avgMin}m`;
          }
        }

        // Compute first-time fix rate
        let firstTimeFixRate = 0;
        if (fixRateData && fixRateData.length > 0) {
          const fixedFirstTime = fixRateData.filter((record) => {
            const m = record.metadata;
            if (
              m &&
              typeof m === "object" &&
              !Array.isArray(m) &&
              "first_time_fix" in m &&
              typeof (m as any).first_time_fix === "boolean"
            ) {
              return (m as any).first_time_fix === true;
            }
            return false;
          }).length;

          firstTimeFixRate = Math.round((fixedFirstTime / fixRateData.length) * 100);
        }

        setMetrics({
          assignedJobs: assignedCount || 0,
          completedJobs: completedCount || 0,
          avgCompletionTime: avgTime,
          responseTime: respTime,
          satisfaction: satisfactionScore,
          firstTimeFixRate,
          openIssues: openIssuesCount || 0,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setMetrics({
          assignedJobs: 0,
          completedJobs: 0,
          avgCompletionTime: "N/A",
          responseTime: "N/A",
          satisfaction: 0,
          firstTimeFixRate: 0,
          openIssues: 0,
          isLoading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        });

        showToast.error(
          "Could not load metrics: " +
            (error instanceof Error ? error.message : String(error))
        );
      }
    }

    fetchMetrics();
  }, [user?.id]);

  return metrics;
}
