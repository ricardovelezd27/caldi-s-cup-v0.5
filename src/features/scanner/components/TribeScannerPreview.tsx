import { Card, CardContent } from "@/components/ui/card";
import { getTribeDefinition } from "@/features/quiz/data/tribes";
import { useLanguage } from "@/contexts/language";
import type { CoffeeTribe } from "@/features/quiz/types/tribe";

interface TribeScannerPreviewProps {
  tribe: CoffeeTribe;
}

const tribeDescriptors: Record<CoffeeTribe, { en: string; es: string }> = {
  fox: {
    en: "rare, award-winning, and exclusive",
    es: "raros, premiados y exclusivos",
  },
  owl: {
    en: "precise, traceable, and data-rich",
    es: "precisos, trazables y ricos en datos",
  },
  hummingbird: {
    en: "experimental, surprising, and full of flavor adventure",
    es: "experimentales, sorprendentes y llenos de aventura de sabor",
  },
  bee: {
    en: "consistent, comforting, and reliably delicious",
    es: "consistentes, reconfortantes y confiablemente deliciosos",
  },
};

export function TribeScannerPreview({ tribe }: TribeScannerPreviewProps) {
  const tribeData = getTribeDefinition(tribe);
  const { t, language } = useLanguage();
  const descriptor = tribeDescriptors[tribe][language];

  const messageParts = language === "es"
    ? { before: "Busquemos un café que refleje tu carácter — buscamos cafés que sean ", after: "." }
    : { before: "Let's search for a coffee that reflects your character — we're looking for coffees that are ", after: "." };

  return (
    <Card className="border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))]">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Column 1: Tribe identity */}
          <div className="flex items-center gap-3 sm:min-w-[160px] shrink-0">
            <span className="text-4xl">{tribeData.emoji}</span>
            <div>
              <h3 className="font-bangers text-xl text-foreground leading-tight">
                {t(`tribes.${tribe}.name`)}
              </h3>
              <p className={`text-sm font-medium ${tribeData.colorClass}`}>
                {t(`tribes.${tribe}.title`)}
              </p>
            </div>
          </div>

          {/* Column 2: Tribe descriptor sentence */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {messageParts.before}
            <span className="font-semibold text-foreground">{descriptor}</span>
            {messageParts.after}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
