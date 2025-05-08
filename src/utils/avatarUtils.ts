import { User } from "@/types/user";

/**
 * Colors used for generating avatar backgrounds based on user initials
 */
const AVATAR_COLORS = [
  "#3498db", // blue
  "#1abc9c", // teal
  "#9b59b6", // purple
  "#f1c40f", // yellow
  "#e74c3c", // red
  "#34495e", // navy
  "#2ecc71", // green
  "#e67e22", // orange
];

/**
 * Gets initials from a user's name or email
 * @param user User object
 * @returns String with 1-2 letters representing the user
 */
export function getUserInitials(user?: User | null): string {
  if (!user) return "?";
  
  if (user.name) {
    const nameParts = user.name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  }
  
  return user.email.substring(0, 2).toUpperCase();
}

/**
 * Gets a consistent color for a user based on their ID
 * @param user User object
 * @returns CSS color value
 */
export function getUserAvatarColor(user?: User | null): string {
  if (!user || !user.id) return AVATAR_COLORS[0];
  
  // Use the user's ID to deterministically pick a color
  const id = user.id.toString();
  const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = sum % AVATAR_COLORS.length;
  
  return AVATAR_COLORS[colorIndex];
}

/**
 * Gets avatar URL for a user, with proper fallbacks
 * @param user User object
 * @returns Valid URL string for the user's avatar
 */
export function getUserAvatarUrl(user?: User | null): string | undefined {
  if (!user) return undefined;
  
  // If user has an avatarUrl, use it
  if (user.avatarUrl && user.avatarUrl.trim() !== '') {
    return user.avatarUrl;
  }
  
  // Otherwise return undefined to trigger the fallback
  return undefined;
}
