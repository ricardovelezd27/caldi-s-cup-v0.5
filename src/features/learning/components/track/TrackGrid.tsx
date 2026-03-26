import { TrackCard } from "./TrackCard";
import type { LearningTrack, LearningTrackId } from "../../types";
import { Skeleton } from "@/components/ui/skeleton";

interface TrackGridProps {
  tracks: LearningTrack[];
  progressMap: Record<string, number>;
  recommendedTrackId?: LearningTrackId;
  isLoading?: boolean;
  singleColumn?: boolean;
}

export function TrackGrid({ tracks, progressMap, recommendedTrackId, isLoading, singleColumn }: TrackGridProps) {
  const gridClass = singleColumn
    ? "grid grid-cols-1 gap-4"
    : "grid grid-cols-1 md:grid-cols-2 gap-4";

  if (isLoading) {
    return (
      <div className={gridClass}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className={gridClass}>
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
