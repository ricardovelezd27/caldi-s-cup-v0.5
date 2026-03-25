import { useState, useCallback } from "react";
import { STORAGE_KEYS } from "@/constants/storageKeys";

interface OnboardingState {
  step: "interest" | "goal" | "done";
  selectedTrackId: string | null;
  selectedGoalXp: number | null;
  hasCompleted: boolean;
}

const DEFAULT_STATE: OnboardingState = {
  step: "interest",
  selectedTrackId: null,
  selectedGoalXp: null,
  hasCompleted: false,
};

function load(): OnboardingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

function persist(state: OnboardingState) {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(state));
}

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(load);

  const update = useCallback((patch: Partial<OnboardingState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      persist(next);
      return next;
    });
  }, []);

  const setTrack = useCallback((trackId: string) => {
    update({ selectedTrackId: trackId, step: "goal" });
  }, [update]);

  const setGoal = useCallback((goalXp: number) => {
    update({ selectedGoalXp: goalXp, step: "done" });
  }, [update]);

  const markCompleted = useCallback(() => {
    update({ hasCompleted: true });
  }, [update]);

  const reset = useCallback(() => {
    const fresh = { ...DEFAULT_STATE };
    persist(fresh);
    setState(fresh);
  }, []);

  return { ...state, setTrack, setGoal, markCompleted, reset };
}
