
interface RateLimitResult {
  allowed: boolean;
  resetTime?: number;
  remainingAttempts?: number;
}

class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  check(identifier: string): RateLimitResult {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true, remainingAttempts: this.maxAttempts - 1 };
    }

    if (now > record.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true, remainingAttempts: this.maxAttempts - 1 };
    }

    if (record.count >= this.maxAttempts) {
      return { 
        allowed: false, 
        resetTime: record.resetTime,
        remainingAttempts: 0
      };
    }

    record.count++;
    return { 
      allowed: true, 
      remainingAttempts: this.maxAttempts - record.count 
    };
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  getRemainingTime(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record) return 0;
    return Math.max(0, record.resetTime - Date.now());
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.attempts.entries()) {
      if (now > record.resetTime) {
        this.attempts.delete(key);
      }
    }
  }
}

// Enhanced rate limiters for different use cases
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const apiRateLimiter = new RateLimiter(100, 60 * 1000); // 100 requests per minute
export const formSubmissionRateLimiter = new RateLimiter(10, 60 * 1000); // 10 submissions per minute
export const passwordResetRateLimiter = new RateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour

// Session security utilities
export class SessionManager {
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours
  
  static isSessionValid(session: any): boolean {
    if (!session || !session.expires_at) return false;
    
    const expiresAt = new Date(session.expires_at).getTime();
    const now = Date.now();
    
    return expiresAt > now;
  }
  
  static isSessionExpired(lastActivity: number): boolean {
    return Date.now() - lastActivity > this.INACTIVITY_TIMEOUT;
  }
  
  static updateLastActivity(): void {
    sessionStorage.setItem('lastActivity', Date.now().toString());
  }
  
  static getLastActivity(): number {
    const activity = sessionStorage.getItem('lastActivity');
    return activity ? parseInt(activity) : Date.now();
  }
}

// Token security utilities
export class TokenSecurity {
  private static readonly TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes
  
  static shouldRefreshToken(expiresAt: string): boolean {
    const expiry = new Date(expiresAt).getTime();
    const now = Date.now();
    return (expiry - now) < this.TOKEN_REFRESH_THRESHOLD;
  }
  
  static validateTokenFormat(token: string): boolean {
    // JWT format validation
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }
  
  static sanitizeToken(token: string): string {
    // Remove any potential XSS characters
    return token.replace(/[<>"'&]/g, '');
  }
}

// Password security utilities
export class PasswordSecurity {
  static readonly MIN_LENGTH = 12;
  static readonly REQUIRE_UPPERCASE = true;
  static readonly REQUIRE_LOWERCASE = true;
  static readonly REQUIRE_NUMBERS = true;
  static readonly REQUIRE_SPECIAL = true;
  
  static validateStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < this.MIN_LENGTH) {
      errors.push(`Password must be at least ${this.MIN_LENGTH} characters long`);
    }
    
    if (this.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (this.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (this.REQUIRE_NUMBERS && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (this.REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Check for common patterns
    if (this.hasCommonPatterns(password)) {
      errors.push('Password contains common patterns and is not secure');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  private static hasCommonPatterns(password: string): boolean {
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /admin/i,
      /(.)\1{3,}/, // Repeated characters
    ];
    
    return commonPatterns.some(pattern => pattern.test(password));
  }
  
  static generateSalt(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Cleanup old entries periodically
setInterval(() => {
  loginRateLimiter.cleanup();
  apiRateLimiter.cleanup();
  formSubmissionRateLimiter.cleanup();
  passwordResetRateLimiter.cleanup();
}, 5 * 60 * 1000); // Every 5 minutes
