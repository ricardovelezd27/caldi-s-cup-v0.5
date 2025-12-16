/**
 * Storage Factory with Fallbacks
 * 
 * Provides storage abstraction with automatic fallbacks:
 * 1. localStorage (preferred)
 * 2. sessionStorage (if localStorage unavailable)
 * 3. In-memory (last resort - for private browsing)
 */

export type StorageType = 'localStorage' | 'sessionStorage' | 'memory';

export interface StorageAdapter {
  type: StorageType;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

// In-memory fallback storage
const memoryStorage: Map<string, string> = new Map();

const memoryAdapter: StorageAdapter = {
  type: 'memory',
  getItem: (key) => memoryStorage.get(key) ?? null,
  setItem: (key, value) => memoryStorage.set(key, value),
  removeItem: (key) => memoryStorage.delete(key),
  clear: () => memoryStorage.clear(),
};

/**
 * Test if a storage type is available and working
 */
function isStorageAvailable(storage: Storage): boolean {
  const testKey = '__storage_test__';
  try {
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create adapter for browser storage
 */
function createBrowserStorageAdapter(
  storage: Storage,
  type: 'localStorage' | 'sessionStorage'
): StorageAdapter {
  return {
    type,
    getItem: (key) => storage.getItem(key),
    setItem: (key, value) => {
      try {
        storage.setItem(key, value);
      } catch (e) {
        // Handle quota exceeded
        console.warn(`[StorageFactory] ${type} quota exceeded:`, e);
        throw e;
      }
    },
    removeItem: (key) => storage.removeItem(key),
    clear: () => storage.clear(),
  };
}

/**
 * Get the best available storage adapter
 */
export function getAvailableStorage(): StorageAdapter {
  // Try localStorage first
  if (typeof window !== 'undefined' && isStorageAvailable(window.localStorage)) {
    return createBrowserStorageAdapter(window.localStorage, 'localStorage');
  }

  // Fall back to sessionStorage
  if (typeof window !== 'undefined' && isStorageAvailable(window.sessionStorage)) {
    console.warn('[StorageFactory] localStorage unavailable, using sessionStorage');
    return createBrowserStorageAdapter(window.sessionStorage, 'sessionStorage');
  }

  // Last resort: in-memory storage
  console.warn('[StorageFactory] Browser storage unavailable, using memory storage');
  return memoryAdapter;
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/**
 * Safe JSON stringify
 */
export function safeJsonStringify(value: unknown): string | null {
  try {
    return JSON.stringify(value);
  } catch {
    console.error('[StorageFactory] Failed to stringify value');
    return null;
  }
}

// Singleton instance
let storageInstance: StorageAdapter | null = null;

/**
 * Get storage singleton (lazy initialization)
 */
export function getStorage(): StorageAdapter {
  if (!storageInstance) {
    storageInstance = getAvailableStorage();
  }
  return storageInstance;
}

/**
 * Reset storage singleton (for testing)
 */
export function resetStorage(): void {
  storageInstance = null;
}
