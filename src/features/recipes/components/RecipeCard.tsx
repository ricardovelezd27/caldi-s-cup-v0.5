import { Link } from "react-router-dom";
import { Clock, Coffee, Globe, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/app";
import { type Recipe, formatBrewTime, getBrewMethodLabel } from "../types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  showAuthor?: boolean;
}

export function RecipeCard({ recipe, showAuthor = false }: RecipeCardProps) {
  return (
    <Link to={`${ROUTES.recipes}/${recipe.id}`}>
      <Card className="border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))] hover:shadow-[6px_6px_0px_0px_hsl(var(--border))] transition-shadow h-full">
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bangers text-lg text-foreground line-clamp-2">
              {recipe.name}
            </h3>
            {recipe.isPublic ? (
              <Globe className="w-4 h-4 text-secondary flex-shrink-0" />
            ) : (
              <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            )}
          </div>

          {/* Brew Method Badge */}
          <Badge variant="secondary" className="text-xs">
            {getBrewMethodLabel(recipe.brewMethod)}
          </Badge>

          {/* Description */}
          {recipe.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {recipe.description}
            </p>
          )}

          {/* Stats Row */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {recipe.brewTimeSeconds && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatBrewTime(recipe.brewTimeSeconds)}</span>
              </div>
            )}
            {recipe.ratio && (
              <div className="flex items-center gap-1">
                <Coffee className="w-3 h-3" />
                <span>{recipe.ratio}</span>
              </div>
            )}
          </div>

          {/* Steps Preview */}
          {recipe.steps.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {recipe.steps.length} step{recipe.steps.length !== 1 ? "s" : ""}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
