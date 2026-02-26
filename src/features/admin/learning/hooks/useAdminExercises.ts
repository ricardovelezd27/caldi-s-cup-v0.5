import { useQuery } from "@tanstack/react-query";
import { getAdminExercises } from "../services/adminLearningService";

export function useAdminExercises(lessonId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "exercises", lessonId],
    queryFn: () => getAdminExercises(lessonId!),
    enabled: !!lessonId,
  });
}
