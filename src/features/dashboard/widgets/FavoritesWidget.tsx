import { useState } from "react";
import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { useDashboardData } from "../hooks/useDashboardData";
import { useFavorites } from "@/features/coffee/hooks/useFavorites";
import { FavoritesModal } from "@/features/profile/components/FavoritesModal";
import { Button } from "@/components/ui/button";
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
        className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-card p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))] cursor-pointer transition-opacity hover:opacity-90 flex flex-col"
        onClick={() => setModalOpen(true)}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-bangers text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-destructive" />
            {favCount > 0 ? `${t("widgets.favorites")} (${favCount})` : t("widgets.favorites")}
          </h3>
          <WidgetCategoryTag label={t("widgets.categoryExperience")} />
        </div>
        <div className="px-5 pb-5 flex flex-col items-center flex-1">
          {favorite ? (
            <>
              {favorite.imageUrl ? (
                <div className="w-16 h-16 rounded-lg border-4 border-border overflow-hidden">
                  <img src={favorite.imageUrl} alt={favorite.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center border-4 border-border">
                  <Heart className="h-8 w-8 text-destructive" />
                </div>
              )}
              <h4 className="font-bangers text-lg tracking-wide truncate mt-3 text-center max-w-full">{favorite.name}</h4>
              {favorite.brand && <p className="text-sm text-muted-foreground text-center">{t("widgets.by")} {favorite.brand}</p>}
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center border-4 border-border">
                <Heart className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-muted-foreground mt-3 text-center">{t("widgets.noFavoritesYet")}</p>
            </>
          )}
          <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-auto" onClick={(e) => e.stopPropagation()}>
            {t("widgets.viewAll")}
          </Button>
        </div>
      </div>
      <FavoritesModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
