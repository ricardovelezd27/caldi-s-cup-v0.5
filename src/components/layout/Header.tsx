import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, MessageSquare, ScanLine, User, Users, Coffee } from "lucide-react";
import { FeedbackDialog } from "@/features/feedback/components/FeedbackDialog";
import { ROUTES } from "@/constants/app";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import { UserMenu } from "@/components/auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  showLogo?: boolean;
}

/** Compact ES | EN pill toggle */
const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="inline-flex items-center border-2 border-border rounded-full overflow-hidden shadow-[2px_2px_0px_0px_hsl(var(--border))] text-xs font-inter font-semibold select-none">
      <button
        onClick={() => setLanguage("es")}
        className={`px-3 py-1 transition-colors ${
          language === "es"
            ? "bg-primary text-primary-foreground"
            : "bg-background text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Switch to Spanish"
      >
        ES
      </button>
      <span className="text-border px-0.5">|</span>
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 transition-colors ${
          language === "en"
            ? "bg-primary text-primary-foreground"
            : "bg-background text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
};

export const Header = ({ showLogo = true }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();

  return (
    <>
      <header className="py-4 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between gap-4">
            {/* Language Selector — far left, desktop only */}
            <div className="hidden md:flex items-center shrink-0">
              <LanguageSelector />
            </div>

            {/* Logo */}
            <Link
              to={ROUTES.home}
              className={`flex items-center shrink-0 transition-opacity duration-300 ${
                showLogo ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                alt="Caldi's Cup"
                className="h-10 md:h-12"
                src="/lovable-uploads/8e78a6bd-5f00-45be-b082-c35b57fa9a7c.png"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-wrap justify-end">

              <NavLink
                to={ROUTES.scanner}
                className={({ isActive }) =>
                  `flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive ? "text-primary font-bold" : "text-foreground hover:text-primary"
                  }`
                }
              >
                <ScanLine className="w-5 h-5 shrink-0" />
                {t("nav.scanner")}
              </NavLink>

              <NavLink
                to={ROUTES.contactFeedback}
                className={({ isActive }) =>
                  `flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive ? "text-primary font-bold" : "text-foreground hover:text-primary"
                  }`
                }
              >
                <Users className="w-5 h-5 shrink-0" />
                {t("nav.ourStory")}
              </NavLink>

              <NavLink
                to={ROUTES.blog}
                className={({ isActive }) =>
                  `flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive ? "text-primary font-bold" : "text-foreground hover:text-primary"
                  }`
                }
              >
                <Coffee className="w-5 h-5 shrink-0" />
                {t("nav.brewLog")}
              </NavLink>

              {user ? (
                <UserMenu
                  displayName={profile?.display_name}
                  avatarUrl={profile?.avatar_url}
                  email={user.email}
                  onSignOut={signOut}
                />
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link to={ROUTES.auth}>{t("nav.signIn")}</Link>
                </Button>
              )}
            </div>

            {/* Mobile: Hamburger only */}
            <div className="md:hidden flex items-center">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <button
                    className="p-2 text-foreground hover:text-primary transition-colors"
                    aria-label={t("nav.menu")}
                  >
                    <Menu size={24} />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-background">
                  <SheetHeader className="mb-8">
                    <Link
                      to={ROUTES.home}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center"
                    >
                      <img
                        alt="Caldi's Cup"
                        className="h-10"
                        src="/lovable-uploads/8e78a6bd-5f00-45be-b082-c35b57fa9a7c.png"
                      />
                    </Link>
                  </SheetHeader>
                  {/* Language Selector — inside mobile menu */}
                  <div className="mb-4">
                    <LanguageSelector />
                  </div>
                  <nav className="flex flex-col gap-4">
                    <NavLink
                      to={ROUTES.scanner}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `text-lg font-medium py-2 transition-colors flex items-center gap-2 ${
                          isActive ? "text-primary font-bold" : "text-foreground hover:text-primary"
                        }`
                      }
                    >
                      <ScanLine className="w-5 h-5 shrink-0" />
                      {t("nav.scanner")}
                    </NavLink>

                    {user && (
                      <NavLink
                        to={ROUTES.profile}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `text-lg font-medium py-2 transition-colors flex items-center gap-2 ${
                            isActive ? "text-primary font-bold" : "text-foreground hover:text-primary"
                          }`
                        }
                      >
                        <User className="w-5 h-5 shrink-0" />
                        {t("nav.profile")}
                      </NavLink>
                    )}

                    <NavLink
                      to={ROUTES.contactFeedback}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `text-lg font-medium py-2 transition-colors flex items-center gap-2 ${
                          isActive ? "text-primary font-bold" : "text-foreground hover:text-primary"
                        }`
                      }
                    >
                      <Users className="w-5 h-5 shrink-0" />
                      {t("nav.ourStory")}
                    </NavLink>

                    <NavLink
                      to={ROUTES.blog}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `text-lg font-medium py-2 transition-colors flex items-center gap-2 ${
                          isActive ? "text-primary font-bold" : "text-foreground hover:text-primary"
                        }`
                      }
                    >
                      <Coffee className="w-5 h-5 shrink-0" />
                      {t("nav.brewLog")}
                    </NavLink>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setTimeout(() => setFeedbackOpen(true), 300);
                      }}
                      className="text-lg font-medium py-2 transition-colors flex items-center gap-2 text-foreground hover:text-primary text-left"
                    >
                      <MessageSquare className="w-5 h-5 shrink-0" />
                      {t("nav.feedback")}
                    </button>

                    {user ? (
                      <button
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                        className="text-lg font-medium py-2 transition-colors text-left text-destructive hover:text-destructive/80"
                      >
                        {t("nav.signOut")}
                      </button>
                    ) : (
                      <NavLink
                        to={ROUTES.auth}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `text-lg font-medium py-2 transition-colors ${
                            isActive ? "text-primary font-bold" : "text-foreground hover:text-primary"
                          }`
                        }
                      >
                        {t("nav.signIn")}
                      </NavLink>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>

      {/* Feedback dialog rendered outside Sheet so it persists after menu closes */}
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>
  );
};
