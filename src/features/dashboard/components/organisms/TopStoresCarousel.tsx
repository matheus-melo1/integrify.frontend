import { ChevronLeft, ChevronRight, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SurfaceCard } from "@/shared/components/molecules/SurfaceCard/SurfaceCard";
import { AvatarStack } from "@/shared/components/molecules/AvatarStack/AvatarStack";
import { MarketplaceLogo } from "@/shared/components/molecules/MarketplaceLogo";
import { useTopStores } from "../../hooks/useTopStores";

const formatFollowers = (n: number) =>
  new Intl.NumberFormat("pt-BR").format(n);

export function TopStoresCarousel() {
  const { stores, page, totalPages, next, prev } = useTopStores();

  return (
    <SurfaceCard innerClassName="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Minhas Lojas em Destaque</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>
            {String(page + 1).padStart(2, "0")} de {totalPages}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={prev}
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={next}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 min-h-0">
        {stores.map((store) => (
          <SurfaceCard
            key={store.id}
            className="!from-white/15! !via-white/5! !to-white/15!"
            innerClassName="bg-neutral-950 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <h4 className="font-medium">{store.name}</h4>
              <MoreHorizontal size={16} className="text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <MarketplaceLogo marketplace={store.marketplace} />
              <span className="text-xs text-muted-foreground">
                #{formatFollowers(store.followers)} seguidores
              </span>
            </div>
            <p
              className={
                store.variation >= 0
                  ? "text-emerald-400 text-xs"
                  : "text-red-400 text-xs"
              }
            >
              {store.variation > 0 ? "+" : ""}
              {store.variation}%
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <AvatarStack members={store.members} max={3} />
              <Button
                size="icon"
                variant="ghost"
                className="size-7 rounded-full bg-neutral-800"
              >
                <Plus size={14} />
              </Button>
            </div>
          </SurfaceCard>
        ))}
      </div>
    </SurfaceCard>
  );
}
