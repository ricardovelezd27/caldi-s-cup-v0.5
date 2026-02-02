import { useEffect, useState } from 'react';
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
import { Coffee, LayoutDashboard, RefreshCw, UserPlus } from 'lucide-react';

const RESULT_STORAGE_KEY = 'caldi_quiz_result';

export const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  // Get result from navigation state or localStorage
  useEffect(() => {
    const stateResult = location.state?.result as QuizResult | undefined;
    
    if (stateResult) {
      setResult(stateResult);
      // Save to localStorage for guests
      if (!user) {
        try {
          localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(stateResult));
        } catch {
          // Ignore storage errors
        }
      }
    } else {
      // Try to load from localStorage
      try {
        const saved = localStorage.getItem(RESULT_STORAGE_KEY);
        if (saved) {
          setResult(JSON.parse(saved));
        } else {
          // No result found, redirect to quiz
          navigate('/quiz');
        }
      } catch {
        navigate('/quiz');
      }
    }
  }, [location.state, user, navigate]);

  // Save result to profile if authenticated
  useEffect(() => {
    const saveToProfile = async () => {
      if (user && result && !hasSaved && !isSaving) {
        setIsSaving(true);
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              coffee_tribe: result.tribe,
              is_onboarded: true,
              onboarded_at: new Date().toISOString(),
            })
            .eq('id', user.id);

          if (error) {
            console.error('Failed to save tribe:', error);
            toast({
              title: "Couldn't save your tribe",
              description: "Don't worry, your result is saved locally.",
              variant: "destructive",
            });
          } else {
            setHasSaved(true);
            // Refresh profile so other pages see the new tribe immediately
            await refreshProfile();
            // Clear localStorage since it's saved to profile
            try {
              localStorage.removeItem(RESULT_STORAGE_KEY);
              localStorage.removeItem('caldi_quiz_state');
            } catch {
              // Ignore
            }
            toast({
              title: "Coffee Tribe Saved!",
              description: `You're now officially ${TRIBES[result.tribe].name}.`,
            });
          }
        } catch (err) {
          console.error('Error saving tribe:', err);
        } finally {
          setIsSaving(false);
        }
      }
    };

    saveToProfile();
  }, [user, result, hasSaved, isSaving, toast]);

  // Handle retake quiz
  const handleRetake = () => {
    try {
      localStorage.removeItem(RESULT_STORAGE_KEY);
      localStorage.removeItem('caldi_quiz_state');
    } catch {
      // Ignore
    }
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

          {/* CTAs */}
          <div className="space-y-4">
            {/* Primary CTA: Dashboard for logged in, Sign Up for guests */}
            {user ? (
              <Button 
                size="lg" 
                className="w-full text-lg"
                onClick={() => navigate(ROUTES.dashboard)}
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Go to My Dashboard
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full text-lg"
                asChild
              >
                <Link to={ROUTES.auth}>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Sign Up to Save My Tribe
                </Link>
              </Button>
            )}

            {/* Retake Quiz */}
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
        </div>
      </div>
    </PageLayout>
  );
};
