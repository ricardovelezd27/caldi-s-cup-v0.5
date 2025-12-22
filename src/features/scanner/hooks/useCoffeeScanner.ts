import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import type { ScannedCoffee, ScanProgress, ScanResponse } from "../types/scanner";
import { SCAN_PROGRESS_STATES } from "../types/scanner";

const SCAN_TIMEOUT = 60000; // 60 seconds timeout for mobile

// Fetch with timeout for mobile reliability
const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

export function useCoffeeScanner() {
  const { user, profile } = useAuth();
  const [scanResult, setScanResult] = useState<ScannedCoffee | null>(null);
  const [progress, setProgress] = useState<ScanProgress>(SCAN_PROGRESS_STATES.idle);
  const [error, setError] = useState<string | null>(null);

  const resetScan = useCallback(() => {
    setScanResult(null);
    setProgress(SCAN_PROGRESS_STATES.idle);
    setError(null);
  }, []);

  const scanCoffee = useCallback(async (imageBase64: string) => {
    if (!user) {
      setError("You must be logged in to scan coffee");
      return;
    }

    try {
      setError(null);
      setScanResult(null);
      
      // Step 1: Uploading
      setProgress(SCAN_PROGRESS_STATES.uploading);
      
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Analyzing
      setProgress(SCAN_PROGRESS_STATES.analyzing);

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      if (!accessToken) {
        throw new Error("No active session. Please sign in again.");
      }

      // Call the edge function with timeout
      let response: Response;
      try {
        response = await fetchWithTimeout(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scan-coffee`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              imageBase64,
              userTribe: profile?.coffee_tribe || null,
            }),
          },
          SCAN_TIMEOUT
        );
      } catch (fetchError) {
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error("Scan timed out. Please try with a smaller image or check your connection.");
        }
        // Network error
        throw new Error("Network error. Please check your connection and try again.");
      }

      // Step 3: Enriching (while waiting for response)
      setProgress(SCAN_PROGRESS_STATES.enriching);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment and try again.");
        }
        if (response.status === 402) {
          throw new Error("AI credits depleted. Please add more credits to continue.");
        }
        if (response.status === 413) {
          throw new Error("Image too large. Please try a smaller image.");
        }
        throw new Error(errorData.error || `Scan failed with status ${response.status}`);
      }

      const result: ScanResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || "Scan failed");
      }

      // Step 4: Complete
      setProgress(SCAN_PROGRESS_STATES.complete);
      setScanResult(result.data);
      
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setProgress({
        ...SCAN_PROGRESS_STATES.error,
        message: errorMessage,
      });
      return null;
    }
  }, [user, profile?.coffee_tribe]);

  return {
    scanCoffee,
    scanResult,
    progress,
    error,
    resetScan,
    isScanning: progress.status !== "idle" && progress.status !== "complete" && progress.status !== "error",
    isComplete: progress.status === "complete",
    isError: progress.status === "error",
  };
}
