import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared";
import { Coffee, Sparkles } from "lucide-react";

const BlogPage = () => {
  return (
    <PageLayout>
      <Container className="py-16 text-center">
        <div className="max-w-lg mx-auto">
          <Coffee className="w-16 h-16 text-primary mx-auto mb-6" />

          <h1 className="font-bangers text-4xl md:text-5xl text-foreground tracking-wide mb-4">
            The Brew Log
          </h1>

          <p className="text-muted-foreground font-inter text-lg mb-3">
            Stories, tips, and rabbit holes from the world of coffee.
          </p>

          <div className="inline-flex items-center gap-2 bg-primary/10 border-2 border-primary/30 rounded-full px-5 py-2 text-sm font-inter text-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            Brewing soon — stay tuned!
          </div>
        </div>
      </Container>
    </PageLayout>
  );
};

export default BlogPage;
