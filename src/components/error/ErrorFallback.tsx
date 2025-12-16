import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error?: Error | null;
  onReset?: () => void;
}

/**
 * ErrorFallback Component
 * 
 * User-friendly error display matching brand design system.
 * Shows friendly message with recovery options.
 */
export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border-4 border-border rounded-lg p-6 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-bangers text-2xl text-center text-foreground mb-2">
          Oops! Something went wrong
        </h1>

        {/* Message */}
        <p className="text-muted-foreground text-center mb-6">
          We hit a snag. Don't worry, your coffee journey isn't over — 
          let's get you back on track.
        </p>

        {/* Dev-only error details */}
        {isDev && error && (
          <div className="bg-muted/50 border border-border rounded p-3 mb-6 overflow-auto max-h-32">
            <p className="text-xs font-mono text-destructive break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {onReset && (
            <Button 
              onClick={onReset}
              variant="default"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          
          <Button 
            onClick={handleRefresh}
            variant="outline"
            className="flex-1"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Page
          </Button>
          
          <Button 
            onClick={handleGoHome}
            variant="secondary"
            className="flex-1"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
