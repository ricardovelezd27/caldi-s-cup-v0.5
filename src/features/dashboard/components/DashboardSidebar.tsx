import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  User, 
  Coffee, 
  BookOpen, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth";
import { ROUTES } from "@/constants/app";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: ROUTES.dashboard },
  { label: "Profile", icon: User, path: ROUTES.dashboard + "/profile" },
  { label: "My Coffees", icon: Coffee, path: ROUTES.dashboard + "/coffees" },
  { label: "Brew Guides", icon: BookOpen, path: ROUTES.dashboard + "/guides" },
  { label: "Settings", icon: Settings, path: ROUTES.dashboard + "/settings" },
];

export function DashboardSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <aside
      className={cn(
        "h-full border-r-4 border-border bg-card flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <div className="p-2 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                "hover:bg-muted",
                isActive && "bg-primary text-primary-foreground font-medium",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="p-2 border-t-4 border-border">
        <button
          onClick={handleSignOut}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-colors",
            "text-destructive hover:bg-destructive/10",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
