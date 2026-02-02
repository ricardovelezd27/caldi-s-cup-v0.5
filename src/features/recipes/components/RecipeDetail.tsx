import { Clock, Coffee, Thermometer, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  type Recipe, 
  formatBrewTime, 
  getBrewMethodLabel, 
  getGrindSizeLabel 
} from "../types/recipe";

interface RecipeDetailProps {
  recipe: Recipe;
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-bangers text-3xl text-foreground mb-2">
          {recipe.name}
        </h1>
        <Badge variant="secondary" className="text-sm">
          {getBrewMethodLabel(recipe.brewMethod)}
        </Badge>
        {recipe.description && (
          <p className="mt-4 text-muted-foreground">{recipe.description}</p>
        )}
      </div>

      <Separator />

      {/* Parameters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recipe.grindSize && (
          <div className="border-4 border-border rounded-lg p-3 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Scale className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Grind</span>
            </div>
            <p className="font-medium text-sm">{getGrindSizeLabel(recipe.grindSize)}</p>
          </div>
        )}

        {recipe.ratio && (
          <div className="border-4 border-border rounded-lg p-3 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Coffee className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Ratio</span>
            </div>
            <p className="font-medium text-sm">{recipe.ratio}</p>
          </div>
        )}

        {recipe.waterTempCelsius && (
          <div className="border-4 border-border rounded-lg p-3 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Thermometer className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Temp</span>
            </div>
            <p className="font-medium text-sm">{recipe.waterTempCelsius}°C</p>
          </div>
        )}

        {recipe.brewTimeSeconds && (
          <div className="border-4 border-border rounded-lg p-3 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Time</span>
            </div>
            <p className="font-medium text-sm">{formatBrewTime(recipe.brewTimeSeconds)}</p>
          </div>
        )}
      </div>

      {/* Steps */}
      {recipe.steps.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-bangers text-xl text-foreground">Steps</h2>
          <ol className="space-y-3">
            {recipe.steps.map((step, index) => (
              <li 
                key={index} 
                className="flex gap-3 border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))]"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <p className="text-foreground pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
