import caldiCelebrating from "@/assets/characters/caldi-celebrating.png";
import caldiCurious from "@/assets/characters/caldi-curious.png";
import caldiEncouraging from "@/assets/characters/caldi-encouraging.png";
import caldiNeutral from "@/assets/characters/caldi-neutral.png";
import caldiThinking from "@/assets/characters/caldi-thinking.png";
import goatConfused from "@/assets/characters/goat-confused.png";
import goatCrazy from "@/assets/characters/goat-crazy.png";
import goatExcited from "@/assets/characters/goat-excited.png";
import goatHappy from "@/assets/characters/goat-happy.png";
import goatNeutral from "@/assets/characters/goat-neutral.png";
import { cn } from "@/lib/utils";

type MascotMood = "neutral" | "encouraging" | "celebrating" | "thinking" | "curious" | "confused";

interface MascotCharacterProps {
  mascot: "caldi" | "goat";
  mood?: MascotMood;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const CALDI_ASSETS: Record<string, string> = {
  neutral: caldiNeutral,
  encouraging: caldiEncouraging,
  celebrating: caldiCelebrating,
  thinking: caldiThinking,
  curious: caldiCurious,
  confused: caldiThinking,
};

const GOAT_ASSETS: Record<string, string> = {
  neutral: goatNeutral,
  encouraging: goatHappy,
  celebrating: goatExcited,
  thinking: goatConfused,
  curious: goatCrazy,
  confused: goatConfused,
  happy: goatHappy,
  excited: goatExcited,
  crazy: goatCrazy,
};

const SIZE_CLASSES = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-36 h-36",
};

export function MascotCharacter({ mascot, mood = "neutral", size = "md", className }: MascotCharacterProps) {
  const assets = mascot === "goat" ? GOAT_ASSETS : CALDI_ASSETS;
  const src = assets[mood] ?? assets.neutral;

  return (
    <img
      src={src}
      alt={`${mascot} ${mood}`}
      className={cn(
        SIZE_CLASSES[size],
        "object-contain animate-[bounce-in_0.4s_ease-out]",
        className,
      )}
    />
  );
}
