import { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { ExerciseOption } from "../base/ExerciseOption";
import { CheckButton } from "../base/CheckButton";
import { sounds } from "../../../utils/sounds";

interface MCData {
  question: string;
  question_es?: string;
  options: { id: string; text: string; text_es?: string }[];
  correct_answer: string;
  explanation?: string;
  explanation_es?: string;
}

interface Props {
  data: MCData;
  onSubmit: (answer: string, isCorrect: boolean) => void;
  disabled: boolean;
}

export function MultipleChoice({ data, onSubmit, disabled }: Props) {
  const { language } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

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
      <div className="flex-1 px-4 py-6 space-y-4">
        <p className="text-lg font-inter text-foreground">{question}</p>
        <div className="space-y-3">
          {data.options.map((opt, i) => {
            const text = language === "es" && opt.text_es ? opt.text_es : opt.text;
            const isCorrectOption = submitted ? opt.id === data.correct_answer : null;
            return (
              <ExerciseOption
                key={opt.id}
                isSelected={selected === opt.id}
                isCorrect={submitted ? (opt.id === data.correct_answer ? true : selected === opt.id ? false : null) : null}
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
