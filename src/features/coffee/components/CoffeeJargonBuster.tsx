import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { CoffeeScanMeta } from "../types";

interface CoffeeJargonBusterProps {
  scanMeta: CoffeeScanMeta;
}

export function CoffeeJargonBuster({ scanMeta }: CoffeeJargonBusterProps) {
  const jargonEntries = Object.entries(scanMeta.jargonExplanations);

  if (jargonEntries.length === 0) {
    return null;
  }

  return (
    <AccordionItem value="jargon" className="border-b-0">
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <span className="font-bangers text-lg tracking-wide">
            Jargon Buster
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        <div className="space-y-3">
          {jargonEntries.map(([term, explanation]) => (
            <div key={term} className="space-y-1">
              <dt className="font-medium text-foreground capitalize">
                {term}
              </dt>
              <dd className="text-sm text-muted-foreground pl-4 border-l-2 border-secondary">
                {explanation}
              </dd>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
