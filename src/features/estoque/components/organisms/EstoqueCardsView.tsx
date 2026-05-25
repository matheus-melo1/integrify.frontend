import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { SurfaceCard } from "@/shared/components/molecules/SurfaceCard/SurfaceCard";
import { EmptyState } from "@/shared/components/molecules/EmptyState/EmptyState";
import { StockFilters } from "../molecules/StockFilters";
import { StockCard } from "../molecules/StockCard";
import type { StockListController } from "../../hooks/useStockList";

const SKELETON_CARDS = 8;

type Props = {
  list: StockListController;
};

export function EstoqueCardsView({ list }: Props) {
  const {
    search,
    setSearch,
    marketplace,
    setMarketplace,
    status,
    setStatus,
    page,
    totalPages,
    next,
    prev,
    items,
    total,
    isLoading,
    isError,
    refetch,
  } = list;

  useEffect(() => {
    if (isError) toast.error("Erro ao carregar produtos");
  }, [isError]);

  return (
    <SurfaceCard
      className="h-full"
      innerClassName="bg-transparent border-0 rounded-none p-0 sm:bg-neutral-800 sm:border sm:border-neutral-700 sm:rounded-2xl sm:p-5 flex flex-col gap-4 h-full"
    >
      <StockFilters
        search={search}
        onSearchChange={setSearch}
        marketplace={marketplace}
        onMarketplaceChange={setMarketplace}
        status={status}
        onStatusChange={setStatus}
      />

      <div className="flex-1 overflow-auto min-h-0">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: SKELETON_CARDS }).map((_, i) => (
              <Skeleton
                key={`sk-${i}`}
                className="h-28 sm:h-48 w-full rounded-xl"
              />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-xs text-muted-foreground">
            <span>Não foi possível carregar os produtos.</span>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </div>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <EmptyState
            title="Nenhum produto encontrado"
            description="Tente ajustar os filtros ou a busca."
          />
        )}

        {!isLoading && !isError && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {items.map((stock) => (
              <StockCard key={stock.id} stock={stock} />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{total} produtos</span>
        <div className="flex items-center gap-1.5">
          <span>
            Página {String(page + 1).padStart(2, "0")} de{" "}
            {String(totalPages).padStart(2, "0")}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={prev}
            disabled={page === 0}
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={next}
            disabled={page >= totalPages - 1}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </SurfaceCard>
  );
}
