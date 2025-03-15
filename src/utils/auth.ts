
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";

/**
 * Sends a password reset email to the user
 * @param email User's email address
 * @returns Promise with the operation result
 */
export async function sendPasswordResetEmail(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

/**
 * Admin function to reset a user's password
 * @param userId User ID to reset password for
 * @param newPassword The new password to set
 * @returns Promise with the operation result
 */
export async function adminResetUserPassword(userId: string, newPassword: string) {
  // In a real app, this would call a secure server endpoint
  // This is a simplified example
  return supabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  });
}

/**
 * Update the user's password
 * @param newPassword The new password to set
 * @returns Promise with the operation result
 */
export async function updateUserPassword(newPassword: string) {
  return supabase.auth.updateUser({
    password: newPassword,
  });
}
