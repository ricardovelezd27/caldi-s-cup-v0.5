import { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { ExerciseOption } from "../base/ExerciseOption";
import { CheckButton } from "../base/CheckButton";
import { sounds } from "../../../utils/sounds";

interface TSData {
  scenario: string;
  scenario_es?: string;
  question: string;
  question_es?: string;
  options: { id: string; text: string; text_es?: string; is_correct: boolean }[];
  explanation?: string;
  explanation_es?: string;
}

interface Props {
  data: TSData;
  onSubmit: (answer: string, isCorrect: boolean) => void;
  disabled: boolean;
}

export function Troubleshooting({ data, onSubmit, disabled }: Props) {
  const { language } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const scenario = language === "es" && data.scenario_es ? data.scenario_es : data.scenario;
  const question = language === "es" && data.question_es ? data.question_es : data.question;

  const handleCheck = () => {
    if (!selected) return;
    const opt = data.options.find((o) => o.id === selected);
    const correct = opt?.is_correct ?? false;
    correct ? sounds.playCorrect() : sounds.playIncorrect();
    setSubmitted(true);
    onSubmit(selected, correct);
  };

  const selectedOpt = data.options.find((o) => o.id === selected);
  const btnState = submitted
    ? selectedOpt?.is_correct ? "correct" : "incorrect"
    : selected ? "ready" : "disabled";

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 px-4 py-6 space-y-4">
        <div className="rounded-lg border-4 border-primary/60 bg-primary/10 p-4"
          style={{ boxShadow: "2px 2px 0px 0px hsl(var(--border))" }}>
          <p className="text-xs font-bangers text-primary-foreground/70 uppercase mb-1">⚠️ {language === "es" ? "Escenario" : "Scenario"}</p>
          <p className="text-sm font-inter text-foreground">{scenario}</p>
        </div>
        <p className="text-lg font-inter text-foreground">{question}</p>
        <div className="space-y-3">
          {data.options.map((opt, i) => {
            const text = language === "es" && opt.text_es ? opt.text_es : opt.text;
            return (
              <ExerciseOption key={opt.id}
                isSelected={selected === opt.id}
                isCorrect={submitted ? (opt.is_correct ? true : selected === opt.id ? false : null) : null}
                isDisabled={disabled || submitted}
                onClick={() => setSelected(opt.id)}
                letterIndex={i}
              >
                {text}
              </ExerciseOption>
            );
          })}
        </div>
      </div>
      {!disabled && !submitted && <CheckButton state={btnState} onClick={handleCheck} />}
    </div>
  );
}
