/**
 * Retry with Exponential Backoff
 * 
 * Retries async operations with increasing delays to handle transient failures.
 */

export interface RetryOptions {
  /** Maximum retry attempts (default: 3) */
  maxRetries?: number;
  /** Initial delay in ms (default: 1000) */
  initialDelay?: number;
  /** Maximum delay in ms (default: 10000) */
  maxDelay?: number;
  /** Backoff multiplier (default: 2) */
  backoffFactor?: number;
  /** Add jitter to prevent thundering herd (default: true) */
  jitter?: boolean;
  /** Callback on each retry attempt */
  onRetry?: (attempt: number, error: Error, nextDelay: number) => void;
  /** Abort signal for cancellation */
  signal?: AbortSignal;
  /** Predicate to determine if error is retryable */
  isRetryable?: (error: Error) => boolean;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'onRetry' | 'signal' | 'isRetryable'>> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  jitter: true,
};

/**
 * Default retryable error check (network errors, 5xx responses)
 */
function defaultIsRetryable(error: Error): boolean {
  // Network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return true;
  }
  // Check for HTTP status in error
  const statusMatch = error.message.match(/(\d{3})/);
  if (statusMatch) {
    const status = parseInt(statusMatch[1], 10);
    // Retry on 5xx errors and 429 (rate limited)
    return status >= 500 || status === 429;
  }
  return true; // Default to retryable
}

/**
 * Calculate delay with optional jitter
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  backoffFactor: number,
  jitter: boolean
): number {
  const exponentialDelay = initialDelay * Math.pow(backoffFactor, attempt);
  const cappedDelay = Math.min(exponentialDelay, maxDelay);
  
  if (jitter) {
    // Add random jitter between 0-30% of delay
    const jitterAmount = cappedDelay * 0.3 * Math.random();
    return Math.floor(cappedDelay + jitterAmount);
  }
  
  return cappedDelay;
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }
  });
}

/**
 * Retry an async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries,
    initialDelay,
    maxDelay,
    backoffFactor,
    jitter,
  } = { ...DEFAULT_OPTIONS, ...options };
  
  const { onRetry, signal, isRetryable = defaultIsRetryable } = options;
  
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // Check for abort before attempt
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }
    
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry if it's the last attempt or error isn't retryable
      if (attempt === maxRetries || !isRetryable(lastError)) {
        throw lastError;
      }
      
      const delay = calculateDelay(attempt, initialDelay, maxDelay, backoffFactor, jitter);
      
      // Notify about retry
      onRetry?.(attempt + 1, lastError, delay);
      
      // Wait before retrying
      await sleep(delay, signal);
    }
  }
  
  throw lastError!;
}
