import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, Coffee } from "lucide-react";
import type { FavoriteCoffee } from "../types/dashboard";

interface FavoriteCoffeeCardProps {
  favorite: FavoriteCoffee | null;
}

export function FavoriteCoffeeCard({ favorite }: FavoriteCoffeeCardProps) {
  if (!favorite) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="font-bangers text-xl tracking-wide flex items-center gap-2">
            <Heart className="h-5 w-5 text-destructive" />
            Favorite Coffee
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <Coffee className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground text-sm">No favorite set yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Browse the marketplace to find your go-to brew
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="font-bangers text-xl tracking-wide flex items-center gap-2">
          <Heart className="h-5 w-5 text-destructive fill-destructive" />
          Favorite Coffee
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          {/* Coffee Image */}
          <div className="w-20 h-20 rounded-lg border-4 border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
            {favorite.image_url ? (
              <img
                src={favorite.image_url}
                alt={favorite.coffee_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Coffee className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          {/* Coffee Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{favorite.coffee_name}</h3>
            {favorite.roaster_name && (
              <p className="text-sm text-muted-foreground truncate">{favorite.roaster_name}</p>
            )}
            {favorite.brew_method && (
              <p className="text-xs text-muted-foreground/70 mt-1">{favorite.brew_method}</p>
            )}
            {favorite.rating && (
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="text-sm font-medium">{favorite.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
