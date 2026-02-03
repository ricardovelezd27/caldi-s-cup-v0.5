import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useCoffeeScanner } from "./hooks/useCoffeeScanner";
import { ScanUploader, ScanningTips, ScanProgress, ScanResults, TribeScannerPreview } from "./components";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared";
import { ROUTES } from "@/constants/app";

export function ScannerPage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { 
    scanCoffee, 
    scanResult, 
    progress, 
    error, 
    resetScan,
    isScanning, 
    isComplete,
    isError,
  } = useCoffeeScanner();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(ROUTES.auth, { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Show loading skeleton while auth is checking
  if (authLoading) {
    return (
      <PageLayout>
        <Container className="py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-[400px] w-full" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>
        </Container>
      </PageLayout>
    );
  }

  if (!user) {
    return null;
  }

  const handleImageSelected = (imageBase64: string) => {
    scanCoffee(imageBase64);
  };

  return (
    <PageLayout>
      <Container className="py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-bangers text-3xl md:text-4xl text-foreground">
            Coffee Scanner
          </h1>
          <p className="text-muted-foreground mt-1">
            Scan a coffee bag to discover its profile
          </p>
        </div>

        <div className="space-y-8">
          {/* No Tribe Warning */}
          {!profile?.coffee_tribe && !isComplete && (
            <Alert className="border-4 border-accent bg-accent/5">
              <AlertCircle className="h-4 w-4 text-accent" />
              <AlertTitle className="font-bangers">Take the Quiz First!</AlertTitle>
              <AlertDescription>
                For personalized match scores, complete the{" "}
                <a href="/quiz" className="text-primary hover:underline font-medium">
                  Coffee Personality Quiz
                </a>{" "}
                to discover your coffee tribe.
              </AlertDescription>
            </Alert>
          )}

          {/* Scan Complete - Show Results */}
          {isComplete && scanResult && (
            <ScanResults data={scanResult} onScanAgain={resetScan} />
          )}

          {/* Scanning in Progress */}
          {isScanning && (
            <div className="max-w-xl mx-auto">
              <ScanProgress progress={progress} />
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="max-w-xl mx-auto space-y-4">
              <Alert className="border-4 border-destructive bg-destructive/5">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertTitle className="font-bangers">Scan Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="flex justify-center">
                <Button onClick={resetScan}>Try Again</Button>
              </div>
            </div>
          )}

          {/* Initial State - Upload Zone */}
          {!isScanning && !isComplete && !isError && (
            <div className="space-y-8">
              {/* Tribe Preview (if user has tribe) */}
              {profile?.coffee_tribe && (
                <TribeScannerPreview tribe={profile.coffee_tribe} />
              )}

              {/* Upload Zone */}
              <div className="max-w-xl mx-auto">
                <ScanUploader 
                  onImageSelected={handleImageSelected}
                  disabled={isScanning}
                />
              </div>

              {/* Tribe-aware Scanning Tips */}
              <ScanningTips tribe={profile?.coffee_tribe} />
            </div>
          )}
        </div>
      </Container>
    </PageLayout>
  );
}
