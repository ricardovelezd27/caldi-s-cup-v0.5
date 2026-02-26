import { useQuery } from "@tanstack/react-query";
import { getAdminLessons } from "../services/adminLearningService";

export function useAdminLessons(unitId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "lessons", unitId],
    queryFn: () => getAdminLessons(unitId!),
    enabled: !!unitId,
  });
}
