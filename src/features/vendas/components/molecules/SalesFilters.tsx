import { Calendar, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { Marketplace } from "@/shared/types/marketplace.types";
import type { SaleStatus } from "../../types/sale.types";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  marketplace: Marketplace | "all";
  onMarketplaceChange: (v: Marketplace | "all") => void;
  status: SaleStatus | "all";
  onStatusChange: (v: SaleStatus | "all") => void;
};

export function SalesFilters({
  search,
  onSearchChange,
  marketplace,
  onMarketplaceChange,
  status,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="relative flex-1 min-w-[220px]">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por produto, cliente ou ID..."
          className="pl-9 h-9 bg-neutral-900 border-neutral-800 text-sm"
        />
      </div>

      <Select
        value={marketplace}
        onValueChange={(v) => onMarketplaceChange(v as Marketplace | "all")}
      >
        <SelectTrigger className="w-[160px] h-9 text-xs bg-neutral-900 border-neutral-800">
          <SelectValue placeholder="Marketplace" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os marketplaces</SelectItem>
          <SelectItem value="mercadolibre">Mercado Livre</SelectItem>
          <SelectItem value="shoppe">Shopee</SelectItem>
          <SelectItem value="amazon">Amazon</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={status}
        onValueChange={(v) => onStatusChange(v as SaleStatus | "all")}
      >
        <SelectTrigger className="w-[140px] h-9 text-xs bg-neutral-900 border-neutral-800">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="paid">Paga</SelectItem>
          <SelectItem value="shipped">Enviada</SelectItem>
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="cancelled">Cancelada</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        className="h-9 text-xs gap-2 bg-neutral-900 border-neutral-800"
      >
        <Calendar size={14} />
        Últimos 30 dias
      </Button>
    </div>
  );
}
