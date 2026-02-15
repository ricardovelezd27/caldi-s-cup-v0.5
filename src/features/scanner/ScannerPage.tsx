import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ScanLine, PenLine } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useCoffeeScanner } from "./hooks/useCoffeeScanner";
import { ScanUploader, ScanningTips, ScanProgress, TribeScannerPreview, ManualAddForm } from "./components";
import { transformToCoffee, extractScanMeta } from "./utils/transformScanData";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared";
import { FeedbackCTA } from "@/components/shared/FeedbackCTA";

export function ScannerPage() {
  const { user, profile } = useAuth();
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

  const imageBase64Ref = useRef<string | null>(null);

  // Navigate to coffee profile page on scan completion
  useEffect(() => {
    if (isComplete && scanResult) {
      const coffee = transformToCoffee(scanResult);
      const scanMeta = extractScanMeta(scanResult);
      const isNewCoffee = scanResult.isNewCoffee ?? false;
      const coffeeId = scanResult.coffeeId || scanResult.id;

      // If no image URL from backend (anonymous), use the original base64
      let isTemporaryImage = false;
      if (!coffee.imageUrl && imageBase64Ref.current) {
        const base64 = imageBase64Ref.current;
        coffee.imageUrl = base64.startsWith("data:") ? base64 : `data:image/jpeg;base64,${base64}`;
        isTemporaryImage = true;
      }

      navigate(`/coffee/${coffeeId}`, {
        state: { coffee, scanMeta, isNewCoffee, isTemporaryImage },
        replace: true,
      });
    }
  }, [isComplete, scanResult, navigate]);

  const handleImageSelected = (imageBase64: string) => {
    imageBase64Ref.current = imageBase64;
    scanCoffee(imageBase64);
  };

  return (
    <PageLayout compactFooter>
      <Container className="py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="font-bangers text-3xl md:text-4xl text-foreground">
            Coffee Scanner
          </h1>
          <p className="text-muted-foreground mt-1">
            Scan a coffee bag or add one manually
          </p>
        </div>

        <Tabs defaultValue="scan" className="space-y-6">
          <TabsList className="w-full max-w-xs">
            <TabsTrigger value="scan" className="flex-1 gap-1.5">
              <ScanLine className="h-4 w-4" />
              Scan
            </TabsTrigger>
            {user && (
              <TabsTrigger value="manual" className="flex-1 gap-1.5">
                <PenLine className="h-4 w-4" />
                Add Manually
              </TabsTrigger>
            )}
          </TabsList>

          {/* ===== SCAN TAB ===== */}
          <TabsContent value="scan" className="space-y-8">
            {/* No Tribe Warning */}
            {user && !profile?.coffee_tribe && (
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
                {profile?.coffee_tribe && (
                  <TribeScannerPreview tribe={profile.coffee_tribe} />
                )}
                <div className="max-w-xl mx-auto">
                  <ScanUploader 
                    onImageSelected={handleImageSelected}
                    disabled={isScanning}
                  />
                </div>
                <ScanningTips tribe={profile?.coffee_tribe} />
              </div>
            )}
          </TabsContent>

          {/* ===== MANUAL ADD TAB ===== */}
          {user && (
            <TabsContent value="manual">
              <ManualAddForm />
            </TabsContent>
          )}
        </Tabs>

        <div className="mt-12">
          <FeedbackCTA />
        </div>
      </Container>
    </PageLayout>
  );
}
