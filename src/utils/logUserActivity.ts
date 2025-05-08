
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
    // Get user agent and IP information if available
    let userAgent = '';
    let ipAddress = '';
    
    if (typeof window !== 'undefined') {
      userAgent = window.navigator.userAgent;
    }

    const { error } = await supabase.from('user_activity_logs').insert({
      user_id: userId,
      activity_type: activityType,
      description,
      ip_address: ipAddress,
      user_agent: userAgent,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        browser: getBrowserInfo(),
        platform: getPlatformInfo()
      }
    });

    if (error) {
      console.error('Error logging user activity:', error);
    }
  } catch (err) {
    console.error('Failed to log user activity:', err);
  }
}

// Helper functions to get more detailed browser and platform info
function getBrowserInfo(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const ua = window.navigator.userAgent;
  let browser = 'unknown';
  
  if (ua.indexOf("Firefox") > -1) {
    browser = "Firefox";
  } else if (ua.indexOf("SamsungBrowser") > -1) {
    browser = "Samsung Browser";
  } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
    browser = "Opera";
  } else if (ua.indexOf("Trident") > -1) {
    browser = "Internet Explorer";
  } else if (ua.indexOf("Edge") > -1) {
    browser = "Edge";
  } else if (ua.indexOf("Chrome") > -1) {
    browser = "Chrome";
  } else if (ua.indexOf("Safari") > -1) {
    browser = "Safari";
  }
  
  return browser;
}

function getPlatformInfo(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const platform = window.navigator.platform;
  
  if (platform.indexOf("Win") !== -1) return "Windows";
  if (platform.indexOf("Mac") !== -1) return "MacOS";
  if (platform.indexOf("Linux") !== -1) return "Linux";
  if (platform.indexOf("iPhone") !== -1) return "iOS";
  if (platform.indexOf("Android") !== -1) return "Android";
  
  return platform;
}
