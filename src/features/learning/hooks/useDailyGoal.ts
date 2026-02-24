import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { getDailyGoal, addXPToDaily } from "../services/streakService";
import { supabase } from "@/integrations/supabase/client";

export function useDailyGoal() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const goalQuery = useQuery({
    queryKey: ["learning-daily-goal", user?.id],
    queryFn: () => getDailyGoal(user!.id),
    enabled: !!user,
  });

  const setGoalMutation = useMutation({
    mutationFn: async (goalXp: number) => {
      if (!user) return;
      const today = new Date().toISOString().split("T")[0];
      // Upsert today's goal
      const { error } = await supabase
        .from("learning_user_daily_goals")
        .upsert(
          { user_id: user.id, date: today, goal_xp: goalXp },
          { onConflict: "user_id,date" },
        );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["learning-daily-goal"] }),
  });

  const addXPMutation = useMutation({
    mutationFn: async (xp: number) => {
      if (!user) return;
      await addXPToDaily(user.id, xp);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["learning-daily-goal"] }),
  });

  const goal = goalQuery.data ?? null;
  const progressPercent = goal ? Math.min(Math.round((goal.earnedXp / goal.goalXp) * 100), 100) : 0;

  return {
    goal,
    isLoading: goalQuery.isLoading,
    setGoal: setGoalMutation.mutateAsync,
    addXP: addXPMutation.mutateAsync,
    progressPercent,
    remainingXP: goal ? Math.max(0, goal.goalXp - goal.earnedXp) : 0,
    isGoalSet: !!goal,
  };
}
