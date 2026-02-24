import { useLanguage } from "@/contexts/language";

interface StreakCalendarProps {
  lastActivityDate: string | null;
  currentStreak: number;
}

export function StreakCalendar({ lastActivityDate, currentStreak }: StreakCalendarProps) {
  const { t } = useLanguage();
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    return d;
  });

  const todayStr = today.toISOString().split("T")[0];

  // Build set of active dates based on streak length from lastActivityDate
  const activeDates = new Set<string>();
  if (lastActivityDate && currentStreak > 0) {
    const lastDate = new Date(lastActivityDate);
    for (let i = 0; i < currentStreak && i < 7; i++) {
      const d = new Date(lastDate);
      d.setDate(lastDate.getDate() - i);
      activeDates.add(d.toISOString().split("T")[0]);
    }
  }

  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="p-3 border-4 border-border rounded-lg bg-card shadow-[4px_4px_0px_0px_hsl(var(--border))]">
      <p className="text-xs font-inter font-medium text-muted-foreground mb-2">
        {t("learn.streak")}
      </p>
      <div className="flex items-center gap-2">
        {days.map((d, i) => {
          const dateStr = d.toISOString().split("T")[0];
          const isToday = dateStr === todayStr;
          const isDone = activeDates.has(dateStr);
          const isFuture = d > today && !isToday;

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-inter text-muted-foreground">
                {dayLabels[i]}
              </span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone
                    ? "bg-primary text-primary-foreground"
                    : isToday
                      ? "border-2 border-secondary animate-pulse"
                      : isFuture
                        ? "border-2 border-border/30"
                        : "border-2 border-border/50"
                }`}
              >
                {isDone ? "✓" : isToday ? "●" : "○"}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs font-inter text-muted-foreground mt-2">
        🔥 {currentStreak} {t("learn.streak").toLowerCase()}
      </p>
    </div>
  );
}
