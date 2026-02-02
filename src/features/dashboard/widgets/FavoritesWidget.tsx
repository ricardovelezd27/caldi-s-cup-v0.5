import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, ScanLine } from "lucide-react";
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
          <div className="space-y-3">
            {favorite.image_url && (
              <div className="aspect-square w-full max-w-[120px] mx-auto rounded-lg border-4 border-border overflow-hidden">
                <img 
                  src={favorite.image_url} 
                  alt={favorite.coffee_name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="text-center">
              <h4 className="font-bangers text-lg tracking-wide truncate">
                {favorite.coffee_name}
              </h4>
              {favorite.roaster_name && (
                <p className="text-sm text-muted-foreground">
                  by {favorite.roaster_name}
                </p>
              )}
              {favorite.rating && (
                <div className="flex items-center justify-center gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < favorite.rating! ? "text-primary fill-primary" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
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
