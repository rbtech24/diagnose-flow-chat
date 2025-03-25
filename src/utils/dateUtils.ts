
/**
 * Converts a string date to a Date object
 * Handles Supabase string dates when converting to frontend Date objects
 */
export function parseDate(dateString: string | null | undefined): Date | undefined {
  if (!dateString) return undefined;
  return new Date(dateString);
}

/**
 * Safely formats a date object or string to ISO string for Supabase
 */
export function formatDateForSupabase(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  
  try {
    if (typeof date === 'string') {
      return new Date(date).toISOString();
    }
    
    return date.toISOString();
  } catch (error) {
    console.error('Error formatting date for Supabase:', error);
    return null;
  }
}

/**
 * Converts an object from Supabase date strings to Date objects
 */
export function convertSupabaseDates<T>(obj: Record<string, any>, dateFields: string[]): T {
  const result = { ...obj };
  
  dateFields.forEach(field => {
    if (obj[field]) {
      result[field] = parseDate(obj[field]);
    }
  });
  
  return result as T;
}

/**
 * Parses JSON or returns an empty array
 */
export function safeParseJsonArray(jsonString: string | any): any[] {
  if (Array.isArray(jsonString)) return jsonString;
  
  if (typeof jsonString !== 'string') {
    return [];
  }
  
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}
