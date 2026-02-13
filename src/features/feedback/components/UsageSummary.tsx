import { useUsageSummary } from "../hooks/useUsageSummary";
import { Skeleton } from "@/components/ui/skeleton";

interface UsageSummaryProps {
  enabled: boolean;
}

export const UsageSummary = ({ enabled }: UsageSummaryProps) => {
  const { tribe, scansCount, favoritesCount, manualCoffeesCount, isLoading } =
    useUsageSummary(enabled);

  if (!enabled) return null;

  if (isLoading) {
    return <Skeleton className="h-20 w-full rounded-md" />;
  }

  const tribeLabel = tribe
    ? tribe.charAt(0).toUpperCase() + tribe.slice(1)
    : "Not set";

  return (
    <div className="rounded-md border-2 border-border bg-muted/30 p-3 text-sm space-y-1">
      <p className="font-medium text-foreground">Your Activity Summary</p>
      <ul className="text-muted-foreground space-y-0.5">
        <li>☕ Coffee Tribe: <span className="text-foreground font-medium">{tribeLabel}</span></li>
        <li>📷 Coffees scanned: <span className="text-foreground font-medium">{scansCount}</span></li>
        <li>❤️ Favorites: <span className="text-foreground font-medium">{favoritesCount}</span></li>
        <li>➕ Coffees added: <span className="text-foreground font-medium">{manualCoffeesCount}</span></li>
      </ul>
    </div>
  );
};

export const formatUsageSummaryText = (data: {
  tribe: string | null;
  scansCount: number;
  favoritesCount: number;
  manualCoffeesCount: number;
}) => {
  const tribe = data.tribe
    ? data.tribe.charAt(0).toUpperCase() + data.tribe.slice(1)
    : "Not set";
  return [
    "--- App Activity ---",
    `Coffee Tribe: ${tribe}`,
    `Coffees scanned: ${data.scansCount}`,
    `Favorites: ${data.favoritesCount}`,
    `Coffees added: ${data.manualCoffeesCount}`,
  ].join("\n");
};
