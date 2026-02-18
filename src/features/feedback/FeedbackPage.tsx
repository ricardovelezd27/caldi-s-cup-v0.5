import { useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/shared";
import { CaldiCard } from "@/components/shared/CaldiCard";
import { Button } from "@/components/ui/button";
import { MessageSquare, Linkedin, Instagram } from "lucide-react";
import { FeedbackDialog } from "./components/FeedbackDialog";
import { ROUTES } from "@/constants/app";
import { useLanguage } from "@/contexts/language";

import duoGoatImg from "@/assets/characters/ilustration_Duo_and_Goat_NoBG_1.png";
import ricardoImg from "@/assets/characters/ricardo-profile.png";
import vibrantImg from "@/assets/illustrations/vibrant-coffee-overwhelm.png";

const FeedbackPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <PageLayout>
      <Container className="py-12 space-y-20">
        {/* 1. Hero / Intro */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bangers tracking-wide">
              {t("ourStory.heroTitle")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("ourStory.heroParagraph1")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("ourStory.heroParagraph2")}
            </p>
          </div>
          <div className="hidden md:flex justify-center">
            <img
              src={vibrantImg}
              alt="Overwhelmed coffee lover surrounded by options"
              className="w-64 md:w-[80%]"
            />
          </div>
        </section>

        {/* 2. Why "Caldi"? */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center w-full">
            <img
              src={duoGoatImg}
              alt="The legend of Kaldi"
              className="w-64 md:w-[80%]"
            />
          </div>
          <CaldiCard className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bangers tracking-wide">
              {t("ourStory.whyTitle")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("ourStory.whyParagraph1")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("ourStory.whyParagraph2")}
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
              {t("ourStory.meetTitle")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("ourStory.meetIntro")}
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-xl">🧠</span>
                <span><strong className="text-foreground">{t("ourStory.passion1Label")}</strong> {t("ourStory.passion1Text")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xl">💡</span>
                <span><strong className="text-foreground">{t("ourStory.passion2Label")}</strong> {t("ourStory.passion2Text")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xl">🇨🇴</span>
                <span><strong className="text-foreground">{t("ourStory.passion3Label")}</strong> {t("ourStory.passion3Text")}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 4. A Personal Mission */}
        <section>
          <CaldiCard className="bg-secondary/5 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bangers tracking-wide">
              {t("ourStory.missionTitle")}
            </h2>
            <blockquote className="border-l-4 border-secondary pl-6 space-y-3">
              <p className="text-muted-foreground leading-relaxed italic">
                {t("ourStory.missionQ1")}
              </p>
              <p className="text-muted-foreground leading-relaxed italic">
                {t("ourStory.missionQ2")}
              </p>
              <p className="text-muted-foreground leading-relaxed italic">
                {t("ourStory.missionQ3")}
              </p>
            </blockquote>
          </CaldiCard>
        </section>

        {/* 5. Our North Star */}
        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bangers tracking-wide text-center">
            {t("ourStory.northStarTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <CaldiCard className="space-y-3">
              <h3 className="text-2xl font-bangers tracking-wide">{t("ourStory.missionCardTitle")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("ourStory.missionCardText")}
              </p>
            </CaldiCard>
            <CaldiCard className="space-y-3">
              <h3 className="text-2xl font-bangers tracking-wide">{t("ourStory.visionCardTitle")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("ourStory.visionCardText")}
              </p>
            </CaldiCard>
          </div>
        </section>

        {/* 6. The Journey Ahead */}
        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bangers tracking-wide text-center">
            {t("ourStory.journeyTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: t("ourStory.journeyToday"), text: t("ourStory.journeyTodayText"), accent: "bg-secondary" },
              { label: t("ourStory.journeyTomorrow"), text: t("ourStory.journeyTomorrowText"), accent: "bg-accent" },
              { label: t("ourStory.journeyFuture"), text: t("ourStory.journeyFutureText"), accent: "bg-primary" },
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
            {t("ourStory.ctaTitle")}
          </h2>
          <Link to={ROUTES.quiz}>
            <Button size="lg" className="text-lg">
              {t("ourStory.ctaButton")}
            </Button>
          </Link>
          <p className="text-background/80 italic mt-6">
            {t("ourStory.ctaSignoff")}
            <br />
            {t("ourStory.ctaFounder")}
            <br />
            {t("ourStory.ctaFounderRole")}
          </p>
        </section>

        {/* 8. Connect / Feedback */}
        <section className="text-center space-y-6">
          <p className="text-muted-foreground">
            {t("ourStory.connectText")}
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
            {t("ourStory.feedbackButton")}
          </Button>
        </section>

        <FeedbackDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </Container>
    </PageLayout>
  );
};

export default FeedbackPage;
