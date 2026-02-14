import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FavoriteCoffee {
  coffee_id: string;
  added_at: string | null;
  coffee_name: string;
  coffee_brand: string | null;
}

export function FavoritesTable() {
  const { user } = useAuth();
  const [items, setItems] = useState<FavoriteCoffee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      const { data } = await supabase
        .from("user_coffee_favorites")
        .select("coffee_id, added_at, coffees(name, brand)")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false })
        .limit(20);

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

  return (
    <div>
      <h3 className="text-xl flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-destructive" />
        Favorites ({items.length})
      </h3>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No favorites yet. Scan a coffee and hit the heart!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border text-left">
                <th className="py-2 pr-4 font-medium">Coffee</th>
                <th className="py-2 pr-4 font-medium">Brand</th>
                <th className="py-2 font-medium">Added</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
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
      )}
    </div>
  );
}
