import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/auth";

const STORAGE_KEY = "caldi_learning_progress";
const MAX_ANONYMOUS_LESSONS = 3;

interface AnonymousProgress {
  lessonsCompleted: string[];
  currentStreak: number;
  totalXP: number;
  lastActivityDate: string;
  hasSeenSignupPrompt: boolean;
}

const DEFAULT_PROGRESS: AnonymousProgress = {
  lessonsCompleted: [],
  currentStreak: 0,
  totalXP: 0,
  lastActivityDate: "",
  hasSeenSignupPrompt: false,
};

function loadProgress(): AnonymousProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_PROGRESS, ...JSON.parse(raw) } : DEFAULT_PROGRESS;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveProgress(progress: AnonymousProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useAnonymousProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<AnonymousProgress>(loadProgress);

  // Clear localStorage when user logs in
  useEffect(() => {
    if (user) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const completeLesson = useCallback(
    (lessonId: string, xpEarned: number) => {
      setProgress((prev) => {
        const updated: AnonymousProgress = {
          ...prev,
          lessonsCompleted: prev.lessonsCompleted.includes(lessonId)
            ? prev.lessonsCompleted
            : [...prev.lessonsCompleted, lessonId],
          totalXP: prev.totalXP + xpEarned,
          lastActivityDate: new Date().toISOString().split("T")[0],
        };
        saveProgress(updated);
        return updated;
      });
    },
    [],
  );

  const dismissSignupPrompt = useCallback(() => {
    setProgress((prev) => {
      const updated = { ...prev, hasSeenSignupPrompt: true };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const shouldForceSignup = progress.lessonsCompleted.length >= MAX_ANONYMOUS_LESSONS;
  const shouldShowSignupPrompt =
    !progress.hasSeenSignupPrompt && progress.lessonsCompleted.length > 0;

  return {
    progress,
    completeLesson,
    dismissSignupPrompt,
    shouldForceSignup,
    shouldShowSignupPrompt,
  };
}
