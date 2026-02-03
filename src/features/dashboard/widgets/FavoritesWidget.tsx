import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ScanLine } from "lucide-react";
import { useDashboardData } from "../hooks/useDashboardData";
import type { WidgetComponentProps } from "./types";

export function FavoritesWidget({ widget }: WidgetComponentProps) {
  const { favorite } = useDashboardData();

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="font-bangers text-xl tracking-wide flex items-center gap-2">
          <Heart className="h-5 w-5 text-destructive" />
          Favorite Coffee
        </CardTitle>
      </CardHeader>
      <CardContent>
        {favorite ? (
          <Link 
            to={`/coffee/${favorite.id}`}
            className="block space-y-3 hover:opacity-90 transition-opacity"
          >
            {favorite.imageUrl && (
              <div className="aspect-square w-full max-w-[120px] mx-auto rounded-lg border-4 border-border overflow-hidden">
                <img 
                  src={favorite.imageUrl} 
                  alt={favorite.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="text-center">
              <h4 className="font-bangers text-lg tracking-wide truncate">
                {favorite.name}
              </h4>
              {favorite.brand && (
                <p className="text-sm text-muted-foreground">
                  by {favorite.brand}
                </p>
              )}
              {favorite.originCountry && (
                <p className="text-xs text-muted-foreground mt-1">
                  {favorite.originCountry}
                </p>
              )}
            </div>
          </Link>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Heart className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground mb-3">No favorites yet</p>
            <Button asChild variant="outline" size="sm">
              <Link to="/scanner">
                <ScanLine className="h-4 w-4 mr-2" />
                Scan to discover
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
