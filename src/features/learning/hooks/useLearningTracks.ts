import { useQuery } from "@tanstack/react-query";
import { getTracks } from "../services/learningService";
import { getUserProgress } from "../services/progressService";
import { useAuth } from "@/contexts/auth";
import type { LearningTrack } from "../types";

export function useLearningTracks() {
  const { user } = useAuth();

  const tracksQuery = useQuery({
    queryKey: ["learning-tracks"],
    queryFn: getTracks,
  });

  const progressQuery = useQuery({
    queryKey: ["learning-user-progress", user?.id],
    queryFn: () => getUserProgress(user!.id),
    enabled: !!user,
  });

  // Build progress map: trackId -> percent (simplified: 0% for now since no lessons yet)
  const progressMap: Record<string, number> = {};
  // In future, this would calculate based on completed lessons per track

  return {
    tracks: tracksQuery.data ?? [],
    progressMap,
    isLoading: tracksQuery.isLoading,
    error: tracksQuery.error,
  };
}
