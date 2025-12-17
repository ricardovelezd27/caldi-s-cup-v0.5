import { Button } from "@/components/ui/button";
import { RotateCcw, Heart, Share2 } from "lucide-react";
import { ExtractedDataCard } from "./ExtractedDataCard";
import { EnrichedDataCard } from "./EnrichedDataCard";
import { PreferenceMatchCard } from "./PreferenceMatchCard";
import { toast } from "sonner";
import type { ScannedCoffee } from "../types/scanner";

interface ScanResultsProps {
  data: ScannedCoffee;
  onScanAgain: () => void;
}

export function ScanResults({ data, onScanAgain }: ScanResultsProps) {
  const handleAddToFavorites = () => {
    // TODO: Implement add to favorites
    toast.success("Added to favorites!", {
      description: `${data.coffeeName || "This coffee"} has been saved.`,
    });
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
          className="gap-2"
        >
          <Heart className="w-4 h-4" />
          Add to Favorites
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
