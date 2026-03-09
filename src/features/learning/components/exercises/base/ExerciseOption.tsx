import { cn } from "@/lib/utils";
import { sounds } from "../../../utils/sounds";
import { Check, X } from "lucide-react";

interface ExerciseOptionProps {
  children: React.ReactNode;
  isSelected: boolean;
  isCorrect?: boolean | null;
  isDisabled: boolean;
  onClick: () => void;
  letterIndex?: number;
}

export function ExerciseOption({
  children,
  isSelected,
  isCorrect = null,
  isDisabled,
  onClick,
}: ExerciseOptionProps) {
  const submitted = isCorrect !== null;

  const handleClick = () => {
    if (isDisabled) return;
    sounds.playTap();
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 font-inter text-left transition-all duration-200",
        // default
        !isSelected && !submitted && "border-border/30 bg-card hover:border-border/60",
        // selected (pre-submit)
        isSelected && !submitted && "border-primary bg-primary/10 font-semibold",
        // correct (post-submit)
        submitted && isCorrect === true && "border-[hsl(142_71%_45%)] bg-[hsl(142_76%_90%)]",
        // incorrect (post-submit, selected wrong)
        submitted && isCorrect === false && isSelected && "border-destructive bg-destructive/5",
        // disabled
        isDisabled && !submitted && "opacity-50 cursor-not-allowed",
        // press effect
        !isDisabled && "active:scale-[0.97] cursor-pointer",
      )}
      style={!isDisabled && !submitted ? { boxShadow: "0 2px 0 0 hsl(var(--border) / 0.2)" } : undefined}
    >
      <span className="flex-1 text-foreground">{children}</span>
      {submitted && isCorrect === true && <Check className="w-5 h-5 text-[hsl(142_71%_45%)] flex-shrink-0" />}
      {submitted && isCorrect === false && isSelected && <X className="w-5 h-5 text-destructive flex-shrink-0" />}
    </button>
  );
}
