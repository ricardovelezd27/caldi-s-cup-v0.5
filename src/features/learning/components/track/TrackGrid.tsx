import { TrackCard } from "./TrackCard";
import type { LearningTrack, LearningTrackId } from "../../types";
import { Skeleton } from "@/components/ui/skeleton";

interface TrackGridProps {
  tracks: LearningTrack[];
  progressMap: Record<string, number>;
  recommendedTrackId?: LearningTrackId;
  isLoading?: boolean;
}

export function TrackGrid({ tracks, progressMap, recommendedTrackId, isLoading }: TrackGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tracks.map((track) => (
        <TrackCard
          key={track.id}
          track={track}
          progressPercent={progressMap[track.trackId] ?? 0}
          isRecommended={track.trackId === recommendedTrackId}
        />
      ))}
    </div>
  );
}
