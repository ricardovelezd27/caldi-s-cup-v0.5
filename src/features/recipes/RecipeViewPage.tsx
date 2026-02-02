import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Globe, Lock } from "lucide-react";
import { toast } from "sonner";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ROUTES } from "@/constants/app";
import { RecipeDetail } from "./components";
import { useRecipe, useDeleteRecipe } from "./services";
import { useAuth } from "@/contexts/auth";

export function RecipeViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: recipe, isLoading, error } = useRecipe(id);
  const deleteMutation = useDeleteRecipe();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isOwner = user?.id === recipe?.userId;

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Recipe deleted");
      navigate(ROUTES.recipes);
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      toast.error("Failed to delete recipe");
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container max-w-3xl py-8 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64" />
        </div>
      </PageLayout>
    );
  }

  if (error || !recipe) {
    return (
      <PageLayout>
        <div className="container max-w-3xl py-8 text-center">
          <h1 className="font-bangers text-2xl text-foreground mb-4">
            Recipe Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            This recipe may have been deleted or you don't have access.
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
      <div className="container max-w-3xl py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            {recipe.isPublic ? (
              <div className="flex items-center gap-1 text-sm text-secondary">
                <Globe className="w-4 h-4" />
                <span>Public</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Private</span>
              </div>
            )}

            {isOwner && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`${ROUTES.recipes}/${id}/edit`}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{recipe.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        {/* Recipe Content */}
        <div className="border-4 border-border rounded-lg p-6 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card">
          <RecipeDetail recipe={recipe} />
        </div>
      </div>
    </PageLayout>
  );
}
