import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, BookOpen, Users } from "lucide-react";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/app";
import { RecipeGrid } from "./components";
import { useMyRecipes, usePublicRecipes } from "./services";

export function RecipesPage() {
  const [activeTab, setActiveTab] = useState("my-recipes");
  
  const { data: myRecipes, isLoading: loadingMy } = useMyRecipes();
  const { data: publicRecipes, isLoading: loadingPublic } = usePublicRecipes({ limit: 20 });

  return (
    <PageLayout>
      <div className="container max-w-6xl py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-bangers text-4xl text-foreground">Recipes</h1>
            <p className="text-muted-foreground mt-1">
              Create, save, and share your favorite brewing methods
            </p>
          </div>
          <Button asChild>
            <Link to={`${ROUTES.recipes}/new`}>
              <Plus className="w-4 h-4 mr-2" />
              New Recipe
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="my-recipes" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              My Recipes
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-recipes" className="mt-6">
            {loadingMy ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : (
              <RecipeGrid
                recipes={myRecipes ?? []}
                emptyMessage="You haven't created any recipes yet. Start by creating your first one!"
              />
            )}
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            {loadingPublic ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : (
              <RecipeGrid
                recipes={publicRecipes ?? []}
                emptyMessage="No public recipes yet. Be the first to share one!"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
