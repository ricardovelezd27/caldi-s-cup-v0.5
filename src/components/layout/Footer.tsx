import { Link } from "react-router-dom";
import { APP_CONFIG, ROUTES } from "@/constants/app";
import { FeedbackTrigger } from "@/features/feedback";
import { Mail, Instagram, Youtube, Facebook } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language";

/** Simple SVG icons for platforms Lucide doesn't cover */
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.71a8.21 8.21 0 004.76 1.52V6.69h-1z" />
  </svg>
);

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/caldis_cup/", icon: Instagram, comingSoon: false },
  { label: "TikTok", href: "#", icon: TikTokIcon, comingSoon: true },
  { label: "X", href: "#", icon: XIcon, comingSoon: true },
  { label: "YouTube", href: "#", icon: Youtube, comingSoon: true },
  { label: "Facebook", href: "#", icon: Facebook, comingSoon: true },
];

interface FooterProps {
  compact?: boolean;
}

export const Footer = ({ compact = false }: FooterProps) => {
  const { t } = useLanguage();

  const footerNav = {
    explore: [
      { label: t("footer.scanner"), path: ROUTES.scanner },
      { label: t("footer.quiz"), path: ROUTES.quiz },
      { label: t("footer.brewLog"), path: ROUTES.blog },
    ],
    company: [
      { label: t("footer.ourStory"), path: ROUTES.contactFeedback },
    ],
  };

  if (compact) {
    return (
      <footer className="border-t-4 border-border bg-foreground text-background">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-background/50 font-inter">
            © {APP_CONFIG.year} {APP_CONFIG.name}. {t("footer.copyright")}
          </p>
          <a
            href="mailto:r.velez@caldi.coffee"
            className="flex items-center gap-1.5 text-xs text-background/60 hover:text-primary font-inter transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            r.velez@caldi.coffee
          </a>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t-4 border-border mt-16 bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="font-bangers text-2xl tracking-wide text-primary mb-3">
              {APP_CONFIG.name}
            </h2>
            <p className="text-sm text-background/70 font-inter leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="font-bangers text-lg tracking-wide text-primary mb-4">{t("footer.explore")}</h3>
            <ul className="space-y-2.5">
              {footerNav.explore.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-background/70 hover:text-primary font-inter transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bangers text-lg tracking-wide text-primary mb-4">{t("footer.company")}</h3>
            <ul className="space-y-2.5">
              {footerNav.company.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-background/70 hover:text-primary font-inter transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <FeedbackTrigger>
                  {(open) => (
                    <button onClick={open} className="text-sm text-background/70 hover:text-primary font-inter transition-colors">
                      {t("footer.giveFeedback")}
                    </button>
                  )}
                </FeedbackTrigger>
              </li>
            </ul>
          </div>

          {/* Contact & Socials Column */}
          <div>
            <h3 className="font-bangers text-lg tracking-wide text-primary mb-4">{t("footer.getInTouch")}</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:r.velez@caldi.coffee" className="flex items-center gap-2 text-sm text-background/70 hover:text-primary font-inter transition-colors">
                  <Mail className="w-4 h-4 shrink-0" />
                  r.velez@caldi.coffee
                </a>
              </li>
            </ul>
            <div className="mt-5">
              <p className="text-xs text-background/50 font-inter mb-2.5">{t("footer.followUs")}</p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <div key={social.label} className="relative group">
                    <a
                      href={social.comingSoon ? undefined : social.href}
                      target={social.comingSoon ? undefined : "_blank"}
                      rel={social.comingSoon ? undefined : "noopener noreferrer"}
                      aria-label={social.label}
                      className={`w-9 h-9 rounded-md border-2 border-background/20 flex items-center justify-center transition-colors ${
                        social.comingSoon ? "text-background/30 cursor-default" : "text-background/60 hover:text-primary hover:border-primary"
                      }`}
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                    {social.comingSoon && (
                      <Badge variant="outline" className="absolute -top-2.5 -right-2.5 text-[8px] px-1 py-0 leading-tight border-primary/50 text-primary bg-foreground whitespace-nowrap pointer-events-none">
                        {t("common.comingSoon")}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-background/15" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-background/50 font-inter">
            © {APP_CONFIG.year} {APP_CONFIG.name}. {t("footer.copyright")}
          </p>
          <p className="text-xs text-background/50 font-inter">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
};
