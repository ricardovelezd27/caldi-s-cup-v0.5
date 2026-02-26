import { useQuery } from "@tanstack/react-query";
import { getAdminSections, getAdminUnitsBySectionIds } from "../services/adminLearningService";

export function useAdminSections(trackId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "sections", trackId],
    queryFn: () => getAdminSections(trackId!),
    enabled: !!trackId,
  });
}

export function useAdminUnitsForSections(sectionIds: string[]) {
  return useQuery({
    queryKey: ["admin", "units-by-sections", sectionIds],
    queryFn: () => getAdminUnitsBySectionIds(sectionIds),
    enabled: sectionIds.length > 0,
  });
}
