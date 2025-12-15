import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ROUTES, NAV_LINKS } from "@/constants/app";
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
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-foreground hover:text-primary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
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
                  {NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `text-lg font-medium py-2 transition-colors ${
                          isActive
                            ? "text-primary font-bold"
                            : "text-foreground hover:text-primary"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};
