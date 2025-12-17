import { Lightbulb, Sun, Focus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const tips = [
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

export function ScanningTips() {
  return (
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
  );
}
