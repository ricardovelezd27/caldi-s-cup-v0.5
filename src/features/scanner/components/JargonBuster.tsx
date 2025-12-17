import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface JargonBusterProps {
  explanations: Record<string, string>;
}

export function JargonBuster({ explanations }: JargonBusterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const terms = Object.entries(explanations);

  if (terms.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between p-0 h-auto hover:bg-transparent"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-secondary" />
            <span className="text-sm font-bold text-foreground">
              Jargon Buster
            </span>
            <span className="text-xs text-muted-foreground">
              ({terms.length} terms)
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-3 space-y-3">
        {terms.map(([term, explanation]) => (
          <div 
            key={term}
            className="bg-muted/50 rounded-lg p-3 border border-border"
          >
            <dt className="font-bold text-sm text-foreground mb-1">
              {term}
            </dt>
            <dd className="text-xs text-muted-foreground leading-relaxed">
              {explanation}
            </dd>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
