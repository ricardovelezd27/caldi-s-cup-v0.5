import { useLanguage } from "@/contexts/language";
import { Button } from "@/components/ui/button";

interface ExerciseWrapperProps {
  children: React.ReactNode;
  onSubmit?: () => void;
  disabled?: boolean;
  timerSeconds?: number;
}

export function ExerciseWrapper({ children, onSubmit, disabled, timerSeconds }: ExerciseWrapperProps) {
  const { t } = useLanguage();
  const mins = timerSeconds ? Math.floor(timerSeconds / 60) : 0;
  const secs = timerSeconds ? timerSeconds % 60 : 0;

  return (
    <div className="flex flex-col flex-1">
      {timerSeconds != null && (
        <div className="text-right px-4 py-1">
          <span className="text-xs font-inter text-muted-foreground">
            {mins}:{secs.toString().padStart(2, "0")}
          </span>
        </div>
      )}

      <div className="flex-1">{children}</div>

      {onSubmit && (
        <div className="px-4 py-4">
          <Button
            onClick={onSubmit}
            disabled={disabled}
            className="w-full font-bangers tracking-wide text-lg"
          >
            {t("learn.exercise.check")}
          </Button>
        </div>
      )}
    </div>
  );
}
