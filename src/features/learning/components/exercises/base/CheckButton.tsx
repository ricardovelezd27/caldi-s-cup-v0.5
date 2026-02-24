import { useLanguage } from "@/contexts/language";
import { cn } from "@/lib/utils";

interface CheckButtonProps {
  state: "disabled" | "ready" | "correct" | "incorrect";
  onClick: () => void;
}

export function CheckButton({ state, onClick }: CheckButtonProps) {
  const { t } = useLanguage();

  const label =
    state === "correct" || state === "incorrect"
      ? t("learn.exercise.continue")
      : t("learn.exercise.check");

  return (
    <div className="sticky bottom-0 px-4 py-4 bg-background/95 backdrop-blur-sm">
      <button
        type="button"
        onClick={onClick}
        disabled={state === "disabled"}
        className={cn(
          "w-full h-14 rounded-lg border-4 border-border font-bangers text-lg tracking-wide uppercase transition-all duration-150",
          state === "disabled" && "bg-muted text-muted-foreground cursor-not-allowed opacity-60",
          state === "ready" && "bg-primary text-primary-foreground hover:-translate-y-0.5",
          state === "correct" && "bg-[hsl(142_71%_45%)] text-white hover:-translate-y-0.5",
          state === "incorrect" && "bg-accent text-accent-foreground hover:-translate-y-0.5",
        )}
        style={state !== "disabled" ? { boxShadow: "4px 4px 0px 0px hsl(var(--border))" } : undefined}
      >
        {label}
      </button>
    </div>
  );
}
