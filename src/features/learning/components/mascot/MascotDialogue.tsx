import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MascotDialogueProps {
  text: string;
  position?: "left" | "right";
  className?: string;
}

export function MascotDialogue({ text, position = "right", className }: MascotDialogueProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [text]);

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
