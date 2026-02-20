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
        {/* Left Column: Image + Roaster info (About This Coffee) */}
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

          {/* Mobile-only: Match Score */}
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

          {/* Mobile-only: Attributes */}
          <div className="order-5 lg:hidden">
            <CoffeeAttributes
              coffee={coffee}
              rating={rating}
              isAuthenticated={isAuthenticated}
              onRatingChange={updateField}
            />
          </div>

          {/* About This Coffee + Jargon — order-6 mobile, order-2 desktop (roaster info under image) */}
          <div className="order-6 lg:order-2">
            <CoffeeDescription coffee={coffee} scanMeta={scanMeta} />
          </div>

          {/* Mobile-only: Flavor Notes */}
          <div className="order-7 lg:hidden">
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

        {/* Right Column: Coffee-related info (Match Score, Attributes, Flavor Notes) */}
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
