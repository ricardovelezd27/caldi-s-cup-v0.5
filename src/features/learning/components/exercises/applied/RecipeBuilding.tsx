import { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { CheckButton } from "../base/CheckButton";
import { sounds } from "../../../utils/sounds";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface RBData {
  instruction?: string;
  instruction_es?: string;
  method: string;
  variables: {
    id: string;
    name: string;
    name_es?: string;
    type: "select" | "range";
    options?: { value: string; label: string; label_es?: string }[];
    range?: { min: number; max: number; step: number; unit: string };
  }[];
  valid_combinations: Record<string, string | number>[];
  explanation?: string;
  explanation_es?: string;
}

interface Props {
  data: RBData;
  onSubmit: (answer: Record<string, string | number>, isCorrect: boolean) => void;
  disabled: boolean;
}

export function RecipeBuilding({ data, onSubmit, disabled }: Props) {
  const { language } = useLanguage();
  const [values, setValues] = useState<Record<string, string | number>>(() => {
    const init: Record<string, string | number> = {};
    data.variables.forEach((v) => {
      if (v.type === "range" && v.range) init[v.id] = v.range.min;
    });
    return init;
  });
  const [submitted, setSubmitted] = useState(false);

  const instruction = language === "es" && data.instruction_es ? data.instruction_es : data.instruction;
  const allSet = data.variables.every((v) => values[v.id] != null && values[v.id] !== "");

  const handleCheck = () => {
    const correct = data.valid_combinations.some((combo) =>
      data.variables.every((v) => String(combo[v.id]) === String(values[v.id])),
    );
    correct ? sounds.playCorrect() : sounds.playIncorrect();
    setSubmitted(true);
    onSubmit(values, correct);
  };

  const btnState = submitted ? "correct" : allSet ? "ready" : "disabled";

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 px-4 py-6 space-y-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">☕</span>
          <h3 className="font-bangers text-xl text-foreground">{data.method}</h3>
        </div>
        {instruction && <p className="text-sm font-inter text-foreground">{instruction}</p>}
        {data.variables.map((v) => {
          const label = language === "es" && v.name_es ? v.name_es : v.name;
          return (
            <div key={v.id} className="space-y-2">
              <label className="font-inter text-sm font-medium text-foreground">{label}</label>
              {v.type === "select" && v.options && (
                <Select value={String(values[v.id] ?? "")}
                  onValueChange={(val) => setValues((p) => ({ ...p, [v.id]: val }))}
                  disabled={disabled || submitted}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {v.options.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {language === "es" && o.label_es ? o.label_es : o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {v.type === "range" && v.range && (
                <div className="space-y-1">
                  <Slider min={v.range.min} max={v.range.max} step={v.range.step}
                    value={[Number(values[v.id] ?? v.range.min)]}
                    onValueChange={([val]) => setValues((p) => ({ ...p, [v.id]: val }))}
                    disabled={disabled || submitted} />
                  <p className="text-xs text-muted-foreground text-center font-inter">
                    {values[v.id]} {v.range.unit}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!disabled && !submitted && <CheckButton state={btnState} onClick={handleCheck} />}
    </div>
  );
}
