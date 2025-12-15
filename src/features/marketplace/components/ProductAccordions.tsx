import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText, Coffee, MessageSquare } from "lucide-react";
import type { Product } from "@/types/coffee";

interface ProductAccordionsProps {
  product: Product;
}

export const ProductAccordions = ({ product }: ProductAccordionsProps) => {
  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="description">
      {/* Description */}
      <AccordionItem value="description" className="border-b-2 border-border">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-secondary" />
            <span className="font-semibold">Description</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="space-y-4 text-muted-foreground">
            <p>{product.description}</p>
            
            {product.tastingNotes && (
              <div>
                <h4 className="font-semibold text-foreground mb-1">Tasting Notes</h4>
                <p>{product.tastingNotes}</p>
              </div>
            )}

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {product.origin && (
                <div>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Origin</span>
                  <p className="font-medium text-foreground">{product.origin}</p>
                </div>
              )}
              {product.processingMethod && (
                <div>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Process</span>
                  <p className="font-medium text-foreground capitalize">{product.processingMethod}</p>
                </div>
              )}
              {product.altitude && (
                <div>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Altitude</span>
                  <p className="font-medium text-foreground">{product.altitude}</p>
                </div>
              )}
              {product.harvest && (
                <div>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Harvest</span>
                  <p className="font-medium text-foreground">{product.harvest}</p>
                </div>
              )}
              {product.producer && (
                <div className="col-span-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Producer</span>
                  <p className="font-medium text-foreground">{product.producer}</p>
                </div>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Brewing Guide */}
      <AccordionItem value="brewing" className="border-b-2 border-border">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-secondary" />
            <span className="font-semibold">Brewing Guide</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          {product.brewingGuide ? (
            <div className="prose prose-sm text-muted-foreground max-w-none">
              {product.brewingGuide.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-3 last:mb-0">
                  {paragraph.split("**").map((part, i) => 
                    i % 2 === 1 ? (
                      <strong key={i} className="text-foreground">{part}</strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </p>
              ))}
            </div>
          ) : product.brewingTips ? (
            <p className="text-muted-foreground">{product.brewingTips}</p>
          ) : (
            <p className="text-muted-foreground italic">
              Brewing guide coming soon. Check back later for detailed brewing instructions.
            </p>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* Reviews */}
      <AccordionItem value="reviews" className="border-b-2 border-border">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-secondary" />
            <span className="font-semibold">
              Reviews ({product.reviewCount?.toLocaleString() || 0})
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="text-center py-6 text-muted-foreground">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Reviews coming soon</p>
            <p className="text-sm mt-1">
              Customer reviews will be available in a future update.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
