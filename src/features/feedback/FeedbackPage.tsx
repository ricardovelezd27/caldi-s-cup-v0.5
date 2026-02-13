import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { FeedbackDialog } from "./components/FeedbackDialog";

const FeedbackPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Auto-open dialog on mount
  useEffect(() => {
    const timer = setTimeout(() => setDialogOpen(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageLayout>
      <Container className="py-12 space-y-10">
        {/* About Section */}
        <section className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bangers tracking-wide">
            Who We Are
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Caldi's Cup was born from a simple frustration: coffee got complicated.
            Between exotic origins, mysterious processing methods, and endless jargon,
            finding a coffee you actually love became overwhelming. We built Caldi to
            bring clarity back to your cup — powered by AI, guided by your taste.
          </p>
          <p className="text-muted-foreground">
            We're a small team of coffee lovers and tech enthusiasts building this
            in the open. Your feedback shapes everything we do.
          </p>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={() => setDialogOpen(true)}
            className="gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Give Us Feedback
          </Button>
        </div>

        <FeedbackDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </Container>
    </PageLayout>
  );
};

export default FeedbackPage;
