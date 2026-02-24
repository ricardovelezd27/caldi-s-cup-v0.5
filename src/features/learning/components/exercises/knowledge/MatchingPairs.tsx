import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/language";
import { CheckButton } from "../base/CheckButton";
import { sounds } from "../../../utils/sounds";
import { cn } from "@/lib/utils";

interface MPData {
  instruction?: string;
  instruction_es?: string;
  pairs: { id: string; left: string; left_es?: string; right: string; right_es?: string }[];
  explanation?: string;
  explanation_es?: string;
}

interface Props {
  data: MPData;
  onSubmit: (answer: Record<string, string>, isCorrect: boolean) => void;
  disabled: boolean;
}

export function MatchingPairs({ data, onSubmit, disabled }: Props) {
  const { language } = useLanguage();
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [shuffledRight] = useState(() =>
    [...data.pairs].sort(() => Math.random() - 0.5).map((p) => p.id),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; id: string }[]>([]);

  const instruction = language === "es" && data.instruction_es ? data.instruction_es : data.instruction;

  const calcLines = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newLines = Object.entries(connections).map(([leftId, rightId]) => {
      const leftEl = containerRef.current?.querySelector(`[data-left="${leftId}"]`);
      const rightEl = containerRef.current?.querySelector(`[data-right="${rightId}"]`);
      if (!leftEl || !rightEl) return null;
      const lr = leftEl.getBoundingClientRect();
      const rr = rightEl.getBoundingClientRect();
      return {
        id: leftId,
        x1: lr.right - rect.left,
        y1: lr.top + lr.height / 2 - rect.top,
        x2: rr.left - rect.left,
        y2: rr.top + rr.height / 2 - rect.top,
      };
    }).filter(Boolean) as typeof lines;
    setLines(newLines);
  }, [connections]);

  useEffect(() => { calcLines(); }, [connections, calcLines]);
  useEffect(() => { window.addEventListener("resize", calcLines); return () => window.removeEventListener("resize", calcLines); }, [calcLines]);

  const handleLeftClick = (id: string) => {
    if (disabled || submitted) return;
    sounds.playTap();
    if (connections[id]) {
      setConnections((c) => { const n = { ...c }; delete n[id]; return n; });
      return;
    }
    setSelectedLeft(selectedLeft === id ? null : id);
  };

  const handleRightClick = (id: string) => {
    if (disabled || submitted || !selectedLeft) return;
    sounds.playTap();
    // Remove any existing connection to this right item
    const updated = { ...connections };
    Object.entries(updated).forEach(([k, v]) => { if (v === id) delete updated[k]; });
    updated[selectedLeft] = id;
    setConnections(updated);
    setSelectedLeft(null);
  };

  const allConnected = Object.keys(connections).length === data.pairs.length;

  const handleCheck = () => {
    const correct = data.pairs.every((p) => connections[p.id] === p.id);
    correct ? sounds.playCorrect() : sounds.playIncorrect();
    setSubmitted(true);
    onSubmit(connections, correct);
  };

  const btnState = submitted
    ? data.pairs.every((p) => connections[p.id] === p.id) ? "correct" : "incorrect"
    : allConnected ? "ready" : "disabled";

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 px-4 py-6 space-y-4">
        {instruction && <p className="text-lg font-inter text-foreground">{instruction}</p>}
        <div ref={containerRef} className="relative">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {lines.map((l) => (
              <line key={l.id} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                stroke="hsl(var(--secondary))" strokeWidth={3} strokeLinecap="round" />
            ))}
          </svg>
          <div className="flex gap-4" style={{ position: "relative", zIndex: 2 }}>
            <div className="flex-1 space-y-3">
              {data.pairs.map((p) => {
                const text = language === "es" && p.left_es ? p.left_es : p.left;
                const connected = !!connections[p.id];
                return (
                  <button key={p.id} type="button" data-left={p.id}
                    onClick={() => handleLeftClick(p.id)}
                    disabled={disabled || submitted}
                    className={cn(
                      "w-full px-3 py-3 rounded-lg border-4 text-sm font-inter transition-all",
                      selectedLeft === p.id && "border-secondary bg-secondary/10",
                      connected && !submitted && "border-secondary/60 bg-secondary/5",
                      submitted && connections[p.id] === p.id && "border-[hsl(142_71%_45%)] bg-[hsl(142_76%_90%)]",
                      submitted && connections[p.id] !== p.id && "border-destructive bg-destructive/10",
                      !connected && selectedLeft !== p.id && "border-border/40 bg-card",
                    )}
                    style={{ boxShadow: "2px 2px 0px 0px hsl(var(--border))" }}
                  >
                    {text}
                  </button>
                );
              })}
            </div>
            <div className="flex-1 space-y-3">
              {shuffledRight.map((rId) => {
                const pair = data.pairs.find((p) => p.id === rId)!;
                const text = language === "es" && pair.right_es ? pair.right_es : pair.right;
                const isConnected = Object.values(connections).includes(rId);
                return (
                  <button key={rId} type="button" data-right={rId}
                    onClick={() => handleRightClick(rId)}
                    disabled={disabled || submitted || !selectedLeft}
                    className={cn(
                      "w-full px-3 py-3 rounded-lg border-4 text-sm font-inter transition-all",
                      isConnected && !submitted && "border-secondary/60 bg-secondary/5",
                      submitted && Object.entries(connections).some(([l, r]) => r === rId && l === rId) && "border-[hsl(142_71%_45%)] bg-[hsl(142_76%_90%)]",
                      !isConnected && "border-border/40 bg-card",
                      selectedLeft && !isConnected && "hover:border-secondary/40",
                    )}
                    style={{ boxShadow: "2px 2px 0px 0px hsl(var(--border))" }}
                  >
                    {text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {!disabled && !submitted && <CheckButton state={btnState} onClick={handleCheck} />}
    </div>
  );
}
