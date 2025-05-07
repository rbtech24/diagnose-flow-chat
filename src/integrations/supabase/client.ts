
import { createClient } from '@supabase/supabase-js';

// Use these values directly rather than environment variables
const supabaseUrl = 'https://jukatimjnqhhlxkrxsak.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a2F0aW1qbnFoaGx4a3J4c2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzOTg3MjYsImV4cCI6MjA1NDk3NDcyNn0.cbWwrd2QIEkb25-8tKpcqRhYai1q6bMcxd2dkC_qssE';

// Verify the Supabase URL and API key are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please check your client configuration.');
}

// Create the Supabase client with explicit configuration for auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage
  },
  global: {
    headers: {
      'x-application-name': 'repair-autopilot',
      'apikey': supabaseAnonKey  // Always include the API key in headers
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
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Auth connection test failed:", error);
      return {
        success: false,
        message: error.message
      };
    }
    return { 
      success: true,
      session: data.session 
    };
  } catch (e) {
    console.error("Unexpected error during auth connection test:", e);
    return {
      success: false,
      message: "Could not connect to authentication service"
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
        error: { message: "Authentication service unavailable: " + connectionTest.message } 
      };
    }
    
    // Try sign-in with explicit options to ensure proper auth flow
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Sign in error details:", error);
      return { data, error };
    }
    
    console.log("Sign in successful, user data:", data.user);
    return { data, error: null };
  } catch (e) {
    console.error("Unexpected error during sign in:", e);
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
        error: { message: "Authentication service unavailable: " + connectionTest.message } 
      };
    }
    
    const redirectTo = options?.redirectTo || `${siteUrl}/verify-email-success`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: options?.data || {},
        emailRedirectTo: redirectTo
      }
    });
    
    if (error) {
      console.error("Sign up error details:", error);
      return { data, error };
    }
    
    if (data.user) {
      console.log("Sign up successful, user data:", data.user);
    }
    
    return { data, error: null };
  } catch (e) {
    console.error("Unexpected error during sign up:", e);
    return { 
      data: null, 
      error: { 
        message: "An unexpected error occurred during sign up. Please try again." 
      } 
    };
  }
};

// Reset password function with improved error handling
export const resetPassword = async (email: string, redirectTo?: string) => {
  console.log(`Attempting to send password reset for email: ${email}`);
  
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email, 
      { 
        redirectTo: redirectTo || `${siteUrl}/reset-password` 
      }
    );
    
    if (error) {
      console.error("Password reset error details:", error);
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
