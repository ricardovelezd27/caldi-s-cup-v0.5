import { useLanguage } from "@/contexts/language";
import { useLeague } from "../../hooks/useLeague";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/app";

export function LeagueCard() {
  const { t } = useLanguage();
  const { league, myRank, userLeague, daysRemaining, isLoading } = useLeague();
  const navigate = useNavigate();

  if (isLoading || !league) return null;

  return (
    <button
      onClick={() => navigate(ROUTES.leaderboard)}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-border bg-card shadow-[2px_2px_0px_0px_hsl(var(--border))] hover:bg-primary/10 transition-colors text-left"
    >
      <span className="text-xl">{league.icon}</span>
      <div className="flex flex-col">
        <span className="font-bangers text-sm text-foreground tracking-wide leading-tight">
          {league.name}
        </span>
        {myRank && (
          <span className="text-[10px] font-inter text-muted-foreground">
            #{myRank} · {daysRemaining}d
          </span>
        )}
      </div>
    </button>
  );
}
