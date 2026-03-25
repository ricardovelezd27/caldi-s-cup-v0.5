import { Link } from "react-router-dom";
import { Sparkles, UserPlus, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MascotCharacter } from "@/features/learning/components/mascot/MascotCharacter";
import { useLanguage } from "@/contexts/language";

export function WhatsNextCard() {
  const { t } = useLanguage();

  return (
    <div className="border-4 border-border rounded-lg shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card p-6 mt-8">
      <div className="flex flex-col items-center text-center gap-4">
        <MascotCharacter mascot="caldi" mood="celebrating" size="lg" />
        <h2 className="font-bangers text-2xl tracking-wide text-foreground">
          {t("coffee.whatsNextTitle")}
        </h2>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button asChild>
            <Link to="/quiz">
              <Sparkles className="h-4 w-4 mr-2" />
              {t("coffee.whatsNextDiscover")}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/auth">
              <UserPlus className="h-4 w-4 mr-2" />
              {t("coffee.whatsNextSignUp")}
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/scanner">
              <Camera className="h-4 w-4 mr-2" />
              {t("coffee.whatsNextScanAnother")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
