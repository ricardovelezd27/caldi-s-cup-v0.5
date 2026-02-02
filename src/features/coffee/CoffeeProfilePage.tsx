import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared";
import { CoffeeProfile } from "./components/CoffeeProfile";
import { CoffeeActions } from "./components/CoffeeActions";
import { useCoffee } from "./hooks/useCoffee";

/**
 * Unified Coffee Profile Page - displays any coffee from the master catalog.
 * Used for viewing scanned coffees, favorites, and inventory items.
 */
export function CoffeeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: coffee, isLoading, error } = useCoffee(id);

  if (isLoading) {
    return (
      <PageLayout>
        <Container className="py-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-6">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
              <div className="lg:col-span-7 space-y-6">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </Container>
      </PageLayout>
    );
  }

  if (error || !coffee) {
    return (
      <PageLayout>
        <Container className="py-6">
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
            <h1 className="font-bangers text-3xl text-foreground">Coffee Not Found</h1>
            <p className="text-muted-foreground">
              This coffee doesn't exist or you don't have permission to view it.
            </p>
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Container className="py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Coffee Profile */}
        <CoffeeProfile
          coffee={coffee}
          actions={<CoffeeActions coffee={coffee} />}
        />
      </Container>
    </PageLayout>
  );
}
