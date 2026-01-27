import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Coffee, BookOpen, Award, HelpCircle, Leaf, Mountain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ScannedCoffee } from "../types/scanner";
import { formatAltitude } from "../types/scanner";

interface ScanResultsAccordionsProps {
  data: ScannedCoffee;
}

export function ScanResultsAccordions({ data }: ScanResultsAccordionsProps) {
  const hasSpecs = data.processingMethod || data.variety || data.altitudeMeters || data.altitude;
  const hasJargon = data.jargonExplanations && Object.keys(data.jargonExplanations).length > 0;
  const hasBrandStory = !!data.brandStory;
  const hasAwards = data.awards && data.awards.length > 0;

  return (
    <Accordion type="multiple" className="w-full" defaultValue={["specs", "jargon"]}>
      {/* Coffee Specs */}
      {hasSpecs && (
        <AccordionItem value="specs" className="border-b-2 border-border">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-secondary" />
              <span className="font-semibold">Coffee Specs</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="grid grid-cols-2 gap-3 text-muted-foreground">
              {data.processingMethod && (
                <div className="flex items-start gap-2">
                  <Leaf className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs uppercase tracking-wide text-muted-foreground block">Process</span>
                    <p className="font-medium text-foreground capitalize">{data.processingMethod}</p>
                  </div>
                </div>
              )}
              {data.variety && (
                <div>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground block">Variety</span>
                  <p className="font-medium text-foreground">{data.variety}</p>
                </div>
              )}
              {(data.altitudeMeters || data.altitude) && (
                <div className="flex items-start gap-2">
                  <Mountain className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs uppercase tracking-wide text-muted-foreground block">Altitude</span>
                    <p className="font-medium text-foreground">
                      {data.altitudeMeters ? formatAltitude(data.altitudeMeters) : data.altitude}
                    </p>
                  </div>
                </div>
              )}
              {data.cuppingScore && (
                <div>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground block">Cupping Score</span>
                  <p className="font-bangers text-xl text-primary">{data.cuppingScore}</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Awards & Certifications */}
      {hasAwards && (
        <AccordionItem value="awards" className="border-b-2 border-border">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-secondary" />
              <span className="font-semibold">Awards & Certifications</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="flex flex-wrap gap-2">
              {data.awards!.map((award, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {award}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Jargon Buster */}
      {hasJargon && (
        <AccordionItem value="jargon" className="border-b-2 border-border">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-secondary" />
              <span className="font-semibold">Jargon Buster</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-3">
              {Object.entries(data.jargonExplanations!).map(([term, explanation]) => (
                <div key={term} className="border-l-2 border-secondary pl-3">
                  <dt className="font-semibold text-foreground">{term}</dt>
                  <dd className="text-sm text-muted-foreground mt-0.5">{explanation}</dd>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Brand Story */}
      {hasBrandStory && (
        <AccordionItem value="story" className="border-b-2 border-border">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" />
              <span className="font-semibold">About the Roaster</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <p className="text-muted-foreground leading-relaxed">
              {data.brandStory}
            </p>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
