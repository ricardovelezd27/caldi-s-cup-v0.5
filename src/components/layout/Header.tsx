import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, ShoppingCart } from "lucide-react";
import { ROUTES, NAV_LINKS } from "@/constants/app";
import { useCart } from "@/contexts/CartContext";
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
  const { itemCount } = useCart();

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

            {/* Cart Icon */}
            <Link
              to={ROUTES.cart}
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: Cart Icon + Hamburger Menu */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Cart Icon */}
            <Link
              to={ROUTES.cart}
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

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
                  
                  {/* Cart Link in Mobile Menu */}
                  <NavLink
                    to={ROUTES.cart}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `text-lg font-medium py-2 transition-colors flex items-center gap-2 ${
                        isActive
                          ? "text-primary font-bold"
                          : "text-foreground hover:text-primary"
                      }`
                    }
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Cart {itemCount > 0 && `(${itemCount})`}
                  </NavLink>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};
