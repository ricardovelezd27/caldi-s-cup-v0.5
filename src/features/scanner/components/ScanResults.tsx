import type { ScannedCoffee } from "../types/scanner";
import { ScanResultsImage } from "./ScanResultsImage";
import { ScanResultsInfo } from "./ScanResultsInfo";
import { ScanResultsAttributes } from "./ScanResultsAttributes";
import { ScanResultsMatch } from "./ScanResultsMatch";
import { ScanResultsFlavorNotes } from "./ScanResultsFlavorNotes";
import { ScanResultsAccordions } from "./ScanResultsAccordions";
import { ScanResultsActions } from "./ScanResultsActions";

interface ScanResultsProps {
  data: ScannedCoffee;
  onScanAgain: () => void;
}

export function ScanResults({ data, onScanAgain }: ScanResultsProps) {
  return (
    <div className="space-y-6">
      {/* Main Grid Layout - Matches Product Page structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image, Attributes, Flavor Notes */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Coffee Image - order-1 on all */}
          <div className="order-1">
            <ScanResultsImage 
              src={data.imageUrl} 
              alt={data.coffeeName || "Scanned coffee"} 
            />
          </div>

          {/* Coffee Info - Mobile/Tablet only, order-2 */}
          <div className="order-2 lg:hidden">
            <ScanResultsInfo data={data} />
          </div>

          {/* Actions - Mobile/Tablet only, order-3 */}
          <div className="order-3 lg:hidden">
            <ScanResultsActions data={data} onScanAgain={onScanAgain} />
          </div>

          {/* Attribute Sliders - order-4 mobile, order-2 desktop */}
          <div className="order-4 lg:order-2">
            <ScanResultsAttributes data={data} />
          </div>

          {/* Match Card - Mobile/Tablet only, order-5 */}
          <div className="order-5 lg:hidden">
            <ScanResultsMatch data={data} />
          </div>

          {/* Flavor Notes - order-6 mobile, order-3 desktop */}
          <div className="order-6 lg:order-3">
            <ScanResultsFlavorNotes data={data} />
          </div>

          {/* Accordions - Mobile/Tablet only, order-7 */}
          <div className="order-7 lg:hidden border-4 border-border rounded-lg px-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card overflow-hidden">
            <ScanResultsAccordions data={data} />
          </div>
        </div>

        {/* Right Column: Info, Actions, Match, Accordions - Desktop only */}
        <div className="hidden lg:flex lg:col-span-7 flex-col gap-6">
          {/* Coffee Info */}
          <ScanResultsInfo data={data} />

          {/* Actions */}
          <ScanResultsActions data={data} onScanAgain={onScanAgain} />

          {/* Match Score */}
          <ScanResultsMatch data={data} />

          {/* Accordions */}
          <div className="border-4 border-border rounded-lg px-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card overflow-hidden">
            <ScanResultsAccordions data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
