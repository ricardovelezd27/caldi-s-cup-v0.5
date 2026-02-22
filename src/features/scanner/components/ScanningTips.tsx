import { useEffect, useState } from "react";
import { Sun, Focus, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { useIsMobile } from "@/hooks/use-mobile";

export function ScanningTips() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const tips = [
    { icon: Sun, title: t("scanner.goodLighting"), description: t("scanner.goodLightingDesc") },
    { icon: Focus, title: t("scanner.focusLabels"), description: t("scanner.focusLabelsDesc") },
    { icon: Lightbulb, title: t("scanner.includeDetails"), description: t("scanner.includeDetailsDesc") },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isMobile, tips.length]);

  // Desktop: show all tips inline
  if (!isMobile) {
    return (
      <div className="flex flex-wrap items-start gap-6 justify-center text-xs text-muted-foreground">
        {tips.map((tip) => (
          <div key={tip.title} className="flex items-center gap-2 max-w-[220px]">
            <tip.icon className="h-4 w-4 shrink-0 text-secondary" />
            <span>
              <span className="font-semibold text-foreground">{tip.title}:</span>{" "}
              {tip.description}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Mobile: rotating carousel
  const tip = tips[activeIndex];
  return (
    <div className="flex items-center gap-3 justify-center text-xs text-muted-foreground transition-all duration-300">
      <tip.icon className="h-4 w-4 shrink-0 text-secondary" />
      <span>
        <span className="font-semibold text-foreground">{tip.title}:</span>{" "}
        {tip.description}
      </span>
      <div className="flex gap-1 ml-2">
        {tips.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              i === activeIndex ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
