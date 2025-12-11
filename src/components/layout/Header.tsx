import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/app";
import logo from "@/assets/logo.svg";

interface HeaderProps {
  showLogo?: boolean;
}

export const Header = ({ showLogo = true }: HeaderProps) => {
  return (
    <header className="py-4 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <Link 
            to={ROUTES.home} 
            className={`flex items-center transition-opacity duration-300 ${showLogo ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <img 
              src={logo} 
              alt="Caldi's Cup" 
              className="h-10 md:h-12"
            />
          </Link>
          
          {/* Future navigation items can be added here */}
          <div className="flex items-center gap-4">
            {/* Placeholder for future nav items */}
          </div>
        </nav>
      </div>
    </header>
  );
};
