import { Lightbulb, Sun, Focus, Trophy, Mountain, Sparkles, Coffee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CoffeeTribe } from "@/features/quiz/types/tribe";

interface ScanningTipsProps {
  tribe?: CoffeeTribe | null;
}

const genericTips = [
  {
    icon: Sun,
    title: "Good Lighting",
    description: "Ensure the bag is well-lit without harsh shadows",
  },
  {
    icon: Focus,
    title: "Focus on Labels",
    description: "Capture the front label with all text visible",
  },
  {
    icon: Lightbulb,
    title: "Include Details",
    description: "Show origin, roast level, and flavor notes if visible",
  },
];

const tribeTips: Record<CoffeeTribe, typeof genericTips> = {
  fox: [
    {
      icon: Trophy,
      title: "Look for Awards",
      description: "Capture any competition medals or 90+ scores",
    },
    {
      icon: Sparkles,
      title: "Rare Varietals",
      description: "Focus on Geisha, Pacamara, or limited edition mentions",
    },
    {
      icon: Focus,
      title: "Estate Details",
      description: "Include farm name, lot number, or exclusive series info",
    },
  ],
  owl: [
    {
      icon: Mountain,
      title: "Elevation Data",
      description: "Capture MASL/altitude information on the label",
    },
    {
      icon: Focus,
      title: "Processing Method",
      description: "Look for washed, natural, honey, or fermentation details",
    },
    {
      icon: Lightbulb,
      title: "Varietal Names",
      description: "Include Bourbon, Typica, SL28, or other varietal info",
    },
  ],
  hummingbird: [
    {
      icon: Sparkles,
      title: "Flavor Notes",
      description: "Capture unique tasting notes and fruit descriptors",
    },
    {
      icon: Sun,
      title: "Fermentation Type",
      description: "Look for anaerobic, co-ferment, or experimental process",
    },
    {
      icon: Lightbulb,
      title: "Fun Details",
      description: "Include any unique story or experimental batch info",
    },
  ],
  bee: [
    {
      icon: Coffee,
      title: "Roast Level",
      description: "Capture medium, dark, or roast profile information",
    },
    {
      icon: Sun,
      title: "Classic Flavors",
      description: "Look for chocolate, nutty, caramel, or smooth notes",
    },
    {
      icon: Focus,
      title: "Blend Info",
      description: "Include house blend details or consistent roaster info",
    },
  ],
};

export function ScanningTips({ tribe }: ScanningTipsProps) {
  const tips = tribe ? tribeTips[tribe] : genericTips;
  const tribeLabel = tribe ? getTribeLabel(tribe) : null;

  return (
    <div className="space-y-3">
      {tribeLabel && (
        <p className="text-sm text-muted-foreground text-center">
          Tips tailored for <span className="font-medium text-foreground">{tribeLabel}</span>
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip) => (
          <Card 
            key={tip.title} 
            className="border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))]"
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <tip.icon className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">{tip.title}</h4>
                <p className="text-xs text-muted-foreground">{tip.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function getTribeLabel(tribe: CoffeeTribe): string {
  const labels: Record<CoffeeTribe, string> = {
    fox: "🦊 The Fox",
    owl: "🦉 The Owl",
    hummingbird: "🐦 The Hummingbird",
    bee: "🐝 The Bee",
  };
  return labels[tribe];
}
