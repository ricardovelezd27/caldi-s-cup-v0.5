import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bangers text-foreground mb-6">
            Find Your Perfect Coffee
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto font-inter">
            No more guessing. No more jargon. Take our quick quiz and discover 
            coffees that match your unique taste.
          </p>
          <Button size="lg" className="text-xl font-bold">
            Discover Your Taste
          </Button>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="caldi-card p-6 text-center">
            <div className="text-4xl mb-4">😵‍💫</div>
            <h3 className="text-2xl font-bangers text-foreground mb-2">Too Many Choices</h3>
            <p className="text-muted-foreground font-inter">
              Hundreds of beans, roasts, and origins. Where do you even start?
            </p>
          </div>
          <div className="caldi-card p-6 text-center">
            <div className="text-4xl mb-4">🤔</div>
            <h3 className="text-2xl font-bangers text-foreground mb-2">Confusing Jargon</h3>
            <p className="text-muted-foreground font-inter">
              "Bright acidity with stone fruit notes" — what does that even mean?
            </p>
          </div>
          <div className="caldi-card p-6 text-center">
            <div className="text-4xl mb-4">😤</div>
            <h3 className="text-2xl font-bangers text-foreground mb-2">Hit or Miss</h3>
            <p className="text-muted-foreground font-inter">
              Bought a fancy bag and hated it? We've all been there.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Statement */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bangers text-secondary mb-6">
            Caldi Makes It Simple
          </h2>
          <p className="text-lg text-muted-foreground font-inter mb-8">
            Answer a few fun questions about how you like your coffee, and we'll 
            match you with beans that fit your vibe. It's like having a coffee-loving 
            friend who just <em>gets</em> you.
          </p>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t-4 border-border mt-16">
        <div className="text-center">
          <p className="text-muted-foreground font-inter">
            © 2024 Caldi's Cup. Brewed with love.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;