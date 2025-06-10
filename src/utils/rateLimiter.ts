
interface RateLimitResult {
  allowed: boolean;
  resetTime?: number;
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
      return { allowed: true };
    }

    if (now > record.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true };
    }

    if (record.count >= this.maxAttempts) {
      return { allowed: false, resetTime: record.resetTime };
    }

    record.count++;
    return { allowed: true };
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
