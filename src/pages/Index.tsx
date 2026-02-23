import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { Container, SectionHeading, CaldiCard } from "@/components/shared";
import { ROUTES } from "@/constants/app";
import { Coffee } from "lucide-react";
import { useLanguage } from "@/contexts/language";

// Import assets
import pathToClarity from "@/assets/backgrounds/path-to-clarity.svg";
import caldiScanning from "@/assets/characters/caldi-scanning.png";
import illustrationScan from "@/assets/illustrations/illustration-scan-understand.png";
import illustrationFavorites from "@/assets/illustrations/illustration-search-favorites.png";
import illustrationTribe from "@/assets/illustrations/illustration-coffee-tribe.png";

const HeroSection = () => {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden py-4 md:py-16 lg:py-20">
      {/* Path of Clarity background */}
      <div className="absolute inset-0 z-0 hero-background" style={{ backgroundImage: `url(${pathToClarity})` }} />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/30 via-transparent to-background/50" />

      <Container size="wide" className="relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column: Typography & Action */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left bg-background/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 relative">
            {/* Mobile-only mini illustration popping out above banner */}
            <img

              alt="Caldi scanning coffee"
              className="block md:hidden w-40 h-auto mx-auto -mb-6 relative z-10" src="/lovable-uploads/ae1c4319-73ba-420d-9fea-16f127a385de.png" />

            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-1.5 text-xs font-inter font-semibold tracking-wider mb-6 relative z-20">
              <Coffee className="w-4 h-4 shrink-0" />
              {t("hero.badge")}
            </span>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bangers leading-tight mb-4">
              <span className="text-foreground">{t("hero.headlinePart1")}</span>
              <span className="text-foreground relative inline-block">
                {t("hero.headlineCrossed")}
                <span className="absolute left-0 top-1/2 h-[6px] bg-accent animate-strikethrough" />
              </span>
              <br />
              <span className="text-secondary">{t("hero.headlinePart2")}</span>
            </h1>

            {/* Body text */}
            <p className="text-lg lg:text-xl text-muted-foreground font-inter max-w-md mb-8">
              {t("hero.body")}
            </p>

            {/* CTA row */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
              <Button size="lg" className="text-xl font-bangers px-8 py-6 tracking-wide w-full md:w-auto" asChild>
                <Link to={ROUTES.scanner}>{t("hero.cta")}</Link>
              </Button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-foreground hover:text-secondary font-inter text-sm font-medium underline underline-offset-4 transition-colors">

                {t("hero.ctaSecondary")}
              </button>
            </div>
          </div>

          {/* Right Column: Illustration (desktop only) */}
          <div className="relative hidden md:flex justify-center items-center">
            {/* Speech bubble */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 animate-float">
              <div className="relative bg-background rounded-2xl border-2 border-secondary/30 px-5 py-3 shadow-md">
                <p className="text-secondary font-bangers text-lg">{t("hero.speechBubble")}</p>
                {/* Bubble tail */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-background border-b-2 border-r-2 border-secondary/30 rotate-45" />
              </div>
            </div>

            {/* Character illustration */}
            <img

              alt="Caldi scanning coffee illustration"
              className="w-full max-w-full mt-8 drop-shadow-lg" src="/lovable-uploads/cd9c31ea-b898-492f-8c53-4d5bc1e7afd2.png" />

          </div>
        </div>
      </Container>
    </section>);

};

const FeaturesSection = () => {
  const { t } = useLanguage();
  const features = [
  {
    image: illustrationScan,
    title: t("features.scan.title"),
    description: t("features.scan.description")
  },
  {
    image: illustrationFavorites,
    title: t("features.favorites.title"),
    description: t("features.favorites.description")
  },
  {
    image: illustrationTribe,
    title: t("features.tribe.title"),
    description: t("features.tribe.description")
  }];


  return (
    <section id="features" className="py-16 md:py-20 bg-secondary/5 scroll-mt-16">
      <Container>
        <SectionHeading title={t("features.sectionTitle")} color="secondary" className="mb-12" />
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) =>
          <CaldiCard key={feature.title} className="text-center px-4" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex justify-center mb-4">
                <img src={feature.image} alt={feature.title} className="w-40 h-32 object-contain" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bangers text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground font-inter text-base lg:text-lg">{feature.description}</p>
            </CaldiCard>
          )}
        </div>
      </Container>
    </section>);

};

const CTASection = () => {
  const { t } = useLanguage();
  return (
    <section className="py-16 md:py-24">
      <Container className="flex justify-center">
        <Button size="lg" className="text-2xl md:text-3xl font-bangers px-12 py-8 tracking-wide" asChild>
          <Link to={ROUTES.scanner}>{t("hero.cta")}</Link>
        </Button>
      </Container>
    </section>);

};

const Index = () => {
  return (
    <PageLayout heroHasLogo>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </PageLayout>);

};

export default Index;