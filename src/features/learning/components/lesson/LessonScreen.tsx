import { useLesson } from "../../hooks/useLesson";
import { useAuth } from "@/contexts/auth";
import { useAnonymousProgress } from "../../hooks/useAnonymousProgress";
import { LessonIntro } from "./LessonIntro";
import { LessonProgress } from "./LessonProgress";
import { LessonComplete } from "./LessonComplete";
import { ExerciseRenderer } from "./ExerciseRenderer";
import { ExerciseFeedback } from "../exercises/base/ExerciseFeedback";
import { SignupPrompt } from "../gamification/SignupPrompt";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface LessonScreenProps {
  lessonId: string;
  trackId: string;
  onExit: () => void;
  onComplete: () => void;
}

export function LessonScreen({ lessonId, trackId, onExit, onComplete }: LessonScreenProps) {
  const { user } = useAuth();
  const lesson = useLesson(lessonId);
  const anonymousProgress = useAnonymousProgress();
  const [showSignup, setShowSignup] = useState(false);

  const handleLessonDone = () => {
    if (!user) {
      anonymousProgress.completeLesson(lessonId, 10);
      if (anonymousProgress.shouldShowSignupPrompt || anonymousProgress.shouldForceSignup) {
        setShowSignup(true);
        return;
      }
    }
    onComplete();
  };

  if (lesson.state === "loading") {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (lesson.state === "intro") {
    return <LessonIntro onStart={lesson.startLesson} />;
  }

  if (lesson.state === "exercise" && lesson.currentExercise) {
    return (
      <div className="flex flex-col min-h-screen">
        <LessonProgress
          current={lesson.currentIndex + 1}
          total={lesson.exercises.length}
          onExit={onExit}
        />
        <ExerciseRenderer
          exercise={lesson.currentExercise}
          onAnswer={(answer, isCorrect) => lesson.submitAnswer(isCorrect)}
          disabled={false}
        />
      </div>
    );
  }

  if (lesson.state === "feedback") {
    return (
      <div className="flex flex-col min-h-screen">
        <LessonProgress
          current={lesson.currentIndex + 1}
          total={lesson.exercises.length}
          onExit={onExit}
        />
        <div className="flex-1 flex items-end">
          <ExerciseFeedback
            isCorrect={lesson.lastAnswerCorrect ?? false}
            onContinue={lesson.nextExercise}
          />
        </div>
      </div>
    );
  }

  if (lesson.state === "complete") {
    return (
      <>
        <LessonComplete
          correct={lesson.score.correct}
          total={lesson.score.total}
          xpEarned={10}
          timeSpent={lesson.timeSpent}
          onBackToTrack={handleLessonDone}
        />
        <SignupPrompt
          open={showSignup}
          onOpenChange={setShowSignup}
          onMaybeLater={() => {
            anonymousProgress.dismissSignupPrompt();
            setShowSignup(false);
            onComplete();
          }}
          forceful={anonymousProgress.shouldForceSignup}
        />
      </>
    );
  }

  // Fallback for intro when no exercises exist
  return <LessonIntro onStart={lesson.startLesson} />;
}
