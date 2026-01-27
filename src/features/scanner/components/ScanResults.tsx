import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Heart, Share2, Loader2 } from "lucide-react";
import { ExtractedDataCard } from "./ExtractedDataCard";
import { EnrichedDataCard } from "./EnrichedDataCard";
import { PreferenceMatchCard } from "./PreferenceMatchCard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import type { ScannedCoffee } from "../types/scanner";

interface ScanResultsProps {
  data: ScannedCoffee;
  onScanAgain: () => void;
}

export function ScanResults({ data, onScanAgain }: ScanResultsProps) {
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
        // User cancelled or share failed
        if ((err as Error).name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareText);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          variant="default"
          onClick={handleAddToFavorites}
          disabled={isSaving || isSaved || !user}
          className="gap-2"
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
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button
          variant="outline"
          onClick={onScanAgain}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Scan Another
        </Button>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Left: Extracted Data with Image */}
        <ExtractedDataCard data={data} />

        {/* Middle: Enriched Data & Jargon */}
        <EnrichedDataCard data={data} />

        {/* Right: Preference Match */}
        <PreferenceMatchCard data={data} />
      </div>
    </div>
  );
}
