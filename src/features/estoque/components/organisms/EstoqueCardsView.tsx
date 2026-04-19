import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SurfaceCard } from "@/shared/components/molecules/SurfaceCard/SurfaceCard";
import { EmptyState } from "@/shared/components/molecules/EmptyState/EmptyState";
import { StockFilters } from "../molecules/StockFilters";
import { StockCard } from "../molecules/StockCard";
import type { StockListController } from "../../hooks/useStockList";

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
  } = list;

  return (
    <SurfaceCard className="h-full" innerClassName="flex flex-col gap-4 h-full">
      <StockFilters
        search={search}
        onSearchChange={setSearch}
        marketplace={marketplace}
        onMarketplaceChange={setMarketplace}
        status={status}
        onStatusChange={setStatus}
      />

      <div className="flex-1 overflow-auto min-h-0">
        {items.length === 0 ? (
          <EmptyState
            title="Nenhum produto encontrado"
            description="Tente ajustar os filtros ou a busca."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
