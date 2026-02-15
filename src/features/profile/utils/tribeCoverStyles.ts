import type { CoffeeTribe } from "@/features/quiz";

interface TribeCoverStyle {
  gradient: string;
  patternSvg: string | null;
}

// Diamond pattern for Fox (exclusivity, gems)
const foxPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%23FDFCF7' stroke-width='1'/%3E%3C/svg%3E")`;

// Grid lines for Owl (precision, data)
const owlPattern = `url("data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 16h32M16 0v32' fill='none' stroke='%23FDFCF7' stroke-width='0.5'/%3E%3C/svg%3E")`;

// Wavy lines for Hummingbird (exploration, movement)
const hummingbirdPattern = `url("data:image/svg+xml,%3Csvg width='60' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 15c15-10 30 10 60 0' fill='none' stroke='%23FDFCF7' stroke-width='1'/%3E%3C/svg%3E")`;

// Honeycomb for Bee (comfort, consistency)
const beePattern = `url("data:image/svg+xml,%3Csvg width='56' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 0l14 8v16l-14 8L0 24V8zM42 0l14 8v16l-14 8-14-8V8z' fill='none' stroke='%23FDFCF7' stroke-width='0.8'/%3E%3C/svg%3E")`;

const TRIBE_COVER_STYLES: Record<CoffeeTribe, TribeCoverStyle> = {
  fox: {
    // Destructive red → warm amber gold
    gradient: "linear-gradient(160deg, hsl(6 78% 47%) 0%, hsl(36 90% 50%) 100%)",
    patternSvg: foxPattern,
  },
  owl: {
    // Secondary teal → deep slate
    gradient: "linear-gradient(160deg, hsl(174 35% 50%) 0%, hsl(198 35% 22%) 100%)",
    patternSvg: owlPattern,
  },
  hummingbird: {
    // Primary yellow → warm coral
    gradient: "linear-gradient(160deg, hsl(49 90% 50%) 0%, hsl(16 75% 55%) 100%)",
    patternSvg: hummingbirdPattern,
  },
  bee: {
    // Accent orange → deep coffee brown
    gradient: "linear-gradient(160deg, hsl(30 80% 52%) 0%, hsl(20 40% 25%) 100%)",
    patternSvg: beePattern,
  },
};

const DEFAULT_COVER: TribeCoverStyle = {
  gradient: "linear-gradient(160deg, hsl(198 20% 30%) 0%, hsl(198 15% 20%) 100%)",
  patternSvg: null,
};

export function getTribeCoverStyle(tribe: CoffeeTribe | null): TribeCoverStyle {
  if (!tribe) return DEFAULT_COVER;
  return TRIBE_COVER_STYLES[tribe] ?? DEFAULT_COVER;
}
