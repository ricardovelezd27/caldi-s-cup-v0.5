import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth";
import { StarRating } from "./StarRating";
import { UsageSummary, formatUsageSummaryText } from "./UsageSummary";
import { useUsageSummary } from "../hooks/useUsageSummary";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FeedbackDialog = ({ open, onOpenChange }: FeedbackDialogProps) => {
  const { user, profile } = useAuth();
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [includeUsage, setIncludeUsage] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const usageSummary = useUsageSummary(includeUsage && !!user);

  // Pre-fill from auth
  useEffect(() => {
    if (open) {
      setName(profile?.display_name ?? "");
      setEmail(user?.email ?? "");
      setRating(0);
      setMessage("");
      setIncludeUsage(false);
      setSubmitted(false);
      setSubmitting(false);
    }
  }, [open, profile?.display_name, user?.email]);

  const handleSubmit = async () => {
    setSubmitting(true);
    const summaryText = includeUsage && user ? formatUsageSummaryText(usageSummary) : null;

    const { error } = await supabase.from("feedback" as any).insert({
      user_id: user?.id ?? null,
      name: name || null,
      email: email || null,
      rating: rating || null,
      message,
      usage_summary: summaryText,
    });

    setSubmitting(false);

    if (error) {
      toast.error("Failed to send feedback. Please try again.");
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8 space-y-4">
            <h2 className="text-3xl font-bangers tracking-wide">🎉 Thank You!</h2>
            <p className="text-muted-foreground">
              Your feedback means the world to us. We'll use it to make Caldi even better!
            </p>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bangers tracking-wide">
            We'd Love Your Feedback
          </DialogTitle>
          <DialogDescription>
            Caldi is a work in progress. Tell us what you think!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Star Rating */}
          <div className="space-y-1">
            <Label className="text-sm">How would you rate Caldi?</Label>
            <StarRating rating={rating} onRate={setRating} />
          </div>

          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="feedback-name" className="text-sm">
              Name <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="feedback-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="feedback-email" className="text-sm">
              Email <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          {/* Message */}
          <div className="space-y-1">
            <Label htmlFor="feedback-message" className="text-sm">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What did you like? What could be better?"
              rows={4}
            />
          </div>

          {/* Usage Summary Consent */}
          {user && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="include-usage"
                  checked={includeUsage}
                  onCheckedChange={(checked) =>
                    setIncludeUsage(checked === true)
                  }
                />
                <Label htmlFor="include-usage" className="text-sm cursor-pointer">
                  Include a summary of my app activity
                </Label>
              </div>
              <UsageSummary enabled={includeUsage} />
            </div>
          )}

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || submitting}
            className="w-full"
          >
            {submitting ? "Sending…" : "Send Feedback"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
