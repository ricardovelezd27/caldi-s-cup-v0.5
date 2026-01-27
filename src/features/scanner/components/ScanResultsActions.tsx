import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Heart, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import type { ScannedCoffee } from "../types/scanner";

interface ScanResultsActionsProps {
  data: ScannedCoffee;
  onScanAgain: () => void;
}

export function ScanResultsActions({ data, onScanAgain }: ScanResultsActionsProps) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleAddToFavorites = async () => {
    if (!user || isSaved || isSaving) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("user_favorites")
        .insert({
          user_id: user.id,
          coffee_name: data.coffeeName || "Unknown Coffee",
          roaster_name: data.brand,
          image_url: data.imageUrl,
        });

      if (error) throw error;

      setIsSaved(true);
      toast.success("Added to favorites!", {
        description: `${data.coffeeName || "This coffee"} has been saved.`,
      });
    } catch (err) {
      console.error("Failed to save favorite:", err);
      toast.error("Failed to save favorite", {
        description: "Please try again later.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    const shareText = `Check out ${data.coffeeName || "this coffee"} from ${data.brand || "a great roaster"}! Scanned with Caldi's Cup.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.coffeeName || "Coffee Scan",
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card">
      <div className="flex flex-wrap gap-3">
        <Button
          variant="default"
          onClick={handleAddToFavorites}
          disabled={isSaving || isSaved || !user}
          className="flex-1 min-w-[140px] gap-2"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          )}
          {isSaved ? "Saved!" : isSaving ? "Saving..." : "Add to Favorites"}
        </Button>
        <Button
          variant="outline"
          onClick={handleShare}
          className="flex-1 min-w-[100px] gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button
          variant="outline"
          onClick={onScanAgain}
          className="flex-1 min-w-[120px] gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Scan Another
        </Button>
      </div>
    </div>
  );
}
