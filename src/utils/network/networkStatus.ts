import { useState, useEffect, useCallback } from 'react';

export interface NetworkStatus {
  /** Whether the browser reports being online */
  isOnline: boolean;
  /** Whether the connection appears slow */
  isSlowConnection: boolean;
  /** Connection type if available (4g, 3g, wifi, etc.) */
  connectionType: string | null;
  /** Effective connection type */
  effectiveType: string | null;
  /** Downlink speed in Mbps */
  downlink: number | null;
  /** Round-trip time in ms */
  rtt: number | null;
}

// Extend Navigator type for Network Information API
interface NetworkInformation {
  type?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener(type: string, listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  }
}

/**
 * Get network connection API (with browser prefix fallbacks)
 */
function getConnection(): NetworkInformation | null {
  return navigator.connection || 
         navigator.mozConnection || 
         navigator.webkitConnection || 
         null;
}

/**
 * Determine if connection is slow based on effective type
 */
function isConnectionSlow(connection: NetworkInformation | null): boolean {
  if (!connection?.effectiveType) return false;
  return ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
}

/**
 * Hook to monitor network connectivity status
 */
export function useNetworkStatus(): NetworkStatus {
  const getNetworkStatus = useCallback((): NetworkStatus => {
    const connection = getConnection();
    
    return {
      isOnline: navigator.onLine,
      isSlowConnection: isConnectionSlow(connection),
      connectionType: connection?.type || null,
      effectiveType: connection?.effectiveType || null,
      downlink: connection?.downlink || null,
      rtt: connection?.rtt || null,
    };
  }, []);

  const [status, setStatus] = useState<NetworkStatus>(getNetworkStatus);

  useEffect(() => {
    const updateStatus = () => {
      setStatus(getNetworkStatus());
    };

    // Listen for online/offline events
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    // Listen for connection changes if available
    const connection = getConnection();
    connection?.addEventListener('change', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      connection?.removeEventListener('change', updateStatus);
    };
  }, [getNetworkStatus]);

  return status;
}

/**
 * Simple check if currently online (non-hook version)
 */
export function isOnline(): boolean {
  return navigator.onLine;
}
