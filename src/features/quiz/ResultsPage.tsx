import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TribeReveal } from './components/TribeReveal';
import { TRIBES } from './data/tribes';
import { QuizResult, CoffeeTribe } from './types/tribe';
import { ROUTES } from '@/constants/app';
import { Coffee, LayoutDashboard, RefreshCw, UserPlus, ScanLine } from 'lucide-react';
import { retryWithBackoff } from '@/utils/network/retryWithBackoff';

const RESULT_STORAGE_KEY = 'caldi_quiz_result';
export const PENDING_TRIBE_SAVE_KEY = 'caldi_pending_tribe_save';
const REDIRECT_DELAY_SECONDS = 3;

export const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wasFirstOnboarding = useRef(false);

  // Track if this is first onboarding before the save changes the profile
  useEffect(() => {
    if (profile && !profile.is_onboarded) {
      wasFirstOnboarding.current = true;
    }
  }, [profile]);

  // Get result from navigation state or localStorage
  useEffect(() => {
    const stateResult = location.state?.result as QuizResult | undefined;
    
    if (stateResult) {
      setResult(stateResult);
      if (!user) {
        try {
          localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(stateResult));
        } catch { /* ignore */ }
      }
    } else {
      try {
        const saved = localStorage.getItem(RESULT_STORAGE_KEY);
        if (saved) {
          setResult(JSON.parse(saved));
        } else {
          navigate('/quiz');
        }
      } catch {
        navigate('/quiz');
      }
    }
  }, [location.state, user, navigate]);

  // Cancel redirect
  const cancelRedirect = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setCountdown(null);
  }, []);

  // Start auto-redirect countdown
  useEffect(() => {
    if (hasSaved && wasFirstOnboarding.current && user) {
      setCountdown(REDIRECT_DELAY_SECONDS);
      let remaining = REDIRECT_DELAY_SECONDS;
      countdownRef.current = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(countdownRef.current!);
          countdownRef.current = null;
          navigate(ROUTES.scanner);
        } else {
          setCountdown(remaining);
        }
      }, 1000);
    }
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [hasSaved, user, navigate]);

  // Save result to profile with retry
  useEffect(() => {
    const saveToProfile = async () => {
      if (!user || !result || hasSaved || isSaving) return;
      setIsSaving(true);
      try {
        await retryWithBackoff(
          async () => {
            const { error } = await supabase
              .from('profiles')
              .update({
                coffee_tribe: result.tribe,
                is_onboarded: true,
                onboarded_at: new Date().toISOString(),
              })
              .eq('id', user.id);
            if (error) throw new Error(error.message);
          },
          { maxRetries: 3, initialDelay: 1000, backoffFactor: 2 }
        );

        setHasSaved(true);
        await refreshProfile();
        try {
          localStorage.removeItem(RESULT_STORAGE_KEY);
          localStorage.removeItem('caldi_quiz_state');
          localStorage.removeItem(PENDING_TRIBE_SAVE_KEY);
        } catch { /* ignore */ }
        toast({
          title: "Coffee Tribe Saved!",
          description: `You're now officially ${TRIBES[result.tribe].name}.`,
        });
      } catch (err) {
        console.error('All retries failed saving tribe:', err);
        // Persist pending save for recovery
        try {
          localStorage.setItem(PENDING_TRIBE_SAVE_KEY, JSON.stringify(result));
        } catch { /* ignore */ }
        toast({
          title: "Couldn't save your tribe",
          description: "We'll retry automatically next time you open the app.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    };

    saveToProfile();
  }, [user, result, hasSaved, isSaving, toast, refreshProfile]);

  // Handle retake quiz
  const handleRetake = () => {
    cancelRedirect();
    try {
      localStorage.removeItem(RESULT_STORAGE_KEY);
      localStorage.removeItem('caldi_quiz_state');
    } catch { /* ignore */ }
    navigate('/quiz');
  };

  if (!result) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Coffee className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading your results...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const tribeData = TRIBES[result.tribe];

  return (
    <PageLayout>
      <div className="min-h-[calc(100vh-160px)] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Reveal Section */}
          <div className="mb-12">
            <TribeReveal tribe={result.tribe} />
          </div>

          {/* Coffee Recommendations */}
          <div className="bg-card border-4 border-border rounded-lg p-6 shadow-[4px_4px_0px_0px_hsl(var(--border))] mb-8">
            <h2 className="font-bangers text-2xl text-foreground mb-4 tracking-wide">
              Coffees Curated For Your Psychology
            </h2>
            <ul className="space-y-3">
              {tribeData.coffeeRecommendations.map((rec, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Coffee className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Keywords */}
          <div className="bg-muted border-4 border-border rounded-lg p-6 shadow-[4px_4px_0px_0px_hsl(var(--border))] mb-8">
            <h3 className="font-bangers text-xl text-foreground mb-3 tracking-wide">
              Your Coffee Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {tribeData.keywords.map((keyword) => (
                <span 
                  key={keyword}
                  className="px-3 py-1 bg-background border-2 border-border rounded-full text-sm text-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Auto-redirect countdown */}
          {countdown !== null && (
            <div className="bg-secondary/20 border-4 border-secondary rounded-lg p-4 mb-6 text-center">
              <div className="flex items-center justify-center gap-2 text-foreground">
                <ScanLine className="w-5 h-5 text-secondary" />
                <span className="font-bangers text-lg tracking-wide">
                  Taking you to your first scan in {countdown}...
                </span>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="space-y-4">
            {user ? (
              <>
                <Button 
                  size="lg" 
                  className="w-full text-lg"
                  onClick={() => { cancelRedirect(); navigate(ROUTES.scanner); }}
                >
                  <ScanLine className="w-5 h-5 mr-2" />
                  Scan Your First Coffee
                </Button>
                <Button 
                  variant="outline"
                  size="lg" 
                  className="w-full text-lg"
                  onClick={() => { cancelRedirect(); navigate(ROUTES.dashboard); }}
                >
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  Go to My Dashboard
                </Button>
              </>
            ) : (
              <Button size="lg" className="w-full text-lg" asChild>
                <Link to={ROUTES.auth}>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Sign Up to Save My Tribe
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={handleRetake}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          </div>

          {/* Status Message */}
          {user && hasSaved && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              ✓ Your Coffee Tribe has been saved to your profile
            </p>
          )}
          {user && isSaving && (
            <p className="text-center text-sm text-muted-foreground mt-6 animate-pulse">
              Saving your tribe...
            </p>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
