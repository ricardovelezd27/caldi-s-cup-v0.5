import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/features/feedback/components/FeedbackDialog";

export const FeedbackCTA = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="border-4 border-border rounded-lg p-6 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card text-center space-y-3">
      <h3 className="font-bangers text-xl tracking-wide text-foreground">
        Got thoughts? We're all ears ☕
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Help us brew a better experience — your feedback shapes what comes next.
      </p>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <MessageSquare className="h-4 w-4" />
        Share Your Feedback
      </Button>
      <FeedbackDialog open={open} onOpenChange={setOpen} />
    </section>
  );
};
