import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getExercises } from "../services/learningService";
import { getLessons } from "../services/learningService";
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
  submitAnswer: (isCorrect: boolean) => void;
  nextExercise: () => void;
  completeLesson: () => void;
  goToSignup: () => void;
}

export function useLesson(lessonId: string): UseLessonResult {
  const [state, setState] = useState<LessonState>("loading");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const startTimeRef = useRef(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);

  const exercisesQuery = useQuery({
    queryKey: ["learning-exercises", lessonId],
    queryFn: () => getExercises(lessonId),
  });

  // We don't have a getLessonById, so lesson is null for now
  const lesson: LearningLesson | null = null;

  const exercises = exercisesQuery.data ?? [];
  const currentExercise = exercises[currentIndex] ?? null;

  useEffect(() => {
    if (!exercisesQuery.isLoading) {
      setState("intro");
    }
  }, [exercisesQuery.isLoading]);

  const startLesson = useCallback(() => {
    startTimeRef.current = Date.now();
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setState(exercises.length > 0 ? "exercise" : "complete");
  }, [exercises.length]);

  const submitAnswer = useCallback((isCorrect: boolean) => {
    setLastAnswerCorrect(isCorrect);
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    setState("feedback");
  }, []);

  const nextExercise = useCallback(() => {
    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex((prev) => prev + 1);
      setLastAnswerCorrect(null);
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
