/**
 * Rate Limiter - Token Bucket Algorithm
 * 
 * Prevents excessive operations (spam clicking add/remove).
 * Uses token bucket for smooth rate limiting with burst allowance.
 */

export interface RateLimitOptions {
  /** Maximum tokens in bucket (burst capacity) */
  maxTokens?: number;
  /** Token refill rate per second */
  refillRate?: number;
  /** Initial tokens (defaults to maxTokens) */
  initialTokens?: number;
}

export interface RateLimiter {
  /** Try to consume a token, returns true if allowed */
  tryConsume: (key?: string) => boolean;
  /** Check remaining tokens without consuming */
  getRemaining: (key?: string) => number;
  /** Reset rate limiter for a key */
  reset: (key?: string) => void;
  /** Reset all rate limiters */
  resetAll: () => void;
}

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const DEFAULT_OPTIONS: Required<Omit<RateLimitOptions, 'initialTokens'>> = {
  maxTokens: 10,
  refillRate: 2, // 2 tokens per second
};

/**
 * Create a rate limiter instance
 */
export function createRateLimiter(options: RateLimitOptions = {}): RateLimiter {
  const { maxTokens, refillRate } = { ...DEFAULT_OPTIONS, ...options };
  const initialTokens = options.initialTokens ?? maxTokens;
  
  // Per-key buckets for fine-grained limiting
  const buckets = new Map<string, TokenBucket>();
  const DEFAULT_KEY = '__default__';

  /**
   * Get or create a bucket for a key
   */
  function getBucket(key: string): TokenBucket {
    if (!buckets.has(key)) {
      buckets.set(key, {
        tokens: initialTokens,
        lastRefill: Date.now(),
      });
    }
    return buckets.get(key)!;
  }

  /**
   * Refill tokens based on elapsed time
   */
  function refillBucket(bucket: TokenBucket): void {
    const now = Date.now();
    const elapsed = (now - bucket.lastRefill) / 1000; // Convert to seconds
    const refillAmount = elapsed * refillRate;
    
    bucket.tokens = Math.min(maxTokens, bucket.tokens + refillAmount);
    bucket.lastRefill = now;
  }

  return {
    tryConsume(key = DEFAULT_KEY): boolean {
      const bucket = getBucket(key);
      refillBucket(bucket);
      
      if (bucket.tokens >= 1) {
        bucket.tokens -= 1;
        return true;
      }
      
      return false;
    },

    getRemaining(key = DEFAULT_KEY): number {
      const bucket = getBucket(key);
      refillBucket(bucket);
      return Math.floor(bucket.tokens);
    },

    reset(key = DEFAULT_KEY): void {
      buckets.delete(key);
    },

    resetAll(): void {
      buckets.clear();
    },
  };
}

// ============= Cart-Specific Rate Limiter =============

// Singleton for cart operations: 10 operations burst, refill 2/sec
let cartRateLimiter: RateLimiter | null = null;

/**
 * Get the cart rate limiter singleton
 */
export function getCartRateLimiter(): RateLimiter {
  if (!cartRateLimiter) {
    cartRateLimiter = createRateLimiter({
      maxTokens: 10,
      refillRate: 2,
    });
  }
  return cartRateLimiter;
}

/**
 * Reset cart rate limiter (for testing)
 */
export function resetCartRateLimiter(): void {
  cartRateLimiter = null;
}
