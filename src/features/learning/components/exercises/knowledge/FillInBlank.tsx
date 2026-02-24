import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/language";
import { CheckButton } from "../base/CheckButton";
import { sounds } from "../../../utils/sounds";

interface FIBData {
  question: string;
  question_es?: string;
  blanks: { id: number; correct_answers: string[] }[];
  explanation?: string;
  explanation_es?: string;
}

interface Props {
  data: FIBData;
  onSubmit: (answer: Record<number, string>, isCorrect: boolean) => void;
  disabled: boolean;
}

export function FillInBlank({ data, onSubmit, disabled }: Props) {
  const { language } = useLanguage();
  const question = language === "es" && data.question_es ? data.question_es : data.question;
  const [values, setValues] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Parse question into segments split by {blank}
  const segments = question.split(/\{blank\}/gi);
  const blankCount = segments.length - 1;

  const allFilled = data.blanks.every((b) => (values[b.id] ?? "").trim().length > 0);

  const handleCheck = () => {
    const res: Record<number, boolean> = {};
    let allCorrect = true;
    data.blanks.forEach((b, i) => {
      const userVal = (values[b.id] ?? "").trim().toLowerCase();
      const correct = b.correct_answers.some((a) => a.toLowerCase() === userVal);
      res[b.id] = correct;
      if (!correct) allCorrect = false;
    });
    setResults(res);
    setSubmitted(true);
    allCorrect ? sounds.playCorrect() : sounds.playIncorrect();
    onSubmit(values, allCorrect);
  };

  const btnState = submitted
    ? Object.values(results).every(Boolean) ? "correct" : "incorrect"
    : allFilled ? "ready" : "disabled";

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 px-4 py-6">
        <div className="text-lg font-inter text-foreground leading-relaxed flex flex-wrap items-baseline gap-1">
          {segments.map((seg, i) => (
            <span key={i}>
              {seg}
              {i < blankCount && (
                <input
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  value={values[data.blanks[i]?.id] ?? ""}
                  disabled={disabled || submitted}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [data.blanks[i].id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Tab") {
                      e.preventDefault();
                      inputRefs.current[i + 1]?.focus();
                    }
                  }}
                  className={`inline-block w-24 mx-1 px-2 py-1 border-b-4 bg-transparent text-center font-bold outline-none transition-colors ${
                    submitted
                      ? results[data.blanks[i]?.id]
                        ? "border-[hsl(142_71%_45%)] text-[hsl(142_71%_45%)]"
                        : "border-destructive text-destructive"
                      : "border-border focus:border-secondary"
                  }`}
                />
              )}
            </span>
          ))}
        </div>
      </div>
      {!disabled && !submitted && <CheckButton state={btnState} onClick={handleCheck} />}
    </div>
  );
}
