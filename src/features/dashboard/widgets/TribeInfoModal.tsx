import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import { getTribeDefinition } from "@/features/quiz/data/tribes";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

interface TribeInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TribeInfoModal({ open, onOpenChange }: TribeInfoModalProps) {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const tribe = profile?.coffee_tribe ?? null;
  const tribeDef = tribe ? getTribeDefinition(tribe) : null;

  const handleRetake = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.QUIZ_RESULT);
      localStorage.removeItem(STORAGE_KEYS.QUIZ_STATE);
    } catch { /* ignore */ }
    onOpenChange(false);
    navigate("/quiz");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {tribeDef ? (
          <>
            <DialogHeader className="items-center text-center">
              <div className={cn("w-16 h-16 rounded-full border-4 border-border flex items-center justify-center mx-auto", tribeDef.bgClass)}>
                <span className="text-3xl">{tribeDef.emoji}</span>
              </div>
              <DialogTitle className={cn("font-bangers text-3xl tracking-wide", tribeDef.colorClass)}>
                {t(`tribes.${tribe}.name`)}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t(`tribes.${tribe}.title`)}
              </DialogDescription>
            </DialogHeader>

            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              {t(`tribes.${tribe}.description`)}
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {t(`tribes.${tribe}.values`).split(",").map((v) => (
                <span key={v} className="text-xs px-2 py-1 rounded-full border bg-muted text-muted-foreground">
                  {v}
                </span>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-2" onClick={handleRetake}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("widgets.retakeQuiz")}
            </Button>
          </>
        ) : (
          <>
            <DialogHeader className="items-center text-center">
              <div className="w-16 h-16 rounded-full border-4 border-border flex items-center justify-center mx-auto bg-muted">
                <span className="text-3xl">☕</span>
              </div>
              <DialogTitle className="font-bangers text-2xl tracking-wide text-foreground">
                {t("widgets.discoverYourTribe")}
              </DialogTitle>
              <DialogDescription>
                {t("widgets.noTribeYet")}
              </DialogDescription>
            </DialogHeader>
            <Button className="w-full" onClick={() => { onOpenChange(false); navigate("/quiz"); }}>
              {t("widgets.takeQuiz")}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
