import { Link } from "react-router-dom";
import { APP_CONFIG, ROUTES } from "@/constants/app";
import { FeedbackTrigger } from "@/features/feedback";
import { Mail, Instagram, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerNav = {
  explore: [
    { label: "Label Scanner", path: ROUTES.scanner },
    { label: "Coffee Quiz", path: ROUTES.quiz },
    { label: "Dashboard", path: ROUTES.dashboard },
    { label: "Recipes", path: ROUTES.recipes },
  ],
  company: [
    { label: "Our Story", path: ROUTES.contactFeedback },
  ],
};

export const Footer = () => {
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
              {APP_CONFIG.tagline}
            </p>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="font-bangers text-lg tracking-wide text-primary mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {footerNav.explore.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-background/70 hover:text-primary font-inter transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bangers text-lg tracking-wide text-primary mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {footerNav.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-background/70 hover:text-primary font-inter transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <FeedbackTrigger>
                  {(open) => (
                    <button
                      onClick={open}
                      className="text-sm text-background/70 hover:text-primary font-inter transition-colors"
                    >
                      Give Feedback
                    </button>
                  )}
                </FeedbackTrigger>
              </li>
            </ul>
          </div>

          {/* Contact & Socials Column */}
          <div>
            <h3 className="font-bangers text-lg tracking-wide text-primary mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:r.velez@caldi.coffee"
                  className="flex items-center gap-2 text-sm text-background/70 hover:text-primary font-inter transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  r.velez@caldi.coffee
                </a>
              </li>
            </ul>

            <div className="mt-5">
              <p className="text-xs text-background/50 font-inter mb-2.5">Follow us</p>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-md border-2 border-background/20 flex items-center justify-center text-background/60 hover:text-primary hover:border-primary transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-md border-2 border-background/20 flex items-center justify-center text-background/60 hover:text-primary hover:border-primary transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-background/15" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-background/50 font-inter">
            © {APP_CONFIG.year} {APP_CONFIG.name}. Brewed with love.
          </p>
          <p className="text-xs text-background/50 font-inter">
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
