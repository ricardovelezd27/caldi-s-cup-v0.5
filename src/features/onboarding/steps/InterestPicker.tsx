import { useQuery } from "@tanstack/react-query";
import { getTracks } from "@/features/learning/services/learningService";
import { useLanguage } from "@/contexts/language";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface InterestPickerProps {
  onSelect: (trackId: string) => void;
}

export function InterestPicker({ onSelect }: InterestPickerProps) {
  const { t, language } = useLanguage();
  const { data: tracks, isLoading } = useQuery({
    queryKey: ["learning-tracks"],
    queryFn: getTracks,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      <h2 className="font-bangers text-3xl text-foreground tracking-wide text-center">
        {t("onboarding.pickInterest")}
      </h2>

      <div className="grid grid-cols-2 gap-4 w-full">
        {(tracks ?? []).map((track) => (
          <button
            key={track.id}
            onClick={() => onSelect(track.trackId)}
            className={cn(
              "flex flex-col items-center gap-2 p-5 rounded-lg border-4 border-border",
              "bg-card hover:border-primary transition-all",
              "shadow-[4px_4px_0px_0px_hsl(var(--border))]",
              "hover:shadow-[2px_2px_0px_0px_hsl(var(--primary))]",
              "active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            )}
          >
            <span className="text-4xl">{track.icon}</span>
            <span className="font-bangers text-lg text-foreground tracking-wide">
              {language === "es" ? track.nameEs : track.name}
            </span>
            <span className="text-xs text-muted-foreground font-inter text-center line-clamp-2">
              {language === "es" ? track.descriptionEs : track.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
