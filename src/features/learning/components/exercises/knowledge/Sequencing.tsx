import { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { CheckButton } from "../base/CheckButton";
import { sounds } from "../../../utils/sounds";
import { cn } from "@/lib/utils";

interface SeqData {
  instruction?: string;
  instruction_es?: string;
  items: { id: string; text: string; text_es?: string }[];
  correct_order: string[];
  explanation?: string;
  explanation_es?: string;
}

interface Props {
  data: SeqData;
  onSubmit: (answer: string[], isCorrect: boolean) => void;
  disabled: boolean;
}

export function Sequencing({ data, onSubmit, disabled }: Props) {
  const { language } = useLanguage();
  const [order, setOrder] = useState<string[]>(() =>
    [...data.items].sort(() => Math.random() - 0.5).map((i) => i.id),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const instruction = language === "es" && data.instruction_es ? data.instruction_es : data.instruction;

  const handleTap = (id: string) => {
    if (disabled || submitted) return;
    sounds.playTap();
    if (!selectedId) {
      setSelectedId(id);
    } else if (selectedId === id) {
      setSelectedId(null);
    } else {
      // swap
      setOrder((prev) => {
        const copy = [...prev];
        const a = copy.indexOf(selectedId);
        const b = copy.indexOf(id);
        [copy[a], copy[b]] = [copy[b], copy[a]];
        return copy;
      });
      setSelectedId(null);
    }
  };

  const handleCheck = () => {
    const correct = order.every((id, i) => id === data.correct_order[i]);
    correct ? sounds.playCorrect() : sounds.playIncorrect();
    setSubmitted(true);
    onSubmit(order, correct);
  };

  const isCorrectOrder = order.every((id, i) => id === data.correct_order[i]);
  const btnState = submitted ? (isCorrectOrder ? "correct" : "incorrect") : "ready";

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 px-4 py-6 space-y-4">
        {instruction && <p className="text-lg font-inter text-foreground">{instruction}</p>}
        <p className="text-sm text-muted-foreground font-inter">
          {language === "es" ? "Toca un elemento, luego toca otro para intercambiar" : "Tap an item, then tap another to swap"}
        </p>
        <div className="space-y-3">
          {order.map((id, i) => {
            const item = data.items.find((it) => it.id === id)!;
            const text = language === "es" && item.text_es ? item.text_es : item.text;
            const correctPos = submitted && data.correct_order[i] === id;
            const incorrectPos = submitted && data.correct_order[i] !== id;
            return (
              <button key={id} type="button" onClick={() => handleTap(id)}
                disabled={disabled || submitted}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg border-4 font-inter text-left transition-all",
                  selectedId === id && "border-secondary bg-secondary/10",
                  selectedId !== id && !submitted && "border-border/40 bg-card",
                  correctPos && "border-[hsl(142_71%_45%)] bg-[hsl(142_76%_90%)]",
                  incorrectPos && "border-destructive bg-destructive/10",
                )}
                style={{ boxShadow: "2px 2px 0px 0px hsl(var(--border))" }}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 border-border/40">
                  {i + 1}
                </span>
                <span className="flex-1">{text}</span>
              </button>
            );
          })}
        </div>
      </div>
      {!disabled && !submitted && <CheckButton state={btnState} onClick={handleCheck} />}
    </div>
  );
}
