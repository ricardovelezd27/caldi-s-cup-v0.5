import { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { CheckButton } from "../base/CheckButton";
import { sounds } from "../../../utils/sounds";
import { Input } from "@/components/ui/input";

interface CalcData {
  question: string;
  question_es?: string;
  correct_answer: number;
  tolerance?: number;
  unit?: string;
  hint?: string;
  hint_es?: string;
  explanation?: string;
  explanation_es?: string;
}

interface Props {
  data: CalcData;
  onSubmit: (answer: number, isCorrect: boolean) => void;
  disabled: boolean;
}

export function Calculation({ data, onSubmit, disabled }: Props) {
  const { language, t } = useLanguage();
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const question = language === "es" && data.question_es ? data.question_es : data.question;
  const hint = language === "es" && data.hint_es ? data.hint_es : data.hint;

  const handleCheck = () => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    const tol = data.tolerance ?? 2;
    const correct = Math.abs(num - data.correct_answer) <= tol;
    correct ? sounds.playCorrect() : sounds.playIncorrect();
    setIsCorrect(correct);
    setSubmitted(true);
    onSubmit(num, correct);
  };

  const btnState = submitted
    ? isCorrect ? "correct" : "incorrect"
    : value.trim() ? "ready" : "disabled";

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 px-4 py-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📐</span>
          <span className="font-bangers text-sm uppercase text-muted-foreground">{t("learn.exercise.calculate")}</span>
        </div>
        <p className="text-lg font-inter text-foreground">{question}</p>
        <div className="flex items-center gap-2 max-w-xs">
          <Input type="number" inputMode="decimal" value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled || submitted}
            className={`text-center text-lg font-bold ${
              submitted ? (isCorrect ? "border-[hsl(142_71%_45%)]" : "border-destructive") : ""
            }`}
          />
          {data.unit && <span className="text-sm font-inter text-muted-foreground">{data.unit}</span>}
        </div>
        {hint && (
          <div>
            <button type="button" onClick={() => setShowHint(!showHint)}
              className="text-xs font-inter text-secondary underline">
              {showHint ? t("learn.exercise.hideHint") : t("learn.exercise.showHint")}
            </button>
            {showHint && (
              <p className="mt-1 text-sm font-inter text-muted-foreground bg-card border-2 border-border/40 rounded-lg p-3">
                {hint}
              </p>
            )}
          </div>
        )}
      </div>
      {!disabled && !submitted && <CheckButton state={btnState} onClick={handleCheck} />}
    </div>
  );
}
