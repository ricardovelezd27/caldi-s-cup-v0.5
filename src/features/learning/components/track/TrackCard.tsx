import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/language";
import { ROUTES } from "@/constants/app";
import { TrackProgress } from "./TrackProgress";
import { cn } from "@/lib/utils";
import type { LearningTrack } from "../../types";

interface TrackCardProps {
  track: LearningTrack;
  progressPercent: number;
  isRecommended?: boolean;
}

export function TrackCard({ track, progressPercent, isRecommended }: TrackCardProps) {
  const { language, t } = useLanguage();
  const name = language === "es" ? track.nameEs : track.name;
  const description = language === "es" ? track.descriptionEs : track.description;

  return (
    <Link
      to={`${ROUTES.learn}/${track.trackId}`}
      className={cn(
        "block relative rounded-lg border-4 border-border bg-card p-5 shadow-[4px_4px_0px_0px_hsl(var(--border))] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_hsl(var(--border))]",
        isRecommended && "ring-2 ring-secondary",
      )}
      style={{ borderLeftColor: track.colorHex, borderLeftWidth: 6 }}
    >
      {/* Bonus badge */}
      {track.isBonus && (
        <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-inter font-bold uppercase bg-accent text-accent-foreground rounded-full">
          {t("learn.bonusBadge")}
        </span>
      )}

      <div className="flex items-center gap-4">
        {/* Icon */}
        <span className="text-4xl">{track.icon}</span>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bangers text-xl text-foreground tracking-wide mb-1">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground font-inter line-clamp-2">
            {description}
          </p>
        </div>

        {/* Progress */}
        <TrackProgress percent={progressPercent} colorHex={track.colorHex} size={56} />
      </div>
    </Link>
  );
}
