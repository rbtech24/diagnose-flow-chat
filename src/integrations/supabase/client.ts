
import { createClient } from '@supabase/supabase-js';

// Define Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jukatimjnqhhlxkrxsak.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a2F0aW1qbnFoaGx4a3J4c2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzOTg3MjYsImV4cCI6MjA1NDk3NDcyNn0.cbWwrd2QIEkb25-8tKpcqRhYai1q6bMcxd2dkC_qssE';

// Create and export the supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  global: {
    fetch: (url: string, options?: RequestInit) => fetch(url, options)
  }
});

// Debug log initialization
console.log("Supabase client initialized with URL:", supabaseUrl);
console.log("Supabase auth configuration:", {
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: false
});
