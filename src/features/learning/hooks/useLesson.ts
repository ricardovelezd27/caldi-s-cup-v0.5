import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { getExercises, getLessonById } from "../services/learningService";
import { useExerciseSubmit } from "./useExerciseSubmit";
import type { LearningExercise, LearningLesson } from "../types";

export type LessonState = "loading" | "intro" | "exercise" | "feedback" | "complete" | "signup";

interface UseLessonResult {
  state: LessonState;
  lesson: LearningLesson | null;
  exercises: LearningExercise[];
  currentIndex: number;
  score: { correct: number; total: number };
  timeSpent: number;
  currentExercise: LearningExercise | null;
  lastAnswerCorrect: boolean | null;
  startLesson: () => void;
  submitAnswer: (isCorrect: boolean, userAnswer?: any) => void;
  nextExercise: () => void;
  completeLesson: () => void;
  goToSignup: () => void;
}

export function useLesson(lessonId: string): UseLessonResult {
  const { user } = useAuth();
  const [state, setState] = useState<LessonState>("loading");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const startTimeRef = useRef(Date.now());
  const exerciseStartRef = useRef(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const { submit: recordExercise } = useExerciseSubmit();

  const lessonQuery = useQuery({
    queryKey: ["learning-lesson", lessonId],
    queryFn: () => getLessonById(lessonId),
  });

  const exercisesQuery = useQuery({
    queryKey: ["learning-exercises", lessonId],
    queryFn: () => getExercises(lessonId),
  });

  const lesson = lessonQuery.data ?? null;
  const exercises = exercisesQuery.data ?? [];
  const currentExercise = exercises[currentIndex] ?? null;

  useEffect(() => {
    if (!exercisesQuery.isLoading && !lessonQuery.isLoading) {
      setState("intro");
    }
  }, [exercisesQuery.isLoading, lessonQuery.isLoading]);

  const startLesson = useCallback(() => {
    startTimeRef.current = Date.now();
    exerciseStartRef.current = Date.now();
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setState(exercises.length > 0 ? "exercise" : "complete");
  }, [exercises.length]);

  const submitAnswer = useCallback(
    (isCorrect: boolean, userAnswer?: any) => {
      setLastAnswerCorrect(isCorrect);
      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
      setState("feedback");

      // Record exercise history for authenticated users
      if (user && currentExercise) {
        const exerciseTime = Math.floor((Date.now() - exerciseStartRef.current) / 1000);
        recordExercise(currentExercise.id, isCorrect, userAnswer ?? null, exerciseTime);
      }
    },
    [user, currentExercise, recordExercise],
  );

  const nextExercise = useCallback(() => {
    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex((prev) => prev + 1);
      setLastAnswerCorrect(null);
      exerciseStartRef.current = Date.now();
      setState("exercise");
    } else {
      setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
      setState("complete");
    }
  }, [currentIndex, exercises.length]);

  const completeLesson = useCallback(() => {
    setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
    setState("complete");
  }, []);

  const goToSignup = useCallback(() => {
    setState("signup");
  }, []);

  return {
    state,
    lesson,
    exercises,
    currentIndex,
    score,
    timeSpent,
    currentExercise,
    lastAnswerCorrect,
    startLesson,
    submitAnswer,
    nextExercise,
    completeLesson,
    goToSignup,
  };
}
