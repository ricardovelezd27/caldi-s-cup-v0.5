import { useState, useCallback, useMemo } from 'react';
import { CoffeeTribe, QuizState, QuizScores, QuizResult } from '../types/tribe';
import { TOTAL_SCENARIOS } from '../data/scenarios';

const STORAGE_KEY = 'caldi_quiz_state';
const RESULT_STORAGE_KEY = 'caldi_quiz_result';

const initialState: QuizState = {
  currentStep: 0, // 0 = hook screen
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
  const [state, setState] = useState<QuizState>(() => {
    // Try to restore from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only restore if not complete
        if (!parsed.isComplete) {
          return parsed;
        }
      }
    } catch {
      // Ignore errors, use initial state
    }
    return initialState;
  });

  // Calculate scores from responses
  const scores = useMemo<QuizScores>(() => {
    const calculated = { ...initialScores };
    Object.values(state.responses).forEach((tribe) => {
      calculated[tribe]++;
    });
    return calculated;
  }, [state.responses]);

  // Calculate percentages
  const percentages = useMemo<Record<CoffeeTribe, number>>(() => {
    const total = Object.keys(state.responses).length || 1;
    return {
      fox: Math.round((scores.fox / total) * 100),
      owl: Math.round((scores.owl / total) * 100),
      hummingbird: Math.round((scores.hummingbird / total) * 100),
      bee: Math.round((scores.bee / total) * 100),
    };
  }, [scores, state.responses]);

  // Determine winning tribe
  const winningTribe = useMemo<CoffeeTribe | null>(() => {
    if (Object.keys(state.responses).length < TOTAL_SCENARIOS) {
      return null;
    }

    // Find max score
    const maxScore = Math.max(...Object.values(scores));
    const winners = (Object.entries(scores) as [CoffeeTribe, number][])
      .filter(([, score]) => score === maxScore)
      .map(([tribe]) => tribe);

    // If tie, return first one selected from the tied tribes
    if (winners.length > 1) {
      const responsesArray = Object.entries(state.responses) as [string, CoffeeTribe][];
      for (const [, tribe] of responsesArray) {
        if (winners.includes(tribe)) {
          return tribe;
        }
      }
    }

    return winners[0];
  }, [scores, state.responses]);

  // Save state to localStorage
  const persistState = useCallback((newState: QuizState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Start quiz (move from hook to first scenario)
  const startQuiz = useCallback(() => {
    const newState = { ...state, currentStep: 1 };
    setState(newState);
    persistState(newState);
  }, [state, persistState]);

  // Select an answer for current scenario
  const selectAnswer = useCallback((scenarioId: number, tribe: CoffeeTribe) => {
    const newResponses = { ...state.responses, [scenarioId]: tribe };
    const isComplete = Object.keys(newResponses).length >= TOTAL_SCENARIOS;
    
    const newState: QuizState = {
      ...state,
      responses: newResponses,
      isComplete,
    };
    
    setState(newState);
    persistState(newState);
  }, [state, persistState]);

  // Navigate to next scenario
  const nextScenario = useCallback(() => {
    if (state.currentStep < TOTAL_SCENARIOS) {
      const newState = { ...state, currentStep: state.currentStep + 1 };
      setState(newState);
      persistState(newState);
    }
  }, [state, persistState]);

  // Skip current scenario (move to next without answer)
  const skipScenario = useCallback(() => {
    if (state.currentStep < TOTAL_SCENARIOS) {
      const newState = { ...state, currentStep: state.currentStep + 1 };
      setState(newState);
      persistState(newState);
    }
  }, [state, persistState]);

  // Go to specific step
  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step <= TOTAL_SCENARIOS) {
      const newState = { ...state, currentStep: step };
      setState(newState);
      persistState(newState);
    }
  }, [state, persistState]);

  // Reset quiz
  const resetQuiz = useCallback(() => {
    setState(initialState);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(RESULT_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  // Save result for guests
  const saveGuestResult = useCallback((result: QuizResult) => {
    try {
      localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Get saved guest result
  const getGuestResult = useCallback((): QuizResult | null => {
    try {
      const saved = localStorage.getItem(RESULT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return null;
  }, []);

  // Check if current scenario has a response
  const hasCurrentResponse = state.responses[state.currentStep] !== undefined;

  // Get result object
  const getResult = useCallback((): QuizResult | null => {
    if (!winningTribe) return null;
    return {
      tribe: winningTribe,
      scores,
      percentages,
    };
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
    skipScenario,
    goToStep,
    resetQuiz,
    saveGuestResult,
    getGuestResult,
    getResult,
  };
};
