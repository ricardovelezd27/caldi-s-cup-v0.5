import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { STORAGE_KEYS } from "@/constants/storageKeys";

const STORAGE_KEY = STORAGE_KEYS.SCANNER_PROGRESS;
const MAX_ANONYMOUS_SCANS = 3;

interface AnonymousScanProgress {
  scansCompleted: number;
  hasSeenSignupPrompt: boolean;
}

const DEFAULT_PROGRESS: AnonymousScanProgress = {
  scansCompleted: 0,
  hasSeenSignupPrompt: false,
};

function loadProgress(): AnonymousScanProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_PROGRESS, ...JSON.parse(raw) } : DEFAULT_PROGRESS;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveProgress(progress: AnonymousScanProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useAnonymousScanProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<AnonymousScanProgress>(loadProgress);

  // Clear localStorage when user logs in (no DB migration needed for scan count)
  useEffect(() => {
    if (!user) return;
    localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const recordScan = useCallback(() => {
    setProgress((prev) => {
      const updated: AnonymousScanProgress = {
        ...prev,
        scansCompleted: prev.scansCompleted + 1,
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const dismissSignupPrompt = useCallback(() => {
    setProgress((prev) => {
      const updated = { ...prev, hasSeenSignupPrompt: true };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const shouldForceSignup = progress.scansCompleted >= MAX_ANONYMOUS_SCANS;
  const shouldShowSignupBanner =
    !progress.hasSeenSignupPrompt && progress.scansCompleted > 0 && !shouldForceSignup;

  return {
    progress,
    recordScan,
    dismissSignupPrompt,
    shouldForceSignup,
    shouldShowSignupBanner,
  };
}
