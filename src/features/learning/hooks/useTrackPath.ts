import { useQuery } from "@tanstack/react-query";
import { getTracks, getSections, getUnits, getLessons } from "../services/learningService";
import { getUserProgress } from "../services/progressService";
import { useAuth } from "@/contexts/auth";
import type { LearningSection, LearningUnit, LearningLesson } from "../types";

export interface TrackPathSection extends LearningSection {
  units: TrackPathUnit[];
}

export interface TrackPathUnit extends LearningUnit {
  lessons: TrackPathLesson[];
}

export interface TrackPathLesson extends LearningLesson {
  status: "completed" | "available" | "locked";
}

export function useTrackPath(trackIdParam: string) {
  const { user } = useAuth();

  // Get tracks to resolve trackId enum -> UUID
  const tracksQuery = useQuery({
    queryKey: ["learning-tracks"],
    queryFn: getTracks,
  });

  const track = tracksQuery.data?.find(
    (t) => t.trackId === trackIdParam || t.id === trackIdParam,
  );

  const sectionsQuery = useQuery({
    queryKey: ["learning-sections", track?.id],
    queryFn: () => getSections(track!.id),
    enabled: !!track,
  });

  const progressQuery = useQuery({
    queryKey: ["learning-user-progress", user?.id],
    queryFn: () => getUserProgress(user!.id),
    enabled: !!user,
  });

  const completedLessonIds = new Set(
    (progressQuery.data ?? []).filter((p) => p.isCompleted).map((p) => p.lessonId),
  );

  // Build nested structure (sections with units fetched inline isn't ideal but works for MVP)
  const sections: TrackPathSection[] = (sectionsQuery.data ?? []).map((section) => ({
    ...section,
    units: [], // Will be populated by TrackPathView via lazy loading
  }));

  const progressMap = completedLessonIds;

  // Calculate overall percent (simplified)
  const overallPercent = 0; // Will be real when lessons exist

  return {
    track: track ?? null,
    sections,
    progressMap,
    overallPercent,
    isLoading: tracksQuery.isLoading || sectionsQuery.isLoading,
  };
}
