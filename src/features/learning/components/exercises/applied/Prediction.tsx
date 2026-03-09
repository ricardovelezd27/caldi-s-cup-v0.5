import { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { ExerciseOption } from "../base/ExerciseOption";
import { BottomActionBar } from "../base/BottomActionBar";
import { sounds } from "../../../utils/sounds";

interface PredData {
  scenario: string;
  scenario_es?: string;
  question: string;
  question_es?: string;
  options: { id: string; text: string; text_es?: string }[];
  correct_answer: string;
  explanation?: string;
  explanation_es?: string;
}

interface Props {
  data: PredData;
  onSubmit: (answer: string, isCorrect: boolean) => void;
  disabled: boolean;
}

export function Prediction({ data, onSubmit, disabled }: Props) {
  const { language, t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const scenario = language === "es" && data.scenario_es ? data.scenario_es : data.scenario;
  const question = language === "es" && data.question_es ? data.question_es : data.question;

  const handleCheck = () => {
    if (!selected) return;
    const correct = selected === data.correct_answer;
    correct ? sounds.playCorrect() : sounds.playIncorrect();
    setSubmitted(true);
    onSubmit(selected, correct);
  };

  const btnState = submitted
    ? selected === data.correct_answer ? "correct" : "incorrect"
    : selected ? "ready" : "disabled";

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 px-4 py-6 space-y-4 pb-24">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔮</span>
          <span className="font-bangers text-sm uppercase text-muted-foreground">{t("learn.exercise.predict")}</span>
        </div>
        <div className="rounded-xl border-2 border-accent/40 bg-accent/5 p-4"
          style={{ boxShadow: "0 2px 0 0 hsl(var(--border) / 0.2)" }}>
          <p className="text-sm font-inter text-foreground">{scenario}</p>
        </div>
        <p className="text-lg font-inter text-foreground">{question}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.options.map((opt) => {
            const text = language === "es" && opt.text_es ? opt.text_es : opt.text;
            return (
              <ExerciseOption key={opt.id}
                isSelected={selected === opt.id}
                isCorrect={submitted ? (opt.id === data.correct_answer ? true : selected === opt.id ? false : null) : null}
                isDisabled={disabled || submitted}
                onClick={() => setSelected(opt.id)}
              >
                {text}
              </ExerciseOption>
            );
          })}
        </div>
      </div>
      {!disabled && !submitted && <BottomActionBar state={btnState} onClick={handleCheck} />}
    </div>
  );
}
