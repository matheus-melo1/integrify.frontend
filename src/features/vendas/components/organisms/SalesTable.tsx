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
import { SalesFilters } from "../molecules/SalesFilters";
import { SaleStatusBadge } from "../molecules/SaleStatusBadge";
import { useSalesList } from "../../hooks/useSalesList";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

const formatBRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    n,
  );

export function SalesTable() {
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
  } = useSalesList();

  return (
    <SurfaceCard className="h-full" innerClassName="flex flex-col gap-4 h-full">
      <SalesFilters
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
              <TableHead className="text-xs text-muted-foreground">
                #ID
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Produto
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Cliente
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Marketplace
              </TableHead>
              <TableHead className="text-xs text-muted-foreground">
                Data
              </TableHead>
              <TableHead className="text-xs text-muted-foreground text-right">
                Valor
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
                  colSpan={8}
                  className="text-center text-xs text-muted-foreground py-8"
                >
                  Nenhuma venda encontrada com esses filtros.
                </TableCell>
              </TableRow>
            )}
            {items.map((sale) => (
              <TableRow
                key={sale.id}
                className="border-neutral-700/60 hover:bg-neutral-700/30"
              >
                <TableCell className="text-xs text-muted-foreground">
                  {sale.id}
                </TableCell>
                <TableCell className="font-medium text-sm">
                  {sale.product}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] uppercase">
                      {sale.customer[0]}
                    </div>
                    <span className="text-xs">{sale.customer}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <MarketplaceLogo marketplace={sale.marketplace} />
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(sale.date)}
                </TableCell>
                <TableCell className="text-right text-sm tabular-nums">
                  {formatBRL(sale.amount)}
                </TableCell>
                <TableCell>
                  <SaleStatusBadge status={sale.status} />
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
        <span>{total} vendas</span>
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
