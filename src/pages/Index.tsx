import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { Container, SectionHeading, CaldiCard } from "@/components/shared";
import { APP_CONFIG, ROUTES } from "@/constants/app";
import { Camera, Heart, Sparkles, Coffee } from "lucide-react";

// Import assets
import pathToClarity from "@/assets/backgrounds/path-to-clarity.svg";
import duoAndGoat from "@/assets/characters/ilustration_Duo_and_Goat_NoBG_1.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-12 md:py-16 lg:py-20">
      {/* Path of Clarity background */}
      <div className="absolute inset-0 z-0 hero-background" style={{ backgroundImage: `url(${pathToClarity})` }} />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/30 via-transparent to-background/50" />

      <Container size="wide" className="relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column: Typography & Action */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left bg-background/70 backdrop-blur-sm rounded-2xl p-6 md:p-8">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-1.5 text-xs font-inter font-semibold tracking-wider mb-6">
              <Coffee className="w-4 h-4" />
              AI-POWERED COFFEE DISCOVERY
            </span>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bangers leading-tight mb-4">
              <span className="text-foreground">Coffee Got </span>
              <span className="text-foreground line-through decoration-accent decoration-[6px]">Complicated</span>
              <br />
              <span className="text-secondary">Caldi Makes It Simple.</span>
            </h1>

            {/* Body text */}
            <p className="text-lg lg:text-xl text-muted-foreground font-inter max-w-md mb-8">
              {APP_CONFIG.description}
            </p>

            {/* CTA row */}
            <div className="flex items-center gap-6">
              <Button size="lg" className="text-xl font-bangers px-8 py-6 tracking-wide" asChild>
                <Link to={ROUTES.quiz}>Give Caldi AI a Try!</Link>
              </Button>
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground font-inter text-sm underline underline-offset-4 transition-colors"
              >
                How it works
              </a>
            </div>
          </div>

          {/* Right Column: Illustration */}
          <div className="relative flex justify-center items-center">
            {/* Speech bubble */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 animate-float">
              <div className="relative bg-background rounded-2xl border-2 border-secondary/30 px-5 py-3 shadow-md">
                <p className="text-secondary font-bangers text-lg whitespace-nowrap">Let's find your match!</p>
                {/* Bubble tail */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-background border-b-2 border-r-2 border-secondary/30 rotate-45" />
              </div>
            </div>

            {/* Character illustration */}
            <img
              src={duoAndGoat}
              alt="Caldi's duo and goat mascots"
              className="w-80 sm:w-96 md:w-[28rem] lg:w-[32rem] mt-12 md:mt-8 drop-shadow-lg"
            />
          </div>
        </div>
      </Container>
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
    <section id="features" className="py-16 md:py-20 bg-secondary/5 scroll-mt-16">
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
