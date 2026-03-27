import { useState, useCallback, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useLesson } from "../../hooks/useLesson";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import { useAnonymousProgress } from "../../hooks/useAnonymousProgress";
import { useHearts } from "../../hooks/useHearts";
import { useStreak } from "../../hooks/useStreak";
import { useDailyGoal } from "../../hooks/useDailyGoal";
import { useAchievements } from "../../hooks/useAchievements";
import { calculateLessonXP } from "../../services/xpService";
import { updateStreakViaRPC, addXPToDaily } from "../../services/streakService";
import { addWeeklyXP, getLeaderboard, getUserLeague } from "../../services/leagueService";
import { upsertLessonProgress, getLessonProgress } from "../../services/progressService";
import { getNextLessonInTrack } from "../../services/learningService";
import { PageLayout } from "@/components/layout";
import { LessonIntro } from "./LessonIntro";
import { LessonProgress } from "./LessonProgress";
import { LessonComplete } from "./LessonComplete";
import { ExerciseRenderer } from "./ExerciseRenderer";
import { FeedbackModal } from "./FeedbackModal";
import { SignupPrompt } from "../gamification/SignupPrompt";
import { HeartsEmptyModal } from "../gamification/HeartsEmptyModal";
import { AchievementUnlock } from "../gamification/AchievementUnlock";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MascotCharacter } from "../mascot/MascotCharacter";
import type { XPCalculation } from "../../services/xpService";
import type { LearningAchievement } from "../../types";

interface LessonScreenProps {
  lessonId: string;
  trackId: string;
  trackRoute: string;
  onExit: () => void;
  onComplete: () => void;
}

export function LessonScreen({ lessonId, trackId, trackRoute, onExit, onComplete }: LessonScreenProps) {
  const { user, refreshProfile } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const lesson = useLesson(lessonId);
  const anonymousProgress = useAnonymousProgress();
  const { hearts, maxHearts, hasHearts, timeUntilRefill, loseHeart, isLoading: heartsLoading } = useHearts();
  const { streak } = useStreak();
  const { addXP: addDailyXP } = useDailyGoal();
  const { checkAndUnlock: checkAndUnlockAchievements } = useAchievements();

  const [showSignup, setShowSignup] = useState(false);
  const [showHeartsEmpty, setShowHeartsEmpty] = useState(false);
  const [xpResult, setXpResult] = useState<XPCalculation | null>(null);
  const [newAchievements, setNewAchievements] = useState<LearningAchievement[]>([]);
  const [showAchievement, setShowAchievement] = useState<LearningAchievement | null>(null);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [processingDone, setProcessingDone] = useState(false);
  const [isReview, setIsReview] = useState(false);
  const [leaderboardRank, setLeaderboardRank] = useState<number | undefined>();
  const [leaderboardTotal, setLeaderboardTotal] = useState<number | undefined>();
  const hasSubmittedRef = useRef(false);

  // Block lesson start when hearts are empty
  useEffect(() => {
    if (lesson.state === "intro" && user && !hasHearts && !heartsLoading) {
      setShowHeartsEmpty(true);
    }
  }, [lesson.state, hasHearts, user, heartsLoading]);

  // Fetch next lesson ID
  const { data: nextLessonId } = useQuery({
    queryKey: ["next-lesson", lessonId],
    queryFn: () => getNextLessonInTrack(lessonId),
    enabled: lesson.state === "complete",
    staleTime: Infinity,
  });

  const handleSubmitAnswer = useCallback(
    (answer: any, isCorrect: boolean) => {
      lesson.submitAnswer(isCorrect, answer);
      if (!isCorrect && user) {
        // Show modal synchronously if this will drain the last heart
        if (hearts <= 1) setShowHeartsEmpty(true);
        loseHeart();
      }
    },
    [lesson, user, loseHeart, hearts],
  );

  const REVIEW_XP_BASE = 5;

  // Auto-process results when lesson completes
  useEffect(() => {
    if (lesson.state !== "complete") return;
    if (hasSubmittedRef.current) return;

    const processResults = async () => {
      if (!user) {
        anonymousProgress.completeLesson(lessonId, 10);
        setProcessingDone(true);
        if (anonymousProgress.shouldShowSignupPrompt || anonymousProgress.shouldForceSignup) {
          setShowSignup(true);
        }
        return;
      }

      hasSubmittedRef.current = true;
      setIsProcessingComplete(true);

      try {
        const existingProgress = await getLessonProgress(user.id, lessonId);
        const isReviewAttempt = !!existingProgress?.isCompleted;
        setIsReview(isReviewAttempt);

        const fullBaseXp = lesson.lesson?.xpReward ?? 10;
        const baseXpReward = isReviewAttempt ? REVIEW_XP_BASE : fullBaseXp;
        const currentStreak = streak?.currentStreak ?? 0;
        const today = new Date().toISOString().split("T")[0];
        const isFirstToday = streak?.lastActivityDate !== today;

        const xpCalc = calculateLessonXP(
          baseXpReward,
          lesson.score.correct,
          lesson.score.total,
          lesson.timeSpent,
          currentStreak,
          isFirstToday,
        );
        setXpResult(xpCalc);

        // 1. Streak RPC (critical)
        let streakResult: { currentStreak: number; longestStreak: number; totalXp: number; totalLessonsCompleted: number } | null = null;
        try {
          streakResult = await updateStreakViaRPC(user.id, xpCalc.totalXP);
          // Sync profiles.current_streak with the authoritative value
          if (streakResult) {
            await supabase.from("profiles").update({ current_streak: streakResult.currentStreak }).eq("id", user.id);
          }
        } catch (err) {
          console.error("[Gamification] Streak RPC failed:", err);
          toast.error("Could not update your streak. Your progress was still saved.");
        }

        // 2. Daily goal + league XP (non-critical)
        try { await addXPToDaily(user.id, xpCalc.totalXP); } catch (err) { console.error("[Gamification] Daily goal update failed:", err); }
        try { await addWeeklyXP(user.id, xpCalc.totalXP); } catch (err) { console.error("[Gamification] League XP update failed:", err); }

        // 3. Profile XP update (non-critical)
        try {
          const { data: currentProfile } = await supabase
            .from("profiles")
            .select("total_xp")
            .eq("id", user.id)
            .single();
          const newTotalXp = ((currentProfile as any)?.total_xp ?? 0) + xpCalc.totalXP;
          await supabase.from("profiles").update({ total_xp: newTotalXp }).eq("id", user.id);
        } catch (err) {
          console.error("[Gamification] Profile XP update failed:", err);
        }

        // 4. Progress upsert (critical)
        const scorePercent =
          lesson.score.total > 0
            ? Math.round((lesson.score.correct / lesson.score.total) * 100)
            : 0;
        try {
          await upsertLessonProgress({
            userId: user.id,
            lessonId,
            isCompleted: true,
            scorePercent,
            exercisesCorrect: lesson.score.correct,
            exercisesTotal: lesson.score.total,
            timeSpentSeconds: lesson.timeSpent,
            xpEarned: xpCalc.totalXP,
          });
        } catch (err) {
          console.error("[Gamification] Progress upsert failed:", err);
          toast.error("Could not save your lesson progress. Please try again.");
        }

        // 6. Leaderboard position (non-critical)
        try {
          const leagueData = await getUserLeague(user.id);
          if (leagueData) {
            const lb = await getLeaderboard(leagueData.league.id, leagueData.userLeague.weekStartDate);
            const myEntry = lb.find((e) => e.userId === user.id);
            if (myEntry) {
              setLeaderboardRank(myEntry.rank);
              setLeaderboardTotal(lb.length);
            }
          }
        } catch (err) {
          console.error("[Gamification] Leaderboard fetch failed:", err);
        }
        try {
          const unlocked = await checkAndUnlockAchievements({
            currentStreak: streakResult?.currentStreak ?? currentStreak,
            totalLessonsCompleted: streakResult?.totalLessonsCompleted ?? 0,
          } as any);
          if (unlocked.length > 0) {
            setNewAchievements(unlocked);
            setShowAchievement(unlocked[0]);
          }
        } catch (err) {
          console.error("[Gamification] Achievement check failed:", err);
        }
      } catch (err) {
        console.error("Lesson completion unexpected error:", err);
      } finally {
        setIsProcessingComplete(false);
        setProcessingDone(true);
        refreshProfile();
      }
    };

    processResults();
  }, [lesson.state]); // intentionally minimal deps — runs once when state becomes "complete"

  const handleNextLesson = useCallback(() => {
    if (nextLessonId) {
      navigate(`/learn/${trackId}/${nextLessonId}`);
    }
  }, [nextLessonId, trackId, navigate]);

  // --- Back link component ---
  const BackLink = () => (
    <Link
      to={trackRoute}
      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-inter text-sm"
    >
      <ArrowLeft className="w-4 h-4" />
      {t("learn.backToTrack")}
    </Link>
  );

  // --- LOADING ---
  if (lesson.state === "loading") {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <BackLink />
          <div className="mt-6 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </PageLayout>
    );
  }

  // --- INTRO ---
  if (lesson.state === "intro") {
    const lessonData = lesson.lesson;
    const lessonName = lessonData ? (language === "es" ? lessonData.nameEs : lessonData.name) : undefined;
    const introText = lessonData ? (language === "es" ? lessonData.introTextEs : lessonData.introText) : undefined;

    return (
      <>
        <PageLayout>
          <div className="container mx-auto px-4 py-8 max-w-2xl">
            <BackLink />
            <LessonIntro
              lessonName={lessonName}
              introText={introText}
              estimatedMinutes={lessonData?.estimatedMinutes}
              xpReward={lessonData?.xpReward}
              onStart={lesson.startLesson}
            />
          </div>
        </PageLayout>
        <HeartsEmptyModal
          open={showHeartsEmpty}
          onOpenChange={setShowHeartsEmpty}
          timeUntilRefill={timeUntilRefill}
        />
      </>
    );
  }

  // --- EXERCISE + FEEDBACK ---
  if ((lesson.state === "exercise" || lesson.state === "feedback") && lesson.currentExercise) {
    const isFeedback = lesson.state === "feedback";
    const feedbackQd = lesson.currentExercise?.questionData as any;
    const explanation = feedbackQd?.explanation;
    const mascot = (lesson.currentExercise?.mascot as "caldi" | "goat") ?? "caldi";

    return (
      <PageLayout>
        <LessonProgress
          current={lesson.currentIndex + 1}
          total={lesson.exercises.length}
          onExit={onExit}
          hearts={user ? hearts : undefined}
          maxHearts={user ? maxHearts : undefined}
          timeUntilRefill={user ? timeUntilRefill : undefined}
        />
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col px-4 pb-8">
          <ErrorBoundary
            key={lesson.currentExercise.id}
            name="ExerciseRenderer"
            fallback={
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center max-w-sm mx-auto">
                <div className="rounded-lg border-4 border-dashed border-border p-8 bg-card/50 w-full space-y-4">
                  <p className="text-muted-foreground font-inter text-sm">
                    This exercise had a problem loading. Your progress has been saved — you can continue to the next exercise.
                  </p>
                  <Button variant="default" onClick={() => lesson.nextExercise()}>
                    Skip to Next
                  </Button>
                </div>
              </div>
            }
          >
            <ExerciseRenderer
              exercise={lesson.currentExercise}
              onAnswer={handleSubmitAnswer}
              disabled={(!hasHearts && !!user) || isFeedback}
            />
          </ErrorBoundary>
        </div>
        <FeedbackModal
          open={isFeedback}
          isCorrect={!!lesson.lastAnswerCorrect}
          explanation={explanation}
          mascot={mascot}
          exerciseId={lesson.currentExercise.id}
          lessonId={lessonId}
          onContinue={() => {
            if (hearts === 0 && user) {
              setShowHeartsEmpty(true);
              return;
            }
            lesson.nextExercise();
          }}
        />
      </PageLayout>
    );
  }

  // --- COMPLETE ---
  if (lesson.state === "complete") {
    // Show loading while processing results
    if (!processingDone) {
      return (
        <PageLayout>
          <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <MascotCharacter mascot="caldi" mood="thinking" size="lg" />
              <p className="font-bangers text-xl text-foreground tracking-wide animate-pulse">
                {t("common.loading")}...
              </p>
            </div>
          </div>
        </PageLayout>
      );
    }

    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <LessonComplete
            correct={lesson.score.correct}
            total={lesson.score.total}
            xpEarned={xpResult?.totalXP ?? lesson.lesson?.xpReward ?? 10}
            xpBreakdown={xpResult ?? undefined}
            timeSpent={lesson.timeSpent}
            onNext={nextLessonId ? handleNextLesson : undefined}
            onBackToTrack={onComplete}
            isReview={isReview}
            leaderboardRank={leaderboardRank}
            leaderboardTotal={leaderboardTotal}
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
          {showAchievement && (
            <AchievementUnlock
              achievement={showAchievement}
              open={!!showAchievement}
              onOpenChange={(open) => {
                if (!open) {
                  const remaining = newAchievements.filter((a) => a.id !== showAchievement.id);
                  setShowAchievement(remaining[0] ?? null);
                }
              }}
            />
          )}
        </div>
      </PageLayout>
    );
  }

  // Fallback
  return (
    <>
      <PageLayout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <BackLink />
          <LessonIntro onStart={lesson.startLesson} />
        </div>
      </PageLayout>
      <HeartsEmptyModal
        open={showHeartsEmpty}
        onOpenChange={setShowHeartsEmpty}
        timeUntilRefill={timeUntilRefill}
      />
    </>
  );
}
