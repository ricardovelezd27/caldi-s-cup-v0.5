import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { PageLayout } from "@/components/layout";
import { ROUTES } from "@/constants/app";
import { TrackPathView } from "../components/track/TrackPathView";
import { MascotReaction } from "../components/mascot/MascotReaction";
import { useTrackPath } from "../hooks/useTrackPath";
import { Progress } from "@/components/ui/progress";

export default function TrackPage() {
  const { trackId } = useParams<{ trackId: string }>();
  const { t, language } = useLanguage();
  const { track, sections, progressMap, overallPercent, isLoading } = useTrackPath(trackId ?? "");

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          {t("common.loading")}
        </div>
      </PageLayout>
    );
  }

  const trackName = track ? (language === "es" ? track.nameEs : track.name) : "";
  const hasContent = sections.length > 0;

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back */}
        <Link
          to={ROUTES.learn}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-6 font-inter text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("learn.backToTrack")}
        </Link>

        {/* Track header */}
        {track && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{track.icon}</span>
              <h1 className="font-bangers text-3xl md:text-4xl text-foreground tracking-wide">
                {trackName}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={overallPercent} className="h-3 flex-1" />
              <span className="text-sm font-inter text-muted-foreground font-medium">
                {overallPercent}%
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        {hasContent ? (
          <TrackPathView
            sections={sections}
            progressMap={progressMap}
            trackId={trackId ?? ""}
          />
        ) : (
          <div className="text-center py-12">
            <MascotReaction mascot="caldi" mood="curious" dialogue={t("learn.comingSoonDesc")} />
            <p className="mt-4 font-bangers text-2xl text-foreground">
              {t("learn.comingSoon")}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
