import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { User, LogOut, LayoutDashboard, Globe } from "lucide-react";
import { ROUTES } from "@/constants/app";
import { useLanguage } from "@/contexts/language";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserMenuProps {
  displayName?: string | null;
  avatarUrl?: string | null;
  email?: string;
  onSignOut: () => void;
}

export const UserMenu = forwardRef<HTMLDivElement, UserMenuProps>(
  ({ displayName, avatarUrl, email, onSignOut }, ref) => {
    const { language, setLanguage } = useLanguage();

    const initials = displayName
      ? displayName.slice(0, 2).toUpperCase()
      : email?.slice(0, 2).toUpperCase() || "U";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full border-2 border-border p-0 hover:bg-accent"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatarUrl || undefined} alt={displayName || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent ref={ref} align="end" className="w-56">
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl || undefined} alt={displayName || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5 leading-none">
              {displayName && (
                <p className="font-medium text-sm">{displayName}</p>
              )}
              {email && (
                <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                  {email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={ROUTES.dashboard} className="cursor-pointer">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={ROUTES.profile} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* Language Toggle */}
          <div className="flex items-center justify-between px-2 py-1.5">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Language</span>
            </div>
            <div className="inline-flex items-center border-2 border-border rounded-full overflow-hidden text-xs font-semibold select-none shadow-[2px_2px_0px_0px_hsl(var(--border))]">
              <button
                onClick={() => setLanguage("es")}
                className={`px-2 py-0.5 transition-colors ${
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
                className={`px-2 py-0.5 transition-colors ${
                  language === "en"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onSignOut}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

UserMenu.displayName = "UserMenu";
