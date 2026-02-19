import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/app";
import { getTribeDefinition, type CoffeeTribe } from "@/features/quiz";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/language";

interface TribeSectionProps {
  tribe: CoffeeTribe | null;
}

export function TribeSection({ tribe }: TribeSectionProps) {
  const { t } = useLanguage();

  if (!tribe) {
    return (
      <div
        className="rounded-md border-[4px] border-border p-6 text-center"
        style={{ boxShadow: "4px 4px 0px 0px hsl(var(--border))" }}
      >
        <Sparkles className="mx-auto mb-3 h-10 w-10 text-primary" />
        <h3 className="text-xl mb-2">{t("profile.discoverTribe")}</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {t("profile.noQuizYet")}
        </p>
        <Button asChild>
          <Link to={ROUTES.quiz}>{t("profile.takeQuiz")}</Link>
        </Button>
      </div>
    );
  }

  const tribeKey = `tribes.${tribe}`;
  const name = t(`${tribeKey}.name`);
  const title = t(`${tribeKey}.title`);
  const description = t(`${tribeKey}.description`);

  const def = getTribeDefinition(tribe);

  return (
    <div
      className={`rounded-md border-[4px] border-border p-6 ${def.bgClass}`}
      style={{ boxShadow: "4px 4px 0px 0px hsl(var(--border))" }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">{def.emoji}</span>
        <div>
          <h3 className={`text-xl ${def.colorClass}`}>{name}</h3>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">{description}</p>
    </div>
  );
}
