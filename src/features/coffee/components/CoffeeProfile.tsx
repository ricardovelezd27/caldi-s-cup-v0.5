import { ReactNode } from "react";
import { Accordion } from "@/components/ui/accordion";
import type { Coffee, CoffeeScanMeta } from "../types";
import { CoffeeImage } from "./CoffeeImage";
import { CoffeeInfo } from "./CoffeeInfo";
import { CoffeeAttributes } from "./CoffeeAttributes";
import { CoffeeFlavorNotes } from "./CoffeeFlavorNotes";
import { CoffeeDescription } from "./CoffeeDescription";
import { CoffeeScanMatch } from "./CoffeeScanMatch";
import { CoffeeJargonBuster } from "./CoffeeJargonBuster";

interface CoffeeProfileProps {
  /** The coffee data to display */
  coffee: Coffee;
  /** Optional scan metadata (for scan results view) */
  scanMeta?: CoffeeScanMeta;
  /** Whether this is a newly discovered coffee (shows badge) */
  isNewCoffee?: boolean;
  /** Contextual actions (add to cart, add to inventory, etc.) */
  actions?: ReactNode;
  /** Additional content to display in accordions */
  accordionContent?: ReactNode;
}

/**
 * Unified CoffeeProfile component - single source of truth for coffee display.
 * Used across scanner results, marketplace product page, inventory, and favorites.
 */
export function CoffeeProfile({
  coffee,
  scanMeta,
  isNewCoffee = false,
  actions,
  accordionContent,
}: CoffeeProfileProps) {
  const hasAccordionContent = scanMeta || accordionContent || coffee.description;

  return (
    <div className="space-y-6">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image, Attributes, Flavor Notes */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Coffee Image - order-1 on all */}
          <div className="order-1">
            <CoffeeImage
              src={coffee.imageUrl}
              alt={coffee.name}
            />
          </div>

          {/* Coffee Info - Mobile/Tablet only, order-2 */}
          <div className="order-2 lg:hidden">
            <CoffeeInfo coffee={coffee} isNewCoffee={isNewCoffee} />
          </div>

          {/* Actions - Mobile/Tablet only, order-3 */}
          {actions && (
            <div className="order-3 lg:hidden">
              {actions}
            </div>
          )}

          {/* Attribute Sliders - order-4 mobile, order-2 desktop */}
          <div className="order-4 lg:order-2">
            <CoffeeAttributes coffee={coffee} />
          </div>

          {/* Match Card - Mobile/Tablet only, order-5 */}
          {scanMeta && (
            <div className="order-5 lg:hidden">
              <CoffeeScanMatch scanMeta={scanMeta} />
            </div>
          )}

          {/* Flavor Notes - order-6 mobile, order-3 desktop */}
          <div className="order-6 lg:order-3">
            <CoffeeFlavorNotes coffee={coffee} />
          </div>

          {/* Accordions - Mobile/Tablet only, order-7 */}
          {hasAccordionContent && (
            <div className="order-7 lg:hidden border-4 border-border rounded-lg px-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                {coffee.description && (
                  <CoffeeDescription coffee={coffee} />
                )}
                {scanMeta && <CoffeeJargonBuster scanMeta={scanMeta} />}
                {accordionContent}
              </Accordion>
            </div>
          )}
        </div>

        {/* Right Column: Info, Actions, Match, Accordions - Desktop only */}
        <div className="hidden lg:flex lg:col-span-7 flex-col gap-6">
          {/* Coffee Info */}
          <CoffeeInfo coffee={coffee} isNewCoffee={isNewCoffee} />

          {/* Actions */}
          {actions}

          {/* Match Score (scan results only) */}
          {scanMeta && <CoffeeScanMatch scanMeta={scanMeta} />}

          {/* Accordions */}
          {hasAccordionContent && (
            <div className="border-4 border-border rounded-lg px-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                {coffee.description && (
                  <CoffeeDescription coffee={coffee} />
                )}
                {scanMeta && <CoffeeJargonBuster scanMeta={scanMeta} />}
                {accordionContent}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
