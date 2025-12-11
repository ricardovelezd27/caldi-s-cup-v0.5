import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/app";
import logo from "@/assets/logo.svg";

export const Header = () => {
  return (
    <header className="py-4">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <Link to={ROUTES.home} className="flex items-center">
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
