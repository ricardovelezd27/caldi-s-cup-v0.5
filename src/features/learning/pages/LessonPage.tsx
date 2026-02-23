import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/app";
import { LessonScreen } from "../components/lesson/LessonScreen";

export default function LessonPage() {
  const { trackId, lessonId } = useParams<{ trackId: string; lessonId: string }>();
  const navigate = useNavigate();

  const handleExit = () => {
    navigate(`${ROUTES.learn}/${trackId}`);
  };

  const handleComplete = () => {
    navigate(`${ROUTES.learn}/${trackId}`);
  };

  if (!lessonId) return null;

  return (
    <div className="min-h-screen bg-background">
      <LessonScreen
        lessonId={lessonId}
        trackId={trackId ?? ""}
        onExit={handleExit}
        onComplete={handleComplete}
      />
    </div>
  );
}
