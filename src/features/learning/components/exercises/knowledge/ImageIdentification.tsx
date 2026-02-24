import { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { ExerciseOption } from "../base/ExerciseOption";
import { CheckButton } from "../base/CheckButton";
import { sounds } from "../../../utils/sounds";

interface IIData {
  instruction?: string;
  instruction_es?: string;
  image_url?: string;
  options: { id: string; text: string; text_es?: string }[];
  correct_answer: string;
  explanation?: string;
  explanation_es?: string;
}

interface Props {
  data: IIData;
  imageUrl?: string | null;
  onSubmit: (answer: string, isCorrect: boolean) => void;
  disabled: boolean;
}

export function ImageIdentification({ data, imageUrl, onSubmit, disabled }: Props) {
  const { language } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const instruction = language === "es" && data.instruction_es ? data.instruction_es : data.instruction;
  const imgSrc = data.image_url || imageUrl;

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
        {instruction && <p className="text-lg font-inter text-foreground">{instruction}</p>}
        {imgSrc && (
          <div className="rounded-lg border-4 border-border overflow-hidden"
            style={{ boxShadow: "4px 4px 0px 0px hsl(var(--border))" }}>
            <img src={imgSrc} alt="" className="w-full h-48 object-cover" />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          {data.options.map((opt, i) => {
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
      {!disabled && !submitted && <CheckButton state={btnState} onClick={handleCheck} />}
    </div>
  );
}
