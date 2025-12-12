import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/app";
interface HeaderProps {
  showLogo?: boolean;
}
export const Header = ({
  showLogo = true
}: HeaderProps) => {
  return <header className="py-4 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <Link to={ROUTES.home} className={`flex items-center transition-opacity duration-300 ${showLogo ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <img alt="Caldi's Cup" className="h-10 md:h-12" src="/lovable-uploads/8e78a6bd-5f00-45be-b082-c35b57fa9a7c.png" />
          </Link>
          
          {/* Future navigation items can be added here */}
          <div className="flex items-center gap-4">
            {/* Placeholder for future nav items */}
          </div>
        </nav>
      </div>
    </header>;
};