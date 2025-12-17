// Coffee Tribe Types for Personality Quiz

export type CoffeeTribe = 'fox' | 'owl' | 'hummingbird' | 'bee';

export interface TribeDefinition {
  id: CoffeeTribe;
  name: string;        // "The Fox"
  title: string;       // "The Tastemaker"
  emoji: string;       // 🦊
  colorClass: string;  // Tailwind color class
  bgClass: string;     // Background color class
  values: string[];
  keywords: string[];
  description: string;
  coffeeRecommendations: string[];
}

export interface QuizScenarioOption {
  id: string;          // "A", "B", "C", "D"
  label: string;
  tribe: CoffeeTribe;
  icon: string;        // Lucide icon name
}

export interface QuizScenario {
  id: number;
  category: string;
  question: string;
  options: QuizScenarioOption[];
}

export interface QuizState {
  currentStep: number;  // 0 = hook, 1-5 = scenarios
  totalSteps: number;
  responses: Record<number, CoffeeTribe>;
  isComplete: boolean;
}

export interface QuizScores {
  fox: number;
  owl: number;
  hummingbird: number;
  bee: number;
}

export interface QuizResult {
  tribe: CoffeeTribe;
  scores: QuizScores;
  percentages: Record<CoffeeTribe, number>;
}
