import { useQuery } from "@tanstack/react-query";
import { differenceInDays } from "date-fns";
import { getTracks, getSections, getUnitsBySectionIds, getLessonsByUnitIds } from "../services/learningService";
import { getUserProgress } from "../services/progressService";
import { useAuth } from "@/contexts/auth";
import type { LearningSection, LearningUnit, LearningLesson, LearningUserProgress } from "../types";

const DECAY_THRESHOLD_DAYS = 14;

export interface TrackPathSection extends LearningSection {
  units: TrackPathUnit[];
}

export interface TrackPathUnit extends LearningUnit {
  lessons: TrackPathLesson[];
}

export interface TrackPathLesson extends LearningLesson {
  status: "completed" | "available" | "locked" | "decayed";
}

export function useTrackPath(trackIdParam: string) {
  const { user } = useAuth();

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

  const sectionIds = (sectionsQuery.data ?? []).map((s) => s.id);

  const unitsQuery = useQuery({
    queryKey: ["learning-units-batch", sectionIds.join(",")],
    queryFn: () => getUnitsBySectionIds(sectionIds),
    enabled: sectionIds.length > 0,
  });

  const unitIds = (unitsQuery.data ?? []).map((u) => u.id);

  const lessonsQuery = useQuery({
    queryKey: ["learning-lessons-batch", unitIds.join(",")],
    queryFn: () => getLessonsByUnitIds(unitIds),
    enabled: unitIds.length > 0,
  });

  const progressQuery = useQuery({
    queryKey: ["learning-user-progress", user?.id],
    queryFn: () => getUserProgress(user!.id),
    enabled: !!user,
  });

  // Build progress map: lessonId -> progress record (for timestamp access)
  const progressByLessonId = new Map<string, LearningUserProgress>(
    (progressQuery.data ?? [])
      .filter((p) => p.isCompleted)
      .map((p) => [p.lessonId, p]),
  );

  // Build nested structure with status
  const allUnits = unitsQuery.data ?? [];
  const allLessons = lessonsQuery.data ?? [];

  let totalLessons = 0;
  let completedCount = 0;
  let foundFirstAvailable = false;

  // Build a set of all lesson IDs per section for prerequisite checking
  const lessonIdsBySection = new Map<string, string[]>();
  for (const section of sectionsQuery.data ?? []) {
    const sectionLessonIds = allLessons
      .filter((l) => allUnits.some((u) => u.sectionId === section.id && u.id === l.unitId))
      .map((l) => l.id);
    lessonIdsBySection.set(section.id, sectionLessonIds);
  }

  const sections: TrackPathSection[] = (sectionsQuery.data ?? []).map((section) => {
    // Section prerequisite gating: if requiresSectionId is set,
    // ALL lessons in the required section must be completed
    let sectionLocked = false;
    if (section.requiresSectionId) {
      const requiredLessonIds = lessonIdsBySection.get(section.requiresSectionId) ?? [];
      sectionLocked = requiredLessonIds.length === 0
        ? false
        : requiredLessonIds.some((id) => !progressByLessonId.has(id));
    }

    const sectionUnits = allUnits
      .filter((u) => u.sectionId === section.id)
      .map((unit) => {
        const unitLessons = allLessons
          .filter((l) => l.unitId === unit.id)
          .map((lesson): TrackPathLesson => {
            totalLessons++;

            if (sectionLocked) {
              return { ...lesson, status: "locked" };
            }

            const progress = progressByLessonId.get(lesson.id);
            
            if (progress) {
              completedCount++;
              const lastActivityDate = progress.updatedAt || progress.completedAt;
              if (lastActivityDate) {
                const daysSinceUpdate = differenceInDays(new Date(), new Date(lastActivityDate));
                if (daysSinceUpdate >= DECAY_THRESHOLD_DAYS) {
                  return { ...lesson, status: "decayed" };
                }
              }
              return { ...lesson, status: "completed" };
            }
            
            if (!foundFirstAvailable) {
              foundFirstAvailable = true;
              return { ...lesson, status: "available" };
            }
            return { ...lesson, status: "locked" };
          });
        return { ...unit, lessons: unitLessons };
      });
    return { ...section, units: sectionUnits };
  });

  const overallPercent = totalLessons > 0
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;

  return {
    track: track ?? null,
    sections,
    progressMap: progressByLessonId,
    overallPercent,
    isLoading: tracksQuery.isLoading || sectionsQuery.isLoading || unitsQuery.isLoading || lessonsQuery.isLoading,
  };
}
