import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Package, ScanLine, Share2, Loader2, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { useFavorites } from "../hooks/useFavorites";
import { useInventory } from "../hooks/useInventory";
import type { Coffee, CoffeeScanMeta } from "../types";

interface CoffeeActionsProps {
  coffee: Coffee;
  scanMeta?: CoffeeScanMeta;
  /** Called when user wants to scan again (scan results view) */
  onScanAgain?: () => void;
}

export function CoffeeActions({
  coffee,
  scanMeta,
  onScanAgain,
}: CoffeeActionsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites, isAddingFavorite, isRemovingFavorite } = useFavorites();
  const { isInInventory, addToInventory, isAddingInventory } = useInventory();

  const coffeeIsFavorite = isFavorite(coffee.id);
  const coffeeInInventory = isInInventory(coffee.id);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add favorites.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (coffeeIsFavorite) {
        await removeFromFavorites(coffee.id);
        toast({ title: "Removed from favorites" });
      } else {
        await addToFavorites(coffee.id);
        toast({ title: "Added to favorites!" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddToInventory = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add to inventory.",
        variant: "destructive",
      });
      return;
    }

    if (coffeeInInventory) {
      toast({ title: "Already in inventory" });
      return;
    }

    try {
      await addToInventory(coffee.id);
      toast({ title: "Added to your inventory!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to inventory. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewProfile = () => {
    navigate(`/coffee/${coffee.id}`);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: coffee.name,
        text: `Check out ${coffee.name}${coffee.brand ? ` by ${coffee.brand}` : ""}`,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={coffeeIsFavorite ? "secondary" : "outline"}
          onClick={handleToggleFavorite}
          disabled={isAddingFavorite || isRemovingFavorite}
          className="flex-1 min-w-[140px]"
        >
          {(isAddingFavorite || isRemovingFavorite) ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : coffeeIsFavorite ? (
            <Heart className="h-4 w-4 mr-2 fill-current" />
          ) : (
            <Heart className="h-4 w-4 mr-2" />
          )}
          {coffeeIsFavorite ? "Favorited" : "Add to Favorites"}
        </Button>

        <Button
          variant={coffeeInInventory ? "secondary" : "outline"}
          onClick={handleAddToInventory}
          disabled={isAddingInventory || coffeeInInventory}
          className="flex-1 min-w-[140px]"
        >
          {isAddingInventory ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : coffeeInInventory ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Package className="h-4 w-4 mr-2" />
          )}
          {coffeeInInventory ? "In Inventory" : "Add to Inventory"}
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-wrap gap-3">
        {/* Show "View Full Profile" when on scan results */}
        {scanMeta && (
          <Button variant="default" onClick={handleViewProfile} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View Full Profile
          </Button>
        )}

        {onScanAgain && (
          <Button variant="outline" onClick={onScanAgain} className="flex-1">
            <ScanLine className="h-4 w-4 mr-2" />
            Scan Another
          </Button>
        )}

        <Button variant="ghost" onClick={handleShare} size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
