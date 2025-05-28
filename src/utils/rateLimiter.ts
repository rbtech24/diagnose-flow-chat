
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (identifier: string) => string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Clean up expired entries every minute
    setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime <= now) {
        this.store.delete(key);
      }
    }
  }

  private getKey(identifier: string): string {
    return this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier;
  }

  check(identifier: string): { allowed: boolean; resetTime?: number; remaining?: number } {
    const key = this.getKey(identifier);
    const now = Date.now();
    const windowStart = now + this.config.windowMs;
    
    let entry = this.store.get(key);
    
    // If no entry exists or the window has expired, create a new one
    if (!entry || entry.resetTime <= now) {
      entry = {
        count: 0,
        resetTime: windowStart
      };
      this.store.set(key, entry);
    }
    
    // Check if request is allowed
    if (entry.count >= this.config.maxRequests) {
      return {
        allowed: false,
        resetTime: entry.resetTime,
        remaining: 0
      };
    }
    
    // Increment counter and allow request
    entry.count++;
    
    return {
      allowed: true,
      resetTime: entry.resetTime,
      remaining: this.config.maxRequests - entry.count
    };
  }

  reset(identifier: string): void {
    const key = this.getKey(identifier);
    this.store.delete(key);
  }

  getStatus(identifier: string): { count: number; resetTime: number; remaining: number } | null {
    const key = this.getKey(identifier);
    const entry = this.store.get(key);
    
    if (!entry) {
      return null;
    }
    
    return {
      count: entry.count,
      resetTime: entry.resetTime,
      remaining: Math.max(0, this.config.maxRequests - entry.count)
    };
  }
}

// Create rate limiters for different use cases
export const apiRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60000, // 1 minute
  keyGenerator: (identifier) => `api_${identifier}`
});

export const loginRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 300000, // 5 minutes
  keyGenerator: (identifier) => `login_${identifier}`
});

export const formSubmissionRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000, // 1 minute
  keyGenerator: (identifier) => `form_${identifier}`
});

export { RateLimiter };
