import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/features/feedback/components/FeedbackDialog";
import { useLanguage } from "@/contexts/language";

export const FeedbackCTA = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <section className="border-4 border-border rounded-lg p-6 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card text-center space-y-3">
      <h3 className="font-bangers text-xl tracking-wide text-foreground">
        {t("shared.feedbackTitle")}
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        {t("shared.feedbackBody")}
      </p>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <MessageSquare className="h-4 w-4" />
        {t("shared.feedbackCta")}
      </Button>
      <FeedbackDialog open={open} onOpenChange={setOpen} />
    </section>
  );
};
