import { Lightbulb, Sun, Focus, Trophy, Mountain, Sparkles, Coffee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language";
import type { CoffeeTribe } from "@/features/quiz/types/tribe";

interface ScanningTipsProps { tribe?: CoffeeTribe | null; }

export function ScanningTips({ tribe }: ScanningTipsProps) {
  const { t } = useLanguage();

  const genericTips = [
    { icon: Sun, title: t('scanner.goodLighting'), description: t('scanner.goodLightingDesc') },
    { icon: Focus, title: t('scanner.focusLabels'), description: t('scanner.focusLabelsDesc') },
    { icon: Lightbulb, title: t('scanner.includeDetails'), description: t('scanner.includeDetailsDesc') },
  ];

  const tribeTips: Record<CoffeeTribe, typeof genericTips> = {
    fox: [
      { icon: Trophy, title: t('scanner.lookForAwards'), description: t('scanner.lookForAwardsDesc') },
      { icon: Sparkles, title: t('scanner.rareVarietals'), description: t('scanner.rareVarietalsDesc') },
      { icon: Focus, title: t('scanner.estateDetails'), description: t('scanner.estateDetailsDesc') },
    ],
    owl: [
      { icon: Mountain, title: t('scanner.elevationData'), description: t('scanner.elevationDataDesc') },
      { icon: Focus, title: t('scanner.processingMethodTip'), description: t('scanner.processingMethodTipDesc') },
      { icon: Lightbulb, title: t('scanner.varietalNames'), description: t('scanner.varietalNamesDesc') },
    ],
    hummingbird: [
      { icon: Sparkles, title: t('scanner.flavorNotesTip'), description: t('scanner.flavorNotesTipDesc') },
      { icon: Sun, title: t('scanner.fermentationType'), description: t('scanner.fermentationTypeDesc') },
      { icon: Lightbulb, title: t('scanner.funDetails'), description: t('scanner.funDetailsDesc') },
    ],
    bee: [
      { icon: Coffee, title: t('scanner.roastLevelTip'), description: t('scanner.roastLevelTipDesc') },
      { icon: Sun, title: t('scanner.classicFlavors'), description: t('scanner.classicFlavorsDesc') },
      { icon: Focus, title: t('scanner.blendInfo'), description: t('scanner.blendInfoDesc') },
    ],
  };

  const tips = tribe ? tribeTips[tribe] : genericTips;
  const tribeLabel = tribe ? t(`tribes.${tribe}.name`) : null;

  return (
    <div className="space-y-3">
      {tribeLabel && (<p className="text-sm text-muted-foreground text-center">{t('scanner.tipsTailored')} <span className="font-medium text-foreground">{tribeLabel}</span></p>)}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip) => (
          <Card key={tip.title} className="border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))]">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0"><tip.icon className="w-5 h-5 text-secondary" /></div>
              <div><h4 className="font-bold text-sm text-foreground">{tip.title}</h4><p className="text-xs text-muted-foreground">{tip.description}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
