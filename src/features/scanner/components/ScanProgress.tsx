import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { ScanProgress as ScanProgressType } from "../types/scanner";

interface ScanProgressProps {
  progress: ScanProgressType;
}

const steps = [
  { key: "uploading", label: "Uploading" },
  { key: "analyzing", label: "Analyzing" },
  { key: "enriching", label: "Enriching" },
  { key: "complete", label: "Complete" },
];

export function ScanProgress({ progress }: ScanProgressProps) {
  const currentStepIndex = steps.findIndex((s) => s.key === progress.status);
  const isError = progress.status === "error";

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress 
          value={progress.progress} 
          className="h-3 border-2 border-border"
        />
        <p className="text-center text-sm text-muted-foreground">
          {progress.message}
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStepIndex > index;
          const isCurrent = currentStepIndex === index;
          
          return (
            <div 
              key={step.key}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                  ${isError && isCurrent 
                    ? "border-destructive bg-destructive/10" 
                    : isCompleted 
                      ? "border-secondary bg-secondary text-secondary-foreground" 
                      : isCurrent 
                        ? "border-primary bg-primary/10" 
                        : "border-border bg-muted"
                  }
                `}
              >
                {isError && isCurrent ? (
                  <AlertCircle className="w-5 h-5 text-destructive" />
                ) : isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                )}
              </div>
              <span 
                className={`
                  text-xs font-medium
                  ${isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Animated Message */}
      {!isError && progress.status !== "complete" && (
        <div className="flex items-center justify-center gap-2 text-primary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium animate-pulse">
            {progress.message}
          </span>
        </div>
      )}
    </div>
  );
}
