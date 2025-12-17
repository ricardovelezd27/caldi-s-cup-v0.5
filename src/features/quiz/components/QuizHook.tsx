import { Button } from '@/components/ui/button';
import { Coffee, Sparkles } from 'lucide-react';

interface QuizHookProps {
  onStart: () => void;
}

export const QuizHook = ({ onStart }: QuizHookProps) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Hero Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))]">
          <Coffee className="w-12 h-12 text-primary" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-accent" />
      </div>

      {/* Headline */}
      <h1 className="font-bangers text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 tracking-wide">
        DISCOVER YOUR
        <br />
        <span className="text-primary">COFFEE TRIBE</span>
      </h1>

      {/* Subheadline */}
      <p className="text-lg md:text-xl text-muted-foreground max-w-md mb-8">
        5 quick questions. 4 coffee personalities.
        <br />
        Find out which one matches your vibe.
      </p>

      {/* CTA Button */}
      <Button
        size="lg"
        onClick={onStart}
        className="text-lg px-8 py-6"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Decode My Coffee Ritual
      </Button>

      {/* Time estimate */}
      <p className="text-sm text-muted-foreground mt-4">
        Takes less than 2 minutes
      </p>
    </div>
  );
};
