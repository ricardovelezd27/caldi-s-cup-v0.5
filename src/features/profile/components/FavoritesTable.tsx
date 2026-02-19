import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language";

const INITIAL_SHOW = 5;

interface FavoriteCoffee {
  coffee_id: string;
  added_at: string | null;
  coffee_name: string;
  coffee_brand: string | null;
}

export function FavoritesTable() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [items, setItems] = useState<FavoriteCoffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      const { data } = await supabase
        .from("user_coffee_favorites")
        .select("coffee_id, added_at, coffees(name, brand)")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false });

      if (data) {
        setItems(
          data.map((d: any) => ({
            coffee_id: d.coffee_id,
            added_at: d.added_at,
            coffee_name: d.coffees?.name ?? "Unknown",
            coffee_brand: d.coffees?.brand ?? null,
          }))
        );
      }
      setLoading(false);
    };

    fetch();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  const visible = expanded ? items : items.slice(0, INITIAL_SHOW);
  const hasMore = items.length > INITIAL_SHOW;

  return (
    <div>
      <h3 className="text-xl flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-destructive" />
        {t("profile.favorites")} ({items.length})
      </h3>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t("profile.noFavorites")}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border text-left">
                  <th className="py-2 pr-4 font-medium">{t("profile.coffee")}</th>
                  <th className="py-2 pr-4 font-medium">{t("profile.brand")}</th>
                  <th className="py-2 font-medium">{t("profile.added")}</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.coffee_id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-2 pr-4">
                      <Link
                        to={`/coffee/${item.coffee_id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {item.coffee_name}
                      </Link>
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">{item.coffee_brand || "—"}</td>
                    <td className="py-2 text-muted-foreground">
                      {item.added_at ? new Date(item.added_at).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>{t("profile.showLess")} <ChevronUp className="ml-1 h-4 w-4" /></>
              ) : (
                <>{t("profile.viewMore")} ({items.length - INITIAL_SHOW} {t("profile.more")}) <ChevronDown className="ml-1 h-4 w-4" /></>
              )}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
