import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { Container, SectionHeading, CaldiCard } from "@/components/shared";
import { APP_CONFIG } from "@/constants/app";

// Import assets
import caldiFarmer from "@/assets/characters/caldi-farmer.svg";
import caldiModern from "@/assets/characters/caldi-modern.svg";
import coffeeBagGroup from "@/assets/illustrations/coffee-bag-group.svg";
import coffeeBagSingle from "@/assets/illustrations/coffee-bag-single.svg";
import pathToClarity from "@/assets/backgrounds/path-to-clarity.svg";

const HeroSection = () => {
  return (
    <section className="relative py-8 md:py-16 overflow-hidden">
      {/* Path of Clarity Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url(${pathToClarity})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }}
      />
      
      <Container size="wide" className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center min-h-[60vh]">
          {/* Left: Farmer Caldi + Bag Group (Origin/Abundance) */}
          <div className="hidden md:flex flex-col items-center justify-center gap-4">
            <img 
              src={caldiFarmer} 
              alt="Farmer Caldi - Your coffee journey starts here" 
              className="w-48 lg:w-64 h-auto"
            />
            <img 
              src={coffeeBagGroup} 
              alt="Many coffee bags representing choice overload" 
              className="w-40 lg:w-52 h-auto"
            />
          </div>
          
          {/* Center: CTA Content */}
          <div className="text-center flex flex-col items-center justify-center py-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bangers text-foreground mb-6 leading-tight">
              {APP_CONFIG.tagline}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md font-inter">
              {APP_CONFIG.description}
            </p>
            <Button size="lg" className="text-xl font-bold">
              Discover Your Taste
            </Button>
          </div>
          
          {/* Right: Modern Caldi + Single Bag (Clarity/Destination) */}
          <div className="hidden md:flex flex-col items-center justify-center gap-4">
            <img 
              src={caldiModern} 
              alt="Modern Caldi - Your perfect coffee match" 
              className="w-48 lg:w-64 h-auto"
            />
            <img 
              src={coffeeBagSingle} 
              alt="One perfect coffee bag - your match" 
              className="w-24 lg:w-32 h-auto"
            />
          </div>
        </div>
        
        {/* Mobile: Show characters below */}
        <div className="flex md:hidden justify-center gap-8 mt-8">
          <div className="flex flex-col items-center gap-2">
            <img src={caldiFarmer} alt="Farmer Caldi" className="w-24 h-auto" />
            <img src={coffeeBagGroup} alt="Coffee bags" className="w-20 h-auto" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src={caldiModern} alt="Modern Caldi" className="w-24 h-auto" />
            <img src={coffeeBagSingle} alt="Your perfect bag" className="w-12 h-auto" />
          </div>
        </div>
      </Container>
    </section>
  );
};

const ProblemSection = () => {
  const problems = [
    {
      emoji: "😵‍💫",
      title: "Too Many Choices",
      description: "Hundreds of beans, roasts, and origins. Where do you even start?",
    },
    {
      emoji: "🤔",
      title: "Confusing Jargon",
      description: '"Bright acidity with stone fruit notes" — what does that even mean?',
    },
    {
      emoji: "😤",
      title: "Hit or Miss",
      description: "Bought a fancy bag and hated it? We've all been there.",
    },
  ];

  return (
    <section className="py-16">
      <Container>
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem) => (
            <CaldiCard key={problem.title} className="text-center">
              <div className="text-4xl mb-4">{problem.emoji}</div>
              <h3 className="text-2xl font-bangers text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-muted-foreground font-inter">
                {problem.description}
              </p>
            </CaldiCard>
          ))}
        </div>
      </Container>
    </section>
  );
};

const SolutionSection = () => {
  return (
    <section className="py-16">
      <Container size="narrow">
        <SectionHeading
          title="Caldi Makes It Simple"
          color="secondary"
          className="mb-6"
        />
        <p className="text-lg text-muted-foreground font-inter mb-8 text-center">
          Answer a few fun questions about how you like your coffee, and we'll 
          match you with beans that fit your vibe. It's like having a coffee-loving 
          friend who just <em>gets</em> you.
        </p>
        <div className="text-center">
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </Container>
    </section>
  );
};

const Index = () => {
  return (
    <PageLayout>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
    </PageLayout>
  );
};

export default Index;
