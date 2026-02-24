import { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { CheckButton } from "../base/CheckButton";
import { sounds } from "../../../utils/sounds";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface TFData {
  statement: string;
  statement_es?: string;
  correct_answer: boolean;
  explanation?: string;
  explanation_es?: string;
}

interface Props {
  data: TFData;
  onSubmit: (answer: boolean, isCorrect: boolean) => void;
  disabled: boolean;
}

export function TrueFalse({ data, onSubmit, disabled }: Props) {
  const { language, t } = useLanguage();
  const [selected, setSelected] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const statement = language === "es" && data.statement_es ? data.statement_es : data.statement;

  const handleCheck = () => {
    if (selected === null) return;
    const correct = selected === data.correct_answer;
    correct ? sounds.playCorrect() : sounds.playIncorrect();
    setSubmitted(true);
    onSubmit(selected, correct);
  };

  const btnState = submitted
    ? selected === data.correct_answer ? "correct" : "incorrect"
    : selected !== null ? "ready" : "disabled";

  const optionClass = (val: boolean) =>
    cn(
      "flex-1 flex flex-col items-center justify-center gap-2 py-8 rounded-lg border-4 font-bangers text-2xl transition-all duration-150 cursor-pointer",
      !submitted && selected !== val && "border-border/40 bg-card",
      !submitted && selected === val && "border-secondary bg-secondary/10",
      submitted && val === data.correct_answer && "border-[hsl(142_71%_45%)] bg-[hsl(142_76%_90%)]",
      submitted && val !== data.correct_answer && selected === val && "border-destructive bg-destructive/10",
      (disabled || submitted) && "cursor-not-allowed",
    );

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 px-4 py-6 space-y-6">
        <p className="text-lg font-inter text-foreground">{statement}</p>
        <div className="flex gap-4">
          {[true, false].map((val) => (
            <button
              key={String(val)}
              type="button"
              disabled={disabled || submitted}
              onClick={() => { sounds.playTap(); setSelected(val); }}
              className={optionClass(val)}
              style={{ boxShadow: "2px 2px 0px 0px hsl(var(--border))" }}
            >
              {val ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
              {val ? t("learn.exercise.trueLabel") : t("learn.exercise.falseLabel")}
            </button>
          ))}
        </div>
      </div>
      {!disabled && !submitted && <CheckButton state={btnState} onClick={handleCheck} />}
    </div>
  );
}
