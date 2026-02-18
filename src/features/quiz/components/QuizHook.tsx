import { Button } from '@/components/ui/button';
import { Coffee, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/language';

interface QuizHookProps {
  onStart: () => void;
}

export const QuizHook = ({ onStart }: QuizHookProps) => {
  const { t } = useLanguage();
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
        {t("quiz.discoverTitle")}
        <br />
        <span className="text-primary">{t("quiz.tribeTitle")}</span>
      </h1>

      {/* Subheadline */}
      <p className="text-lg md:text-xl text-muted-foreground max-w-md mb-8">
        {t("quiz.subheadline")}
        <br />
        {t("quiz.subheadline2")}
      </p>

      {/* CTA Button */}
      <Button
        size="lg"
        onClick={onStart}
        className="text-lg px-8 py-6"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        {t("quiz.cta")}
      </Button>

      {/* Time estimate */}
      <p className="text-sm text-muted-foreground mt-4">
        {t("quiz.timeEstimate")}
      </p>
    </div>
  );
};
