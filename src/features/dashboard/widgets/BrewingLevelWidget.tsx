import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import type { WidgetComponentProps } from "./types";

export function BrewingLevelWidget({ widget }: WidgetComponentProps) {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const level = profile?.brewing_level ?? "beginner";

  const config = {
    beginner: {
      label: t("widgets.beginner"),
      progress: 25,
      description: t("widgets.beginnerDesc"),
      toNext: t("widgets.beginnerNext"),
    },
    intermediate: {
      label: t("widgets.intermediate"),
      progress: 60,
      description: t("widgets.intermediateDesc"),
      toNext: t("widgets.intermediateNext"),
    },
    expert: {
      label: t("widgets.expert"),
      progress: 100,
      description: t("widgets.expertDesc"),
      toNext: t("widgets.expertNext"),
    },
  } as const;

  const current = config[level];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="font-bangers text-xl tracking-wide flex items-center gap-2">
          <Award className="h-5 w-5 text-accent" />
          {t("widgets.brewingLevel")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-bangers text-2xl text-accent">{current.label}</span>
          <span className="text-sm text-muted-foreground">{current.progress}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-muted rounded-full overflow-hidden border-2 border-border">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${current.progress}%` }}
          />
        </div>

        <p className="text-sm text-muted-foreground">{current.description}</p>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">{current.toNext}</p>
        </div>
      </CardContent>
    </Card>
  );
}
