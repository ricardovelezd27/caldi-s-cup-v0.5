# Error Handling Architecture

This document describes the error handling architecture implemented in Caldi's Cup for production resilience.

---

## Overview

The error handling system provides multiple layers of protection:

1. **Error Boundaries** - Catch React rendering errors
2. **Error Logging** - Centralized logging service
3. **Network Resilience** - Retry logic and offline detection
4. **Storage Fallbacks** - Graceful degradation for storage
5. **Rate Limiting** - Prevent operation spam

---

## Error Boundary Hierarchy

```
┌─────────────────────────────────────────┐
│           Global ErrorBoundary          │
│     (Catches all unhandled errors)      │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │   Feature   │  │     Feature     │   │
│  │  Boundary   │  │    Boundary     │   │
│  │   (Cart)    │  │  (Marketplace)  │   │
│  └─────────────┘  └─────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Components

| Component | File | Purpose |
|-----------|------|---------|
| `ErrorBoundary` | `src/components/error/ErrorBoundary.tsx` | Global crash catcher |
| `ErrorFallback` | `src/components/error/ErrorFallback.tsx` | User-friendly error UI |
| `OfflineIndicator` | `src/components/error/OfflineIndicator.tsx` | Network status banner |

### Usage

```tsx
import { ErrorBoundary } from '@/components/error';

// Wrap your app or feature
<ErrorBoundary name="MyFeature">
  <MyFeature />
</ErrorBoundary>
```

---

## Error Logging Service

**File**: `src/services/errorLogging.ts`

### Features

- Structured log entries with timestamps
- Log levels: `debug`, `info`, `warn`, `error`, `fatal`
- In-memory buffer (last 50 entries) for debugging
- User context for error correlation
- Ready for external service integration (Sentry, LogRocket)

### API

```typescript
import { errorLogger } from '@/services/errorLogging';

// Capture an error
errorLogger.captureError(error, { component: 'Cart', action: 'addItem' });

// Capture fatal (app crash)
errorLogger.captureFatal(error, context, componentStack);

// Log messages
errorLogger.debug('Debug message');
errorLogger.info('Info message');
errorLogger.warn('Warning message');

// User context
errorLogger.setUserContext('user-123');
errorLogger.clearUserContext();

// Get recent logs (for debugging)
const logs = errorLogger.getRecentLogs();
```

---

## Network Resilience

### Retry with Backoff

**File**: `src/utils/network/retryWithBackoff.ts`

Automatically retry failed operations with exponential backoff.

```typescript
import { retryWithBackoff } from '@/utils/network/retryWithBackoff';

const result = await retryWithBackoff(
  () => fetch('/api/data'),
  {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
    jitter: true,
    onRetry: (attempt, error, delay) => {
      console.log(`Retry ${attempt} in ${delay}ms`);
    },
  }
);
```

### Network Status Hook

**File**: `src/utils/network/networkStatus.ts`

Monitor network connectivity.

```typescript
import { useNetworkStatus } from '@/utils/network/networkStatus';

function MyComponent() {
  const { isOnline, isSlowConnection, connectionType } = useNetworkStatus();
  
  if (!isOnline) {
    return <OfflineMessage />;
  }
}
```

---

## Storage Fallbacks

**File**: `src/utils/storage/storageFactory.ts`

Automatic fallback chain for storage:

1. **localStorage** (preferred)
2. **sessionStorage** (if localStorage unavailable)
3. **In-memory** (last resort, e.g., private browsing)

### Usage

```typescript
import { getStorage, safeJsonParse, safeJsonStringify } from '@/utils/storage/storageFactory';

const storage = getStorage();
console.log(`Using ${storage.type} storage`);

// Safe operations
storage.setItem('key', safeJsonStringify(data));
const data = safeJsonParse(storage.getItem('key'), defaultValue);
```

### User Notification

When storage is degraded, users see a toast notification explaining the limitation.

---

## Rate Limiting

**File**: `src/utils/rateLimit.ts`

Token bucket algorithm to prevent operation spam.

### Configuration

- **maxTokens**: 10 (burst capacity)
- **refillRate**: 2 tokens/second
- Per-item rate limiting for cart operations

### Usage

```typescript
import { getCartRateLimiter } from '@/utils/rateLimit';

const rateLimiter = getCartRateLimiter();

if (rateLimiter.tryConsume(itemKey)) {
  // Operation allowed
  performOperation();
} else {
  // Rate limited
  toast.warning('Too many updates. Please wait a moment.');
}
```

### Integration

Rate limiting is integrated into `useOptimisticCart` hook automatically.

---

## Component Integration

### App.tsx Setup

```tsx
import { ErrorBoundary, OfflineIndicator } from '@/components/error';

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <OfflineIndicator />
        {/* ... rest of app */}
      </CartProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);
```

### Cart Context

Storage fallbacks are automatically integrated into `CartContext`:

```tsx
// CartContext.tsx
import { getStorage } from '@/utils/storage/storageFactory';

// Automatically uses best available storage
// Shows toast if storage is degraded
```

---

## Future Enhancements

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| External logging | Integrate Sentry/LogRocket | Medium |
| Feature boundaries | Per-feature error isolation | Low |
| Error analytics | Track error patterns | Low |
| Offline queue | Queue operations while offline | Medium |

---

## Testing

### Manual Testing

1. **Error Boundary**: Throw an error in a component to verify fallback UI
2. **Offline**: Disable network in DevTools to see offline indicator
3. **Rate Limit**: Rapidly click cart buttons to trigger warning
4. **Storage**: Test in private browsing to verify fallback

### Unit Tests (Future)

```typescript
// Example test structure
describe('ErrorBoundary', () => {
  it('catches errors and shows fallback', () => { /* ... */ });
  it('logs errors to errorLogger', () => { /* ... */ });
  it('allows reset via Try Again', () => { /* ... */ });
});
```

---

*Last Updated: 2025-12-16*
