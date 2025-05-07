import { createClient } from '@supabase/supabase-js';

// Use these values directly rather than environment variables
const supabaseUrl = 'https://jukatimjnqhhlxkrxsak.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a2F0aW1qbnFoaGx4a3J4c2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzOTg3MjYsImV4cCI6MjA1NDk3NDcyNn0.cbWwrd2QIEkb25-8tKpcqRhYai1q6bMcxd2dkC_qssE';

// Verify the Supabase URL and API key are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please check your client configuration.');
}

// Create the Supabase client with explicit storage and auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'supabase.auth.token',
    flowType: 'implicit'
  },
  global: {
    headers: {
      'x-application-name': 'repair-autopilot',
      'apikey': supabaseAnonKey  // Always include the API key in headers
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Set the site URL for authentication redirects
export const siteUrl = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'https://repairautopilot.com';

// A robust function to test authentication availability
export const testAuthConnection = async () => {
  try {
    console.log("Testing auth connection to:", supabaseUrl);
    
    // First check if we can reach Supabase at all
    const startTime = Date.now();
    
    // Try a health check first
    const healthCheckFetch = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': supabaseAnonKey,
        'X-Client-Info': 'repair-autopilot'
      }
    }).catch(e => {
      console.error("Health check failed:", e);
      return { ok: false, status: 0 };
    });
    
    if (!healthCheckFetch.ok) {
      console.error("Health check failed with status:", healthCheckFetch.status);
      return {
        success: false,
        message: `Supabase API unreachable (status: ${healthCheckFetch.status})`,
        responseTime: Date.now() - startTime
      };
    }

    // Then try the actual auth session check
    const { data, error } = await supabase.auth.getSession();
    const endTime = Date.now();
    
    console.log(`Auth connection response time: ${endTime - startTime}ms`);
    
    if (error) {
      console.error("Auth connection test failed:", error);
      
      if (error.message.includes("Database error")) {
        // This is likely a Supabase service issue
        return {
          success: false,
          message: "Database service issue. Please try again later.",
          responseTime: endTime - startTime,
          maintenanceMode: true
        };
      }
      
      return {
        success: false,
        message: error.message,
        responseTime: endTime - startTime
      };
    }
    
    return { 
      success: true,
      session: data.session,
      responseTime: endTime - startTime
    };
  } catch (e) {
    console.error("Unexpected error during auth connection test:", e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Could not connect to authentication service",
      error: e
    };
  }
};

// Export a function to handle sign-in for better error tracking
export const signInWithEmail = async (email: string, password: string) => {
  console.log(`Attempting to sign in with email: ${email}`);
  
  try {
    // First test auth connectivity
    const connectionTest = await testAuthConnection();
    if (!connectionTest.success) {
      return { 
        data: null, 
        error: { message: "Authentication service unavailable: " + connectionTest.message },
        maintenanceMode: connectionTest.maintenanceMode || false
      };
    }
    
    // Clear any previous auth errors from storage
    localStorage.removeItem('sb-auth-error');
    
    // Try sign-in with explicit options to ensure proper auth flow
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Sign in error details:", error);
      
      // Check for database errors which indicate maintenance issues
      if (error.message.includes("Database error") || 
          error.message.includes("column") || 
          error.status === 500) {
        
        localStorage.setItem('sb-auth-error', JSON.stringify({
          type: 'database-error',
          message: error.message,
          timestamp: new Date().toISOString()
        }));
        
        return { 
          data, 
          error,
          maintenanceMode: true 
        };
      }
      
      localStorage.setItem('sb-auth-error', JSON.stringify({
        type: 'sign-in',
        message: error.message,
        timestamp: new Date().toISOString()
      }));
      return { data, error };
    }
    
    console.log("Sign in successful, user data:", data.user);
    localStorage.removeItem('sb-auth-error');
    return { data, error: null };
  } catch (e) {
    console.error("Unexpected error during sign in:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred during sign in";
    
    localStorage.setItem('sb-auth-error', JSON.stringify({
      type: 'sign-in-exception',
      message: errorMessage,
      timestamp: new Date().toISOString()
    }));
    
    return { 
      data: null, 
      error: { 
        message: "An unexpected error occurred during sign in. Please try again." 
      } 
    };
  }
};

// A function to handle sign-up with better error handling
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  options?: { 
    data?: Record<string, any>,
    redirectTo?: string 
  }
) => {
  console.log(`Attempting to sign up with email: ${email}`);
  
  try {
    // First test auth connectivity
    const connectionTest = await testAuthConnection();
    if (!connectionTest.success) {
      return { 
        data: null, 
        error: { 
          message: "Authentication service unavailable: " + connectionTest.message,
          status: 503
        },
        maintenanceMode: connectionTest.maintenanceMode || false
      };
    }
    
    // Clear any previous auth errors from storage
    localStorage.removeItem('sb-auth-error');
    
    const redirectTo = options?.redirectTo || `${siteUrl}/verify-email-success`;
    
    console.log("Using redirect URL:", redirectTo);
    
    // Use more resilient signup configuration
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: options?.data || {},
        emailRedirectTo: redirectTo,
        captchaToken: null
      }
    });
    
    if (error) {
      console.error("Sign up error details:", error);
      
      // Check for database errors which indicate maintenance issues
      if (error.message && 
         (error.message.includes("Database error") || 
          error.message.includes("column") ||
          error.status === 500)) {
        
        localStorage.setItem('sb-auth-error', JSON.stringify({
          type: 'database-error',
          message: error.message,
          timestamp: new Date().toISOString()
        }));
        
        return {
          data,
          error,
          maintenanceMode: true
        };
      }
      
      localStorage.setItem('sb-auth-error', JSON.stringify({
        type: 'sign-up',
        message: error.message,
        timestamp: new Date().toISOString()
      }));
      return { data, error };
    }
    
    if (data.user) {
      console.log("Sign up successful, user data:", data.user);
      console.log("Email confirmation status:", data.user.email_confirmed_at ? "Confirmed" : "Not confirmed");
      localStorage.removeItem('sb-auth-error');
    }
    
    return { data, error: null };
  } catch (e) {
    console.error("Unexpected error during sign up:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred during sign up";
    
    localStorage.setItem('sb-auth-error', JSON.stringify({
      type: 'sign-up-exception',
      message: errorMessage,
      timestamp: new Date().toISOString()
    }));
    
    return { 
      data: null, 
      error: { 
        message: "An unexpected error occurred during sign up. Please try again.",
        status: 500
      } 
    };
  }
};

// Reset password function with improved error handling
export const resetPassword = async (email: string, redirectTo?: string) => {
  console.log(`Attempting to send password reset for email: ${email}`);
  
  try {
    // First test auth connectivity
    const connectionTest = await testAuthConnection();
    if (!connectionTest.success) {
      return { 
        error: { message: "Authentication service unavailable: " + connectionTest.message },
        maintenanceMode: connectionTest.maintenanceMode || false 
      };
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(
      email, 
      { 
        redirectTo: redirectTo || `${siteUrl}/reset-password` 
      }
    );
    
    if (error) {
      console.error("Password reset error details:", error);
      
      // Check for database errors which indicate maintenance issues
      if (error.message && 
         (error.message.includes("Database error") || 
          error.message.includes("column") ||
          error.status === 500)) {
        
        return {
          error,
          maintenanceMode: true
        };
      }
      
      return { error };
    }
    
    return { error: null };
  } catch (e) {
    console.error("Unexpected error during password reset:", e);
    return { 
      error: { 
        message: "An unexpected error occurred during password reset. Please try again." 
      } 
    };
  }
};

// A function to handle sign-out with better error handling
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Sign out error:", error);
      return { error };
    }
    
    console.log("User signed out successfully");
    return { error: null };
  } catch (e) {
    console.error("Unexpected error during sign out:", e);
    return {
      error: {
        message: "An unexpected error occurred during sign out. Please try again."
      }
    };
  }
};

// A function to get the current session with error handling
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Get session error:", error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (e) {
    console.error("Unexpected error getting session:", e);
    return {
      data: null,
      error: {
        message: "An unexpected error occurred while getting the session."
      }
    };
  }
};
