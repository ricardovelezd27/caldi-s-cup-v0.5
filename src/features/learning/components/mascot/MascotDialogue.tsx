import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface MascotDialogueProps {
  text: string;
  position?: "left" | "right";
  className?: string;
}

export function MascotDialogue({ text, position = "right", className }: MascotDialogueProps) {
  // Capture the first text value to prevent typewriter restart on re-renders
  const stableText = useRef(text);
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const target = stableText.current;
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(target.slice(0, i));
      if (i >= target.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, []); // run once on mount only

  return (
    <div
      className={cn(
        "relative inline-block px-4 py-3 rounded-lg border-4 border-border bg-card shadow-[4px_4px_0px_0px_hsl(var(--border))] font-inter text-sm text-foreground max-w-[250px]",
        position === "left" ? "mr-auto" : "ml-auto",
        className,
      )}
    >
      {displayed}
      <span className="animate-pulse">|</span>
    </div>
  );
}
