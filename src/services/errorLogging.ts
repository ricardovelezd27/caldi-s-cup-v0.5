/**
 * Centralized Error Logging Service
 * 
 * Provides structured error capture for development and production.
 * Ready for future external service integration (Sentry, LogRocket, etc.)
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: Error;
  context?: ErrorContext;
  stack?: string;
  componentStack?: string;
}

// In-memory log buffer for development (last 50 entries)
const LOG_BUFFER_SIZE = 50;
const logBuffer: LogEntry[] = [];

// User context (anonymized in production)
let userContext: { userId?: string } = {};

/**
 * Format error for logging
 */
function formatLogEntry(entry: LogEntry): string {
  const parts = [
    `[${entry.timestamp}]`,
    `[${entry.level.toUpperCase()}]`,
    entry.context?.component ? `[${entry.context.component}]` : '',
    entry.message,
  ].filter(Boolean);
  
  return parts.join(' ');
}

/**
 * Add entry to buffer (for debugging)
 */
function addToBuffer(entry: LogEntry): void {
  logBuffer.push(entry);
  if (logBuffer.length > LOG_BUFFER_SIZE) {
    logBuffer.shift();
  }
}

/**
 * Log to console with appropriate styling
 */
function logToConsole(entry: LogEntry): void {
  const formatted = formatLogEntry(entry);
  const isDev = import.meta.env.DEV;
  
  switch (entry.level) {
    case 'debug':
      if (isDev) console.debug(formatted, entry.context?.metadata || '');
      break;
    case 'info':
      console.info(formatted, entry.context?.metadata || '');
      break;
    case 'warn':
      console.warn(formatted, entry.context?.metadata || '');
      break;
    case 'error':
    case 'fatal':
      console.error(formatted);
      if (entry.error) console.error(entry.error);
      if (entry.componentStack && isDev) {
        console.error('Component Stack:', entry.componentStack);
      }
      break;
  }
}

/**
 * Send to external service (placeholder for future integration)
 */
function sendToExternalService(entry: LogEntry): void {
  // Future: Sentry, LogRocket, etc.
  // Example: Sentry.captureException(entry.error, { extra: entry.context });
  
  if (import.meta.env.DEV) {
    // In dev, just note that this would be sent
    console.debug('[ErrorLogger] Would send to external service:', entry.level);
  }
}

/**
 * Error Logging Service API
 */
export const errorLogger = {
  /**
   * Capture and log an error
   */
  captureError(
    error: Error,
    context?: ErrorContext,
    componentStack?: string
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message,
      error,
      context: { ...context, userId: userContext.userId },
      stack: error.stack,
      componentStack,
    };
    
    addToBuffer(entry);
    logToConsole(entry);
    
    // Only send to external in production
    if (!import.meta.env.DEV) {
      sendToExternalService(entry);
    }
  },

  /**
   * Capture a fatal error (app crash)
   */
  captureFatal(
    error: Error,
    context?: ErrorContext,
    componentStack?: string
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'fatal',
      message: `FATAL: ${error.message}`,
      error,
      context: { ...context, userId: userContext.userId },
      stack: error.stack,
      componentStack,
    };
    
    addToBuffer(entry);
    logToConsole(entry);
    sendToExternalService(entry);
  },

  /**
   * Log a message at specified level
   */
  log(level: LogLevel, message: string, context?: ErrorContext): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: { ...context, userId: userContext.userId },
    };
    
    addToBuffer(entry);
    logToConsole(entry);
  },

  /**
   * Convenience methods
   */
  debug: (message: string, context?: ErrorContext) => 
    errorLogger.log('debug', message, context),
  
  info: (message: string, context?: ErrorContext) => 
    errorLogger.log('info', message, context),
  
  warn: (message: string, context?: ErrorContext) => 
    errorLogger.log('warn', message, context),

  /**
   * Set user context for error correlation
   */
  setUserContext(userId?: string): void {
    userContext = { userId };
  },

  /**
   * Clear user context (on logout)
   */
  clearUserContext(): void {
    userContext = {};
  },

  /**
   * Get recent logs (for debugging)
   */
  getRecentLogs(): LogEntry[] {
    return [...logBuffer];
  },

  /**
   * Clear log buffer
   */
  clearLogs(): void {
    logBuffer.length = 0;
  },
};
