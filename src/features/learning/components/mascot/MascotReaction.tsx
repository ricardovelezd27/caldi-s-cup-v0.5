import { MascotCharacter } from "./MascotCharacter";
import { MascotDialogue } from "./MascotDialogue";
import { cn } from "@/lib/utils";

interface MascotReactionProps {
  mascot: "caldi" | "goat";
  mood?: "neutral" | "encouraging" | "celebrating" | "thinking" | "curious" | "confused";
  dialogue?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MascotReaction({ mascot, mood = "neutral", dialogue, size = "md", className }: MascotReactionProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <MascotCharacter mascot={mascot} mood={mood} size={size} />
      {dialogue && <MascotDialogue text={dialogue} position="right" />}
    </div>
  );
}
