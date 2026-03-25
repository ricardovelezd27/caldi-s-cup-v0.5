import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared";
import { useOnboarding } from "./hooks/useOnboarding";
import { InterestPicker } from "./steps/InterestPicker";
import { GoalPicker } from "./steps/GoalPicker";
import { getSections, getUnits, getLessons } from "@/features/learning/services/learningService";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/app";

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const { step, selectedTrackId, hasCompleted, setTrack, setGoal, markCompleted } = useOnboarding();
  const [navigating, setNavigating] = useState(false);

  // If already completed, redirect to /learn
  useEffect(() => {
    if (hasCompleted) {
      navigate(ROUTES.learn, { replace: true });
    }
  }, [hasCompleted, navigate]);

  // After goal step completes, find first lesson and navigate
  useEffect(() => {
    if (step !== "done" || !selectedTrackId || navigating) return;

    let cancelled = false;
    setNavigating(true);

    (async () => {
      try {
        const sections = await getSections(selectedTrackId);
        if (cancelled || sections.length === 0) return;
        const firstSection = sections.sort((a, b) => a.sortOrder - b.sortOrder)[0];

        const units = await getUnits(firstSection.id);
        if (cancelled || units.length === 0) return;
        const firstUnit = units.sort((a, b) => a.sortOrder - b.sortOrder)[0];

        const lessons = await getLessons(firstUnit.id);
        if (cancelled || lessons.length === 0) return;
        const firstLesson = lessons.sort((a, b) => a.sortOrder - b.sortOrder)[0];

        markCompleted();
        navigate(`/learn/${selectedTrackId}/${firstLesson.id}`, { replace: true });
      } catch (err) {
        console.error("Onboarding: failed to find first lesson", err);
        markCompleted();
        navigate(ROUTES.learn, { replace: true });
      }
    })();

    return () => { cancelled = true; };
  }, [step, selectedTrackId, navigating, navigate, markCompleted]);

  if (hasCompleted) return null;

  return (
    <PageLayout>
      <section className="py-12 md:py-20 min-h-[60vh] flex items-center">
        <Container className="flex justify-center">
          {step === "interest" && <InterestPicker onSelect={setTrack} />}
          {step === "goal" && <GoalPicker onSelect={setGoal} />}
          {step === "done" && (
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-8 w-48" />
              <p className="text-muted-foreground font-inter animate-pulse">Loading your first lesson…</p>
            </div>
          )}
        </Container>
      </section>
    </PageLayout>
  );
}
