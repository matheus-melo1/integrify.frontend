import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { SurfaceCard } from "@/shared/components/molecules/SurfaceCard/SurfaceCard";
import { MarketplaceLogo } from "@/shared/components/molecules/MarketplaceLogo";
import { StockFilters } from "../molecules/StockFilters";
import { StockStatusBadge } from "../molecules/StockStatusBadge";
import type { StockListController } from "../../hooks/useStockList";

const formatBRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    n,
  );

type Props = {
  list: StockListController;
};

export function EstoqueTableView({ list }: Props) {
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

      <div className="flex-1 overflow-auto min-h-0 rounded-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-700/60 hover:bg-transparent">
              <TableHead className="text-xs text-muted-foreground">SKU</TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Produto
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Marketplace
              </TableHead>
              <TableHead className="text-xs text-muted-foreground text-right">
                Estoque
              </TableHead>
              <TableHead className="text-xs text-muted-foreground text-right">
                Preço
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-xs text-muted-foreground text-right">
                Ação
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow className="border-neutral-700/60 hover:bg-transparent">
                <TableCell
                  colSpan={7}
                  className="text-center text-xs text-muted-foreground py-8"
                >
                  Nenhum produto encontrado com esses filtros.
                </TableCell>
              </TableRow>
            )}
            {items.map((stock) => (
              <TableRow
                key={stock.id}
                className="border-neutral-700/60 hover:bg-neutral-700/30"
              >
                <TableCell className="text-xs text-muted-foreground">
                  {stock.sku}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={stock.imageUrl}
                      alt={stock.name}
                      loading="lazy"
                      className="size-8 rounded-md object-cover bg-neutral-700"
                    />
                    <span className="font-medium text-sm">{stock.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <MarketplaceLogo marketplace={stock.marketplace} />
                </TableCell>
                <TableCell className="text-right text-sm tabular-nums">
                  {stock.quantity}
                </TableCell>
                <TableCell className="text-right text-sm tabular-nums">
                  {formatBRL(stock.price)}
                </TableCell>
                <TableCell>
                  <StockStatusBadge status={stock.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 rounded-full"
                  >
                    <MoreHorizontal size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
