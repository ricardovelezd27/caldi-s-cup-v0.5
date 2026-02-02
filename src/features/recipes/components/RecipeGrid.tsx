import { Coffee } from "lucide-react";
import { RecipeCard } from "./RecipeCard";
import type { Recipe } from "../types/recipe";

interface RecipeGridProps {
  recipes: Recipe[];
  emptyMessage?: string;
}

export function RecipeGrid({ recipes, emptyMessage = "No recipes found" }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-12 border-4 border-dashed border-border rounded-lg">
        <Coffee className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
