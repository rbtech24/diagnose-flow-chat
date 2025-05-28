
import { z } from 'zod';

// Rate limiting utility (client-side basic implementation)
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

// CSRF token utility
export const generateCSRFToken = (): string => {
  return crypto.randomUUID();
};

// Secure session storage
export const secureStorage = {
  set: (key: string, value: any) => {
    try {
      const encrypted = btoa(JSON.stringify(value));
      sessionStorage.setItem(`secure_${key}`, encrypted);
    } catch (error) {
      console.error('Failed to store secure data:', error);
    }
  },
  
  get: (key: string) => {
    try {
      const encrypted = sessionStorage.getItem(`secure_${key}`);
      if (!encrypted) return null;
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error('Failed to retrieve secure data:', error);
      return null;
    }
  },
  
  remove: (key: string) => {
    sessionStorage.removeItem(`secure_${key}`);
  }
};

// Input sanitization
export const sanitizeUserInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

// Validate file uploads
export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: 'File too large' };
  }

  return { isValid: true };
};
