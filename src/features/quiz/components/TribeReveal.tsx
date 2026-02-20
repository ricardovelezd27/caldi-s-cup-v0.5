import { cn } from '@/lib/utils';
import { CoffeeTribe } from '../types/tribe';
import { TRIBES } from '../data/tribes';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/language';

interface TribeRevealProps {
  tribe: CoffeeTribe;
}

export const TribeReveal = ({ tribe }: TribeRevealProps) => {
  const { t } = useLanguage();
  const tribeData = TRIBES[tribe];
  const name = t(`tribes.${tribe}.name`);
  const title = t(`tribes.${tribe}.title`);
  const description = t(`tribes.${tribe}.description`);
  const values = t(`tribes.${tribe}.values`).split(',');

  return (
    <div className="text-center">
      <div className={cn("w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full flex items-center justify-center mb-6", "border-4 border-border shadow-[6px_6px_0px_0px_hsl(var(--border))]", tribeData.bgClass)}>
        <span className="text-6xl md:text-7xl">{tribeData.emoji}</span>
      </div>
      <h1 className={cn("font-bangers text-4xl md:text-5xl lg:text-6xl tracking-wide mb-2", tribeData.colorClass)}>{name}</h1>
      <p className="text-xl md:text-2xl font-medium text-foreground mb-4">{title}</p>
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {values.map((value) => (
          <Badge key={value} variant="secondary" className="text-sm">{value.trim()}</Badge>
        ))}
      </div>
      <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">{description}</p>
    </div>
  );
};
