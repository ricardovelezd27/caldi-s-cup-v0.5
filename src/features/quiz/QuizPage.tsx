import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useLanguage } from '@/contexts/language';
import { QUIZ_SCENARIOS } from './data/scenarios';
import { useQuizState } from './hooks/useQuizState';
import { 
  QuizHook, 
  ScenarioScreen, 
  QuizProgress, 
  QuizNavigation,
  OnboardingModal
} from './components';

export const QuizPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [forceShowOnboarding, setForceShowOnboarding] = useState(false);
  
  const handleOnboardingComplete = useCallback(() => {
    setOnboardingComplete(true);
  }, []);

  const handleOnboardingClose = useCallback(() => {
    setForceShowOnboarding(false);
  }, []);
  
  const {
    state,
    selectAnswer,
    nextScenario,
    startQuiz,
    goToStep,
    getResult,
  } = useQuizState();

  useEffect(() => {
    if (onboardingComplete && state.currentStep === 0) {
      startQuiz();
    }
  }, [onboardingComplete, state.currentStep, startQuiz]);

  const { currentStep, totalSteps, responses, isComplete } = state;
  const currentScenario = QUIZ_SCENARIOS[currentStep - 1];
  const selectedTribe = currentStep > 0 ? responses[currentStep] : undefined;

  const handleComplete = () => {
    const result = getResult();
    if (result) {
      navigate('/results', { state: { result } });
    }
  };

  const handleNext = () => {
    if (currentStep >= totalSteps || isComplete) {
      handleComplete();
    } else {
      nextScenario();
    }
  };

  return (
    <PageLayout showHeader={true} showFooter={false}>
      <OnboardingModal 
        onComplete={handleOnboardingComplete} 
        forceShow={forceShowOnboarding}
        onClose={handleOnboardingClose}
        isOnboarded={!!profile?.is_onboarded}
      />
      
      <div className="min-h-[calc(100vh-80px)] flex flex-col py-8">
        {currentStep === 0 && (
          <div className="flex flex-col">
            <div className="flex justify-end px-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setForceShowOnboarding(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                {t("quiz.whatIsThis")}
              </Button>
            </div>
            <QuizHook onStart={startQuiz} />
          </div>
        )}

        {currentStep > 0 && currentScenario && (
          <div className="flex-1 flex flex-col">
            <div className="mb-8 px-4">
              <QuizProgress 
                currentStep={currentStep} 
                totalSteps={totalSteps} 
              />
            </div>

            <div className="flex-1 flex items-center">
              <ScenarioScreen
                scenario={currentScenario}
                selectedTribe={selectedTribe}
                onSelect={(tribe) => selectAnswer(currentStep, tribe)}
              />
            </div>

            <div className="px-4 pb-8">
              <QuizNavigation
                canProceed={!!selectedTribe || isComplete}
                canGoBack={currentStep > 1}
                isLastStep={currentStep >= totalSteps || isComplete}
                onNext={handleNext}
                onBack={() => goToStep(currentStep - 1)}
              />
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
