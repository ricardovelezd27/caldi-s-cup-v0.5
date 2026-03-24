import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ROUTES } from "@/constants/app";
import { useLanguage } from "@/contexts/language";
import { useAuth } from "@/contexts/auth";
import { isLessonUnlocked } from "../services/progressService";
import { LessonScreen } from "../components/lesson/LessonScreen";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function LessonPage() {
  const { trackId, lessonId } = useParams<{ trackId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  const trackRoute = `${ROUTES.learn}/${trackId}`;
  const handleExit = () => navigate(trackRoute);
  const handleComplete = () => navigate(trackRoute);

  const { data: unlockStatus, isLoading } = useQuery({
    queryKey: ["lesson-unlock", lessonId, user?.id],
    queryFn: () => isLessonUnlocked(user?.id, lessonId!),
    enabled: !!lessonId,
  });

  if (!lessonId) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-24 w-64 rounded-lg" />
      </div>
    );
  }

  if (unlockStatus && !unlockStatus.unlocked) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="caldi-card p-8 max-w-sm w-full text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-xl text-foreground">
            {t("learn.lessonLocked")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("learn.completePrevious")}
          </p>
          <Button
            onClick={() => navigate(trackRoute)}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("learn.backToTrack")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <LessonScreen
      lessonId={lessonId}
      trackId={trackId ?? ""}
      trackRoute={trackRoute}
      onExit={handleExit}
      onComplete={handleComplete}
    />
  );
}
