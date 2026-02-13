import { useState } from "react";
import { AlertTriangle, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import type { Coffee, CoffeeScanMeta } from "../types";

interface ReportScanErrorDialogProps {
  coffee: Coffee;
  scanMeta?: CoffeeScanMeta;
}

export function ReportScanErrorDialog({ coffee, scanMeta }: ReportScanErrorDialogProps) {
  const [open, setOpen] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!suggestion.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("scan_error_reports").insert({
        user_id: user.id,
        coffee_id: coffee.id,
        scan_id: scanMeta?.scanId ?? null,
        suggested_edit: suggestion.trim(),
        coffee_name: coffee.name,
        coffee_brand: coffee.brand,
      });

      if (error) throw error;

      toast({ title: "Report submitted!", description: "Thanks for helping improve our data." });
      setSuggestion("");
      setOpen(false);
    } catch (error) {
      toast({
        title: "Failed to submit report",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report Error
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bangers text-2xl tracking-wide">
            Report Scan Error
          </DialogTitle>
          <DialogDescription>
            Found something wrong with <strong>{coffee.name}</strong>
            {coffee.brand ? ` by ${coffee.brand}` : ""}? Let us know what needs fixing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Coffee context summary */}
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm space-y-1">
            <p><span className="font-medium text-foreground">Coffee:</span> {coffee.name}</p>
            {coffee.brand && <p><span className="font-medium text-foreground">Brand:</span> {coffee.brand}</p>}
            {coffee.originCountry && <p><span className="font-medium text-foreground">Origin:</span> {coffee.originCountry}</p>}
          </div>

          {/* Suggestion text area */}
          <div className="space-y-2">
            <label htmlFor="suggestion" className="text-sm font-medium text-foreground">
              Suggest an edit
            </label>
            <Textarea
              id="suggestion"
              placeholder="e.g. The brand name is incorrect, it should be... / The origin is actually from... / The roast level seems wrong..."
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!suggestion.trim() || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Submit Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
