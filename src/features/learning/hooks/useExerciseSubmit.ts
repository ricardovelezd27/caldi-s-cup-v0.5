import { useCallback } from "react";
import { useAuth } from "@/contexts/auth";
import { recordExerciseHistory } from "../services/progressService";

export function useExerciseSubmit() {
  const { user } = useAuth();

  const submit = useCallback(
    async (exerciseId: string, isCorrect: boolean, userAnswer: any, timeSpentSeconds: number) => {
      if (!user) return; // Anonymous users don't persist exercise history

      await recordExerciseHistory({
        userId: user.id,
        exerciseId,
        isCorrect,
        timeSpentSeconds,
        userAnswer,
      });
    },
    [user],
  );

  return { submit };
}
