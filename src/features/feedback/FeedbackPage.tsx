import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/shared";
import { CaldiCard } from "@/components/shared/CaldiCard";
import { Button } from "@/components/ui/button";
import { MessageSquare, Linkedin, Instagram } from "lucide-react";
import { FeedbackDialog } from "./components/FeedbackDialog";
import { APP_CONFIG, ROUTES } from "@/constants/app";

import duoGoatImg from "@/assets/characters/ilustration_Duo_and_Goat_NoBG_1.png";
import ricardoImg from "@/assets/characters/ricardo-profile.png";

const FeedbackPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDialogOpen(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageLayout>
      <Container className="py-12 space-y-20">
        {/* 1. Hero / Intro */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-bangers tracking-wide">
              The Story Behind Your Next Great Cup
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ever stood in the coffee aisle, overwhelmed by endless options, wondering which bag
              will actually taste good tomorrow morning? That's where Caldi's Cup was born.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We help you scan any coffee bag and instantly understand what's inside. But we're
              building something bigger — tools that help you discover and enjoy coffee in your own
              way. Think of us as your AI-powered coffee companion.
            </p>
          </div>
          <div className="flex justify-center order-1 md:order-2">
            <img
              src={duoGoatImg}
              alt="Caldi and his goat companion"
              className="w-64 md:w-[80%]"
            />
          </div>
        </section>

        {/* 2. Why "Caldi"? */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <img
              src={duoGoatImg}
              alt="The legend of Kaldi"
              className="w-52 md:w-64"
            />
          </div>
          <CaldiCard className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bangers tracking-wide">
              Why "Caldi"?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Legend has it that Kaldi, an Ethiopian goat herder, discovered coffee centuries ago
              when he noticed his goats dancing with unusual energy after eating mysterious red
              berries. Curious, he tried them himself — and the rest is history.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We changed the K to a C as an homage to Colombia, the land of exceptional coffee and
              the heart of our mission. Caldi's Cup honors both the ancient discovery and the modern
              mission: helping you discover your perfect coffee while transforming lives in Colombian
              coffee communities.
            </p>
          </CaldiCard>
        </section>

        {/* 3. Why This Matters */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-secondary caldi-shadow overflow-hidden">
              <img
                src={ricardoImg}
                alt="Ricardo, Founder of Caldi's Cup"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bangers tracking-wide">
              Why This Matters
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              I'm Ricardo, and I built Caldi's Cup at the intersection of three passions:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-xl">🧠</span>
                <span><strong className="text-foreground">Understanding people:</strong> Using behavioral science to solve real frustrations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xl">💡</span>
                <span><strong className="text-foreground">Smart technology:</strong> AI that serves you, not complicates your life</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xl">🇨🇴</span>
                <span><strong className="text-foreground">Transforming Colombia</strong> — One cup at a time</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 4. A Personal Mission */}
        <section>
          <CaldiCard className="bg-secondary/5 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bangers tracking-wide">
              A Personal Mission
            </h2>
            <blockquote className="border-l-4 border-secondary pl-6 space-y-3">
              <p className="text-muted-foreground leading-relaxed italic">
                I'm Colombian. Coffee is in my blood — I believe in coffee as the force that will
                transform my country.
              </p>
              <p className="text-muted-foreground leading-relaxed italic">
                The farmers growing the world's finest coffee often can't make a living from it.
                Some turn to coca farming out of desperation. Caldi's Cup will change this story.
              </p>
              <p className="text-muted-foreground leading-relaxed italic">
                By helping you discover exceptional coffee, we create demand that rewards quality. We
                build pathways for farmers to earn dignified livelihoods doing what they do best.
              </p>
            </blockquote>
          </CaldiCard>
        </section>

        {/* 5. Our North Star */}
        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bangers tracking-wide text-center">
            Our North Star
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <CaldiCard className="space-y-3">
              <h3 className="text-2xl font-bangers tracking-wide">🎯 Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                Make discovering exceptional coffee <strong className="text-foreground">effortless</strong>, while
                creating <strong className="text-foreground">real value</strong> for the farmers behind every bean.
              </p>
            </CaldiCard>
            <CaldiCard className="space-y-3">
              <h3 className="text-2xl font-bangers tracking-wide">🌟 Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                A world where technology brings you closer to your perfect cup — and every purchase
                supports farmers building better futures.
              </p>
            </CaldiCard>
          </div>
        </section>

        {/* 6. The Journey Ahead */}
        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bangers tracking-wide text-center">
            The Journey Ahead
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "Today", text: "Scan & Discover", accent: "bg-secondary" },
              { label: "Tomorrow", text: "Personalized Brewing Guides & AI at every level — send us your ideas!", accent: "bg-accent" },
              { label: "Future", text: "Your Complete Coffee Companion", accent: "bg-primary" },
            ].map((step) => (
              <div key={step.label} className="text-center space-y-3">
                <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${step.accent} text-foreground`}>
                  {step.label}
                </span>
                <p className="text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. CTA Section */}
        <section className="text-center space-y-6 py-10 px-6 rounded-lg bg-foreground">
          <h2 className="text-3xl md:text-4xl font-bangers tracking-wide text-background">
            Ready to discover something extraordinary?
          </h2>
          <Link to={ROUTES.quiz}>
            <Button size="lg" className="text-lg">
              {APP_CONFIG.cta.primary}
            </Button>
          </Link>
          <p className="text-background/80 italic mt-6">
            With purpose and passion,
            <br />
            Ricardo
            <br />
            Founder, Caldi's Cup
          </p>
        </section>

        {/* 8. Connect / Feedback */}
        <section className="text-center space-y-6">
          <p className="text-muted-foreground">
            Passionate about coffee, technology, or responsible business? Let's connect.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://www.linkedin.com/in/ricardo-velez-dominguez/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors"
            >
              <Linkedin className="w-6 h-6" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://www.instagram.com/caldis_cup/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors"
            >
              <Instagram className="w-6 h-6" />
              <span>Instagram</span>
            </a>
          </div>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setDialogOpen(true)}
            className="gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Give Us Feedback
          </Button>
        </section>

        <FeedbackDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </Container>
    </PageLayout>
  );
};

export default FeedbackPage;
