import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RefreshCw, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/language";

export function RetakeQuizSection() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleRetake = () => {
    try {
      localStorage.removeItem("caldi_quiz_result");
      localStorage.removeItem("caldi_quiz_state");
    } catch {
      // Ignore
    }
    navigate("/quiz");
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full text-left text-lg font-medium hover:text-primary transition-colors py-2">
        <RefreshCw className="h-5 w-5" />
        {t("profile.retakeQuiz")}
        <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="space-y-3 pt-4">
          <p className="text-sm text-muted-foreground">
            {t("profile.retakeDesc")}
          </p>
          <Button variant="outline" onClick={handleRetake}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("profile.startQuizAgain")}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
