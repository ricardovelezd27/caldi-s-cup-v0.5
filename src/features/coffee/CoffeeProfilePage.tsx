import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared";
import { CoffeeProfile } from "./components/CoffeeProfile";
import { CoffeeActions } from "./components/CoffeeActions";
import { useCoffee } from "./hooks/useCoffee";
import { useCoffeeScanMeta } from "./hooks/useCoffeeScanMeta";
import type { Coffee, CoffeeScanMeta } from "./types";

interface CoffeeRouteState {
  coffee?: Coffee;
  scanMeta?: CoffeeScanMeta;
  isNewCoffee?: boolean;
}

/**
 * Unified Coffee Profile Page - single source of truth for all coffee display.
 * Accepts data via route state (from scanner) or fetches from DB (direct URL).
 * Always fetches latest scan metadata so match score & jargon are shown consistently.
 */
export function CoffeeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Route state from scanner navigation
  const routeState = (location.state as CoffeeRouteState) ?? {};
  const hasScanData = !!routeState.coffee;

  // Only fetch from DB if no route state was provided
  const { data: fetchedCoffee, isLoading, error } = useCoffee(hasScanData ? undefined : id);

  // Always fetch scan meta from DB if not provided via route state
  const { data: fetchedScanMeta } = useCoffeeScanMeta(id, !!routeState.scanMeta);

  const coffee = routeState.coffee ?? fetchedCoffee;
  const scanMeta = routeState.scanMeta ?? fetchedScanMeta ?? undefined;
  const isNewCoffee = routeState.isNewCoffee ?? false;

  if (!hasScanData && isLoading) {
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
          onClick={() => navigate(scanMeta ? "/scanner" : -1 as any)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {scanMeta ? "Back to Scanner" : "Back"}
        </Button>

        {/* Coffee Profile */}
        <CoffeeProfile
          coffee={coffee}
          scanMeta={scanMeta}
          isNewCoffee={isNewCoffee}
          actions={
            <CoffeeActions
              coffee={coffee}
              scanMeta={scanMeta}
              onScanAgain={scanMeta ? () => navigate("/scanner") : undefined}
            />
          }
        />
      </Container>
    </PageLayout>
  );
}
