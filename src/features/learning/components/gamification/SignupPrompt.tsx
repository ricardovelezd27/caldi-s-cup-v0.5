import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/language";
import { ROUTES } from "@/constants/app";
import { MascotCharacter } from "../mascot/MascotCharacter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface SignupPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaybeLater?: () => void;
  forceful?: boolean; // No "maybe later" when true
}

export function SignupPrompt({ open, onOpenChange, onMaybeLater, forceful }: SignupPromptProps) {
  const { t } = useLanguage();

  const benefits = [
    t("learn.signupPrompt.benefit1"),
    t("learn.signupPrompt.benefit2"),
    t("learn.signupPrompt.benefit3"),
    t("learn.signupPrompt.benefit4"),
  ];

  return (
    <Dialog open={open} onOpenChange={forceful ? undefined : onOpenChange}>
      <DialogContent className="border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))] max-w-sm">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-2">
            <MascotCharacter mascot="caldi" mood="celebrating" size="lg" />
          </div>
          <DialogTitle className="font-bangers text-2xl tracking-wide">
            {t("learn.signupPrompt.title")}
          </DialogTitle>
          <DialogDescription className="font-inter">
            {t("learn.signupPrompt.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 my-4">
          {benefits.map((b, i) => (
            <li key={i} className="flex items-center gap-2 text-sm font-inter text-foreground">
              <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
              {b}
            </li>
          ))}
        </ul>

        <Button asChild className="w-full">
          <Link to={ROUTES.auth}>{t("learn.signupPrompt.signUp")}</Link>
        </Button>

        {!forceful && onMaybeLater && (
          <button
            onClick={onMaybeLater}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground font-inter mt-1"
          >
            {t("learn.signupPrompt.maybeLater")}
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
