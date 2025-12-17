import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout';
import { QUIZ_SCENARIOS } from './data/scenarios';
import { useQuizState } from './hooks/useQuizState';
import { 
  QuizHook, 
  ScenarioScreen, 
  QuizProgress, 
  QuizNavigation,
  ResultsPreview 
} from './components';

export const QuizPage = () => {
  const navigate = useNavigate();
  const {
    state,
    scores,
    percentages,
    selectAnswer,
    nextScenario,
    skipScenario,
    startQuiz,
    getResult,
  } = useQuizState();

  const { currentStep, totalSteps, responses, isComplete } = state;
  const currentScenario = QUIZ_SCENARIOS[currentStep - 1];
  const selectedTribe = currentStep > 0 ? responses[currentStep] : undefined;
  const totalAnswered = Object.keys(responses).length;

  // Handle completing the quiz
  const handleComplete = () => {
    const result = getResult();
    if (result) {
      // Navigate to results page with state
      navigate('/results', { state: { result } });
    }
  };

  // Handle next scenario or complete
  const handleNext = () => {
    if (currentStep >= totalSteps || isComplete) {
      handleComplete();
    } else {
      nextScenario();
    }
  };

  return (
    <PageLayout showHeader={true} showFooter={false}>
      <div className="min-h-[calc(100vh-80px)] flex flex-col py-8">
        {/* Hook Screen (Step 0) */}
        {currentStep === 0 && (
          <QuizHook onStart={startQuiz} />
        )}

        {/* Scenario Screens (Steps 1-5) */}
        {currentStep > 0 && currentScenario && (
          <div className="flex-1 flex flex-col">
            {/* Progress */}
            <div className="mb-8 px-4">
              <QuizProgress 
                currentStep={currentStep} 
                totalSteps={totalSteps} 
              />
            </div>

            {/* Scenario */}
            <div className="flex-1 flex items-center">
              <ScenarioScreen
                scenario={currentScenario}
                selectedTribe={selectedTribe}
                onSelect={(tribe) => selectAnswer(currentStep, tribe)}
              />
            </div>

            {/* Results Preview */}
            {totalAnswered > 0 && (
              <div className="px-4">
                <ResultsPreview 
                  scores={scores}
                  percentages={percentages}
                  totalAnswered={totalAnswered}
                />
              </div>
            )}

            {/* Navigation */}
            <div className="px-4 pb-8">
              <QuizNavigation
                canProceed={!!selectedTribe || isComplete}
                canSkip={currentStep < totalSteps && !isComplete}
                isLastStep={currentStep >= totalSteps || isComplete}
                onNext={handleNext}
                onSkip={skipScenario}
              />
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
