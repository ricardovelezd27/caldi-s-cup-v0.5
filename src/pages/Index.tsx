import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { Container, SectionHeading, CaldiCard } from "@/components/shared";
import { APP_CONFIG } from "@/constants/app";
import { ChevronDown } from "lucide-react";

// Import assets
import caldiModernChest from "@/assets/characters/caldi-modern-chest.png";
import pathToClarity from "@/assets/backgrounds/path-to-clarity.svg";
import logo from "@/assets/logo.svg";
const HeroSection = () => {
  return (
    <section className="relative flex flex-col overflow-hidden pb-8">
      {/* Path of Clarity - THE DOMINANT BACKGROUND */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${pathToClarity})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          opacity: 0.7,
        }}
      />

      {/* Subtle gradient overlay for text readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/30 via-transparent to-background/50" />

      <Container size="wide" className="relative z-10">
        {/* Desktop Layout: Centered Content */}
        <div className="hidden md:flex justify-center">
          <div className="text-center flex flex-col items-center py-6">
            <div className="caldi-card-glass p-4 lg:p-6 max-w-2xl">
              {/* Big centered logo */}
              <img
                alt="Caldi's Cup"
                src="/lovable-uploads/9a1c8ca1-fc3b-47c6-b890-a494d5153e05.png"
                className="h-28 lg:h-36 mx-auto mb-4"
              />
              <h1 className="text-3xl md:text-3xl lg:text-3xl xl:text-3xl font-bangers text-foreground mb-3 leading-tight hero-text-shadow">
                {APP_CONFIG.tagline}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-4 font-inter max-w-lg mx-auto">
                {APP_CONFIG.description}
              </p>
              <Button size="lg" className="text-xl lg:text-2xl font-bold px-8 py-6">
                Give Caldi AI a try!
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Layout - improved contrast */}
        <div className="flex md:hidden flex-col items-center py-4">
          <div className="text-center bg-background/90 backdrop-blur-sm rounded-2xl p-4 mx-4 border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
            {/* Big centered logo */}
            <img src={logo} alt="Caldi's Cup" className="h-30 sm:h-34 mx-auto mb-2" />
            <h1 className="text-2xl sm:text-3xl font-bangers text-foreground mb-2 leading-tight">
              {APP_CONFIG.tagline}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-4 font-inter max-w-sm mx-auto">
              {APP_CONFIG.description}
            </p>
            <Button size="lg" className="text-lg font-bold">
              Give Caldi AI a try!
            </Button>
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
const ProblemSection = () => {
  const problems = [
    {
      emoji: "😵‍💫",
      title: "Too Many Choices",
      description: "Hundreds of beans, roasts, and origins. Where do you even start?",
      rotation: "",
    },
    {
      emoji: "🤔",
      title: "Confusing Jargon",
      description: '"Bright acidity with stone fruit notes" — what does that even mean?',
      rotation: "",
    },
    {
      emoji: "😤",
      title: "Hit or Miss",
      description: "Bought a fancy bag and hated it? We've all been there.",
      rotation: "",
    },
  ];
  return (
    <section className="py-20 bg-secondary/5">
      <Container>
        <SectionHeading title="Does this sound familiar?" color="accent" className="mb-12" />
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {problems.map((problem, index) => (
            <CaldiCard
              key={problem.title}
              className={`text-center ${problem.rotation}`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="text-5xl mb-4">{problem.emoji}</div>
              <h3 className="text-2xl lg:text-3xl font-bangers text-foreground mb-3">{problem.title}</h3>
              <p className="text-muted-foreground font-inter text-base lg:text-lg">{problem.description}</p>
            </CaldiCard>
          ))}
        </div>
      </Container>
    </section>
  );
};
const SolutionSection = () => {
  return (
    <section className="py-20">
      <Container size="wide">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div className="order-2 md:order-1">
            <SectionHeading title="Caldi Makes It Simple" color="secondary" align="left" className="mb-6" />
            <p className="text-lg lg:text-xl text-muted-foreground font-inter mb-8">
              Answer a few fun questions about how you like your coffee, and we'll match you with beans that fit your
              vibe. It's like having a coffee-loving friend who just{" "}
              <em className="text-secondary font-medium not-italic">gets</em> you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="font-bold">
                Give Caldi AI a try!
              </Button>
              <Button variant="outline" size="lg" className="font-bold">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right: Modern Caldi as guide */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <img
                src={caldiModernChest}
                alt="Modern Caldi - your coffee guide"
                className="w-96 md:w-[32rem] lg:w-[40rem] h-auto drop-shadow-lg"
              />
              {/* Single bag as the "prize" */}
              {/* Speech bubble callout - positioned above character */}
              <div className="absolute -top-16 sm:-top-20 left-1/2 -translate-x-1/2 bg-background border-4 border-foreground rounded-2xl px-4 py-2 sm:py-3 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] whitespace-nowrap z-10">
                <span className="font-bangers text-secondary text-base sm:text-lg lg:text-xl">
                  "Let's find your match!"
                </span>
                {/* Speech bubble tail - centered pointing down */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-foreground"></div>
                <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-background"></div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
const Index = () => {
  return (
    <PageLayout heroHasLogo>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
    </PageLayout>
  );
};
export default Index;
