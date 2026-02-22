import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ScanLine, PenLine, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import { useCoffeeScanner } from "./hooks/useCoffeeScanner";
import { ScanUploader, ScanningTips, ScanProgress, TribeScannerPreview, ManualAddForm } from "./components";
import { transformToCoffee, extractScanMeta } from "./utils/transformScanData";
import { stitchImages } from "./utils/stitchImages";
import { uploadScanImages } from "./utils/uploadScanImages";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared";
import { FeedbackCTA } from "@/components/shared/FeedbackCTA";

type ScannerTab = "scan" | "manual";

export function ScannerPage() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ScannerTab>("scan");
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

  const individualImagesRef = useRef<string[]>([]);
  const [isStitching, setIsStitching] = useState(false);

  // Navigate to coffee profile page on scan completion
  useEffect(() => {
    if (isComplete && scanResult) {
      const coffee = transformToCoffee(scanResult);
      const scanMeta = extractScanMeta(scanResult);
      const isNewCoffee = scanResult.isNewCoffee ?? false;
      const coffeeId = scanResult.coffeeId || scanResult.id;

      let isTemporaryImage = false;
      if (!coffee.imageUrl && individualImagesRef.current.length > 0) {
        const base64 = individualImagesRef.current[0];
        coffee.imageUrl = base64.startsWith("data:") ? base64 : `data:image/jpeg;base64,${base64}`;
        isTemporaryImage = true;
      }

      if (user && individualImagesRef.current.length > 1) {
        uploadScanImages(user.id, coffeeId, individualImagesRef.current);
      }

      navigate(`/coffee/${coffeeId}`, {
        state: { coffee, scanMeta, isNewCoffee, isTemporaryImage, additionalImages: individualImagesRef.current },
        replace: true,
      });
    }
  }, [isComplete, scanResult, navigate, user]);

  const handleImagesReady = async (images: string[]) => {
    individualImagesRef.current = images;

    if (images.length === 1) {
      scanCoffee(images[0]);
      return;
    }

    setIsStitching(true);
    try {
      const stitched = await stitchImages(images);
      setIsStitching(false);
      scanCoffee(stitched);
    } catch {
      setIsStitching(false);
      scanCoffee(images[0]);
    }
  };

  return (
    <PageLayout compactFooter>
      <Container className="py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="font-bangers text-3xl md:text-4xl text-foreground">
            {t("scanner.title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("scanner.subtitle")}</p>
        </div>

        {/* Pill-style mode toggle */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("scanner.modeLabel")}
          </span>
          <div className="inline-flex items-center border-2 border-border rounded-full overflow-hidden text-sm font-semibold select-none shadow-[2px_2px_0px_0px_hsl(var(--border))]">
            <button
              onClick={() => setActiveTab("scan")}
              className={`px-4 py-1.5 transition-colors flex items-center gap-1.5 ${
                activeTab === "scan"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              <ScanLine className="h-3.5 w-3.5" />
              {t("scanner.tabScan")}
            </button>
            {user && (
              <>
                <span className="text-border px-0.5">|</span>
                <button
                  onClick={() => setActiveTab("manual")}
                  className={`px-4 py-1.5 transition-colors flex items-center gap-1.5 ${
                    activeTab === "manual"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <PenLine className="h-3.5 w-3.5" />
                  {t("scanner.tabManual")}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ===== SCAN TAB ===== */}
        {activeTab === "scan" && (
          <div className="space-y-8">
            {/* No Tribe Warning */}
            {user && !profile?.coffee_tribe && (
              <Alert className="border-4 border-accent bg-accent/5">
                <AlertCircle className="h-4 w-4 text-accent" />
                <AlertTitle className="font-bangers">{t("scanner.quizWarningTitle")}</AlertTitle>
                <AlertDescription>
                  {t("scanner.quizWarningBody")}{" "}
                  <a href="/quiz" className="text-primary hover:underline font-medium">
                    {t("scanner.quizWarningLink")}
                  </a>{" "}
                  {t("scanner.quizWarningEnd")}
                </AlertDescription>
              </Alert>
            )}

            {/* Stitching in progress */}
            {isStitching && (
              <div className="max-w-xl mx-auto">
                <div className="border-4 border-dashed border-primary rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                    <h3 className="font-bangers text-2xl text-foreground mb-1">{t("scanner.stitching")}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* Scanning in Progress */}
            {isScanning && !isStitching && (
              <div className="max-w-xl mx-auto">
                <ScanProgress progress={progress} />
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="max-w-xl mx-auto space-y-4">
                <Alert className="border-4 border-destructive bg-destructive/5">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertTitle className="font-bangers">{t("scanner.scanFailedTitle")}</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="flex justify-center">
                  <Button onClick={resetScan}>{t("scanner.tryAgain")}</Button>
                </div>
              </div>
            )}

            {/* Initial State */}
            {!isScanning && !isStitching && !isComplete && !isError && (
              <div className="space-y-6">
                {profile?.coffee_tribe && (
                  <TribeScannerPreview tribe={profile.coffee_tribe} />
                )}
                <div className="max-w-xl mx-auto">
                  <ScanUploader onImagesReady={handleImagesReady} disabled={isScanning} />
                </div>
                <ScanningTips />
              </div>
            )}
          </div>
        )}

        {/* ===== MANUAL ADD TAB ===== */}
        {activeTab === "manual" && user && <ManualAddForm />}

        <div className="mt-12">
          <FeedbackCTA />
        </div>
      </Container>
    </PageLayout>
  );
}
