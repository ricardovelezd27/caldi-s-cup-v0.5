import { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { ExerciseOption } from "../base/ExerciseOption";
import { CheckButton } from "../base/CheckButton";
import { sounds } from "../../../utils/sounds";

interface CompData {
  question: string;
  question_es?: string;
  item_a: { name: string; name_es?: string; image_url?: string };
  item_b: { name: string; name_es?: string; image_url?: string };
  attribute?: string;
  attribute_es?: string;
  correct_answer: "a" | "b" | "equal";
  explanation?: string;
  explanation_es?: string;
}

interface Props {
  data: CompData;
  onSubmit: (answer: string, isCorrect: boolean) => void;
  disabled: boolean;
}

export function Comparison({ data, onSubmit, disabled }: Props) {
  const { language, t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const question = language === "es" && data.question_es ? data.question_es : data.question;
  const nameA = language === "es" && data.item_a.name_es ? data.item_a.name_es : data.item_a.name;
  const nameB = language === "es" && data.item_b.name_es ? data.item_b.name_es : data.item_b.name;

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

  const options = [
    { id: "a", label: nameA },
    { id: "b", label: nameB },
    { id: "equal", label: t("learn.exercise.equalLabel") },
  ];

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 px-4 py-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚖️</span>
          <span className="font-bangers text-sm uppercase text-muted-foreground">{t("learn.exercise.compare")}</span>
        </div>
        <p className="text-lg font-inter text-foreground">{question}</p>

        {/* VS cards */}
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-lg border-4 border-border/40 bg-card p-3 text-center"
            style={{ boxShadow: "2px 2px 0px 0px hsl(var(--border))" }}>
            {data.item_a.image_url && (
              <img src={data.item_a.image_url} alt={nameA} className="w-full h-20 object-cover rounded mb-2" />
            )}
            <p className="font-bangers text-foreground">{nameA}</p>
          </div>
          <span className="font-bangers text-xl text-muted-foreground">VS</span>
          <div className="flex-1 rounded-lg border-4 border-border/40 bg-card p-3 text-center"
            style={{ boxShadow: "2px 2px 0px 0px hsl(var(--border))" }}>
            {data.item_b.image_url && (
              <img src={data.item_b.image_url} alt={nameB} className="w-full h-20 object-cover rounded mb-2" />
            )}
            <p className="font-bangers text-foreground">{nameB}</p>
          </div>
        </div>

        <div className="space-y-3">
          {options.map((opt, i) => (
            <ExerciseOption key={opt.id}
              isSelected={selected === opt.id}
              isCorrect={submitted ? (opt.id === data.correct_answer ? true : selected === opt.id ? false : null) : null}
              isDisabled={disabled || submitted}
              onClick={() => setSelected(opt.id)}
            >
              {opt.label}
            </ExerciseOption>
          ))}
        </div>
      </div>
      {!disabled && !submitted && <CheckButton state={btnState} onClick={handleCheck} />}
    </div>
  );
}
