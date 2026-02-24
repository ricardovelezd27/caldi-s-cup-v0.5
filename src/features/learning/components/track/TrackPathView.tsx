import { useLanguage } from "@/contexts/language";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/app";
import { cn } from "@/lib/utils";
import type { TrackPathSection } from "../../hooks/useTrackPath";

interface TrackPathViewProps {
  sections: TrackPathSection[];
  progressMap: Set<string>;
  trackId: string;
}

export function TrackPathView({ sections, progressMap, trackId }: TrackPathViewProps) {
  const { language, t } = useLanguage();

  if (sections.length === 0) {
    return (
      <p className="text-center text-muted-foreground font-inter py-8">
        {t("learn.comingSoonDesc")}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {sections.map((section, sIdx) => {
        const sectionName = language === "es" ? section.nameEs : section.name;
        const goal = language === "es" ? section.learningGoalEs : section.learningGoal;
        const isLocked = section.requiresSectionId != null; // Simplified lock logic

        return (
          <div key={section.id} className={cn(isLocked && "opacity-50")}>
            {/* Section header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full border-2 border-border bg-card text-xs font-inter font-bold uppercase tracking-wider text-foreground shadow-[2px_2px_0px_0px_hsl(var(--border))]">
                {section.level}
              </span>
              <h3 className="font-bangers text-xl text-foreground tracking-wide">
                {sectionName}
              </h3>
              {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
            </div>

            {goal && (
              <p className="text-sm text-muted-foreground font-inter mb-4 ml-1">
                🎯 {goal}
              </p>
            )}

            {/* Units placeholder - will show when content is seeded */}
            {section.units.length === 0 && (
              <div className="ml-6 border-l-4 border-dashed border-border pl-6 py-4">
                <p className="text-sm text-muted-foreground font-inter italic">
                  {t("learn.comingSoon")}
                </p>
              </div>
            )}

            {/* Connecting line between sections */}
            {sIdx < sections.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="w-0.5 h-8 bg-border" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
