import { cn } from "@/lib/utils";
import { sounds } from "../../../utils/sounds";
import { Check, X } from "lucide-react";

interface ExerciseOptionProps {
  children: React.ReactNode;
  isSelected: boolean;
  isCorrect?: boolean | null; // null = not yet submitted
  isDisabled: boolean;
  onClick: () => void;
  letterIndex?: number;
}

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export function ExerciseOption({
  children,
  isSelected,
  isCorrect = null,
  isDisabled,
  onClick,
  letterIndex,
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
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg border-4 font-inter text-left transition-all duration-150",
        // default
        !isSelected && !submitted && "border-border/40 bg-card hover:shadow-md",
        // selected (pre-submit)
        isSelected && !submitted && "border-secondary bg-secondary/10",
        // correct (post-submit)
        submitted && isCorrect === true && "border-[hsl(142_71%_45%)] bg-[hsl(142_76%_90%)]",
        // incorrect (post-submit, selected wrong)
        submitted && isCorrect === false && isSelected && "border-destructive bg-destructive/10",
        // disabled
        isDisabled && "opacity-50 cursor-not-allowed",
      )}
      style={!isDisabled ? { boxShadow: "2px 2px 0px 0px hsl(var(--border))" } : undefined}
    >
      {letterIndex != null && (
        <span
          className={cn(
            "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2",
            !isSelected && !submitted && "border-border/40 text-muted-foreground",
            isSelected && !submitted && "border-secondary text-secondary bg-secondary/20",
            submitted && isCorrect === true && "border-[hsl(142_71%_45%)] text-[hsl(142_71%_45%)]",
            submitted && isCorrect === false && isSelected && "border-destructive text-destructive",
          )}
        >
          {LETTERS[letterIndex]}
        </span>
      )}
      <span className="flex-1 text-foreground">{children}</span>
      {submitted && isCorrect === true && <Check className="w-5 h-5 text-[hsl(142_71%_45%)]" />}
      {submitted && isCorrect === false && isSelected && <X className="w-5 h-5 text-destructive" />}
    </button>
  );
}
