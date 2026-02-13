import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, ScanLine, Users } from "lucide-react";
import { ROUTES } from "@/constants/app";
import { useAuth } from "@/contexts/auth";
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

export const Header = ({ showLogo = true }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  return (
    <header className="py-4 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to={ROUTES.home}
            className={`flex items-center transition-opacity duration-300 ${
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
          <div className="hidden md:flex items-center gap-6">
            {/* Scanner Icon */}
            <NavLink
              to={ROUTES.scanner}
              className={({ isActive }) =>
                `p-2 transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`
              }
              aria-label="Coffee Scanner"
            >
              <ScanLine className="w-6 h-6" />
            </NavLink>

            {/* Who we are */}
            <NavLink
              to={ROUTES.contactFeedback}
              className={({ isActive }) =>
                `flex items-center gap-1 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-foreground hover:text-primary"
                }`
              }
            >
              <Users className="w-5 h-5" />
              Who we are
            </NavLink>

            {/* Auth: User Menu or Sign In Button */}
            {user ? (
              <UserMenu
                displayName={profile?.display_name}
                avatarUrl={profile?.avatar_url}
                email={user.email}
                onSignOut={signOut}
              />
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link to={ROUTES.auth}>Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile: Hamburger Menu */}
          <div className="md:hidden flex items-center gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 text-foreground hover:text-primary transition-colors"
                  aria-label="Open menu"
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
                <nav className="flex flex-col gap-4">
                  <NavLink
                    to={ROUTES.scanner}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `text-lg font-medium py-2 transition-colors flex items-center gap-2 ${
                        isActive
                          ? "text-primary font-bold"
                          : "text-foreground hover:text-primary"
                      }`
                    }
                  >
                    <ScanLine className="w-5 h-5" />
                    Scanner
                  </NavLink>

                  <NavLink
                    to={ROUTES.contactFeedback}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `text-lg font-medium py-2 transition-colors flex items-center gap-2 ${
                        isActive
                          ? "text-primary font-bold"
                          : "text-foreground hover:text-primary"
                      }`
                    }
                  >
                    <Users className="w-5 h-5" />
                    Who we are
                  </NavLink>

                  {/* Auth Link in Mobile Menu */}
                  {user ? (
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="text-lg font-medium py-2 transition-colors text-left text-destructive hover:text-destructive/80"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <NavLink
                      to={ROUTES.auth}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `text-lg font-medium py-2 transition-colors ${
                          isActive
                            ? "text-primary font-bold"
                            : "text-foreground hover:text-primary"
                        }`
                      }
                    >
                      Sign In
                    </NavLink>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};
