import { useState } from "react";
import { AlertTriangle, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/language";
import type { Coffee, CoffeeScanMeta } from "../types";

interface ReportScanErrorDialogProps { coffee: Coffee; scanMeta?: CoffeeScanMeta; }

export function ReportScanErrorDialog({ coffee, scanMeta }: ReportScanErrorDialogProps) {
  const [open, setOpen] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async () => {
    if (!suggestion.trim() || !user) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("scan_error_reports").insert({ user_id: user.id, coffee_id: coffee.id, scan_id: scanMeta?.scanId ?? null, suggested_edit: suggestion.trim(), coffee_name: coffee.name, coffee_brand: coffee.brand });
      if (error) throw error;
      toast({ title: t('coffee.reportSubmitted'), description: t('coffee.reportThanks') });
      setSuggestion(""); setOpen(false);
    } catch { toast({ title: t('coffee.reportFailed'), description: t('coffee.reportRetry'), variant: "destructive" }); }
    finally { setIsSubmitting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline" className="flex-1"><AlertTriangle className="h-4 w-4 mr-2" />{t('coffee.reportError')}</Button></DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bangers text-2xl tracking-wide">{t('coffee.reportScanError')}</DialogTitle>
          <DialogDescription>{t('coffee.reportDesc')} <strong>{coffee.name}</strong>{coffee.brand ? ` ${t('coffee.by')} ${coffee.brand}` : ""}{t('coffee.reportDesc2')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm space-y-1">
            <p><span className="font-medium text-foreground">{t('coffee.coffeeLabel')}</span> {coffee.name}</p>
            {coffee.brand && <p><span className="font-medium text-foreground">{t('coffee.brandLabel')}</span> {coffee.brand}</p>}
            {coffee.originCountry && <p><span className="font-medium text-foreground">{t('coffee.originLabel')}</span> {coffee.originCountry}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="suggestion" className="text-sm font-medium text-foreground">{t('coffee.suggestEdit')}</label>
            <Textarea id="suggestion" placeholder={t('coffee.suggestPlaceholder')} value={suggestion} onChange={(e) => setSuggestion(e.target.value)} rows={4} className="resize-none" />
          </div>
          <Button onClick={handleSubmit} disabled={!suggestion.trim() || isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            {t('coffee.submitReport')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
