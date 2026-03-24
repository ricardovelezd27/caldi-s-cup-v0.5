import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ScanLine } from "lucide-react";
import { useDashboardData } from "../hooks/useDashboardData";
import { useFavorites } from "@/features/coffee/hooks/useFavorites";
import type { WidgetComponentProps } from "./types";
import { WidgetCategoryTag } from "./WidgetCategoryTag";

export function FavoritesWidget({ widget }: WidgetComponentProps) {
  const { favorite } = useDashboardData();
  const { favoriteIds } = useFavorites();
  const favCount = favoriteIds.length;

  return (
    <div className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-card p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="font-bangers text-lg flex items-center gap-2">
          <Heart className="h-5 w-5 text-destructive" />
          {favCount > 0 ? `Favorites (${favCount})` : "Favorites"}
        </h3>
        <WidgetCategoryTag label="Experience" />
      </div>
      <div className="px-5 pb-5">
        {favorite ? (
          <Link to={`/coffee/${favorite.id}`} className="block space-y-3 hover:opacity-90 transition-opacity">
            {favorite.imageUrl && (
              <div className="aspect-square w-full max-w-[120px] mx-auto rounded-lg border-4 border-border overflow-hidden">
                <img src={favorite.imageUrl} alt={favorite.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="text-center">
              <h4 className="font-bangers text-lg tracking-wide truncate">{favorite.name}</h4>
              {favorite.brand && <p className="text-sm text-muted-foreground">by {favorite.brand}</p>}
              {favorite.originCountry && <p className="text-xs text-muted-foreground mt-1">{favorite.originCountry}</p>}
            </div>
          </Link>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Heart className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground mb-3">No favorites yet</p>
            <Button asChild variant="outline" size="sm">
              <Link to="/scanner"><ScanLine className="h-4 w-4 mr-2" />Scan to discover</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
