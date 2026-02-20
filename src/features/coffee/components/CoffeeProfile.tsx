import { ReactNode } from "react";
import type { Coffee, CoffeeScanMeta } from "../types";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useUserCoffeeRating } from "../hooks/useUserCoffeeRating";
import { CoffeeImage } from "./CoffeeImage";
import { CoffeeInfo } from "./CoffeeInfo";
import { CoffeeAttributes } from "./CoffeeAttributes";
import { CoffeeFlavorNotes } from "./CoffeeFlavorNotes";
import { CoffeeDescription } from "./CoffeeDescription";
import { CoffeeScanMatch } from "./CoffeeScanMatch";

interface CoffeeProfileProps {
  coffee: Coffee;
  scanMeta?: CoffeeScanMeta;
  isNewCoffee?: boolean;
  actions?: ReactNode;
  accordionContent?: ReactNode;
  isTemporaryImage?: boolean;
  additionalImages?: string[];
}

/**
 * Unified CoffeeProfile component - single source of truth for coffee display.
 * Section order: Info → Attributes → Match Score → About/Jargon → Flavor Notes
 */
export function CoffeeProfile({
  coffee,
  scanMeta,
  isNewCoffee = false,
  actions,
  accordionContent,
  isTemporaryImage = false,
  additionalImages,
}: CoffeeProfileProps) {
  const { profile } = useAuth();
  const { rating, updateField, isAuthenticated } = useUserCoffeeRating(coffee.id);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image, then stacked sections on desktop */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Image — always first */}
          <div className="order-1">
            <CoffeeImage
              src={coffee.imageUrl}
              alt={coffee.name}
              isTemporaryImage={isTemporaryImage}
              additionalImages={additionalImages}
            />
          </div>

          {/* Mobile-only: Coffee Info */}
          <div className="order-2 lg:hidden">
            <CoffeeInfo coffee={coffee} isNewCoffee={isNewCoffee} />
          </div>

          {/* Mobile-only: Actions */}
          {actions && (
            <div className="order-3 lg:hidden">{actions}</div>
          )}

          {/* Mobile-only: Match Score — order-4 mobile */}
          {scanMeta && (
            <div className="order-4 lg:hidden">
              <CoffeeScanMatch
                scanMeta={scanMeta}
                tribe={profile?.coffee_tribe ?? null}
                userMatchScore={rating.userMatchScore}
                isAuthenticated={isAuthenticated}
                onUserMatchChange={(v) => updateField("userMatchScore", v)}
              />
            </div>
          )}

          {/* Attributes — order-5 mobile, order-2 desktop */}
          <div className="order-5 lg:order-2">
            <CoffeeAttributes
              coffee={coffee}
              rating={rating}
              isAuthenticated={isAuthenticated}
              onRatingChange={updateField}
            />
          </div>

          {/* Mobile-only: About This Coffee + Jargon */}
          <div className="order-6 lg:hidden">
            <CoffeeDescription coffee={coffee} scanMeta={scanMeta} />
          </div>

          {/* Flavor Notes — order-7 mobile, order-3 desktop */}
          <div className="order-7 lg:order-3">
            <CoffeeFlavorNotes
              coffee={coffee}
              isAuthenticated={isAuthenticated}
              userFlavorNotes={rating.userFlavorNotes.length > 0 ? rating.userFlavorNotes : undefined}
              onUserFlavorNotesChange={(notes) => updateField("userFlavorNotes", notes)}
            />
          </div>

          {/* Mobile-only: extra accordion content */}
          {accordionContent && (
            <div className="order-8 lg:hidden">{accordionContent}</div>
          )}
        </div>

        {/* Right Column: Desktop only */}
        <div className="hidden lg:flex lg:col-span-7 flex-col gap-6">
          <CoffeeInfo coffee={coffee} isNewCoffee={isNewCoffee} />

          {actions}

          {scanMeta && (
            <CoffeeScanMatch
              scanMeta={scanMeta}
              tribe={profile?.coffee_tribe ?? null}
              userMatchScore={rating.userMatchScore}
              isAuthenticated={isAuthenticated}
              onUserMatchChange={(v) => updateField("userMatchScore", v)}
            />
          )}

          <CoffeeAttributes
            coffee={coffee}
            rating={rating}
            isAuthenticated={isAuthenticated}
            onRatingChange={updateField}
          />

          <CoffeeDescription coffee={coffee} scanMeta={scanMeta} />

          <CoffeeFlavorNotes
            coffee={coffee}
            isAuthenticated={isAuthenticated}
            userFlavorNotes={rating.userFlavorNotes.length > 0 ? rating.userFlavorNotes : undefined}
            onUserFlavorNotesChange={(notes) => updateField("userFlavorNotes", notes)}
          />

          {accordionContent}
        </div>
      </div>
    </div>
  );
}
