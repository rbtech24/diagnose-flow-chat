
import { createClient } from '@supabase/supabase-js';

// Use these values directly rather than environment variables
const supabaseUrl = 'https://jukatimjnqhhlxkrxsak.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a2F0aW1qbnFoaGx4a3J4c2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzOTg3MjYsImV4cCI6MjA1NDk3NDcyNn0.cbWwrd2QIEkb25-8tKpcqRhYai1q6bMcxd2dkC_qssE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token'
  },
  global: {
    headers: {
      'x-application-name': 'repair-autopilot',
      'apikey': supabaseAnonKey  // Always include the API key in headers
    }
  }
});

// Set the site URL for authentication redirects
// This can be accessed by Supabase auth functions that need redirect URLs
export const siteUrl = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'https://repairautopilot.com';

// Debug log initialization
console.log("Supabase client initialized with URL:", supabaseUrl);
console.log("Site URL for redirects:", siteUrl);

// Export a function to handle sign-in for better error tracking
export const signInWithEmail = async (email: string, password: string) => {
  console.log(`Attempting to sign in with email: ${email}`);
  
  try {
    // Make sure we're including the apikey in all requests
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
