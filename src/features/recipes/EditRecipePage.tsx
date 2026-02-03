import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/app";
import { RecipeForm } from "./components";
import { useRecipe, useUpdateRecipe } from "./services";
import { useAuth } from "@/contexts/auth";
import type { RecipeFormData } from "./types/recipe";

export function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: recipe, isLoading, error } = useRecipe(id);
  const updateMutation = useUpdateRecipe();

  const isOwner = user?.id === recipe?.userId;

  const handleSubmit = async (data: RecipeFormData) => {
    if (!id) return;
    try {
      await updateMutation.mutateAsync({ id, data });
      toast.success("Recipe updated successfully!");
      navigate(`${ROUTES.recipes}/${id}`);
    } catch (error) {
      console.error("Failed to update recipe:", error);
      toast.error("Failed to update recipe. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container max-w-2xl py-8 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-96" />
        </div>
      </PageLayout>
    );
  }

  if (error || !recipe) {
    return (
      <PageLayout>
        <div className="container max-w-2xl py-8 text-center">
          <h1 className="font-bangers text-2xl text-foreground mb-4">
            Recipe Not Found
          </h1>
          <Button asChild>
            <Link to={ROUTES.recipes}>Back to Recipes</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  if (!isOwner) {
    return (
      <PageLayout>
        <div className="container max-w-2xl py-8 text-center">
          <h1 className="font-bangers text-2xl text-foreground mb-4">
            Not Authorized
          </h1>
          <p className="text-muted-foreground mb-6">
            You can only edit your own recipes.
          </p>
          <Button asChild>
            <Link to={ROUTES.recipes}>Back to Recipes</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container max-w-2xl py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bangers text-3xl text-foreground">Edit Recipe</h1>
        </div>

        {/* Form */}
        <div className="border-4 border-border rounded-lg p-6 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card">
          <RecipeForm
            initialData={{
              name: recipe.name,
              description: recipe.description ?? "",
              brewMethod: recipe.brewMethod,
              grindSize: recipe.grindSize ?? "",
              ratio: recipe.ratio ?? "",
              waterTempCelsius: recipe.waterTempCelsius ?? undefined,
              brewTimeSeconds: recipe.brewTimeSeconds ?? undefined,
              steps: recipe.steps,
              isPublic: recipe.isPublic,
              coffeeId: recipe.coffeeId ?? undefined,
            }}
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            isSubmitting={updateMutation.isPending}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </PageLayout>
  );
}
