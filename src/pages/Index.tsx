import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { Container, SectionHeading, CaldiCard } from "@/components/shared";
import { APP_CONFIG } from "@/constants/app";

// Import assets
import caldiFarmer from "@/assets/characters/caldi-farmer.png";
import caldiModern from "@/assets/characters/caldi-modern.png";
import caldiModernChest from "@/assets/characters/caldi-modern-chest.png";
import coffeeBagGroup from "@/assets/illustrations/coffee-bag-group.svg";
import coffeeBagSingle from "@/assets/illustrations/coffee-bag-single.svg";
import pathToClarity from "@/assets/backgrounds/path-to-clarity.svg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Path of Clarity - THE DOMINANT BACKGROUND */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${pathToClarity})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          opacity: 0.7,
        }}
      />
      
      {/* Subtle gradient overlay for text readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/30 via-transparent to-background/50" />
      
      <Container size="wide" className="relative z-10">
        {/* Desktop Layout: Visual Journey from Chaos to Clarity */}
        <div className="hidden md:grid grid-cols-5 gap-4 items-center">
          
          {/* LEFT: Farmer Caldi + Many Bags (CHAOS/ORIGIN) */}
          <div className="col-span-1 flex flex-col items-center justify-end relative">
            <div className="animate-float">
              <img 
                src={caldiFarmer} 
                alt="Farmer Caldi representing coffee origins" 
                className="w-40 lg:w-56 xl:w-64 h-auto drop-shadow-lg"
              />
            </div>
            <div className="relative -mt-4">
              <img 
                src={coffeeBagGroup} 
                alt="Many coffee bags - overwhelming choices" 
                className="w-48 lg:w-64 xl:w-72 h-auto drop-shadow-md"
              />
              {/* Visual label */}
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-bangers text-muted-foreground tracking-wider">
                TOO MANY CHOICES
              </span>
            </div>
          </div>
          
          {/* CENTER: CTA Content - Floating over the Path */}
          <div className="col-span-3 text-center flex flex-col items-center justify-center py-12">
            <div className="caldi-card-glass p-8 lg:p-12 max-w-2xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bangers text-foreground mb-6 leading-tight hero-text-shadow">
                {APP_CONFIG.tagline}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 font-inter max-w-lg mx-auto">
                {APP_CONFIG.description}
              </p>
              <Button size="lg" className="text-xl lg:text-2xl font-bold px-8 py-6 hover-scale">
                Discover Your Taste
              </Button>
            </div>
          </div>
          
          {/* RIGHT: Modern Caldi + Single Bag (CLARITY/DESTINATION) */}
          <div className="col-span-1 flex flex-col items-center justify-end relative">
            <div className="animate-float-delayed">
              <img 
                src={caldiModern} 
                alt="Modern Caldi - your coffee guide" 
                className="w-40 lg:w-56 xl:w-64 h-auto drop-shadow-lg"
              />
            </div>
            <div className="relative -mt-4">
              <img 
                src={coffeeBagSingle} 
                alt="One perfect coffee bag - your match" 
                className="w-20 lg:w-28 xl:w-32 h-auto drop-shadow-md"
              />
              {/* Visual label */}
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-bangers text-secondary tracking-wider whitespace-nowrap">
                YOUR PERFECT MATCH
              </span>
            </div>
          </div>
        </div>
        
        {/* Mobile Layout: Simplified but still tells the story */}
        <div className="flex md:hidden flex-col items-center py-8">
          {/* Hero text first on mobile */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bangers text-foreground mb-4 leading-tight hero-text-shadow">
              {APP_CONFIG.tagline}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 font-inter max-w-sm mx-auto px-4">
              {APP_CONFIG.description}
            </p>
            <Button size="lg" className="text-lg font-bold">
              Discover Your Taste
            </Button>
          </div>
          
          {/* Visual journey below */}
          <div className="flex items-end justify-center gap-6 mt-4">
            <div className="flex flex-col items-center">
              <img src={caldiFarmer} alt="Farmer Caldi" className="w-20 sm:w-24 h-auto" />
              <img src={coffeeBagGroup} alt="Many choices" className="w-24 sm:w-28 h-auto -mt-2" />
            </div>
            <div className="text-2xl text-secondary font-bangers">→</div>
            <div className="flex flex-col items-center">
              <img src={caldiModern} alt="Modern Caldi" className="w-20 sm:w-24 h-auto" />
              <img src={coffeeBagSingle} alt="Your match" className="w-10 sm:w-12 h-auto -mt-2" />
            </div>
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
      rotation: "caldi-card-rotate-left",
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
      rotation: "caldi-card-rotate-right",
    },
  ];

  return (
    <section className="py-20 bg-secondary/5">
      <Container>
        <SectionHeading
          title="Sound Familiar?"
          color="accent"
          className="mb-12"
        />
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {problems.map((problem, index) => (
            <CaldiCard 
              key={problem.title} 
              className={`text-center ${problem.rotation}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-5xl mb-4">{problem.emoji}</div>
              <h3 className="text-2xl lg:text-3xl font-bangers text-foreground mb-3">
                {problem.title}
              </h3>
              <p className="text-muted-foreground font-inter text-base lg:text-lg">
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
    <section className="py-20">
      <Container size="wide">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div className="order-2 md:order-1">
            <SectionHeading
              title="Caldi Makes It Simple"
              color="secondary"
              align="left"
              className="mb-6"
            />
            <p className="text-lg lg:text-xl text-muted-foreground font-inter mb-8">
              Answer a few fun questions about how you like your coffee, and we'll 
              match you with beans that fit your vibe. It's like having a coffee-loving 
              friend who just <em className="text-secondary font-medium not-italic">gets</em> you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="font-bold">
                Take the Quiz
              </Button>
              <Button variant="outline" size="lg" className="font-bold">
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Right: Modern Caldi as guide */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="animate-float">
                <img 
                  src={caldiModernChest} 
                  alt="Modern Caldi - your coffee guide" 
                  className="w-48 md:w-64 lg:w-80 h-auto drop-shadow-lg"
                />
              </div>
              {/* Single bag as the "prize" */}
              <div className="absolute -bottom-4 -right-4 lg:-right-8">
                <div className="caldi-card p-3 lg:p-4 bg-primary/10 border-primary">
                  <img 
                    src={coffeeBagSingle} 
                    alt="Your perfect coffee" 
                    className="w-12 lg:w-16 h-auto"
                  />
                </div>
              </div>
              {/* Speech bubble hint */}
              <div className="absolute -top-2 -left-4 lg:-left-8 caldi-card-glass px-4 py-2 rotate-[-3deg]">
                <span className="font-bangers text-secondary text-sm lg:text-base">Let's find your match!</span>
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
    <PageLayout>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
    </PageLayout>
  );
};

export default Index;
