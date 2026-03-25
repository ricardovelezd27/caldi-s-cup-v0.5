import { useState, useCallback, useMemo } from 'react';
import { CoffeeTribe, QuizState, QuizScores, QuizResult } from '../types/tribe';
import { TOTAL_SCENARIOS } from '../data/scenarios';

const initialState: QuizState = {
  currentStep: 0,
  totalSteps: TOTAL_SCENARIOS,
  responses: {},
  isComplete: false,
};

const initialScores: QuizScores = {
  fox: 0,
  owl: 0,
  hummingbird: 0,
  bee: 0,
};

export const useQuizState = () => {
  const [state, setState] = useState<QuizState>(initialState);

  const scores = useMemo<QuizScores>(() => {
    const calculated = { ...initialScores };
    Object.values(state.responses).forEach((tribe) => {
      calculated[tribe]++;
    });
    return calculated;
  }, [state.responses]);

  const percentages = useMemo<Record<CoffeeTribe, number>>(() => {
    const total = Object.keys(state.responses).length || 1;
    return {
      fox: Math.round((scores.fox / total) * 100),
      owl: Math.round((scores.owl / total) * 100),
      hummingbird: Math.round((scores.hummingbird / total) * 100),
      bee: Math.round((scores.bee / total) * 100),
    };
  }, [scores, state.responses]);

  const winningTribe = useMemo<CoffeeTribe | null>(() => {
    if (Object.keys(state.responses).length < TOTAL_SCENARIOS) return null;
    const maxScore = Math.max(...Object.values(scores));
    const winners = (Object.entries(scores) as [CoffeeTribe, number][])
      .filter(([, score]) => score === maxScore)
      .map(([tribe]) => tribe);
    if (winners.length > 1) {
      const responsesArray = Object.entries(state.responses) as [string, CoffeeTribe][];
      for (const [, tribe] of responsesArray) {
        if (winners.includes(tribe)) return tribe;
      }
    }
    return winners[0];
  }, [scores, state.responses]);

  const startQuiz = useCallback(() => {
    setState({ ...initialState, currentStep: 1 });
  }, []);

  const selectAnswer = useCallback((scenarioId: number, tribe: CoffeeTribe) => {
    setState(prev => {
      const newResponses = { ...prev.responses, [scenarioId]: tribe };
      return {
        ...prev,
        responses: newResponses,
        isComplete: Object.keys(newResponses).length >= TOTAL_SCENARIOS,
      };
    });
  }, []);

  const nextScenario = useCallback(() => {
    setState(prev => prev.currentStep < TOTAL_SCENARIOS ? { ...prev, currentStep: prev.currentStep + 1 } : prev);
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step <= TOTAL_SCENARIOS) {
      setState(prev => ({ ...prev, currentStep: step }));
    }
  }, []);

  const resetQuiz = useCallback(() => {
    setState(initialState);
  }, []);

  const hasCurrentResponse = state.responses[state.currentStep] !== undefined;

  const getResult = useCallback((): QuizResult | null => {
    if (!winningTribe) return null;
    return { tribe: winningTribe, scores, percentages };
  }, [winningTribe, scores, percentages]);

  return {
    state,
    scores,
    percentages,
    winningTribe,
    hasCurrentResponse,
    startQuiz,
    selectAnswer,
    nextScenario,
    goToStep,
    resetQuiz,
    getResult,
  };
};
