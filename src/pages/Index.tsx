import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { Container, SectionHeading, CaldiCard } from "@/components/shared";
import { APP_CONFIG, ROUTES } from "@/constants/app";
import { ChevronDown, Camera, Heart, Sparkles } from "lucide-react";

// Import assets
import pathToClarity from "@/assets/backgrounds/path-to-clarity.svg";

const HeroSection = () => {
  return (
    <section className="relative flex flex-col overflow-hidden pb-8">
      {/* Path of Clarity - THE DOMINANT BACKGROUND */}
      <div className="absolute inset-0 z-0 hero-background" style={{ backgroundImage: `url(${pathToClarity})` }} />

      {/* Subtle gradient overlay for text readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/30 via-transparent to-background/50" />

      <Container size="wide" className="relative z-10">
        {/* Desktop Layout: Centered Content */}
        <div className="hidden md:flex justify-center">
          <div className="text-center flex flex-col items-center py-6">
            <div className="caldi-card-glass p-4 lg:p-6 max-w-2xl">
              <img
                alt="Caldi's Cup"
                className="h-28 lg:h-36 mx-auto mb-4"
                src="/lovable-uploads/7b48f6d9-16e6-4b03-9ae7-ab7dbbf294c3.png"
              />
              <h1 className="text-3xl lg:text-4xl font-bangers mb-3 leading-tight hero-text-shadow">
                <span className="text-foreground">Coffee got complicated.</span>
                <br />
                <span className="text-secondary">Caldi brings it back to clarity.</span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-4 font-inter max-w-lg mx-auto">
                {APP_CONFIG.description}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden flex-col items-center py-4">
          <div className="text-center bg-background/90 backdrop-blur-sm rounded-2xl p-4 mx-4 border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
            <img
              alt="Caldi's Cup"
              className="h-30 sm:h-34 mx-auto mb-2"
              src="/lovable-uploads/024919ae-9240-42e9-ab0f-5a6c8fedeaf5.png"
            />
            <h1 className="text-2xl sm:text-3xl font-bangers mb-2 leading-tight">
              <span className="text-foreground">Coffee got complicated.</span>
              <br />
              <span className="text-secondary">Caldi brings it back to clarity.</span>
            </h1>
          </div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <div className="flex justify-center mt-4">
        <div className="flex flex-col items-center">
          <ChevronDown className="w-6 h-6 text-foreground" />
          <ChevronDown className="w-6 h-6 text-foreground/50 -mt-3" />
        </div>
      </div>
    </section>
  );
};

const features = [
  {
    icon: Camera,
    title: "Scan & Understand Any Coffee",
    description:
      "Snap a photo of the bag and instantly decode what makes it special: flavor notes, origin story, and all that confusing jargon translated into plain English.",
  },
  {
    icon: Heart,
    title: "Never Forget a Great Coffee",
    description:
      "Trying samples at a fair or exploring cafés in your city? Save every coffee you discover so you can remember what you loved and actually find it again later.",
  },
  {
    icon: Sparkles,
    title: "Find Your Coffee Tribe",
    description:
      "Skip the intimidating jargon. Answer a few fun questions about how you like your mornings, and we'll match you to your perfect coffee personality, no expertise required.",
  },
] as const;

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-20 bg-secondary/5">
      <Container>
        <SectionHeading title="What Caldi Does For You" color="secondary" className="mb-12" />
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <CaldiCard key={feature.title} className="text-center px-4" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bangers text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground font-inter text-base lg:text-lg">{feature.description}</p>
            </CaldiCard>
          ))}
        </div>
      </Container>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-16 md:py-24">
      <Container className="flex justify-center">
        <Button size="lg" className="text-2xl md:text-3xl font-bangers px-12 py-8 tracking-wide" asChild>
          <Link to={ROUTES.quiz}>Give Caldi a Try!</Link>
        </Button>
      </Container>
    </section>
  );
};

const Index = () => {
  return (
    <PageLayout heroHasLogo>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </PageLayout>
  );
};

export default Index;
