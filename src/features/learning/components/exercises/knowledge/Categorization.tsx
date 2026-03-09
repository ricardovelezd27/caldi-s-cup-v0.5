import { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { BottomActionBar } from "../base/BottomActionBar";
import { sounds } from "../../../utils/sounds";
import { cn } from "@/lib/utils";

interface CatData {
  instruction?: string;
  instruction_es?: string;
  categories: { id: string; name: string; name_es?: string }[];
  items: { id: string; text: string; text_es?: string; category_id: string }[];
  explanation?: string;
  explanation_es?: string;
}

interface Props {
  data: CatData;
  onSubmit: (answer: Record<string, string>, isCorrect: boolean) => void;
  disabled: boolean;
}

export function Categorization({ data, onSubmit, disabled }: Props) {
  const { language } = useLanguage();
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const instruction = language === "es" && data.instruction_es ? data.instruction_es : data.instruction;
  const unplacedItems = data.items.filter((item) => !placements[item.id]);
  const allPlaced = unplacedItems.length === 0;

  const handleItemClick = (itemId: string) => {
    if (disabled || submitted) return;
    sounds.playTap();
    setSelectedItem(selectedItem === itemId ? null : itemId);
  };

  const handleCategoryClick = (catId: string) => {
    if (disabled || submitted || !selectedItem) return;
    sounds.playTap();
    setPlacements((prev) => ({ ...prev, [selectedItem]: catId }));
    setSelectedItem(null);
  };

  const handleRemoveItem = (itemId: string) => {
    if (disabled || submitted) return;
    sounds.playTap();
    setPlacements((prev) => { const n = { ...prev }; delete n[itemId]; return n; });
  };

  const handleCheck = () => {
    const correct = data.items.every((item) => placements[item.id] === item.category_id);
    correct ? sounds.playCorrect() : sounds.playIncorrect();
    setSubmitted(true);
    onSubmit(placements, correct);
  };

  const btnState = submitted
    ? data.items.every((item) => placements[item.id] === item.category_id) ? "correct" : "incorrect"
    : allPlaced ? "ready" : "disabled";

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 px-4 py-6 space-y-4 pb-24">
        {instruction && <p className="text-lg font-inter text-foreground">{instruction}</p>}

        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(data.categories.length, 3)}, 1fr)` }}>
          {data.categories.map((cat) => {
            const name = language === "es" && cat.name_es ? cat.name_es : cat.name;
            const catItems = data.items.filter((i) => placements[i.id] === cat.id);
            return (
              <button key={cat.id} type="button" onClick={() => handleCategoryClick(cat.id)}
                disabled={disabled || submitted || !selectedItem}
                className={cn(
                  "rounded-xl border-2 p-3 min-h-[100px] transition-all duration-200",
                  selectedItem && "border-primary/60 hover:bg-primary/5",
                  !selectedItem && "border-border/30",
                  "bg-card",
                  !disabled && !submitted && selectedItem && "active:scale-[0.97]",
                )}
                style={{ boxShadow: "0 2px 0 0 hsl(var(--border) / 0.2)" }}
              >
                <p className="font-bangers text-sm text-foreground mb-2">{name}</p>
                <div className="space-y-1">
                  {catItems.map((ci) => {
                    const text = language === "es" && ci.text_es ? ci.text_es : ci.text;
                    const correctPlace = submitted && ci.category_id === cat.id;
                    const wrongPlace = submitted && ci.category_id !== cat.id;
                    return (
                      <span key={ci.id}
                        onClick={(e) => { e.stopPropagation(); handleRemoveItem(ci.id); }}
                        className={cn(
                          "inline-block text-xs px-2 py-1 rounded border-2 mr-1 mb-1 cursor-pointer",
                          correctPlace && "border-[hsl(142_71%_45%)] bg-[hsl(142_76%_90%)]",
                          wrongPlace && "border-destructive bg-destructive/5",
                          !submitted && "border-border/30 bg-background",
                        )}
                      >
                        {text}
                      </span>
                    );
                  })}
                </div>
              </button>
            );
          })}
        </div>

        {unplacedItems.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {unplacedItems.map((item) => {
              const text = language === "es" && item.text_es ? item.text_es : item.text;
              return (
                <button key={item.id} type="button" onClick={() => handleItemClick(item.id)}
                  disabled={disabled || submitted}
                  className={cn(
                    "px-3 py-2 rounded-xl border-2 text-sm font-inter transition-all duration-200",
                    selectedItem === item.id && "border-primary bg-primary/10",
                    selectedItem !== item.id && "border-border/30 bg-card",
                    !disabled && !submitted && "active:scale-[0.97]",
                  )}
                  style={{ boxShadow: "0 2px 0 0 hsl(var(--border) / 0.2)" }}
                >
                  {text}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {!disabled && !submitted && <BottomActionBar state={btnState} onClick={handleCheck} />}
    </div>
  );
}
