
import { supabase } from "@/integrations/supabase/client";
import { User, UserWithPassword } from "@/types/user";
import { useUserManagementStore } from "@/store/userManagementStore";

// Session tracking keys
const SESSION_ID_KEY = 'session_id';
const LAST_ACTIVITY_KEY = 'last_activity';
const SESSION_TIMEOUT_MS = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return Date.now().toString() + '-' + Math.random().toString(36).substring(2, 15);
}

/**
 * Update the last activity timestamp
 */
export function updateLastActivity(): void {
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
}

/**
 * Check if the session has timed out
 */
export function hasSessionTimedOut(): boolean {
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  
  if (!lastActivity) {
    return true;
  }
  
  const lastActivityTime = parseInt(lastActivity, 10);
  const currentTime = Date.now();
  
  return (currentTime - lastActivityTime) > SESSION_TIMEOUT_MS;
}

/**
 * Register a new session and broadcast to other tabs
 * @returns The new session ID
 */
export function registerSession(): string {
  const sessionId = generateSessionId();
  localStorage.setItem(SESSION_ID_KEY, sessionId);
  
  // Broadcast the login event to other tabs
  const broadcastChannel = new BroadcastChannel('auth_channel');
  broadcastChannel.postMessage({ 
    type: 'new_login', 
    sessionId,
    timestamp: Date.now()
  });
  broadcastChannel.close();
  
  return sessionId;
}

/**
 * Check if current license is valid
 * @param user The current user
 * @returns Boolean indicating if license is valid
 */
export function verifyLicense(user: User | null): boolean {
  if (!user) return false;
  
  // For company and tech users, check subscription status
  if (user.role === 'company' || user.role === 'tech') {
    // If status is not active or trial, license is invalid
    if (user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'trial') {
      return false;
    }
    
    // If trial has ended, license is invalid
    if (user.subscriptionStatus === 'trial' && user.trialEndsAt) {
      const trialEndDate = new Date(user.trialEndsAt);
      if (trialEndDate < new Date()) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Sends a password reset email to the user
 * @param email User's email address
 * @returns Promise with the operation result
 */
export async function sendPasswordResetEmail(email: string) {
  // In a real app with Supabase, this would use:
  // return supabase.auth.resetPasswordForEmail(email, {
  //   redirectTo: `${window.location.origin}/reset-password`,
  // });
  
  // For our mock implementation, we'll simulate success
  return {
    data: {},
    error: null
  };
}

/**
 * Admin function to reset a user's password
 * @param userId User ID to reset password for
 * @param newPassword The new password to set
 * @returns Promise with the operation result
 */
export async function adminResetUserPassword(userId: string, newPassword: string) {
  const { resetUserPassword } = useUserManagementStore.getState();
  return resetUserPassword(userId, newPassword);
}

/**
 * Update the user's password
 * @param newPassword The new password to set
 * @returns Promise with the operation result
 */
export async function updateUserPassword(newPassword: string) {
  // In a real app with Supabase, this would use:
  // return supabase.auth.updateUser({
  //   password: newPassword,
  // });
  
  // For our mock implementation, we'll simulate success
  return {
    data: {},
    error: null
  };
}

/**
 * Authenticate a user with email and password
 * @param email User's email
 * @param password User's password
 * @returns Promise with the authentication result
 */
export async function signInWithEmailPassword(email: string, password: string) {
  // In a real app with Supabase, this would use:
  // return supabase.auth.signInWithPassword({
  //   email,
  //   password,
  // });
  
  // For our mock implementation, we'll simulate checking users in our store
  const { users } = useUserManagementStore.getState();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (user) {
    // In a real app, we would verify the password
    // For demo purposes, any password works
    return {
      data: { user },
      error: null
    };
  }
  
  return {
    data: { user: null },
    error: { message: "Invalid email or password" }
  };
}

/**
 * Sign up a new user
 * @param email User's email
 * @param password User's password
 * @param userData Additional user data
 * @returns Promise with the signup result
 */
export async function signUp(email: string, password: string, userData: Partial<User>) {
  // In a real app with Supabase, this would use:
  // const authResponse = await supabase.auth.signUp({
  //   email,
  //   password,
  // });
  // 
  // if (authResponse.error) {
  //   return authResponse;
  // }
  // 
  // // Create user profile
  // const { error } = await supabase.from('users').insert([{
  //   id: authResponse.data.user?.id,
  //   email,
  //   ...userData
  // }]);
  
  // For our mock implementation, we'll simulate success
  return {
    data: {},
    error: null
  };
}

/**
 * Sign out the current user
 * @returns Promise with the signout result
 */
export async function signOut() {
  // In a real app with Supabase, this would use:
  // return supabase.auth.signOut();
  
  // For our mock implementation, we'll simulate success
  // Clear local storage in our auth context
  localStorage.removeItem("currentUser");
  localStorage.removeItem(SESSION_ID_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
  
  return {
    error: null
  };
}
