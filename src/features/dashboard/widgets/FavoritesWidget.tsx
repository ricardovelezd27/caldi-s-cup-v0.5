import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { useDashboardData } from "../hooks/useDashboardData";
import { useFavorites } from "@/features/coffee/hooks/useFavorites";
import { FavoritesModal } from "@/features/profile/components/FavoritesModal";
import type { WidgetComponentProps } from "./types";
import { WidgetCategoryTag } from "./WidgetCategoryTag";

export function FavoritesWidget({ widget }: WidgetComponentProps) {
  const { t } = useLanguage();
  const { favorite } = useDashboardData();
  const { favoriteIds } = useFavorites();
  const favCount = favoriteIds.length;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-card p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))] cursor-pointer transition-opacity hover:opacity-90"
        onClick={() => setModalOpen(true)}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-bangers text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-destructive" />
            {favCount > 0 ? `${t("widgets.favorites")} (${favCount})` : t("widgets.favorites")}
          </h3>
          <WidgetCategoryTag label={t("widgets.categoryExperience")} />
        </div>
        <div className="px-5 pb-5">
          {favorite ? (
            <div className="block space-y-3">
              {favorite.imageUrl && (
                <div className="aspect-square w-full max-w-[120px] mx-auto rounded-lg border-4 border-border overflow-hidden">
                  <img src={favorite.imageUrl} alt={favorite.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="text-center">
                <h4 className="font-bangers text-lg tracking-wide truncate">{favorite.name}</h4>
                {favorite.brand && <p className="text-sm text-muted-foreground">{t("widgets.by")} {favorite.brand}</p>}
                {favorite.originCountry && <p className="text-xs text-muted-foreground mt-1">{favorite.originCountry}</p>}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Heart className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground mb-3">{t("widgets.noFavoritesYet")}</p>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={(e) => e.stopPropagation()} asChild>
                <Link to="/scanner">{t("widgets.scanToDiscover")}</Link>
              </Button>
            </div>
          )}
          <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-3">{t("widgets.viewAll")}</Button>
        </div>
      </div>
      <FavoritesModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
